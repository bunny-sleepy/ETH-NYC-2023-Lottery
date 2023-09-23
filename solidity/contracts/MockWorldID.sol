// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { IWorldID } from "./Interface/IWorldID.sol";

contract MockWorldID is IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view override {
        // we don't do anything inside the mock
    }
}