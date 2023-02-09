import { ethers } from "hardhat";
import { deployMockTokens } from "./utils/deployments-mock";
import {
  deployComptroller,
  deployUnitroller,
  deployInterestRateModel,
  configureUnitrollerAndComptroller,
  deployCErc20Immutables,
  deployChainlinkPriceOracle,
  type PriceFeedConfig,
} from "./utils/deployments-protocol";
import { addMarketsToUnitroller } from "./utils/deployments-protocol/addMarketsToUnitroller";
import { mintTokens, mintTokensForMultipleUsers } from "./utils/setup-mock-users";
import { borrowTokensForMultipleUsers } from "./utils/setup-mock-users/borrowTokens";

/**
 * CONFIGURATION
 */

const MARKET_TOKEN_PREFIX = "ma";

const priceFeedConfig: PriceFeedConfig = {
  BUSD: "0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa",
  CAKE: "0x81faeDDfeBc2F8Ac524327d70Cf913001732224C",
  MATIC: "0x957Eb0316f02ba4a9De3D308742eefd44a3c1719",
  USDC: "0x90c069C4538adAc136E051052E14c1cD799C41B7",
  AAVE: "0x298619601ebCd58d0b526963Deb2365B485Edc74",
  DAI: "0xE4eE17114774713d2De0eC0f035d4F7665fc025D",
};

/**
 * DEPLOYMENT
 */

async function main() {
  const [deployer] = await ethers.getSigners();

  const deployedMockTokens = await deployMockTokens();
  const comptroller = await deployComptroller();
  const unitroller = await deployUnitroller();
  const interestRateModel = await deployInterestRateModel(deployer.address);
  await configureUnitrollerAndComptroller(unitroller, comptroller, {
    closeFactor: "500000000000000000", // 0.5; taken from Sonne https://optimistic.etherscan.io/address/0x60CF091cD3f50420d50fD7f707414d0DF4751C58#readProxyContract
  });
  const cErc20Immutables = await deployCErc20Immutables(
    deployedMockTokens,
    comptroller,
    interestRateModel,
    deployer.address,
    MARKET_TOKEN_PREFIX
  );
  const priceOracle = await deployChainlinkPriceOracle(
    deployedMockTokens,
    priceFeedConfig
  );
  await addMarketsToUnitroller(comptroller, unitroller, cErc20Immutables);


  // setting up a few users 
  const [user1, user2, user3] = await ethers.getSigners();
  const users = [user1, user2, user3];
  await mintTokensForMultipleUsers(deployedMockTokens, users, ethers.utils.parseEther("1000"));
  await borrowTokensForMultipleUsers(cErc20Immutables, users, ethers.utils.parseEther("100"));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
