import PropTypes from 'prop-types';

import TeamScoreDisplay from "./teamScoreDisplay";

import playerDisplayStyles from "../../src/css/playerDisplay.module.css";

const PlayerDisplay = ({ playerInfo }) => {
  const redPlayerInfo = playerInfo.filter((player) => player.team === 'Red');
  const greenPlayerInfo = playerInfo.filter((player) => player.team === 'Green');
  const redScore = redPlayerInfo.reduce((acc, player) => acc + player.playerScore, 0);
  const greenScore = greenPlayerInfo.reduce((acc, player) => acc + player.playerScore, 0);
  let highScoringTeam = null;
  if (redScore > greenScore) {
    highScoringTeam = 'red';
  } else if (greenScore > redScore) {
    highScoringTeam = 'green';
  } else {
    highScoringTeam = null;
  }

  return (
    <div className={playerDisplayStyles.playerDisplay}>
      <TeamDisplay team="Red" players={redPlayerInfo} highScoring={highScoringTeam === 'red'} />
      <TeamDisplay team="Green" players={greenPlayerInfo} highScoring={highScoringTeam === 'green'} />
    </div>
  );
};

PlayerDisplay.propTypes = {
  playerInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const TeamDisplay = ({ team, players, highScoring }) => {
  return (
    <div className={team === 'Red' ? playerDisplayStyles.redTeam : playerDisplayStyles.greenTeam}>
      <img className={playerDisplayStyles.teamImage} src={`../../assets/${team.toLowerCase()}.png`} alt={`${team} Team`}/>
      {players.map((player, index) => (
        <div key={index} className={playerDisplayStyles.player}>
          <span className={playerDisplayStyles.baseBadge}>
            {player.hasHitBase && (
              <img
                className={playerDisplayStyles.baseBadgeImage}
                src="../../assets/baseicon.png"
                alt="Hit Base Badge"
              />
            )}
          </span>
          <span className={playerDisplayStyles.playerName}>
            {player.codename}
          </span>
          <span className={playerDisplayStyles.playerScore}>
            {player.playerScore}
          </span>
        </div>
      ))}
      <TeamScoreDisplay team={team} playerSessions={players} highScoring={highScoring} />
    </div>
  );
}

TeamDisplay.propTypes = {
  team: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  highScoring: PropTypes.bool.isRequired,
};

export default PlayerDisplay;
