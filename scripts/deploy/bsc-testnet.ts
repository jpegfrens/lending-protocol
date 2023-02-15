import { ethers } from "hardhat";
import { Comptroller, MOCK20 } from "../../typechain-types";
import { deployMockTokens } from "../utils/deployments-mock";
import { MockTokenConfig } from "../utils/deployments-mock/deployMockTokens";
import {
  configureUnitrollerAndComptroller,
  deployCErc20Immutables,
  deployChainlinkPriceOracle,
  deployComptroller,
  deployInterestRateModel,
  deployUnitroller,
  PriceFeedConfig,
} from "../utils/deployments-protocol";
import { addMarketsToUnitroller } from "../utils/deployments-protocol/addMarketsToUnitroller";
import { setCollateralFactors } from "../utils/deployments-protocol/setCollateralFactors";
import { mintTokensForMultipleUsers } from "../utils/setup-mock-users";
import { borrowTokensForMultipleUsers } from "../utils/setup-mock-users/borrowTokens";
import { enterMarketsForMultipleUsers } from "../utils/setup-mock-users/enterMarkets";
import { fundWalletsWithNativeIfBelowThreshold } from "../utils/setup-mock-users/fundWalletsWithNative";
import { supplyTokensForMultipleUsers } from "../utils/setup-mock-users/supplyTokens";

/**
 * CONFIGURATION
 */

const MARKET_TOKEN_PREFIX = "ma";

const priceFeedConfigForBscTestnet: PriceFeedConfig = {
  [MARKET_TOKEN_PREFIX + "BUSD"]: "0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa",
  [MARKET_TOKEN_PREFIX + "CAKE"]: "0x81faeDDfeBc2F8Ac524327d70Cf913001732224C",
  [MARKET_TOKEN_PREFIX + "MATIC"]: "0x957Eb0316f02ba4a9De3D308742eefd44a3c1719",
  [MARKET_TOKEN_PREFIX + "USDC"]: "0x90c069C4538adAc136E051052E14c1cD799C41B7",
  [MARKET_TOKEN_PREFIX + "AAVE"]: "0x298619601ebCd58d0b526963Deb2365B485Edc74",
  [MARKET_TOKEN_PREFIX + "DAI"]: "0xE4eE17114774713d2De0eC0f035d4F7665fc025D",
};

const mockTokenConfig: MockTokenConfig = [
  {
    name: "BUSD",
    symbol: "BUSD",
    decimals: 6,
    cTokenSymbol: MARKET_TOKEN_PREFIX + "BUSD",
    collateralFactor: "500000000000000000", // 50%
  },
  {
    name: "CAKE",
    symbol: "CAKE",
    decimals: 18,
    cTokenSymbol: MARKET_TOKEN_PREFIX + "CAKE",
    collateralFactor: "500000000000000000", // 50%
  },
  {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
    cTokenSymbol: MARKET_TOKEN_PREFIX + "MATIC",
    collateralFactor: "500000000000000000", // 50%
  },
  {
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    cTokenSymbol: MARKET_TOKEN_PREFIX + "USDC",
    collateralFactor: "500000000000000000", // 50%
  },
  {
    name: "AAVE",
    symbol: "AAVE",
    decimals: 18,
    cTokenSymbol: MARKET_TOKEN_PREFIX + "AAVE",
    collateralFactor: "500000000000000000", // 50%
  },
  {
    name: "DAI",
    symbol: "DAI",
    decimals: 18,
    cTokenSymbol: MARKET_TOKEN_PREFIX + "DAI",
    collateralFactor: "500000000000000000", // 50%
  },
];

/**
 * DEPLOYMENT
 */

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // mock
  const deployedMockTokens = await deployMockTokens(mockTokenConfig);

  // protocol
  const comptroller = await deployComptroller();
  const unitroller = await deployUnitroller();
  const interestRateModel = await deployInterestRateModel(deployer.address);
  const priceOracle = await deployChainlinkPriceOracle(
    deployedMockTokens,
    priceFeedConfigForBscTestnet,
    MARKET_TOKEN_PREFIX
  );
  await configureUnitrollerAndComptroller(unitroller, comptroller, {
    closeFactor: "500000000000000000", // 0.5; taken from Sonne https://optimistic.etherscan.io/address/0x60CF091cD3f50420d50fD7f707414d0DF4751C58#readProxyContract
    priceOracle: priceOracle,
  });
  const cErc20Immutables = await deployCErc20Immutables(
    deployedMockTokens,
    unitroller as any as Comptroller, // the CErc20 needs the unitroller address which proxies to the comptroller
    interestRateModel,
    deployer.address,
    MARKET_TOKEN_PREFIX
  );

  await addMarketsToUnitroller(comptroller, unitroller, cErc20Immutables);
  await setCollateralFactors(
    unitroller,
    comptroller,
    cErc20Immutables,
    mockTokenConfig
  );

  // setting up a few users
  const [, user1, user2, user3, user4, user5, user6] =
    await ethers.getSigners();
  const users = [user1, user2, user3, user4, user5, user6];

  // sending testnet BNB to each of the users from the deployer if they don't have enough testnet BNB
  await fundWalletsWithNativeIfBelowThreshold(
    users,
    ethers.utils.parseEther("0.1"),
    ethers.utils.parseEther("0.2"),
    deployer
  );

  await mintTokensForMultipleUsers(
    deployedMockTokens as MOCK20[],
    users,
    ethers.utils.parseEther("1000")
  );
  await supplyTokensForMultipleUsers(
    deployedMockTokens,
    cErc20Immutables,
    users,
    ethers.utils.parseEther("1000")
  );

  // sending testnet BNB to each of the users from the deployer if they don't have enough testnet BNB
  await fundWalletsWithNativeIfBelowThreshold(
    users,
    ethers.utils.parseEther("0.1"),
    ethers.utils.parseEther("0.2"),
    deployer
  );

  await enterMarketsForMultipleUsers(
    cErc20Immutables,
    users,
    comptroller,
    unitroller
  );
  await borrowTokensForMultipleUsers(
    cErc20Immutables,
    users,
    ethers.utils.parseEther("1")
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
