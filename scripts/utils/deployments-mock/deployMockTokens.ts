import { ethers } from "hardhat";
import { ERC20 } from "../../../typechain-types";

export type MockTokenConfig = {
    name: string;
    symbol: string;
    decimals: number;
    cTokenSymbol: string;
    collateralFactor: string; 
}[];


export const deployMockTokens = async (
    mockTokensSpec: MockTokenConfig
) => {
    const MockToken = await ethers.getContractFactory("MOCK20");
    const deployedMockTokens: ERC20[] = [];
    for (const {name, symbol, decimals} of mockTokensSpec) {
        const t = await MockToken.deploy(
            name,
            symbol,
            decimals
        );
        await t.deployed();
        deployedMockTokens.push(t);
        console.log(`${symbol} deployed to:`, t.address);
    }
  
    return deployedMockTokens;
  };