HKU Drone Club Smart Contracts
COMP7610 Assignment 3

This folder contains the Solidity contracts and project files for the HKU Drone
Club on-chain system.

FOLDER GUIDE

scripts/
  ClubPointToken.sol    CPT ERC-20 token contract.
  CampusMemoNFT.sol     Campus-Memo ERC-721 NFT contract.

artifacts/
  Compiled contract files produced by Remix or Hardhat.

assets/
  Images used by the project or report.

contracts/ and tests/
  Remix workspace folders. They may be empty because the source contracts
  and testing work are stored in scripts/ and the report.

DEPLOYMENT IN REMIX

1. Open the workspace in Remix and compile scripts/ClubPointToken.sol.
2. Select ClubPointToken in the Contract dropdown and deploy it. It has no
   constructor arguments. Copy the deployed CPT contract address.
3. Compile scripts/CampusMemoNFT.sol.
4. Select CampusMemoNFT and deploy it with two constructor arguments:
   - clubTokenAddress: the deployed ClubPointToken address.
   - campusMemoBaseURI: the metadata base URI, for example ipfs://CID/.
5. Copy the deployed CampusMemoNFT address.
6. Open the deployed ClubPointToken and call
   setCampusMemoContract(CampusMemoNFT address).
   Use the CPT deployer account because this function is owner-only.

The contracts must be deployed in this order. The NFT contract cannot be
deployed until the CPT address is known.

MAIN FUNCTIONS

- registerMember(): register an address as an active club member.
- mintCPT(address, amount): owner-only CPT reward for one active member.
- distributeCPT(address[], uint256[]): owner-only batch CPT rewards.
- transfer(address, amount): standard ERC-20 CPT transfer. Amounts are whole
  CPT because the token has zero decimals.
- applyForClubWithdrawal(): burn the caller's entire CPT balance and mark the
  caller as withdrawn.
- mintCampusMemo(): burn 100 CPT and mint one Campus-Memo NFT. The collection
  has a maximum supply of 10 NFTs.

TESTING CHECKLIST

After deployment, test the following in Remix:

1. Confirm the initial supply and deployer's balance are both 1,000 CPT.
2. Register members and verify activeMember(address) is true.
3. Mint and transfer whole-number CPT amounts, such as 200 and 50.
4. Mint an NFT and verify that 100 CPT is burned and token ID 1 is owned by
   the minter.
5. Call tokenURI(1) and open the returned metadata URI to check the image.
6. Test withdrawal and verify that the member's CPT balance becomes zero.
7. Test failure cases, including non-owner minting, insufficient CPT, and an
   eleventh NFT mint.
