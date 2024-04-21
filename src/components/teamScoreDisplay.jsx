import {useEffect} from 'react';
import PropTypes from 'prop-types';

import teamScoreDisplayStyles from '../../src/css/teamScoreDisplay.module.css';

const TeamScoreDisplay = ({ team, playerSessions, highScoring }) => {
  useEffect(() => {
    const teamScore = document.getElementById(`teamScore${team}`);
    if (highScoring) {
      // setInterval(() => {
        teamScore.className = teamScoreDisplayStyles.glow;
      // }, 0);
    } else {
      teamScore.className = null;
    }
  }, [team, highScoring]);

  return (
    <div className={teamScoreDisplayStyles.teamScoreBox}>
      <span className={null} id={`teamScore${team}`}>{!(playerSessions.length > 0) || playerSessions.reduce((acc, player) => acc + player.playerScore, 0)}</span>
    </div>
  )
};

TeamScoreDisplay.propTypes = {
  team: PropTypes.string.isRequired,
  playerSessions: PropTypes.arrayOf(PropTypes.object).isRequired,
  highScoring: PropTypes.bool.isRequired,
};

export default TeamScoreDisplay;