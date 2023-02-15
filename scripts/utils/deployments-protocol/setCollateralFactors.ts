import { CErc20, Comptroller, Unitroller } from "../../../typechain-types";
import { makeTxWithRetry } from "../base/makeTxWithRetry";
import { MockTokenConfig } from "../deployments-mock/deployMockTokens";

export const setCollateralFactors = async (
  unitroller: Unitroller,
  comptroller: Comptroller,
  cErc20s: CErc20[],
  tokenConfig: MockTokenConfig
) => {
  // we attach the comptroller interface to the unitroller
  // so we can call the comptroller functions
  const initializedUnitroller = comptroller.attach(unitroller.address);

  for (let i = 0; i < cErc20s.length; i++) {
    await makeTxWithRetry(
      initializedUnitroller._setCollateralFactor(
        cErc20s[i].address,
        tokenConfig[i].collateralFactor
      )
    );
    console.log(
      `Set collateral factor for ${cErc20s[i].address} to ${tokenConfig[i].collateralFactor}`
    );
  }
};
