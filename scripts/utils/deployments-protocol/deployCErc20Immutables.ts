import { ethers } from "hardhat";
import { Comptroller, ERC20, InterestRateModel, MOCK20 } from "../../../typechain-types";


export const deployCErc20Immutables = async (
    token: ERC20[],
    comptroller: Comptroller, // this is actually the unitroller address which proxies to the comptroller
    _interestRateModel: InterestRateModel,
    targetAdmin: string,
    marketTokenPrefix: string
  ) => {
    const CErc20Immutable = await ethers.getContractFactory("CErc20Immutable");
  
    const deployedCErc20Immutables = [];
    for (let i = 0; i < token.length; i++) {
      const underlying_ = token[i].address;
      const comptroller_ = comptroller.address;
      const interestRateModel = _interestRateModel.address;
      const initialExchangeRateMantissa_ = "200000000000000";
      const name = marketTokenPrefix + (await token[i].name());
      const symbol = marketTokenPrefix + (await token[i].symbol());
      const decimals = await token[i].decimals();
  
      const cErc20Immutable = await CErc20Immutable.deploy(
        underlying_,
        comptroller_,
        interestRateModel,
        initialExchangeRateMantissa_,
        name,
        symbol,
        decimals,
        targetAdmin
      );
      await cErc20Immutable.deployed();
      console.log(
        `CErc20Immutable ${name} deployed to: `,
        cErc20Immutable.address
      );
      deployedCErc20Immutables.push(cErc20Immutable);
    }
    return deployedCErc20Immutables;
  };