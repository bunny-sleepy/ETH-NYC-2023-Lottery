// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import {ILottery} from "./Interface/ILottery.sol";
import {IMockToken} from "./Interface/IMockToken.sol";
import {IRandomnessOracle} from "./Interface/IRandomnessOracle.sol";

contract Lottery is ILottery {
    IMockToken _token;
    IRandomnessOracle _oracle;
    uint256 maxId;
    mapping(uint256 => Pool) poolParams;
    // pool Id => user Id => user Address
    mapping(uint256 => mapping(uint256 => address)) userAddresses;
    mapping(uint256 => mapping(address => bool)) userExist;

    constructor(
        IMockToken token,
        IRandomnessOracle oracle
    ) {
        maxId = 0;
        _token = token;
        _oracle = oracle;
    }
    /**
    * @dev Opens a pool, returns id
    */
    function open(
        uint256 maxUserNumber,
        // address tokenAddress,
        uint256 tokenAmount
    ) external override returns (uint256) {
        require(tokenAmount > 0);
        require(maxUserNumber > 0);
        Pool memory _pool = Pool({
            owner: msg.sender,
            maxUserNumber: maxUserNumber,
            currentUserNumber: 0,
            tokenAmount: tokenAmount
        });
        poolParams[maxId] = _pool;
        maxId = maxId + 1;
        return maxId - 1;
    }

    /**
    * @dev Returns whether successful or not
    */
    function register(
        address user, 
        uint256 poolId
    ) external override returns (bool) {
        require(userExist[poolId][user] == false);
        uint256 currentUserNumber = poolParams[poolId].currentUserNumber;
        require(currentUserNumber < poolParams[poolId].maxUserNumber);
        // TODO: check user DID
        // TODO: check user puzzle solution
        userExist[poolId][user] = true;
        userAddresses[poolId][currentUserNumber] = user;
        poolParams[poolId].currentUserNumber = currentUserNumber + 1;
        return true;
    }

    /**
    * @dev Returns the successful user(s)
    */
    function draw(
        uint256 poolId
    ) external override returns (address) {
        Pool memory pool = poolParams[poolId];
        require(pool.owner == msg.sender);
        if (pool.currentUserNumber == 0) return address(0);
        // TODO: get randomness
        bytes memory randomness = _oracle.getRandomness();
        uint256 winnerId = uint256(keccak256(abi.encode(randomness))) % pool.currentUserNumber;
        // TODO: transfer token
        return userAddresses[poolId][winnerId];
    }
}