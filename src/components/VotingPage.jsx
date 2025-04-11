import React, { useState, useEffect } from "react";
import { getWeb3, getContract } from "../utils/web3";
import "./VotingPage.css";

const VotingPage = () => {
  const [account, setAccount] = useState("");
  const [currentResolution, setCurrentResolution] = useState("");
  const [resolutionId, setResolutionId] = useState(1);
  const [results, setResults] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showingResults, setShowingResults] = useState(false);
  const [votingFinished, setVotingFinished] = useState(false); 
  const totalResolutions = 12;

  useEffect(() => {
    const init = async () => {
      try {
        const { signer } = await getWeb3();
        const electionContract = await getContract(signer);
        setContract(electionContract);
        const userAccount = await signer.getAddress();
        setAccount(userAccount);
        await loadResolution(electionContract, resolutionId);
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
        alert("Impossible de charger la résolution. Vérifiez la connexion ou le contrat.");
      }
    };

    init();
  }, [resolutionId]);

  const loadResolution = async (electionContract, id) => {
    try {
      const resolution = await electionContract.AfficherResolution(id);
      if (!resolution || resolution === "") {
        throw new Error("Résolution introuvable.");
      }
      setCurrentResolution(resolution);
    } catch (err) {
      console.error("Erreur chargement résolution :", err);
      setCurrentResolution("Aucune résolution trouvée.");
      console.log("Tentative d'affichage de résolution", resolutionId);
    }
  };

  const vote = async (voteType) => {
    if (!contract) return;
    setLoading(true);
    try {
      await contract.VoterResolution(resolutionId, voteType);
      alert("Vote enregistré !");
    } catch (error) {
      console.error("Erreur lors du vote :", error);
  
      // Vérifiez si l'erreur contient le message "Vous avez deja vote."
      if (error?.error?.message?.includes("Vous avez deja vote.")) {
        alert("Vous avez déjà voté pour cette résolution.");
      } else {
        alert("Erreur pendant le vote. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleResults = async () => {
    if (!showingResults) {
      try {
        const result = await contract.ResultatResolution(resolutionId);
        if (result) {
          setResults(result);
        }
      } catch (error) {
        console.error("Erreur lors de l'affichage des résultats :", error);
        alert("Impossible d'afficher les résultats.");
      }
    }
    setShowingResults(!showingResults); // Change l'état pour afficher ou cacher les résultats
  };

  const nextResolution = () => {
    if (resolutionId < 12) {
      setResults(null);
      setResolutionId((prev) => prev + 1);
    } else {
      alert("Vous avez atteint la dernière résolution.");
    }
  };

  const finishVoting = async () => {
    try {
      const allResults = [];
      for (let i = 1; i <= totalResolutions; i++) {
        const result = await contract.ResultatResolution(i);
        console.log(`Résultats pour la résolution ${i}:`, result);
        if (result) {
          allResults.push(result);
        } else {
          allResults.push({
            forVotes: 0,
            againstVotes: 0,
            neutralVotes: 0,
          });
        }
      }
      setResults(allResults); // Stocke tous les résultats
      setVotingFinished(true); // Indique que le vote est terminé
    } catch (error) {
      console.error("Erreur lors de la récupération des résultats de toutes les résolutions :", error);
      alert("Impossible d'afficher les résultats globaux.");
    }
  };

  return (
    <div className="voting-container">
      {votingFinished ? (
        // Affichage des résultats globaux
        <div className="all-results-box">
          <h3>Résultats globaux :</h3>
          {results && Array.isArray(results) && results.map((result, index) => (
            <div key={index} className="results-box">
              <h4>Résolution {index + 1}</h4>
              <p>✅ Pour : {result.forVotes.toString()}</p>
              <p>❌ Contre : {result.againstVotes.toString()}</p>
              <p>➖ Neutre : {result.neutralVotes.toString()}</p>
            </div>
          ))}
        </div>
      ) : (
        // Affichage normal des résolutions et des boutons de vote
        <>
          <h2 className="emoji">🗳️</h2>
          <h1 className="title">Vote Électronique en Assemblée Générale</h1>
          <p className="account">Connecté en tant que : <strong>{account}</strong></p>
  
          <div className="resolution-box">
            <h2 className="titleResolution">Résolution {resolutionId}</h2>
            <p className="resolution-text">{currentResolution}</p>
          </div>
  
          <div className="vote-buttons">
            <button onClick={() => vote(0)} disabled={loading}>✅ Pour</button>
            <button onClick={() => vote(1)} disabled={loading}>❌ Contre</button>
            <button onClick={() => vote(2)} disabled={loading}>➖ Neutre</button>
          </div>
  
          {showingResults && results && (
            <div className="results-box">
              <h3>Résultats :</h3>
              <p>✅ Pour : {results.forVotes.toString()}</p>
              <p>❌ Contre : {results.againstVotes.toString()}</p>
              <p>➖ Neutre : {results.neutralVotes.toString()}</p>
            </div>
          )}
  
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${(resolutionId / totalResolutions) * 100}%` }} />
          </div>
          <p className="progress-text">Résolution {resolutionId} sur {totalResolutions}</p>
  
          <div className="nav-buttons">
            <button onClick={toggleResults}>
              {showingResults ? "🔒 Cacher les résultats" : "📊 Afficher les résultats"}
            </button>
            <button onClick={nextResolution} disabled={resolutionId >= totalResolutions}>➡️ Résolution suivante</button>
  
            {resolutionId === totalResolutions && (
              <button onClick={finishVoting}>🏁 Finir les votes</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VotingPage;
