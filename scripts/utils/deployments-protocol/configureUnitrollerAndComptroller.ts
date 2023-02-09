import { Comptroller, Unitroller } from "../../../typechain-types";



type unitrollerConfig = {
  closeFactor: string;
}

export const configureUnitrollerAndComptroller = async (
    unitroller: Unitroller,
    comptroller: Comptroller,
    unitrollerConfig: unitrollerConfig
  ) => {
    // set comptroller as pending implementation
    await unitroller._setPendingImplementation(comptroller.address);
  
    // accept
    await comptroller._become(unitroller.address);
  
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
    await initializedUnitroller._setCloseFactor("500000000000000000");
  };
  