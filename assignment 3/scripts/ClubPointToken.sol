// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title HKU Drone Club CPT token
/// @notice CPT transfers are unrestricted. Administrative operations are owner-only.
contract ClubPointToken is ERC20, Ownable {
    uint256 public constant INITIAL_CPT = 1_000;
    uint256 public constant NFT_PRICE = 100;

    mapping(address => bool) public activeMember;
    mapping(address => bool) public hasWithdrawn;
    address public campusMemoContract;

    event MemberRegistered(address indexed member);
    event ClubWithdrawal(address indexed member, uint256 burnedCPT);
    event CPTMinted(address indexed recipient, uint256 amount);
    event CPTBatchDistributed(address indexed administrator, uint256 memberCount, uint256 totalAmount);
    event CampusMemoContractSet(address indexed campusMemoContract);

    /// @notice Makes the deployer owner and an active member, and mints them 1,000 CPT.
    constructor() ERC20("Club Point Token", "CPT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_CPT);
        activeMember[msg.sender] = true;
        emit MemberRegistered(msg.sender);
    }

    /// @notice CPT has no fractional units: an amount of 1 represents one CPT.
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    /// @notice Lets the owner set the NFT contract authorized to burn CPT, once only.
    /// @param campusMemo Address of the deployed CampusMemoNFT contract.
    function setCampusMemoContract(address campusMemo) external onlyOwner {
        require(campusMemoContract == address(0), "Campus-Memo already set");
        require(campusMemo != address(0), "Invalid Campus-Memo address");
        campusMemoContract = campusMemo;
        emit CampusMemoContractSet(campusMemo);
    }

    /// @notice Registers the caller as active; withdrawn members cannot re-register.
    function registerMember() external {
        require(!activeMember[msg.sender], "Already an active member");
        require(!hasWithdrawn[msg.sender], "Withdrawn members cannot re-register");
        activeMember[msg.sender] = true;
        emit MemberRegistered(msg.sender);
    }

    /// @notice Burns the caller's entire CPT balance and immediately withdraws them.
    function applyForClubWithdrawal() external {
        require(activeMember[msg.sender], "Not an active member");
        uint256 balance = balanceOf(msg.sender);
        require(balance > 0, "No CPT to burn");
        _burn(msg.sender, balance);
        activeMember[msg.sender] = false;
        hasWithdrawn[msg.sender] = true;
        emit ClubWithdrawal(msg.sender, balance);
    }

    /// @notice Lets the owner create additional CPT for an active member.
    /// @param recipient Active member receiving the newly minted CPT.
    /// @param amount Positive whole-number amount of CPT.
    function mintCPT(address recipient, uint256 amount) external onlyOwner {
        require(activeMember[recipient], "Recipient is not an active member");
        require(amount > 0, "Amount must be positive");
        _mint(recipient, amount);
        emit CPTMinted(recipient, amount);
    }

    /// @notice Lets the owner mint CPT rewards for multiple active members in one transaction.
    /// @param recipients Nonempty list of active member addresses.
    /// @param amounts Positive whole-number CPT amounts matching recipients by index.
    function distributeCPT(address[] calldata recipients, uint256[] calldata amounts)
        external onlyOwner
    {
        require(recipients.length == amounts.length, "Array lengths differ");
        require(recipients.length > 0, "Empty distribution");
        uint256 totalAmount;
        for (uint256 i = 0; i < recipients.length; i++) {
            require(activeMember[recipients[i]], "Recipient is not an active member");
            require(amounts[i] > 0, "Amount must be positive");
            _mint(recipients[i], amounts[i]);
            totalAmount += amounts[i];
            emit CPTMinted(recipients[i], amounts[i]);
        }
        emit CPTBatchDistributed(msg.sender, recipients.length, totalAmount);
    }

    /// @notice Burns 100 CPT from an active member to pay for an NFT.
    /// @dev Only the configured CampusMemoNFT contract may call this function.
    /// @param member Active member whose CPT will be burned.
    /// @param amount Must equal NFT_PRICE (100 CPT).
    function burnForNFT(address member, uint256 amount) external {
        require(msg.sender == campusMemoContract, "Only Campus-Memo can burn");
        require(activeMember[member], "Not an active member");
        require(amount == NFT_PRICE, "Incorrect NFT price");
        require(balanceOf(member) >= amount, "Insufficient CPT");
        _burn(member, amount);
    }
}
