import { ethers } from "hardhat";
import { ERC20, PriceOracle } from "../../../typechain-types";

export type PriceFeedConfig = { [key: string]: string };

export const deployChainlinkPriceOracle = async (
  token: ERC20[],
  priceFeedConfig: PriceFeedConfig,
  marketTokenPrefix: string
): Promise<PriceOracle> => {
  const symbols = [];
  const priceFeeds = [];
  const baseUnits = [];

  for (let i = 0; i < token.length; i++) {
    const symbol = marketTokenPrefix + (await token[i].symbol());
    symbols.push(symbol);

    const priceFeed = priceFeedConfig[symbol];
    priceFeeds.push(priceFeed);

    if (!priceFeed) throw new Error(`Price feed for ${symbol} not found`);

    const decimals = await token[i].decimals();

    if (![6, 18].includes(Number(decimals)))
      throw new Error(`Invalid decimals for ${symbol}`);

    const baseUnit = await ethers.utils.parseUnits("1", decimals);

    baseUnits.push(baseUnit);
  }

  const PriceOracle = await ethers.getContractFactory("ChainlinkPriceOracle");

  const priceOracle = await PriceOracle.deploy(symbols, priceFeeds, baseUnits);
  await priceOracle.deployed();
  console.log("PriceOracle deployed to:", priceOracle.address);
  return priceOracle;
};
