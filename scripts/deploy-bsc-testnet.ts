import { ethers } from "hardhat";
import {
  Comptroller,
  InterestRateModel,
  MOCK20,
  PriceOracle,
  Unitroller,
} from "../typechain-types";

/**
 * CONFIGURATION
 */

const MARKET_TOKEN_PREFIX = "ma";

type PriceFeedConfig = { [key: string]: string };
const priceFeedConfig: PriceFeedConfig = {
  BUSD: "0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa",
  CAKE: "0x81faeDDfeBc2F8Ac524327d70Cf913001732224C",
  MATIC: "0x957Eb0316f02ba4a9De3D308742eefd44a3c1719",
  USDC: "0x90c069C4538adAc136E051052E14c1cD799C41B7",
  AAVE: "0x298619601ebCd58d0b526963Deb2365B485Edc74",
  DAI: "0xE4eE17114774713d2De0eC0f035d4F7665fc025D",
};

/**
 * DEPLOYMENT METHODS
 */

const deployMockTokens = async () => {
  // we deploy mock tokens for testing on BSC Testnet
  // - BUSD: 6 Decimals
  // - CAKE: 18 Decimals
  // - MATIC: 18 Decimals
  // - USDC: 6 Decimals
  // - AAVE: 18 Decimals
  // - DAI: 18 Decimals

  const MockToken = await ethers.getContractFactory("MOCK20");

  const busd = await MockToken.deploy("BUSD", "BUSD", 6);
  await busd.deployed();
  const cake = await MockToken.deploy("CAKE", "CAKE", 18);
  await cake.deployed();
  const matic = await MockToken.deploy("MATIC", "MATIC", 18);
  await matic.deployed();
  const usdc = await MockToken.deploy("USDC", "USDC", 6);
  await usdc.deployed();
  const aave = await MockToken.deploy("AAVE", "AAVE", 18);
  await aave.deployed();
  const dai = await MockToken.deploy("DAI", "DAI", 18);
  await dai.deployed();

  console.log("BUSD deployed to:", busd.address);
  console.log("CAKE deployed to:", cake.address);
  console.log("MATIC deployed to:", matic.address);
  console.log("USDC deployed to:", usdc.address);
  console.log("AAVE deployed to:", aave.address);
  console.log("DAI deployed to:", dai.address);

  return [busd, cake, matic, usdc, aave, dai];
};

const deployComptroller = async () => {
  const Comptroller = await ethers.getContractFactory("Comptroller");
  const comptroller = await Comptroller.deploy();
  await comptroller.deployed();
  console.log("Comptroller deployed to:", comptroller.address);
  return comptroller;
};

const deployUnitroller = async () => {
  const Unitroller = await ethers.getContractFactory("Unitroller");
  const unitroller = await Unitroller.deploy();
  await unitroller.deployed();
  console.log("Unitroller deployed to:", unitroller.address);
  return unitroller;
};

const configureUnitrollerAndComptroller = async (
  unitroller: Unitroller,
  comptroller: Comptroller
) => {
  // set comptroller as pending implementation
  await unitroller._setPendingImplementation(comptroller.address);

  // accept
  await comptroller._become(unitroller.address);

  // check if unitroller is configured correctly
  if ((await unitroller.comptrollerImplementation()) != comptroller.address) {
    throw new Error(
      "Unitroller comptrollerImplementation is not set correctly"
    );
  }
};

const deployInterestRateModel = async (targetOwner: string) => {
  const InterestRateModel = await ethers.getContractFactory("JumpRateModelV4");

  const blocksPerYear_ = 365 * 24 * 60 * 60; // seconds per 365 days
  const baseRatePerYear = 0; // taken from https://optimistic.etherscan.io/address/0xbbbd75383f6A61d5EB5b43e94E6372Df6F7f13c6#readContract
  const multiplierPerYear = "50000000000000000"; // taken engineered from https://optimistic.etherscan.io/address/0xbbbd75383f6A61d5EB5b43e94E6372Df6F7f13c6#readContract
  const jumpMultiplierPerYear = "1365000000000000000";
  const kink_ = "800000000000000000";
  const owner_ = targetOwner;
  const name_ = "JumpRateModelV4";

  const interestRateModel = await InterestRateModel.deploy(
    blocksPerYear_,
    baseRatePerYear,
    multiplierPerYear,
    jumpMultiplierPerYear,
    kink_,
    owner_,
    name_
  );
  await interestRateModel.deployed();
  console.log("InterestRateModel deployed to:", interestRateModel.address);
  return interestRateModel;
};

const deployCErc20Immutables = async (
  token: MOCK20[],
  comptroller: Comptroller,
  _interestRateModel: InterestRateModel,
  targetAdmin: string
) => {
  const CErc20Immutable = await ethers.getContractFactory("CErc20Immutable");

  const deployedCErc20Immutables = [];
  for (let i = 0; i < token.length; i++) {
    const underlying_ = token[i].address;
    const comptroller_ = comptroller.address;
    const interestRateModel = _interestRateModel.address;
    const initialExchangeRateMantissa_ = "200000000000000";
    const name = MARKET_TOKEN_PREFIX + (await token[i].name());
    const symbol = MARKET_TOKEN_PREFIX + (await token[i].symbol());
    const decimals = await token[i].decimals();

    const cErc20Immutable = await CErc20Immutable.deploy(
      underlying_,
      comptroller_,
      interestRateModel,
      initialExchangeRateMantissa_,
      name,
      symbol,
      decimals,
      targetAdmin
    );
    await cErc20Immutable.deployed();
    console.log(
      `CErc20Immutable ${name} deployed to: `,
      cErc20Immutable.address
    );
    deployedCErc20Immutables.push(cErc20Immutable);
  }
  return deployedCErc20Immutables;
};

const deployChainlinkPriceOracle = async (
  token: MOCK20[],
  priceFeedConfig: PriceFeedConfig
) : Promise<PriceOracle> => {
  const symbols = [];
  const priceFeeds = [];
  const baseUnits = [];

  for (let i = 0; i < token.length; i++) {
    const symbol = await token[i].symbol();
    symbols.push(symbol);
    
    const priceFeed = priceFeedConfig[symbol];
    priceFeeds.push(priceFeed);

    if (!priceFeed) throw new Error(`Price feed for ${symbol} not found`);

    const baseUnit = await token[i].decimals();
    baseUnits.push(baseUnit);
  }

  const PriceOracle = await ethers.getContractFactory(
    "ChainlinkPriceOracle"
  );

  const priceOracle = await PriceOracle.deploy(
    symbols,
    priceFeeds,
    baseUnits
  );
  await priceOracle.deployed();
  console.log("PriceOracle deployed to:", priceOracle.address);
  return priceOracle;
};

async function main() {
  const [deployer] = await ethers.getSigners();

  const deployedMockTokens = await deployMockTokens();
  const comptroller = await deployComptroller();
  const unitroller = await deployUnitroller();
  const interestRateModel = await deployInterestRateModel(deployer.address);
  await configureUnitrollerAndComptroller(unitroller, comptroller);
  const cErc20Immutables = await deployCErc20Immutables(
    deployedMockTokens,
    comptroller,
    interestRateModel,
    deployer.address
  );
  const priceOracle = await deployChainlinkPriceOracle(
    deployedMockTokens,
    priceFeedConfig
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
