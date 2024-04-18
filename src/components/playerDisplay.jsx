import { useEffect, useState } from "react";
import playerDisplayStyles from "../../src/css/playerDisplay.module.css";
import PropTypes from 'prop-types';

const PlayerDisplay = ({ playerInfo }) => {
  const [redPlayers, setRedPlayers] = useState([]);
  const [greenPlayers, setGreenPlayers] = useState([]);

  useEffect(() => {
    const redPlayerInfo = playerInfo.filter((player) => player.team === 'Red');
    const greenPlayerInfo = playerInfo.filter((player) => player.team === 'Green');
    setRedPlayers(redPlayerInfo);
    setGreenPlayers(greenPlayerInfo);
  }, [playerInfo]);

  return (
    <div className={playerDisplayStyles.playerDisplay}>
      <TeamDisplay team="Red" players={redPlayers} />
      <TeamDisplay team="Green" players={greenPlayers} />
    </div>
  );
};

PlayerDisplay.propTypes = {
  playerInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const TeamDisplay = ({ team, players }) => {
  return (
    <div className={team === 'Red' ? playerDisplayStyles.redTeam : playerDisplayStyles.greenTeam}>
      <img className={playerDisplayStyles.teamImage} src={`../../assets/${team.toLowerCase()}.png`} alt={`${team} Team`}/>
      {/*<span className={playerDisplayStyles.teamLabel}>{team} Team</span>*/}
      {players.map((player, index) => (
        <div key={index} className={playerDisplayStyles.player}>
          <span className={playerDisplayStyles.playerName}>
            {player.codename}
          </span>
          <span className={playerDisplayStyles.playerScore}>
            {player.playerScore}
          </span>
        </div>
      ))}
    </div>
  );
}

TeamDisplay.propTypes = {
  team: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PlayerDisplay;
