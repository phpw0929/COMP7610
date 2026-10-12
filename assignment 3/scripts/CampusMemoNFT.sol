// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IClubPointToken {
    /// @notice Declares the CPT burn operation used by the NFT contract.
    /// @param member Address whose CPT will be burned.
    /// @param amount Whole-number amount of CPT.
    function burnForNFT(address member, uint256 amount) external;
}

/// @title HKU Drone Club Campus-Memo NFTs
contract CampusMemoNFT is ERC721, Ownable {
    uint256 public constant MAX_NFT_SUPPLY = 10;
    IClubPointToken public immutable clubToken;
    uint256 public totalCampusMemos;
    string private _campusMemoBaseURI;

    event CampusMemoMinted(address indexed member, uint256 indexed tokenId, uint256 burnedCPT);

    /// @notice Sets the CPT contract, NFT metadata base URI, and deployer as owner.
    /// @param clubTokenAddress Address of the deployed ClubPointToken contract.
    /// @param campusMemoBaseURI Metadata URI prefix, such as ipfs://CID/.
    constructor(address clubTokenAddress, string memory campusMemoBaseURI)
        ERC721("Campus-Memo", "CAMPUS") Ownable(msg.sender)
    {
        require(clubTokenAddress != address(0), "Invalid CPT address");
        clubToken = IClubPointToken(clubTokenAddress);
        _campusMemoBaseURI = campusMemoBaseURI;
    }

    /// @notice Burns 100 CPT from the caller and mints one NFT, up to a total of 10.
    /// @return tokenId ID of the newly minted NFT, numbered from 1 to 10.
    function mintCampusMemo() external returns (uint256 tokenId) {
        require(totalCampusMemos < MAX_NFT_SUPPLY, "Campus-Memo supply exhausted");
        clubToken.burnForNFT(msg.sender, 100);
        tokenId = totalCampusMemos + 1;
        totalCampusMemos = tokenId;
        _safeMint(msg.sender, tokenId);
        emit CampusMemoMinted(msg.sender, tokenId, 100);
    }

    /// @dev Supplies the metadata prefix that ERC721 appends to each token ID.
    /// @return The base URI provided during deployment.
    function _baseURI() internal view override returns (string memory) {
        return _campusMemoBaseURI;
    }
}
