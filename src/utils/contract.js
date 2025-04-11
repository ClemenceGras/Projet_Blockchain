import { ethers } from "ethers";

// L'adresse du contrat déployé
const contractAddress = "0xf5969AB3f35E435655b77dcf01f32d01Bd5897C3";

// ABI du contrat généré par hardhat (framework pour le développement Ethereum)
const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "name": "AddedBeneficiary",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_newPresident",
        "type": "address"
      }
    ],
    "name": "NewPresidentElected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "president",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "NewPresidentElectedWithMessage",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_newScrutateur",
        "type": "address"
      }
    ],
    "name": "NewScrutateurElected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "scrutateur",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "NewScrutateurElectedWithMessage",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_resolutionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_description",
        "type": "string"
      }
    ],
    "name": "ResolutionAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "resolutionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pour",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "contre",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "neutre",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "resultMessage",
        "type": "string"
      }
    ],
    "name": "VoteCloture",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_resolutionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "enum Election.Vote",
        "name": "_vote",
        "type": "uint8"
      }
    ],
    "name": "VotedForResolution",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_resolutionId",
        "type": "uint256"
      }
    ],
    "name": "AfficherResolution",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "InitialiserResolution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_resolutionId",
        "type": "uint256"
      }
    ],
    "name": "ResultatResolution",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "forVotes",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "againstVotes",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "neutralVotes",
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
        "name": "_resolutionId",
        "type": "uint256"
      },
      {
        "internalType": "enum Election.Vote",
        "name": "_vote",
        "type": "uint8"
      }
    ],
    "name": "VoterResolution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_beneficiaries",
        "type": "address[]"
      }
    ],
    "name": "addToWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_resolutionId",
        "type": "uint256"
      }
    ],
    "name": "cloturerVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
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
    "inputs": [],
    "name": "president",
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
        "internalType": "address",
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "name": "removeFromWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resolutionsCount",
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
    "name": "scrutateur",
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
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "whitelist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
  ];

  export const connectToContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    // Vérifiez que le contrat existe à l'adresse
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
        throw new Error("Le contrat n'existe pas à l'adresse spécifiée. Vérifiez l'adresse et le réseau.");
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
};


// import Web3 from "web3";

// const web3 = new Web3("http://127.0.0.1:8545");  // URL du Hardhat Network

// // L'adresse du contrat déployé
// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// // ABI du contrat généré par hardhat (framework pour le développement Ethereum)
// const abi = [
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "_beneficiary",
//           "type": "address"
//         }
//       ],
//       "name": "AddedBeneficiary",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "_newPresident",
//           "type": "address"
//         }
//       ],
//       "name": "NewPresidentElected",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "address",
//           "name": "president",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "message",
//           "type": "string"
//         }
//       ],
//       "name": "NewPresidentElected",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "_newScrutateur",
//           "type": "address"
//         }
//       ],
//       "name": "NewScrutateurElected",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "address",
//           "name": "scrutateur",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "message",
//           "type": "string"
//         }
//       ],
//       "name": "NewScrutateurElected",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "previousOwner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "OwnershipTransferred",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "_resolutionId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "_description",
//           "type": "string"
//         }
//       ],
//       "name": "ResolutionAdded",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "resolutionId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "pour",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "contre",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "neutre",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "resultMessage",
//           "type": "string"
//         }
//       ],
//       "name": "VoteCloture",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "_resolutionId",
//           "type": "uint256"
//         },
//         {
//           "indexed": true,
//           "internalType": "enum Election.Vote",
//           "name": "_vote",
//           "type": "uint8"
//         }
//       ],
//       "name": "VotedForResolution",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_resolutionId",
//           "type": "uint256"
//         }
//       ],
//       "name": "AfficherResolution",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "InitialiserResolution",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_resolutionId",
//           "type": "uint256"
//         }
//       ],
//       "name": "ResultatResolution",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "forVotes",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "againstVotes",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "neutralVotes",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_resolutionId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "enum Election.Vote",
//           "name": "_vote",
//           "type": "uint8"
//         }
//       ],
//       "name": "VoterResolution",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address[]",
//           "name": "_beneficiaries",
//           "type": "address[]"
//         }
//       ],
//       "name": "addToWhitelist",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_resolutionId",
//           "type": "uint256"
//         }
//       ],
//       "name": "cloturerVote",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "president",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "_beneficiary",
//           "type": "address"
//         }
//       ],
//       "name": "removeFromWhitelist",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "resolutionsCount",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "scrutateur",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "transferOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "whitelist",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ];

// const contract = new web3.eth.Contract(abi, contractAddress);

// // Exemple d'appel de fonction
// contract.methods.vote(1).send({ from: "adresse_utilisateur" })
//   .then(result => console.log("Vote réussi", result))
//   .catch(error => console.error("Erreur", error));
