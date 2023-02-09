import { ethers } from "hardhat";

export const deployInterestRateModel = async (targetOwner: string) => {
    const InterestRateModel = await ethers.getContractFactory("JumpRateModelV4");
  
    const blocksPerYear_ = 365 * 24 * 60 * 60; // seconds per 365 days
    const baseRatePerYear = 0; // taken from https://optimistic.etherscan.io/address/0xbbbd75383f6A61d5EB5b43e94E6372Df6F7f13c6#readContract
    const multiplierPerYear = "50000000000000000"; // taken engineered from https://optimistic.etherscan.io/address/0xbbbd75383f6A61d5EB5b43e94E6372Df6F7f13c6#readContract
    const jumpMultiplierPerYear = "1365000000000000000";
    const kink_ = "800000000000000000";
    const owner_ = targetOwner;
    const name_ = "JumpRateModelV4";
  
    const interestRateModel = await InterestRateModel.deploy(
      blocksPerYear_,
      baseRatePerYear,
      multiplierPerYear,
      jumpMultiplierPerYear,
      kink_,
      owner_,
      name_
    );
    await interestRateModel.deployed();
    console.log("InterestRateModel deployed to:", interestRateModel.address);
    return interestRateModel;
  };