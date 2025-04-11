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
  const [whitelist, setWhitelist] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [voteOuvert, setVoteOuvert] = useState(false); // État pour savoir si le vote est ouvert
  const [totalResolutions, setTotalResolutions] = useState(12);
  const [scrutateurAddress, setScrutateurAddress] = useState("");
  const [secretaireAddress, setSecretaireAddress] = useState("");
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const { signer } = await getWeb3();
        const electionContract = await getContract(signer);
        setContract(electionContract);
        const userAccount = await signer.getAddress();
        setAccount(userAccount);

        // 🔥 Récupération des rôles
        const president = await electionContract.president();
        const scrutateur = await electionContract.scrutateur();
        const secretaire = await electionContract.secretaire();
        setScrutateurAddress(scrutateur);
        setSecretaireAddress(secretaire);

        console.log("👑 Président :", president);
        console.log("🧾 Scrutateur :", scrutateur);
        console.log("📑 Secrétaire :", secretaire);

        // Récupère le nombre total de résolutions depuis le contrat
        const resolutionsCount = await electionContract.resolutionsCount();
        setTotalResolutions(resolutionsCount.toNumber());

        await loadResolution(electionContract, resolutionId);
        await checkVoteStatus(electionContract, resolutionId); // Vérifie si le vote est ouvert

        // Check if the user is whitelisted
        const whitelisted = await electionContract.isWhitelisted(userAccount);
        setIsWhitelisted(whitelisted);
        
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
        // alert("Impossible de charger la résolution. Vérifiez la connexion ou le contrat.");
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
    }
  };

  const checkVoteStatus = async (electionContract, id) => {
    try {
      const isOpen = await electionContract.estVoteOuvert(id);
      setVoteOuvert(isOpen);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état du vote :", error);
    }
  };

  const vote = async (voteType) => {
    if (!contract || !isWhitelisted) {
      alert("Vous ne pouvez pas voter. Veuillez contacter le secrétaire.");
      return;
    }
    setLoading(true);
    try {
      await contract.VoterResolution(resolutionId, voteType);
      alert("Vote enregistré !");
    } catch (error) {
      console.error("Erreur lors du vote :", error);
      if (error?.error?.message?.includes("Vous avez deja vote.")) {
        alert("Vous avez déjà voté pour cette résolution.");
      } else if (error?.error?.message?.includes("Le vote pour cette resolution n'est pas ouvert.")) {
        alert("Le vote pour cette résolution n'est pas ouvert.");
      } else {
        alert("Erreur pendant le vote. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const ouvrirVote = async () => {
    try {
      await contract.ouvrirVote(resolutionId);
      alert(`Le vote pour la résolution ${resolutionId} est maintenant ouvert.`);
      setVoteOuvert(true);
    } catch (error) {
      console.error("Erreur lors de l'ouverture du vote :", error);
      alert("Impossible d'ouvrir le vote.");
    }
  };

  const fermerVote = async () => {
    try {
      await contract.fermerVote(resolutionId);
      alert(`Le vote pour la résolution ${resolutionId} est maintenant fermé.`);
      setVoteOuvert(false);
    } catch (error) {
      console.error("Erreur lors de la fermeture du vote :", error);
      alert("Impossible de fermer le vote.");
    }
  };

  const toggleResults = async () => {
    if (!showingResults) {
      try {
        const result = await contract.ResultatResolution(resolutionId);
        if (result) {
          const [forVotes, againstVotes, neutralVotes] = result; // Destructure the result
          setResults({ forVotes, againstVotes, neutralVotes }); // Set results as an object
        }
      } catch (error) {
        console.error("Erreur lors de l'affichage des résultats :", error);
        alert("Impossible d'afficher les résultats.");
      }
    }
    setShowingResults(!showingResults);
  };

  const nextResolution = () => {
    if (resolutionId < totalResolutions) {
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
      setResults(allResults);
      setVotingFinished(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des résultats de toutes les résolutions :", error);
      alert("Impossible d'afficher les résultats globaux.");
    }
  };

  const handleAddToWhitelist = async () => {
    if (!newAddress) return;
    try {
      await contract.addToWhitelist([newAddress]);
      setNewAddress(""); // Clear input field after adding
    } catch (error) {
      console.error("Erreur lors de l'ajout à la whitelist", error);
    }
  };

  const isScrutateur = account === scrutateurAddress;

  return (
    <div className="voting-container">
      {votingFinished ? (
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
        <>
          <h2 className="emoji">🗳️</h2>
          <h1 className="title">Vote Électronique en Assemblée Générale</h1>
          <p className="account">ID Utilisateur : <strong>{account}</strong></p>

          <div className="resolution-box">
            <h2 className="titleResolution">Résolution {resolutionId}</h2>
            <p className="resolution-text">{currentResolution}</p>
          </div>

          <div className="vote-buttons">
            <button onClick={() => vote(0)} disabled={loading || !voteOuvert}>✅ Pour</button>
            <button onClick={() => vote(1)} disabled={loading || !voteOuvert}>❌ Contre</button>
            <button onClick={() => vote(2)} disabled={loading || !voteOuvert}>➖ Neutre</button>
          </div>

          {!isWhitelisted && (
            <div className="whitelist-message">
              <p>Vous ne pouvez pas voter. Veuillez contacter le secrétaire pour être ajouté à la whitelist.</p>
            </div>
          )}

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

          {isScrutateur && (
            <div className="scrutateur-controls">
              <button onClick={ouvrirVote}>Ouvrir le vote</button>
              <button onClick={fermerVote}>Fermer le vote</button>
            </div>
          )}

          <hr className="separator-line" />
          {account === secretaireAddress && (
            <div className="whitelist-section">
              <h3>Whitelist</h3>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Ajouter une adresse"
              />
              <button onClick={handleAddToWhitelist}>Ajouter</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VotingPage;