import { useEffect, useState } from "react";
import playerDisplayStyles from "/src/css/playerDisplay.module.css";
import PropTypes from 'prop-types';

import { getPlayer } from "../../api/player";
import { getAllPlayerSessions } from "../../api/playerSession"

const PlayerDisplay = ({ game }) => {
  const [redPlayers, setRedPlayers] = useState([]);
  const [greenPlayers, setGreenPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerSessions = await getAllPlayerSessions();
        const playerSessionsForGame = playerSessions.filter((playerSession) => playerSession.gameId === game.id);
        const redPlayers = playerSessionsForGame.filter((player) => player.team === 'Red');
        const redPlayerInfo = await Promise.all(
          redPlayers.map(async (player) => {
            const playerInfo = await getPlayer(player.playerId);
            return {
              ...player,
              codename: playerInfo.codename,
            };
          })
        );
        const greenPlayers = playerSessionsForGame.filter((player) => player.team === 'Green');
        const greenPlayerInfo = await Promise.all(
          greenPlayers.map(async (player) => {
            const playerInfo = await getPlayer(player.playerId);
            return {
              ...player,
              codename: playerInfo.codename,
            };
          })
        );
        setRedPlayers(redPlayerInfo);
        setGreenPlayers(greenPlayerInfo);
      } catch (error) {
        console.error(error);
      }
    };

    if (game) {
      fetchData();
    }

  }, [game]);

  return (
    <div className={playerDisplayStyles.playerDisplay}>
      <div className={playerDisplayStyles.redTeam}>
        <span className={playerDisplayStyles.teamLabel}>Red Team</span>
        {redPlayers.map((player, index) => (
          <div key={index} className={playerDisplayStyles.redPlayer}>
            <span className={playerDisplayStyles.redPlayerName}>
              {player.codename}
            </span>
            <span className={playerDisplayStyles.redPlayerScore}>
              {player.playerScore}
            </span>
          </div>
        ))}
      </div>
      <div className={playerDisplayStyles.greenTeam}>
        <span className={playerDisplayStyles.teamLabel}>Green Team</span>
        {greenPlayers.map((player, index) => (
          <div
            key={index}
            className={playerDisplayStyles.greenPlayer}
          >
            <span className={playerDisplayStyles.greenPlayerName}>
              {player.codename}
            </span>
            <span className={playerDisplayStyles.greenPlayerScore}>
              {player.playerScore}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

PlayerDisplay.propTypes = {
  game: PropTypes.object.isRequired,
};

export default PlayerDisplay;
