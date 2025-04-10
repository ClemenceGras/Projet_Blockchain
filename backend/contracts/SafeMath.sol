// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow checks.
 */
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b; // Overflow checks are automatic in 0.8.x
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b; // Underflow checks are automatic in 0.8.x
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b; // Overflow checks are automatic in 0.8.x
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}
