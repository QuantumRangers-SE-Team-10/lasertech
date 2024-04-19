import playerActionStyles from "../css/playerAction.module.css"
import PropTypes from 'prop-types';



const PlayerActions = ({ sender, senderColor, recipient, recipientColor}) => {
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



const PlayerAction = ({ actions }) => {
    const MAX_ACTIONS = 12;

    const reversedActions = [...actions].reverse();

    const limitedActions = reversedActions.slice(0, MAX_ACTIONS);
    
        return (
                <div className={playerActionStyles.actionScreen}>
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
        };
        
        
    export default PlayerAction;