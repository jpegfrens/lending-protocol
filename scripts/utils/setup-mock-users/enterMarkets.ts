import { CErc20, Comptroller, Unitroller } from "../../../typechain-types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const enterMarkets = async (
  cErc20s: CErc20[],
  user: SignerWithAddress,
  comptroller: Comptroller,
  unitroller: Unitroller
) => {
  // we attach the comptroller interface to the unitroller
  // so we can call the comptroller functions
  const initializedUnitroller = comptroller.attach(unitroller.address);

  const cErc20Addresses = cErc20s.map((el) => el.address);

  await initializedUnitroller.connect(user).enterMarkets(cErc20Addresses);
  console.log(`Entered ${cErc20Addresses.length} markets for ${user.address}`);
};

export const enterMarketsForMultipleUsers = async (
  cErc20s: CErc20[],
  users: SignerWithAddress[],
  comptroller: Comptroller,
  unitroller: Unitroller
) => {
  for (const user of users) {
    await enterMarkets(cErc20s, user, comptroller, unitroller);
  }
};
