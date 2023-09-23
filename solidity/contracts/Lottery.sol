// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

import { ILottery } from "./Interface/ILottery.sol";
import { IMockToken } from "./Interface/IMockToken.sol";
import { IRandomnessOracle } from "./Interface/IRandomnessOracle.sol";
import { IWorldID } from "./Interface/IWorldID.sol";
import { IVDFVerifier } from "./Interface/IVDFVerifier.sol";

contract Lottery is ILottery {
    IMockToken internal _token;
    IRandomnessOracle internal _oracle;
    IWorldID internal _worldID;
    IVDFVerifier internal _vdfVerifier;
    uint256 internal maxId;
    // using ByteHasher for bytes;
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable _worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable _externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => mapping(uint256 => bool)) internal _nullifierHashes;

    function verifyAndExecuteWorldId(uint256 poolId, WorldIDInputs memory inputs) internal {
        // First, we make sure this person hasn't done this before
        if (_nullifierHashes[poolId][inputs.nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        _worldId.verifyProof(
            inputs.root,
            groupId,
            hashToField(abi.encodePacked(inputs.signal)),
            inputs.nullifierHash,
            _externalNullifier,
            inputs.proof
        );

        // We now record the user has done this, so they can't do it again (proof of uniqueness)
        _nullifierHashes[poolId][inputs.nullifierHash] = true;

        // Finally, execute your logic here, for example issue a token, NFT, etc...
        // Make sure to emit some kind of event afterwards!
    }
    mapping(uint256 => Pool) poolParams;
    // pool Id => user Id => user Address
    mapping(uint256 => mapping(uint256 => address)) userAddresses;
    mapping(uint256 => mapping(address => bool)) userExist;

    /**
    * @param worldId The WorldID instance that will verify the proofs
    * @param appId The World ID app ID
    * @param actionId The World ID action ID 
    */ 
    constructor(
        IMockToken token,
        IRandomnessOracle oracle,
        IVDFVerifier vdfVerifier,
        IWorldID worldId,
        string memory appId,
        string memory actionId
    ) {
        maxId = 0;
        _token = token;
        _oracle = oracle;
        _worldId = worldId;
        _vdfVerifier = vdfVerifier;
        _externalNullifier = hashToField(abi.encodePacked(hashToField(abi.encodePacked(appId)), actionId));
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
        _token.transferFrom(msg.sender, address(this), tokenAmount);
        return maxId - 1;
    }

    /**
    * @dev Returns whether successful or not
    */
    function register(
        address user,
        uint256 poolId,
        WorldIDInputs calldata worldIdInputs,
        VDFInputs calldata vdfInputs
    ) external override {
        require(userExist[poolId][user] == false);
        uint256 currentUserNumber = poolParams[poolId].currentUserNumber;
        require(currentUserNumber < poolParams[poolId].maxUserNumber);
        // check user DID
        verifyAndExecuteWorldId(poolId, worldIdInputs);
        // check user puzzle solution
        _vdfVerifier.verify_vdf_proof(
            vdfInputs.input_random,
            vdfInputs.y,
            vdfInputs.pi,
            vdfInputs.iterations,
            vdfInputs.prime
        );
        userExist[poolId][user] = true;
        userAddresses[poolId][currentUserNumber] = user;
        poolParams[poolId].currentUserNumber = currentUserNumber + 1;
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
        // get randomness
        bytes memory randomness = _oracle.getRandomness();
        uint256 winnerId = uint256(keccak256(abi.encode(randomness))) % pool.currentUserNumber;
        address winnerAddress = userAddresses[poolId][winnerId];
        // transfer token
        _token.transfer(winnerAddress, pool.tokenAmount);
        return winnerAddress;
    }

    /**
     * @dev Returns the if one user has registered
     */
    function isRegistered(uint256 poolId, address user) external view override returns (bool) {
        return userExist[poolId][user];
    }
}