import { CErc20, Comptroller, Unitroller } from "../../../typechain-types";

export const addMarketsToUnitroller = async (
  comptroller: Comptroller,
  unitroller: Unitroller,
  markets: CErc20[]
) => {
  // we attach the comptroller interface to the unitroller
  // so we can call the comptroller functions
  const initializedUnitroller = comptroller.attach(unitroller.address);

  for (let i = 0; i < markets.length; i++) {
    await initializedUnitroller._supportMarket(markets[i].address);
    console.log(`Added ${markets[i].address} to comptroller`);
  }
};
