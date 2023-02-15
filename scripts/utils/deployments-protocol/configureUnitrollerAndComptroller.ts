import { Comptroller, PriceOracle, Unitroller } from "../../../typechain-types";

type unitrollerConfig = {
  closeFactor: string;
  priceOracle: PriceOracle;
};

export const configureUnitrollerAndComptroller = async (
  unitroller: Unitroller,
  comptroller: Comptroller,
  unitrollerConfig: unitrollerConfig
) => {
  // set comptroller as pending implementation
  await unitroller
    ._setPendingImplementation(comptroller.address)
    .then((tx) => tx.wait());

  // accept
  await comptroller._become(unitroller.address).then((tx) => tx.wait());

  // check if unitroller is configured correctly
  if ((await unitroller.comptrollerImplementation()) != comptroller.address) {
    throw new Error(
      "Unitroller comptrollerImplementation is not set correctly"
    );
  }

  // we attach the comptroller interface to the unitroller
  // so we can call the comptroller functions
  const initializedUnitroller = comptroller.attach(unitroller.address);

  // set close factor
  await initializedUnitroller
    ._setCloseFactor("500000000000000000")
    .then((tx) => tx.wait());

  // set price oracle
  await initializedUnitroller
    ._setPriceOracle(unitrollerConfig.priceOracle.address)
    .then((tx) => tx.wait());
};
