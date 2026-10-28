const env = import.meta.env ?? {};

export const CONTRACT_ADDRESS = env.VITE_CONTRACT_ADDRESS ?? "0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe";

export const READ_RPC_URL = env.VITE_READ_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";

export const SEPOLIA_CHAIN_ID =
  env.VITE_CHAIN_ID ?? "0xaa36a7";

export const SEPOLIA_EXPLORER_URL =
  env.VITE_EXPLORER_URL ?? "https://sepolia.etherscan.io";

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "ActivityClosed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "category",
        "type": "string"
      }
    ],
    "name": "ActivityCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      }
    ],
    "name": "OrganizationRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "changedBy",
        "type": "address"
      }
    ],
    "name": "OrganizationStatusChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum VolunteerHoursRegistry.ClaimStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "reviewer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "approvedMinutes",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      }
    ],
    "name": "ServiceClaimReviewed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "volunteer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "claimedMinutes",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "serviceDate",
        "type": "uint64"
      }
    ],
    "name": "ServiceClaimSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "oldRecordId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "replacementRecordId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "changedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "reasonHash",
        "type": "bytes32"
      }
    ],
    "name": "ServiceRecordCorrected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "volunteer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "approvedMinutes",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "serviceDate",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "replacesRecordId",
        "type": "uint256"
      }
    ],
    "name": "ServiceRecordIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "changedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "reasonHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "changedAt",
        "type": "uint64"
      }
    ],
    "name": "ServiceRecordRevoked",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "activityCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "administrator",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "approvedMinutes",
        "type": "uint32"
      },
      {
        "internalType": "bytes32",
        "name": "reviewNoteHash",
        "type": "bytes32"
      }
    ],
    "name": "approveClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      }
    ],
    "name": "closeActivity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "correctedMinutes",
        "type": "uint32"
      },
      {
        "internalType": "uint64",
        "name": "correctedServiceDate",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "reasonHash",
        "type": "bytes32"
      }
    ],
    "name": "correctRecord",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "replacementRecordId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "metadataHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "uint64",
        "name": "serviceStartDate",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "serviceEndDate",
        "type": "uint64"
      }
    ],
    "name": "createActivity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      }
    ],
    "name": "getActivity",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "issuer",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "metadataHash",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "uint64",
            "name": "serviceStartDate",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "serviceEndDate",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "open",
            "type": "bool"
          },
          {
            "internalType": "uint64",
            "name": "createdAt",
            "type": "uint64"
          }
        ],
        "internalType": "struct VolunteerHoursRegistry.Activity",
        "name": "activity",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      }
    ],
    "name": "getActivityClaimIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "claimIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "name": "getClaim",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "activityId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "volunteer",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "claimedMinutes",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "serviceDate",
            "type": "uint64"
          },
          {
            "internalType": "bytes32",
            "name": "supportingInfoHash",
            "type": "bytes32"
          },
          {
            "internalType": "enum VolunteerHoursRegistry.ClaimStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "submittedAt",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "reviewedAt",
            "type": "uint64"
          },
          {
            "internalType": "address",
            "name": "reviewer",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "approvedMinutes",
            "type": "uint32"
          },
          {
            "internalType": "bytes32",
            "name": "reviewNoteHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "recordId",
            "type": "uint256"
          }
        ],
        "internalType": "struct VolunteerHoursRegistry.Claim",
        "name": "claim",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "getIssuerRecordIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "serviceRecordIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      }
    ],
    "name": "getOrganization",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "wallet",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "metadataHash",
            "type": "bytes32"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          },
          {
            "internalType": "uint64",
            "name": "registeredAt",
            "type": "uint64"
          }
        ],
        "internalType": "struct VolunteerHoursRegistry.Organization",
        "name": "organization",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "getOrganizationActivityIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "activityIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      }
    ],
    "name": "getOrganizationById",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "wallet",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "metadataHash",
            "type": "bytes32"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          },
          {
            "internalType": "uint64",
            "name": "registeredAt",
            "type": "uint64"
          }
        ],
        "internalType": "struct VolunteerHoursRegistry.Organization",
        "name": "organization",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      }
    ],
    "name": "getServiceRecord",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "volunteer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "issuer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "activityId",
            "type": "uint256"
          },
          {
            "internalType": "uint32",
            "name": "approvedMinutes",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "serviceDate",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "issuedAt",
            "type": "uint64"
          },
          {
            "internalType": "enum VolunteerHoursRegistry.RecordStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "replacesRecordId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "replacementRecordId",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "statusChangedAt",
            "type": "uint64"
          },
          {
            "internalType": "bytes32",
            "name": "reasonHash",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "supportingInfoHash",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "reviewNoteHash",
            "type": "bytes32"
          }
        ],
        "internalType": "struct VolunteerHoursRegistry.ServiceRecord",
        "name": "serviceRecord",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "volunteer",
        "type": "address"
      }
    ],
    "name": "getVolunteerHistory",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "claimIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "serviceRecordIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "organizationCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "recordCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "metadataHash",
        "type": "bytes32"
      }
    ],
    "name": "registerOrganization",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "reasonHash",
        "type": "bytes32"
      }
    ],
    "name": "rejectClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "reasonHash",
        "type": "bytes32"
      }
    ],
    "name": "revokeRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "name": "setOrganizationActive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "activityId",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "claimedMinutes",
        "type": "uint32"
      },
      {
        "internalType": "uint64",
        "name": "serviceDate",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "supportingInfoHash",
        "type": "bytes32"
      }
    ],
    "name": "submitServiceClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const ZERO_HASH = "0x" + "0".repeat(64);

export const CLAIM_STATUS = {
  0: "None",
  1: "Pending",
  2: "Approved",
  3: "Rejected",
};

export const RECORD_STATUS = {
  0: "None",
  1: "Valid",
  2: "Revoked",
  3: "Corrected",
};

export const NETWORK_NAME = env.VITE_NETWORK_NAME ?? "Sepolia";
export const LOCAL_TEST = env.MODE === "local-test";
