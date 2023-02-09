contract MockChainlinkPriceFeed {
    int256 public price;
    uint8 public decimals;

    constructor(uint8 _decimals, int256 _price) {
        price = _price;
        decimals = _decimals;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = 0;
        answer = price;
        startedAt = 0;
        updatedAt = 0;
        answeredInRound = 0;
    }
}
