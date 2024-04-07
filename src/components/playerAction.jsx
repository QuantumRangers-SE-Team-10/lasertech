import playerActionStyles from "../css/playerAction.module.css"

const PlayerActions = ({ sender, senderColor, recipient, recipientColor}) => {
    return (
        <div className={playerActionStyles.playerAction}>
            <span style={{ color: senderColor }}>{sender}</span> hit&nbsp;
            {recipient === 'the base' ? (
                <span style={{ color: recipientColor }}>{recipient}</span>
            ) : (
                <span style={{ color: recipientColor }}>{recipient}</span>
            )}
        </div>
    );
};

const PlayerAction = () => {

    const [game, setGame] = useState({});
    const [players, setPlayers] = useState([]);

    const fetchGame = async (gameId) => {
        try {
            const response = await fetch(`/api/games/${gameId}`);
            if (!response.ok) {
            throw new Error(`Error fetching game information`);
            }
            const data = await response.json();
            setGame(data.game);
        } catch (error) {
            console.error(error);
        }
        };

        const fetchPlayers = async (gameId) => {
            try {
                const response = await fetch(`/api/games/${gameId}/players`);
                if (!response.ok) {
                    throw new Error(`Error fetching player information`);
                }
                const data = await response.json();
                const playersData = data.players.map(player => ({
                    codename: player.codename,
                    action: player.action
                }));
                setPlayers(playersData);
            } catch (error) {
                console.error(error);
            }
        };
    
        useEffect(() => {
            let [searchParams] = useSearchParams();
            const gameId = searchParams.get("gameId");
            fetchGame(gameId);
            fetchPlayers(gameId);
        }, []);
    
        return (
            <div className={playerActionStyles.actionScreen}>
                {players.map(player => (
                    <PlayerActions
                        key={player.codename}
                        sender={player.codename}
                        senderColor={game.players.find(p => p.codename === player.codename).color}
                        recipient={player.action.recipient}
                        recipientColor={game.players.find(p => p.codename === player.action.recipient).color}
                    />
                ))}
            </div>
        );
    }
    export default PlayerAction;