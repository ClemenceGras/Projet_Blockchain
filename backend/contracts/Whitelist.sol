// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Ownable.sol";

contract Whitelist is Ownable {
    mapping(address => bool) public whitelist;
    event AddedBeneficiary(address indexed _beneficiary);

    function isWhitelisted(address _beneficiary) internal view returns (bool) {
        return whitelist[_beneficiary];
    }

    function addToWhitelist(address[] calldata _beneficiaries) public onlyOwner {
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            whitelist[_beneficiaries[i]] = true;
        }
    }

    function removeFromWhitelist(address _beneficiary) public onlyOwner {
        whitelist[_beneficiary] = false;
    }
}
