// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./Whitelist.sol";

contract Election is Ownable, Whitelist {
    using SafeMath for uint256;

    //* Variables *//
    address public president;
    address public scrutateur;
    uint public resolutionsCount;
    mapping(uint => mapping(address => bool)) private hasVoted;
    mapping(uint => string) private resolutions;
    mapping(uint => uint) private resolutionVoteCountsPour;   // Compteur des votes "Pour"
    mapping(uint => uint) private resolutionVoteCountsContre; // Compteur des votes "Contre"
    mapping(uint => uint) private resolutionVoteCountsNeutre; // Compteur des votes "Neutre"

    enum Vote { Pour, Contre, Neutre }

    modifier onlyWhitelisted() {
        require(isWhitelisted(msg.sender), "Vous n'etes pas autorise a voter.");
        _;
    }

    // Initialiser les resolutions
    function InitialiserResolution() public onlyOwner {
        addResolution("Voulez-vous elire Clemence comme presidente de la seance, car rien ne peut commencer sans une figure d'autorite symbolique.");
        addResolution("Voulez-vous elire Manuela comme scrutateur de la seance, un poste crucial qui changera le cours de l'histoire. Ou pas.");
        addResolution("Offrir une medaille d'or a chaque citoyen pour avoir 'sauve la planete' en triant son dechet une fois dans l'annee.");
        addResolution("Remplacer toutes les voitures par des licornes biodegradables, parce que l'innovation c'est important.");
        addResolution("Obliger tous les employes a faire du teletravail depuis un hamac, pour maximiser la productivite et les coups de soleil.");
        addResolution("Taxer les respirations trop profondes afin de limiter les emissions de CO2 des humains.");
        addResolution("Transformer tous les immeubles en pain d'epices, car c'est aussi durable que du beton mais beaucoup plus delicieux.");
        addResolution("Remplacer le Parlement par un groupe WhatsApp, pour des debats plus reactifs et des decisions basees sur des memes.");
        addResolution("Recompenser toute personne capable de boire un cafe sans produire un dechet, ni parler de l'exploit sur les reseaux sociaux.");
        addResolution("Organiser des seminaires sur la reduction des emissions de carbone... uniquement accessibles en jet prive.");
        addResolution("Lancer un defi national : qui reussira a tenir 24h sans utiliser un mot a la mode comme 'durabilite' ou 'innovation' ?");
        addResolution("Mettre en place une commission pour decider si les decisions doivent etre decidees par une commission.");
    }

    // Ajouter une résolution
    function addResolution(string memory _description) internal {
        resolutionsCount++;
        resolutions[resolutionsCount] = _description;
        emit ResolutionAdded(resolutionsCount, _description); // Emit event when a resolution is added
    }

    // Obtenir la description d'une résolution
    function AfficherResolution(uint _resolutionId) public view returns (string memory) {
        return resolutions[_resolutionId];
    }

    // Obtenir les résultats de la résolution
    function ResultatResolution(uint _resolutionId) public view returns (uint forVotes, uint againstVotes, uint neutralVotes) {
        require(_resolutionId > 0 && _resolutionId <= resolutionsCount, "Resolution invalide.");

        forVotes = resolutionVoteCountsPour[_resolutionId];
        againstVotes = resolutionVoteCountsContre[_resolutionId];
        neutralVotes = resolutionVoteCountsNeutre[_resolutionId];

        return (forVotes, againstVotes, neutralVotes);
    }

    // Fonction pour attribuer les rôles après vérification des votes
function AssignerRoleApresVote() private { 
    if (president == address(0) && resolutionVoteCountsPour[1] > resolutionVoteCountsContre[1] && resolutionVoteCountsPour[1] > resolutionVoteCountsNeutre[1]) {   
        president = address(0xEe868457836Bc3F2C05f7aD7f254d807Ea4Ea575);
        string memory message = "Le role de president a ete attribue a l'adresse specifiee apres validation du vote.";
        emit NewPresidentElectedWithMessage(president, message); // Utilisez la version avec deux arguments
    }
    if (scrutateur == address(0) && resolutionVoteCountsPour[2] > resolutionVoteCountsContre[2] && resolutionVoteCountsPour[2] > resolutionVoteCountsNeutre[2]) {
        scrutateur = address(0xEe868457836Bc3F2C05f7aD7f254d807Ea4Ea575);
        string memory message = "Le role de scrutateur a ete attribue a l'adresse specifiee apres validation du vote.";
        emit NewScrutateurElectedWithMessage(scrutateur, message); // Utilisez la version avec deux arguments
    }
}


    function VoterResolution(uint _resolutionId, Vote _vote) public {
        require(!hasVoted[_resolutionId][msg.sender], "Vous avez deja vote.");
        require(uint(_vote) >= 0 && uint(_vote) <= 2, "Vote invalide.");

        hasVoted[_resolutionId][msg.sender] = true; // Marquer l'utilisateur comme ayant voté

        if (_vote == Vote.Pour) {
            resolutionVoteCountsPour[_resolutionId]++;
        } else if (_vote == Vote.Contre) {
            resolutionVoteCountsContre[_resolutionId]++;
        } else {
            resolutionVoteCountsNeutre[_resolutionId]++;
        }
    }

    // Fonction pour clôturer le vote
    function cloturerVote(uint _resolutionId) public onlyOwner {
        require(bytes(resolutions[_resolutionId]).length > 0, "Resolution inconnue");

        uint pour = resolutionVoteCountsPour[_resolutionId];
        uint contre = resolutionVoteCountsContre[_resolutionId];
        uint neutre = resolutionVoteCountsNeutre[_resolutionId];
        string memory resultMessage;

        // Vérification des résultats pour la résolution
        if (pour > contre && pour > neutre) {
            // Pour résolution 1 et 2
            AssignerRoleApresVote();
            // Résolution approuvée
            resultMessage = "La resolution a ete approuvee.";
        } else if (contre > pour && contre > neutre) {
            // Résolution rejetée
            resultMessage = "La resolution a ete rejetee.";
        } else if (neutre > pour && neutre > contre) {
            // Résolution neutre (si la majorité des votes sont neutres)
            resultMessage = "La resolution a ete rejetee, car la majorite des votes etaient neutres.";
        } else {
            // Cas où il y a égalité entre pour, contre, et neutre
            resultMessage = "La resolution n'a pas de resultat clair (egalite entre les votes). On fait un second tour.";
            secondTour(_resolutionId);
        }
        // Emitting an event to notify the result
        emit VoteCloture(_resolutionId, pour, contre, neutre, resultMessage);
    }

    // Fonction pour réinitialiser les votes pour un second tour
    function secondTour(uint _resolutionId) private {
        require(bytes(resolutions[_resolutionId]).length > 0, "Resolution inconnue");

        // Réinitialiser les compteurs de votes
        resolutionVoteCountsPour[_resolutionId] = 0;
        resolutionVoteCountsContre[_resolutionId] = 0;
        resolutionVoteCountsNeutre[_resolutionId] = 0;

        // Réinitialiser les marques de vote des utilisateurs
        for (uint i = 0; i < resolutionsCount; i++) {
            hasVoted[_resolutionId][msg.sender] = false;
        }
    }

// Événements pour suivre les actions
event VotedForResolution(uint indexed _resolutionId, Vote indexed _vote);
event NewPresidentElected(address indexed _newPresident); // Version avec un seul argument
event NewPresidentElectedWithMessage(address president, string message); // Version avec deux arguments
event NewScrutateurElected(address indexed _newScrutateur); // Version avec un seul argument
event NewScrutateurElectedWithMessage(address scrutateur, string message); // Version avec deux arguments
event ResolutionAdded(uint indexed _resolutionId, string _description);
event VoteCloture(uint resolutionId, uint pour, uint contre, uint neutre, string resultMessage);
}