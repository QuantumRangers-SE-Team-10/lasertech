import playerActionStyles from "../css/playerAction.module.css"
import PropTypes from 'prop-types';



const PlayerActions = ({ sender, senderColor, recipient, recipientColor}) => {
    return (
        <div className={playerActionStyles.playerAction}>
            <span style={{ color: senderColor }}> {sender} </span> &nbsp; hit &nbsp;
            {recipient === 'the base' ? (
                <span style={{ color: recipientColor }}> {recipient} </span>
            ) : (
                <span style={{ color: recipientColor }}> {recipient} </span>
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

    // const [game, setGame] = useState({});
    // const [players, setPlayers] = useState([]);

    // const fetchGame = async (gameId) => {
    //     try {
    //         const response = await fetch(`/api/games/${gameId}`);
    //         if (!response.ok) {
    //         throw new Error(`Error fetching game information`);
    //         }
    //         const data = await response.json();
    //         setGame(data.game);
    //     } catch (error) {
    //         console.error(error);
    //     }
    //     };

    //     const fetchPlayers = async (gameId) => {
    //         try {
    //             const response = await fetch(`/api/games/${gameId}/players`);
    //             if (!response.ok) {
    //                 throw new Error(`Error fetching player information`);
    //             }
    //             const data = await response.json();
    //             const playersData = data.players.map(player => ({
    //                 codename: player.codename,
    //                 action: player.action
    //             }));
    //             setPlayers(playersData);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    
    //     useEffect(() => {
    //         let [searchParams] = useSearchParams();
    //         const gameId = searchParams.get("gameId");
    //         fetchGame(gameId);
    //         fetchPlayers(gameId);
    //     }, []);

    const MAX_ACTIONS = 14;

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