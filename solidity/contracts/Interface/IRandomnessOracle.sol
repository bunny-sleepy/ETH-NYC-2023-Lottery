// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface IRandomnessOracle {
    function requestRandomness() external;
    function fulfillRandomness(bytes memory) external;
    function getRandomness() external returns (bytes memory);
}