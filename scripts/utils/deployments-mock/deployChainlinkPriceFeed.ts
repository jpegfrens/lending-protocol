import { ethers } from "hardhat";
import { ERC20 } from "../../../typechain-types";
import { type PriceFeedConfig } from "../deployments-protocol";
import { MockTokenConfig } from "./deployMockTokens";

export const deployMockChainlinkPriceFeed = async (
  mockTokenConfig: MockTokenConfig,
  prices: number[],
  marketTokenPrefix: string
): Promise<PriceFeedConfig> => {
  const MockChainlinkPriceFeed = await ethers.getContractFactory(
    "MockChainlinkPriceFeed"
  );

  const priceFeedConfig: PriceFeedConfig = {};
  for (let i = 0; i < mockTokenConfig.length; i++) {
    const mockChainlinkPriceFeed = await MockChainlinkPriceFeed.deploy(
      mockTokenConfig[i].decimals,
      prices[i]
    );
    await mockChainlinkPriceFeed.deployed();
    priceFeedConfig[marketTokenPrefix + mockTokenConfig[i].symbol] =
      mockChainlinkPriceFeed.address;
    console.log(
      `Mock Chainlink price feed for ${mockTokenConfig[i].symbol} with price of ${prices[i]} deployed to:`,
      mockChainlinkPriceFeed.address
    );
  }

  return priceFeedConfig;
};
