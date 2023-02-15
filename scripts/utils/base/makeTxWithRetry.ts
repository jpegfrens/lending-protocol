import { ContractTransaction } from "@ethersproject/contracts";

const MAX_RETRY = 3;

export const makeTxWithRetry = async (
  contractTransaction: Promise<ContractTransaction>,
  maxRetries: number = MAX_RETRY,
  blockDelay: number = 1
) => {
  if (maxRetries === 0) {
    throw new Error("Max retries reached");
  }
  try {
    const confirmedTx = await contractTransaction;
    await confirmedTx.wait(blockDelay);
    if (maxRetries < MAX_RETRY) {
      // sleep for 5 seconds before we go to the next tx
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    return confirmedTx;
  } catch (error) {
    console.error(error);
    console.log(`Retrying transaction: ${maxRetries} retries left`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await makeTxWithRetry(contractTransaction, maxRetries - 1, 5);
  }
};
