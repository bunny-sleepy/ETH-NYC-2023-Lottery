// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

import { ILottery } from "./Interface/ILottery.sol";
import { IMockToken } from "./Interface/IMockToken.sol";
import { IRandomnessOracle } from "./Interface/IRandomnessOracle.sol";
import { IWorldID } from "./Interface/IWorldID.sol";
import { IVDFVerifier } from "./Interface/IVDFVerifier.sol";
import "./Interface/IAxiomV2Client.sol";

contract Lottery is ILottery, IAxiomV2Client {
    address public immutable axiomV2QueryAddress;
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
        require(_nullifierHashes[poolId][inputs.nullifierHash] == false, "Invalid Nullifier");

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
        string memory actionId,
        address _axiomV2QueryAddress
    ) {
        maxId = 0;
        _token = token;
        _oracle = oracle;
        _worldId = worldId;
        _vdfVerifier = vdfVerifier;
        _externalNullifier = hashToField(abi.encodePacked(hashToField(abi.encodePacked(appId)), actionId));
        axiomV2QueryAddress = _axiomV2QueryAddress;
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

    function axiomV2Callback(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema,
        bytes32 queryHash,
        bytes32[] calldata axiomResults,
        bytes calldata callbackExtraData
    ) external {
        require(msg.sender == axiomV2QueryAddress, "AxiomV2Client: caller must be axiomV2QueryAddress");
        emit AxiomV2Call(sourceChainId, callerAddr, querySchema, queryHash);

        _validateAxiomV2Call(sourceChainId, callerAddr, querySchema);
        _axiomV2Callback(sourceChainId, callerAddr, querySchema,queryHash, axiomResults, callbackExtraData);
    }

    function _validateAxiomV2Call(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema
    ) internal {
        // testnet only
        require(sourceChainId == 5 || sourceChainId == 31337);
    }

    function _axiomV2Callback(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema,
        bytes32 queryHash,
        bytes32[] calldata axiomResults,
        bytes calldata callbackExtraData
    ) internal {
        //  axiomResults.length is 2
        uint256 poolId;
        bytes memory _callbackExtraData = callbackExtraData;
        assembly {
            poolId := mload(add(_callbackExtraData, 0x20))
        }
        address user = address(uint160(uint256(axiomResults[0])));
        // Register user address
        // allow user to gain access to lottery again if the use has not registered
        if (!userExist[poolId][user]) {
            Pool memory pool = poolParams[poolId];
            pool.maxUserNumber = pool.maxUserNumber + 1;
            userExist[poolId][user] = true;
            userAddresses[poolId][pool.currentUserNumber] = msg.sender;
            pool.currentUserNumber = pool.currentUserNumber + 1;
            poolParams[poolId] = pool;
        }
    }

    /**
    * @dev Returns whether successful or not
    */
    function register(
        uint256 poolId,
        WorldIDInputs calldata worldIdInputs,
        VDFInputs calldata vdfInputs
    ) external override {
        // require(userExist[poolId][msg.sender] == false, "User Exists");
        uint256 currentUserNumber = poolParams[poolId].currentUserNumber;
        // require(currentUserNumber < poolParams[poolId].maxUserNumber, "Reach Max");
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
        userExist[poolId][msg.sender] = true;
        userAddresses[poolId][currentUserNumber] = msg.sender;
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