import React, { useState, useEffect } from "react";
import { getWeb3, getContract } from "../utils/web3";

const VotingPage = () => {
  const [account, setAccount] = useState("");
  const [currentResolution, setCurrentResolution] = useState("");
  const [resolutionId, setResolutionId] = useState(1);
  const [results, setResults] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { signer } = await getWeb3();
        const electionContract = await getContract(signer);
        setContract(electionContract);
        const userAccount = await signer.getAddress();
        setAccount(userAccount);
  
        // Charger la première résolution
        const resolution = await electionContract.AfficherResolution(resolutionId);
        if (!resolution) {
          throw new Error("La résolution n'existe pas.");
        }
        setCurrentResolution(resolution);
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
        console.log("Détails de l'erreur :", error.message);
        alert("Impossible de charger la résolution. Vérifiez l'ID ou réinitialisez le contrat.");
      }
    };
  
    init();
  }, [resolutionId]);

  const vote = async (voteType) => {
    try {
      await contract.VoterResolution(resolutionId, voteType);
      alert("Vote enregistré !");
    } catch (error) {
      console.error("Erreur lors du vote :", error);
    }
  };

  const showResults = async () => {
    const result = await contract.ResultatResolution(resolutionId);
    setResults(result);
  };

  const nextResolution = async () => {
    setResults(null);
    setResolutionId(resolutionId + 1);
  };

  return (
    <div>
      <h1>Vote Électronique en Assemblée Générale</h1>
      <p>Connecté en tant que : {account}</p>
      <h2>Résolution {resolutionId}</h2>
      <p>{currentResolution}</p>

      <div>
        <button onClick={() => vote(0)}>Pour</button>
        <button onClick={() => vote(1)}>Contre</button>
        <button onClick={() => vote(2)}>Neutre</button>
      </div>

      {results && (
        <div>
          <h3>Résultats :</h3>
          <p>Pour : {results.forVotes.toString()}</p>
          <p>Contre : {results.againstVotes.toString()}</p>
          <p>Neutre : {results.neutralVotes.toString()}</p>
        </div>
      )}

      <div>
        <button onClick={showResults}>Afficher les résultats</button>
        <button onClick={nextResolution}>Passer à la résolution suivante</button>
      </div>
    </div>
  );
};

export default VotingPage;