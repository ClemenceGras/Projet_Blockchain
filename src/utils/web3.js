import { ethers } from "ethers";
import Web3Modal from "web3modal";
import ElectionContract from "../components/Election.json";

// ✅ Adresse du contrat déployé sur Sepolia (à ajuster si besoin)
const contractAddress = "0xf5969AB3f35E435655b77dcf01f32d01Bd5897C3";

const getWeb3 = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);

  // 🔎 Vérification du réseau
  const network = await provider.getNetwork();
  console.log("Réseau actuel :", network.name);

  if (network.chainId !== 11155111) { // 11155111 = Sepolia
    alert("Merci de vous connecter au réseau Sepolia dans MetaMask.");
    throw new Error("Mauvais réseau : " + network.name);
  }

  const signer = provider.getSigner();
  console.log(signer);
  return { provider, signer };
};

const getContract = async (signer) => {
  // ✅ Vérifie que le contrat existe
  const provider = signer.provider;
  const code = await provider.getCode(contractAddress);

  if (code === "0x") {
    throw new Error("Le contrat n'existe pas à cette adresse sur le réseau actuel.");
  }

  const contract = new ethers.Contract(contractAddress, ElectionContract.abi, signer);
  return contract;
};

export { getWeb3, getContract };
