import playerActionStyles from "../css/playerAction.module.css"
import PropTypes from 'prop-types';

const PlayerActions = ({ sender, senderColor, recipient, recipientColor }) => {
  return (
    <div className={playerActionStyles.playerAction}>
      <span style={{ color: senderColor }}> {sender}</span>&nbsp;hit&nbsp;
      {recipient === 'the base' ? (
        <span style={{ color: recipientColor }}>{recipient}</span>
      ) : (
        <span style={{ color: recipientColor }}>{recipient}</span>
      )}
    </div>
  );
};

PlayerActions.propTypes = {
  sender: PropTypes.string.isRequired,
  senderColor: PropTypes.string.isRequired,
  recipient: PropTypes.string.isRequired,
  recipientColor: PropTypes.string.isRequired,
};

const PlayerAction = ({ actions, teamWin, gameEnd }) => {
  const MAX_ACTIONS = 10;
  const reversedActions = [...actions].reverse();
  const limitedActions = reversedActions.slice(0, MAX_ACTIONS);

  let gameEndImage;
  if (teamWin === 'red') {
    gameEndImage = 'redwin';
  } else if (teamWin === 'green') {
    gameEndImage = 'greenwin';
  } else {
    gameEndImage = 'draw';
  }

  return (
    <div className={playerActionStyles.actionScreen}>
      <div className={playerActionStyles.actions}>
        {limitedActions.map((action, index) => (
          <PlayerActions
            key={index}
            sender={action.sender}
            senderColor={action.senderColor}
            recipient={action.recipient}
            recipientColor={action.recipientColor}
          />
        ))}
      </div>
      {teamWin && gameEnd ? (
        <div className={playerActionStyles.winImage}>
          <img src={`../../assets/${gameEndImage}.png`} alt='Draw!'/>
        </div>
      ) : null}
    </div>
  );
};

PlayerAction.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      sender: PropTypes.string.isRequired,
      senderColor: PropTypes.string.isRequired,
      recipient: PropTypes.string.isRequired,
      recipientColor: PropTypes.string.isRequired,
    })
  ).isRequired,
  teamWin: PropTypes.string.isRequired,
  gameEnd: PropTypes.bool.isRequired,
};

export default PlayerAction;
