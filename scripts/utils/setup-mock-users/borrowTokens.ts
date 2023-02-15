import { CErc20 } from "../../../typechain-types";
import type { BigNumber } from "@ethersproject/bignumber";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { makeTxWithRetry } from "../base/makeTxWithRetry";

export const borrowTokens = async (
  cErc20s: CErc20[],
  user: SignerWithAddress,
  amount: BigNumber
) => {
  for (let i = 0; i < cErc20s.length; i++) {
    await makeTxWithRetry(cErc20s[i].connect(user).borrow(amount));
    console.log(
      `Borrowed ${amount} ${await cErc20s[i].symbol()} for ${user.address}`
    );
  }
};

export const borrowTokensForMultipleUsers = async (
  cErc20s: CErc20[],
  users: SignerWithAddress[],
  amount: BigNumber
) => {
  for (const user of users) {
    await borrowTokens(cErc20s, user, amount);
  }
};
