import { CErc20, Comptroller, Unitroller } from "../../../typechain-types";
import { makeTxWithRetry } from "../base/makeTxWithRetry";

const COMP_SPEED = "168874591503268000"; // example value for now

export const setCompSpeeds = async (
  markets: CErc20[],
  unitroller: Unitroller,
  comptroller: Comptroller
) => {
  // we attach the comptroller interface to the unitroller
  // so we can call the comptroller functions
  const initializedUnitroller = comptroller.attach(unitroller.address);

  const cErc20Addresses = markets.map((el) => el.address);
  const supplySpeeds = cErc20Addresses.map((el) => COMP_SPEED);
  const borrowSpeeds = cErc20Addresses.map((el) => COMP_SPEED);

  // set comp speed
  await makeTxWithRetry(
    initializedUnitroller._setCompSpeeds(
      cErc20Addresses,
      supplySpeeds,
      borrowSpeeds
    )
  );

  console.log(
    `Set comp speeds for ${cErc20Addresses.length} markets to ${COMP_SPEED}`
  );
};
