// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ILottery {
    struct Pool {
        address owner;
        uint256 maxUserNumber;
        uint256 currentUserNumber;
        uint256 tokenAmount;
    }
    /**
     * @dev Opens a pool, returns id
     */
    function open(
        uint256 maxUserNumber,
        // address tokenAddress,
        uint256 tokenAmount
    ) external returns (uint256);

    /**
     * @dev Returns whether successful or not
     */
    function register(address user, uint256 poolId) external returns (bool);

    /**
     * @dev Returns the successful user(s)
     */
    function draw(uint256 poolId) external returns (address);
}