import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";

import gameStyles from "../css/game.module.css";

import PlayerDisplay from "../components/playerDisplay.jsx";
// import PlayerAction from "../src/components/playerAction.jsx";
import Countdown from "../components/countdown.jsx";
import GameMusic from "../components/gameMusic.jsx";

import { getGame } from "../../api/game";

const Game = () => {
    const [game, setGame] = useState({});
    const [searchParams] = useSearchParams();
    useMemo(async () => {
      const gameId = searchParams.get('id') || '';
      const g = await getGame(gameId);
      setGame(g);
    }, [searchParams]);
    const [countdown, setCountdown] = useState();

    if (game.error) {
      return (
        <div className={gameStyles.window}>
          <div className={gameStyles.windowHeader}>
            <h1>Game Not Found</h1>
          </div>
        </div>
      )
    }

    const buttonHandler = () => {
      let button = document.getElementById("startbutton");
      button.parentNode.removeChild(button);
      addCountdown();
      let window = document.getElementById("window");
      window.style = "{{display: 'block'}}";
    }

    function addCountdown() {
      setCountdown(<Countdown startTime={30} gameTime={360} />);
    } 
    
    return (
      <>
        <button
          id = "startbutton"
          className = {gameStyles.startButton}
          onClick = {buttonHandler}
        >
          Click To Start Countdown
        </button>
        <div className={gameStyles.window} id="window" style={{display: "none"}}>
            <div className={gameStyles.windowHeader}>
                <h1>Game</h1>
            </div>
            {!!game.error || <PlayerDisplay game={game} />}
            {/* <PlayerAction /> */}
            <div>
              <GameMusic />
              {/* <Countdown startTime={30} gameTime={360} /> */}
              {countdown}
            </div>
        </div>
      </>

    );
};


export default Game;

