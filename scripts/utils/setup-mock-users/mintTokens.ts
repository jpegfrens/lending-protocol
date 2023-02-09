import type { BigNumber } from "@ethersproject/bignumber";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20, MOCK20 } from "../../../typechain-types";

export const mintTokens = async (
  tokens: MOCK20[],
  user: SignerWithAddress,
  amount: BigNumber
) => {
  for (const token of tokens) {
    await token.mint(user.address, amount);
    console.log(`Minted ${amount} ${await token.symbol()} for ${user.address}`);
  }
};

export const mintTokensForMultipleUsers = async (
  tokens: MOCK20[],
  users: SignerWithAddress[],
  amount: BigNumber
) => {
  for (const user of users) {
    await mintTokens(tokens, user, amount);
  }
};
