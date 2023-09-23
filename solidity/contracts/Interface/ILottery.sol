// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface ILottery {
    struct Pool {
        address owner;
        uint256 maxUserNumber;
        uint256 currentUserNumber;
        uint256 tokenAmount;
    }

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
    /// @param root The root of the Merkle tree (returned by the JS widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
    struct WorldIDInputs {
        address signal;
        uint256 root;
        uint256 nullifierHash;
        uint256[8] proof;
    }

    struct VDFInputs {
        bytes32 input_random;
        bytes y;
        bytes pi;
        uint256 iterations;
        uint256 prime;
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
    function register(uint256 poolId, WorldIDInputs calldata worldIdInputs, VDFInputs calldata vdfInputs) external;

    /**
     * @dev Returns the successful user(s)
     */
    function draw(uint256 poolId) external returns (address);

    /**
     * @dev Returns the if one user has registered
     */
    function isRegistered(uint256 poolId, address user) external view returns (bool);
}