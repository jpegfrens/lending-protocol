import { ethers } from "hardhat";
import { ERC20 } from "../../../typechain-types";

export type MockTokenConfig = {
  name: string;
  symbol: string;
  decimals: number;
  cTokenSymbol: string;
  collateralFactor: string;
}[];

export type deployedMockToken = {
  name: string;
  address: string;
  cErc20Address: string;
  decimals: number;
};

export const deployMockTokens = async (
  mockTokensSpec: MockTokenConfig
): Promise<{
  deployedMockTokenConfig: deployedMockToken[];
  deployedMockTokens: ERC20[];
}> => {
  const MockToken = await ethers.getContractFactory("MOCK20");
  const deployedMockTokens: ERC20[] = [];
  const deployedMockTokenConfig: deployedMockToken[] = [];
  for (const { name, symbol, decimals } of mockTokensSpec) {
    const t = await MockToken.deploy(name, symbol, decimals);
    await t.deployed();
    deployedMockTokens.push(t);
    console.log(`${symbol} deployed to:`, t.address);

    deployedMockTokenConfig.push({
      name,
      address: t.address,
      cErc20Address: "",
      decimals,
    });
  }

  return { deployedMockTokenConfig, deployedMockTokens };
};
