import PropTypes from 'prop-types';

import teamScoreDisplay from '../../src/css/teamScoreDisplay.module.css';

const TeamScoreDisplay = ({ playerSessions }) => {
  return(
    <div className={teamScoreDisplay.teamScoreBox}>
      {!(playerSessions.length > 0) || playerSessions.reduce((acc, player) => acc + player.playerScore, 0)}
    </div>
  )
};

TeamScoreDisplay.propTypes = {
  playerSessions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TeamScoreDisplay;