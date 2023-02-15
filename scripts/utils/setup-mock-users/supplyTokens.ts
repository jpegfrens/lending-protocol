import { CErc20, ERC20, MOCK20 } from "../../../typechain-types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { BigNumber } from "@ethersproject/bignumber";
import { makeTxWithRetry } from "../base/makeTxWithRetry";

export const supplyTokens = async (
  tokens: ERC20[],
  cErc20s: CErc20[],
  user: SignerWithAddress,
  amount: BigNumber
) => {
  for (let i = 0; i < tokens.length; i++) {
    await makeTxWithRetry(
      tokens[i].connect(user).approve(cErc20s[i].address, amount)
    );
    await makeTxWithRetry(cErc20s[i].connect(user).mint(amount));
    console.log(
      `Supplied ${amount} ${await tokens[i].symbol()} for ${user.address}`
    );
  }
};

export const supplyTokensForMultipleUsers = async (
  tokens: ERC20[],
  cErc20s: CErc20[],
  users: SignerWithAddress[],
  amount: BigNumber
) => {
  for (const user of users) {
    await supplyTokens(tokens, cErc20s, user, amount);
  }
};
