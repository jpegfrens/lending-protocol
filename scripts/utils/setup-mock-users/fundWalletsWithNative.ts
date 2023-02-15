import type { BigNumber } from "@ethersproject/bignumber";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { makeTxWithRetry } from "../base/makeTxWithRetry";

export const fundWalletsWithNativeIfBelowThreshold = async (
  wallets: SignerWithAddress[],
  amount: BigNumber,
  threshold: BigNumber,
  funder: SignerWithAddress
) => {
  for (const wallet of wallets) {
    if ((await wallet.getBalance()).gt(threshold)) {
      console.log(`Skipping funding ${wallet.address} because above treshold`);
      return;
    }
    await makeTxWithRetry(
      funder.sendTransaction({
        to: wallet.address,
        value: amount,
      })
    );

    console.log(`Funded ${wallet.address} with ${amount}`);
  }
};
