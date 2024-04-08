import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";

import gameStyles from "../css/game.module.css";

import PlayerDisplay from "../components/playerDisplay.jsx";
import PlayerAction from "../components/playerAction.jsx";
import Countdown from "../components/countdown.jsx";

import { getGame } from "../../api/game";

const playerActions = [
  {sender: "Bob ", senderColor: "red", recipient: "Billy", recipientColor: "green"},
  {sender: "Billy ", senderColor: "green", recipient: "Bob", recipientColor: "red"},
  {sender: "Bob ", senderColor: "red", recipient: "base", recipientColor: "green"},
  {sender: "Bob ", senderColor: "red", recipient: "base", recipientColor: "red"},
  {sender: "Bob ", senderColor: "red", recipient: "Billy", recipientColor: "green"},
  {sender: "Billy ", senderColor: "green", recipient: "Bob", recipientColor: "red"},
  {sender: "Bob ", senderColor: "red", recipient: "base", recipientColor: "green"},
  {sender: "Bob ", senderColor: "red", recipient: "base", recipientColor: "red"},
  {sender: "Bob ", senderColor: "red", recipient: "Billy", recipientColor: "green"},
  {sender: "Billy ", senderColor: "green", recipient: "Bob", recipientColor: "red"},
  {sender: "Bob ", senderColor: "red", recipient: "base", recipientColor: "green"},
  {sender: "Bob ", senderColor: "red", recipient: "base", recipientColor: "green"},
];

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
            {!!game.error || <PlayerAction actions = {playerActions} />}
            <Countdown startTime={30} gameTime={360} />
        </div>

    );
};


export default Game;

