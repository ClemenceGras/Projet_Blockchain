import { ethers } from "ethers";
import Web3Modal from "web3modal";
import ElectionContract from "../components/Election.json";

const getWeb3 = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  return { provider, signer };
};

const getContract = async (signer) => {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Adresse du contrat déployé
  const contract = new ethers.Contract(contractAddress, ElectionContract.abi, signer);
  return contract;
};

export { getWeb3, getContract };