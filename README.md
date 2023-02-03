# Sonne Finance Fork 

# Notes
Suppling ETH/ERC20: 
- When supplying Ether to the Compound protocol, an application can send ETH directly to the payable mint function in the cEther contract. Following that mint, cEther is minted for the wallet or contract that invoked the mint function. Remember that if you are calling this function from another smart contract, that contract needs a payable function in order to receive ETH when you redeem the cTokens later. (https://medium.com/compound-finance/supplying-assets-to-the-compound-protocol-ec2cf5df5aa)
- The operation is slightly different for cERC20 tokens. In order to mint cERC20 tokens, the invoking wallet or contract needs to first call the approve function on the underlying token’s contract. All ERC20 token contracts have an approve function.


# BNB Testnet: 
- Chainlink PriceFeeds: 
    - BNB/USD: 0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526
    - BUSD/USD: 0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa
    - CAKE/USD: 0x81faeDDfeBc2F8Ac524327d70Cf913001732224C
    - MATIC/USD: 0x957Eb0316f02ba4a9De3D308742eefd44a3c1719
    - USDC/USD: 0x90c069C4538adAc136E051052E14c1cD799C41B7
    - AAVE/USD: 0x298619601ebCd58d0b526963Deb2365B485Edc74
    - DAI/USD: 0xE4eE17114774713d2De0eC0f035d4F7665fc025D

- We deploy mock tockens and soTokens for 
    - BUSD: 6 Decimals 
    - CAKE: 18 Decimals 
    - MATIC: 18 Decimals  
    - USDC: 6 Decimals 
    - AAVE: 18 Decimals  
    - DAI: 18 Decimals 

# Comments to the Interest Rate Model
- like Sonne we pretend that a block takes 1 second. That especially makes sense on L2s. 
- therefore instead of blocks the timestamp is used in CToken 

# Links 
https://docs.compound.finance/v2/ctokens/
