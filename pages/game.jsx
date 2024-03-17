import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";

import gameStyles from "../src/css/game.module.css";

import PlayerDisplay from "../src/components/playerDisplay.jsx";
// import PlayerAction from "../src/components/playerAction.jsx";
import Countdown from "../src/components/countdown.jsx";

import { getGame } from "../api/game";

const Game = () => {
    const [game, setGame] = useState({});
    const [searchParams] = useSearchParams();
    useMemo(async () => {
      const gameId = searchParams.get('id') || '';
      const g = await getGame(gameId);
      setGame(g);
    }, [searchParams]);

    if (game.error) {
      return (
        <div className={gameStyles.window}>
          <div className={gameStyles.windowHeader}>
            <h1>Game Not Found</h1>
          </div>
        </div>
      )
    }
    
    return (
        <div className={gameStyles.window}>
            <div className={gameStyles.windowHeader}>
                <h1>Game</h1>
            </div>
            {!!game.error || <PlayerDisplay game={game} />}
            {/* <PlayerAction /> */}
            <Countdown startTime={30} gameTime={360} />
        </div>

    );
};


export default Game;

