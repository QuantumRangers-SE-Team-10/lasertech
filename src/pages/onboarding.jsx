import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

import { addPlayer, getPlayer } from "../../api/player";
import { addPlayerSession } from "../../api/playerSession";
import { addGame } from "../../api/game";

import onboardingStyles from "../css/onboarding.module.css";

const Onboarding = ({ socket }) => {
  const navigate = useNavigate();
  const [playerID, setPlayerID] = useState("");
  const [redTeamPlayers, setRedTeamPlayers] = useState(
    Array.from(Array(20).keys()).map(() => ({
      codename: "",
      playerID: "",
      equipmentId: "",
    }))
  );
  const [greenTeamPlayers, setGreenTeamPlayers] = useState(
    Array.from(Array(20).keys()).map(() => ({
      codename: "",
      playerID: "",
      equipmentId: "",
    }))
  );
  const [game, setGame] = useState();
  const [codename, setCodename] = useState("");
  const [redTeamIndex, setRedTeamIndex] = useState(0);
  const [greenTeamIndex, setGreenTeamIndex] = useState(0);
  const [equipmentId, setEquipmentId] = useState("");
  const [showCodeName, setShowCodeName] = useState(false);
  const [isAddGreenButtonDisabled, setAddGreenButtonDisabled] = useState(true);
  const [isAddRedButtonDisabled, setAddRedButtonDisabled] = useState(true);
  const [isCodenameInputDisabled, setCodenameInputDisabled] = useState(true);

  useEffect(() => {
    async function add_Game() {
      const game = await addGame();
      setGame(game);
    }
    
    add_Game();
  }, []);

  const fetchCodename = async (playerID) => {
    try {
      const player = await getPlayer(playerID);
      if (!player.error) {
        setCodename(player.codename);
        setShowCodeName(true);
        setCodenameInputDisabled(true);
      } else {
        setCodename("");
        setShowCodeName(true);
        setCodenameInputDisabled(false);
      }
    } catch (error) {
      console.error("Error fetching codename:", error);
      setShowCodeName(true); // Show the input field for manual entry
    }
  };

  const validateTeam = (value) => {
    const equipmentIdValue = parseInt(value);
     if( !isNaN(equipmentIdValue) ) {
      if (equipmentIdValue === 43 || equipmentIdValue === 53) {
        return;
      } else if(equipmentIdValue % 2 !== 0 && codename !== '') {
        setAddRedButtonDisabled(false)
      } else if (equipmentIdValue % 2 === 0 && codename  !== '') {
        setAddGreenButtonDisabled(false)
      }
    }
  }

  const validateEquipmentId = (value, team, index) => {
    const equipmentIdValue = parseInt(value);
    const isValid =
      !isNaN(equipmentIdValue) &&
      ((team === "Green" && equipmentIdValue % 2 === 0) ||
        (team === "Red" && equipmentIdValue % 2 !== 0));
    if (team === "Red") {
      const updatedPlayers = [...redTeamPlayers];
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        equipmentId: value,
        isValid,
        
      };
      setRedTeamPlayers(updatedPlayers);
    } else if (team === "Green") {
      const updatedPlayers = [...greenTeamPlayers];
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        equipmentId: value,
        isValid,
      };
     setGreenTeamPlayers(updatedPlayers);
    }
  };

  const handleClearGame = () => {
    setRedTeamPlayers(
      Array.from(Array(20).keys()).map(() => ({
        codename: "",
        playerID: "",
        equipmentId: "",
      }))
    );
    setGreenTeamPlayers(
      Array.from(Array(20).keys()).map(() => ({
        codename: "",
        playerID: "",
        equipmentId: "",
      }))
    );
    setRedTeamIndex(0);
    setGreenTeamIndex(0);
  };

  const handleCodenameChange = async (codename) => {
    setCodename(codename);
    if (codename === "" || equipmentId === "") {
      setAddGreenButtonDisabled(true);
      setAddRedButtonDisabled(true);
    } else if (equipmentId % 2 === 0) {
      setAddGreenButtonDisabled(false);
      setAddRedButtonDisabled(true);
    } else if (equipmentId % 2 !== 0) {
      setAddRedButtonDisabled(false);
      setAddGreenButtonDisabled(true);
    }
  };

  const handleSubmitPlayer = async (team) => {
    //setAddButtonDisabled(true);
    setAddGreenButtonDisabled(true);
    setAddRedButtonDisabled(true);
    if (!playerID || !codename) {
      console.log("Invalid player");
      return;
    }
    const playerIds = [...redTeamPlayers, ...greenTeamPlayers].map(
      (player) => player.playerID
    );
    if (playerIds.includes(playerID)) {
      // TODO: Handle this case
      console.log("Player ID already exists");
      return;
    }
    const newPlayer = { playerID, codename };
    if (!isCodenameInputDisabled) {
      await addPlayer(playerID, codename);
    }
    await addPlayerSession(playerID, game.id, equipmentId, team);
    socket.emit('equipment-init', equipmentId);
    if (team === "Red") {
      if (redTeamIndex !== -1) {
        const updatedRedTeamPlayers = [...redTeamPlayers];
        updatedRedTeamPlayers[redTeamIndex] = newPlayer; // Update existing player
        setRedTeamPlayers(updatedRedTeamPlayers);
        setRedTeamIndex(redTeamIndex + 1);
      } else {
        console.log("Player not found in the Red Team");
      }
    } else if (team === "Green") {
      if (greenTeamIndex !== -1) {
        const updatedGreenTeamPlayers = [...greenTeamPlayers];
        updatedGreenTeamPlayers[greenTeamIndex] = newPlayer; // Update existing player
        setGreenTeamPlayers(updatedGreenTeamPlayers);
        setGreenTeamIndex(greenTeamIndex + 1);
      } else {
        console.log("Player not found in the Green Team");
      }
    }

    // Clear input fields after submission
    setPlayerID("");
    setCodename("");
    setEquipmentId("");
  };

  const handleSubmit = async () => {
    const players = [...redTeamPlayers, ...greenTeamPlayers];

    const filteredPlayers = players.filter(
      (player) => player.playerID !== "" && player.codename !== ""
    );

    filteredPlayers.forEach(async (player) => {
      if (player.equipmentId && player.codename !== "" && player.playerID !== "") {
        const team = player.equipmentId % 2 === 0 ? "Green" : "Red";
        await addPlayerSession(player.playerID, game.id, player.equipmentId, team);
      }
    });

    navigate(`/game?id=${game.id}`);
  };

  return (
    <div className={onboardingStyles.window}>
      <div className={onboardingStyles.windowHeader}>
        <h2>Game Setup</h2>
      </div>
      <div className={onboardingStyles.windowContent}>
        <div>
          <h3> Add Player</h3>
          <div className={onboardingStyles.playerInput}>
            <input
              id="playerID"
              type="number"
              value={playerID}
              onChange={(e) => {
                setPlayerID(e.target.value);
                //setAddButtonDisabled(true);
                setCodenameInputDisabled(true);
                setCodename("");
              }}
              placeholder="Player ID"
            />
            <span
              className={onboardingStyles.magnifyIcon}
              onClick={() => {
                fetchCodename(playerID);
              }}
            >
              <svg className={onboardingStyles.magnifyingGlassIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
            </span>
          </div>
          {playerID && showCodeName && (
            <>
              <div className={onboardingStyles.playerInput}>
                <input
                  type="text"
                  value={codename}
                  onChange={(e) => handleCodenameChange(e.target.value)}
                  placeholder="Enter Codename"
                  style={{
                    backgroundColor: isCodenameInputDisabled ? "#aaa" : "#f9f9f9",
                    borderColor: isCodenameInputDisabled ? "#aaa" : "#f9f9f9",
                  }}
                  disabled={isCodenameInputDisabled}
                />
              </div>
              <div className={onboardingStyles.playerInput}>
                <input
                  type="number"
                  pattern="^(?!53$|43$).*"
                  value={equipmentId}
                  onChange={(e) => {
                    setEquipmentId(e.target.value);
                    setAddGreenButtonDisabled(true);
                    setAddRedButtonDisabled(true);
                    validateTeam(e.target.value);
                  }}
                  placeholder="Enter Equipment ID"
                />
              </div>
              {equipmentId === '43' || equipmentId === '53' ? (
                  <p style={{ color: "red" }}>
                    Equipment ID cannot be 43 or 53
                  </p>
                ) : null}
            </>
          )}
          <div className={onboardingStyles.buttonContainer}>
            <span style={{gridColumn: "span 3"}}></span>
            <button
              className={onboardingStyles.addTeamButton}
              onClick={() => {
                validateEquipmentId(equipmentId, "Red", redTeamIndex);
                handleSubmitPlayer("Red");
              }}
              disabled={isAddRedButtonDisabled}
              style={{
                color: "red",
                backgroundColor: isAddRedButtonDisabled ? "#aaa" : "#f9f9f9",
              }}
            >
              Add to Red Team
            </button>
            <button
              className={onboardingStyles.addTeamButton}
              onClick={() => {
                validateEquipmentId(equipmentId, "Green", greenTeamIndex);
                handleSubmitPlayer("Green");
              }}
              disabled={isAddGreenButtonDisabled}
              style={{
                color: "green",
                backgroundColor: isAddGreenButtonDisabled ? "#aaa" : "#f9f9f9",
              }}
            >
              Add to Green Team
            </button>
            <span style={{gridColumn: "span 3"}}></span>
          </div>
        </div>
        <div className={onboardingStyles.columns}>
          <div className={onboardingStyles.column}>
            <img className={onboardingStyles.teamImage} src='src/assets/images/red.png'></img>
            {redTeamPlayers.map((player, index) => (
              <div key={index}>
                <input
                  id="playerID"
                  type="number"
                  value={player.playerID}
                  readOnly
                  placeholder="ID Number"
                  autoFocus
                  disabled
                />
                <input
                  id="codename"
                  type="text"
                  value={player.codename}
                  readOnly
                  placeholder="Codename"
                  disabled
                />
                <input
                  id="equipmentId"
                  type="text"
                  value={player.equipmentId}
                  readOnly
                  placeholder="Equipment ID"
                  disabled
                />
              </div>
            ))}
          </div>
          <div className={onboardingStyles.column}>
            <img className={onboardingStyles.teamImage} src='src/assets/images/green.png'></img>
            {greenTeamPlayers.map((player, index) => (
              <div key={index}>
                <input
                  id="playerID"
                  type="number"
                  value={player.playerID}
                  readOnly
                  placeholder="ID Number"
                  disabled
                />
                <input
                  id="codename"
                  type="text"
                  value={player.codename}
                  readOnly
                  placeholder="Codename"
                  disabled
                />
                <input
                  id="equipmentId"
                  type="text"
                  value={player.equipmentId}
                  readOnly
                  placeholder = "Equipment ID"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={onboardingStyles.hotkeys}>
        <span style={{gridColumn: "span 2"}}></span>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleClearGame}>Clear Game</button>
      </div>
    </div>
  );
};

Onboarding.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default Onboarding;
