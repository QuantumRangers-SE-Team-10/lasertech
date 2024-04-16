import { useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import io from 'socket.io-client';

import gameStyles from "../css/game.module.css";

import PlayerDisplay from "../components/playerDisplay.jsx";
import PlayerAction from "../components/playerAction.jsx";
import Countdown from "../components/countdown.jsx";
import GameMusic from "../components/gameMusic.jsx";

import { getGame } from "../../api/game";
import { getAllPlayers } from "../../api/player";
import { getAllPlayerSessions } from "../../api/playerSession";

const socket = io('http://localhost:3000');

const Game = () => {
  const [game, setGame] = useState({});
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState();
  useMemo(async () => {
    const gameId = searchParams.get('id') || '';
    const g = await getGame(gameId);
    setGame(g);
  }, [searchParams]);

  const [players, setPlayers] = useState();
  useMemo(async () => {
    const p = await getAllPlayers();
    setPlayers(p);
  }, []);

  const [playerSessions, setPlayerSessions] = useState();
  useMemo(async () => {
    const ps = (await getAllPlayerSessions());
    setPlayerSessions(ps);
  }, []);

  const [playerActions, setPlayerActions] = useState([]);

  useEffect(() => {
    // Set up event listener
    socket.on('hit', (data) => {
      // Handle the event and update the component state
      console.log('Received data:', data);
      console.log(playerSessions);
      const sender = playerSessions.find((pS) => pS.gameId === game.id && pS.equipmentId === Number(data.sender));
      let recipient
      if (data.recipient === '43' || data.recipient === '53') {
        recipient = { codename: 'the base', team: 'white' }
      } else {
        recipient = playerSessions.find((pS) => pS.gameId === game.id && pS.equipmentId === Number(data.recipient));
      }
      const action = {
        sender: players.find((p) => p.id === sender.playerId).codename,
        senderColor: sender.team.toLowerCase(),
        recipient: recipient.playerId ? players.find((p) => p.id === recipient.playerId).codename : recipient.codename,
        recipientColor: recipient.team.toLowerCase(),
      };
      setPlayerActions((prevActions) => [...prevActions, action]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('hit');
    };
  }, [players, playerSessions, game]);

  const buttonHandler = () => {
      let button = document.getElementById("startbutton");
      button.parentNode.removeChild(button);
      addCountdown();
      let window = document.getElementById("window");
      window.style = "{{display: 'block'}}";
    }

    function addCountdown() {
      setCountdown(<Countdown startTime={10} gameTime={360} />);
    }

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
        {!!game.error || <PlayerAction actions = {playerActions} />}
        <GameMusic />
        {countdown}
      </div>
    </>
  );
};


export default Game;

