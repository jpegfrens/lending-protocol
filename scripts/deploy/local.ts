import { ethers } from "hardhat";
import { Comptroller, MOCK20 } from "../../typechain-types";
import {
  deployMockChainlinkPriceFeed,
  deployMockTokens,
} from "../utils/deployments-mock";
import { MockTokenConfig } from "../utils/deployments-mock/deployMockTokens";
import {
  deployComptroller,
  deployUnitroller,
  deployInterestRateModel,
  configureUnitrollerAndComptroller,
  deployCErc20Immutables,
  deployChainlinkPriceOracle,
} from "../utils/deployments-protocol";
import { addMarketsToUnitroller } from "../utils/deployments-protocol/addMarketsToUnitroller";
import { setCollateralFactors } from "../utils/deployments-protocol/setCollateralFactors";
import { mintTokensForMultipleUsers } from "../utils/setup-mock-users";
import { borrowTokensForMultipleUsers } from "../utils/setup-mock-users/borrowTokens";
import { enterMarketsForMultipleUsers } from "../utils/setup-mock-users/enterMarkets";
import { supplyTokensForMultipleUsers } from "../utils/setup-mock-users/supplyTokens";

/**
 * CONFIGURATION
 */

const MARKET_TOKEN_PREFIX = "ma";

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

  // mock
  const deployedMockTokens = await deployMockTokens(mockTokenConfig);
  const priceFeedConfig = await deployMockChainlinkPriceFeed(
    mockTokenConfig,
    [1, 2, 3, 4, 5, 6], // for now we set random prices
    MARKET_TOKEN_PREFIX
  );

  // protocol
  const comptroller = await deployComptroller();
  const unitroller = await deployUnitroller();
  const interestRateModel = await deployInterestRateModel(deployer.address);
  const priceOracle = await deployChainlinkPriceOracle(
    deployedMockTokens,
    priceFeedConfig,
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
  const [user1, user2, user3] = await ethers.getSigners();
  const users = [user1, user2, user3];
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
