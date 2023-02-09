import { PriceFeedConfig } from "../utils/deployments-protocol";

const MARKET_TOKEN_PREFIX = "ma";

const priceFeedConfigForBscTestnet: PriceFeedConfig = {
  [MARKET_TOKEN_PREFIX + "BUSD"]: "0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa",
  [MARKET_TOKEN_PREFIX + "CAKE"]: "0x81faeDDfeBc2F8Ac524327d70Cf913001732224C",
  [MARKET_TOKEN_PREFIX + "MATIC"]: "0x957Eb0316f02ba4a9De3D308742eefd44a3c1719",
  [MARKET_TOKEN_PREFIX + "USDC"]: "0x90c069C4538adAc136E051052E14c1cD799C41B7",
  [MARKET_TOKEN_PREFIX + "AAVE"]: "0x298619601ebCd58d0b526963Deb2365B485Edc74",
  [MARKET_TOKEN_PREFIX + "DAI"]: "0xE4eE17114774713d2De0eC0f035d4F7665fc025D",
};
