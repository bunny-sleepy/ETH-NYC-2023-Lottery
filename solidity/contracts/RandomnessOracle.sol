// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import {IRandomnessOracle} from "./Interface/IRandomnessOracle.sol";

contract RandomnessOracle is IRandomnessOracle {
    bytes _randomness;
    bool _isRequesting;
    bool _isFulfilled;

    constructor() {
        _isRequesting = false;
        _isFulfilled = false;
    }
    function requestRandomness() external override {
        _isRequesting = true;
        _isFulfilled = false;
    }

    function fulfillRandomness(bytes memory randomness) external override {
        require(_isRequesting == true);
        _randomness = randomness;
        _isFulfilled = true;
        _isRequesting = false;
    }

    function getRandomness() external override returns (bytes memory) {
        require(_isFulfilled == true);
        _isFulfilled = false;
        return _randomness;
    }
}