import { CErc20, MOCK20 } from "../../../typechain-types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { BigNumber } from "@ethersproject/bignumber";

export const supplyTokens = async (tokens: MOCK20[], cErc20s: CErc20[], user: SignerWithAddress, amount: BigNumber) => {
    for (let i = 0; i < tokens.length; i++) {
        await tokens[i].connect(user).approve(cErc20s[i].address, amount);
        await cErc20s[i].connect(user).mint(amount);
    }
};