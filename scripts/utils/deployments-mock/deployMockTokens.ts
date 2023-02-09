import { ethers } from "hardhat";

export const deployMockTokens = async () => {
    // we deploy mock tokens for testing on BSC Testnet
    // - BUSD: 6 Decimals
    // - CAKE: 18 Decimals
    // - MATIC: 18 Decimals
    // - USDC: 6 Decimals
    // - AAVE: 18 Decimals
    // - DAI: 18 Decimals
  
    const MockToken = await ethers.getContractFactory("MOCK20");
  
    const busd = await MockToken.deploy("BUSD", "BUSD", 6);
    await busd.deployed();
    const cake = await MockToken.deploy("CAKE", "CAKE", 18);
    await cake.deployed();
    const matic = await MockToken.deploy("MATIC", "MATIC", 18);
    await matic.deployed();
    const usdc = await MockToken.deploy("USDC", "USDC", 6);
    await usdc.deployed();
    const aave = await MockToken.deploy("AAVE", "AAVE", 18);
    await aave.deployed();
    const dai = await MockToken.deploy("DAI", "DAI", 18);
    await dai.deployed();
  
    console.log("BUSD deployed to:", busd.address);
    console.log("CAKE deployed to:", cake.address);
    console.log("MATIC deployed to:", matic.address);
    console.log("USDC deployed to:", usdc.address);
    console.log("AAVE deployed to:", aave.address);
    console.log("DAI deployed to:", dai.address);
  
    return [busd, cake, matic, usdc, aave, dai];
  };