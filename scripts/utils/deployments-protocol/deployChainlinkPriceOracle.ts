import { ethers } from "hardhat";
import { MOCK20, PriceOracle } from "../../../typechain-types";

export type PriceFeedConfig = { [key: string]: string };

export const deployChainlinkPriceOracle = async (
    token: MOCK20[],
    priceFeedConfig: PriceFeedConfig
  ): Promise<PriceOracle> => {
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
  
    const PriceOracle = await ethers.getContractFactory("ChainlinkPriceOracle");
  
    const priceOracle = await PriceOracle.deploy(symbols, priceFeeds, baseUnits);
    await priceOracle.deployed();
    console.log("PriceOracle deployed to:", priceOracle.address);
    return priceOracle;
  };

  