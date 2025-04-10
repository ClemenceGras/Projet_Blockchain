async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployé par:", deployer.address);

  const Election = await ethers.getContractFactory("Election");
  const election = await Election.deploy();
  await election.deployed();
  console.log("Contrat déployé à:", election.address);

  // Initialiser les résolutions
  await election.InitialiserResolution();
  console.log("Résolutions initialisées.");

  // Vérifier la première résolution
const resolution = await election.AfficherResolution(1);
console.log("Première résolution :", resolution);

  // Interaction avec le contrat : voter pour une résolution
  const resolutionId = 1; // ID de la résolution
  const voteType = 0; // 0 = Pour, 1 = Contre, 2 = Neutre
  await election.VoterResolution(resolutionId, voteType);
  console.log(`Vote enregistré pour la résolution ${resolutionId} avec le type de vote ${voteType}.`);

  // Vérifier les résultats
  const result = await election.ResultatResolution(resolutionId);
  console.log(`Résultats pour la résolution ${resolutionId} : Pour = ${result.forVotes}, Contre = ${result.againstVotes}, Neutre = ${result.neutralVotes}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});