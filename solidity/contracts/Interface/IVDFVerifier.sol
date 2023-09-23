//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IVDFVerifier {
    function verify_vdf_proof(bytes32 input_random, bytes memory y, bytes memory pi, uint256 iterations, uint256 prime) external view;
}