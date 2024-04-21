import { useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';

import gameStyles from "../css/game.module.css";

import PlayerDisplay from "../components/playerDisplay.jsx";
import PlayerAction from "../components/playerAction.jsx";
import Countdown from "../components/countdown.jsx";
import GameMusic from "../components/gameMusic.jsx";

import { getGame } from "../../api/game";
import { getPlayer, getAllPlayers } from "../../api/player";
import { getAllPlayerSessions } from "../../api/playerSession";

const Game = ({ socket }) => {
  const [game, setGame] = useState({});
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState();
  const [gameMusic, setGameMusic] = useState();
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

  const [playerInfo, setPlayerInfo] = useState([]);
  useEffect(() => {
    const fetchData = async (game) => {
      if (game.id != null) {
        const ps = (await getAllPlayerSessions())
          .filter((playerSession) => playerSession.gameId === game.id);
        const playerInfo = await Promise.all(
          ps.map(async (player) => {
            const playerInfo = await getPlayer(player.playerId);
            return {
              ...player,
              codename: playerInfo.codename,
            };
          })
        );
        setPlayerInfo(playerInfo);
      }
    }

    fetchData(game);
  }, [game]);

  const [playerActions, setPlayerActions] = useState([]);

  useEffect(() => {
    socket.on('hit', (data) => {
      const sender = playerInfo.find((pS) => pS.equipmentId === Number(data.sender));
      let recipient
      if (data.recipient === '43' || data.recipient === '53') {
        recipient = { codename: 'the base', team: 'white' }
        sender.playerScore += 50;
        sender.hasHitBase = true;
      } else {
        recipient = playerInfo.find((pS) => pS.equipmentId === Number(data.recipient));
        sender.playerScore += 10;
      }
      const action = {
        sender: players.find((p) => p.id === sender.playerId).codename,
        senderColor: sender.team.toLowerCase() === 'red' ? 'red' : '#0f0',
        recipient: recipient.playerId ? players.find((p) => p.id === recipient.playerId).codename : recipient.codename,
        recipientColor: sender.team.toLowerCase() === 'red' ? '#0f0' : 'red',
      };
      setPlayerActions((prevActions) => [...prevActions, action]);
    });

    return () => {
      socket.off('hit');
    };
  }, [players, playerInfo, game, socket]);

  const buttonHandler = () => {
      let button = document.getElementById("startbutton");
      button.parentNode.removeChild(button);
      addCountdown();
      addGameMusic();
      let window = document.getElementById("window");
      window.style = "{{display: 'block'}}";
    }

    function addCountdown() {
      setCountdown(<Countdown startTime={30} gameTime={360} socket={socket} />);
    }

    function addGameMusic() {
      setGameMusic(<GameMusic />);
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
        <img className={gameStyles.gameImage} src={`../../assets/game.png`} alt='Game'/>
        {!!game.error || <PlayerDisplay playerInfo={playerInfo} />}
        {!!game.error || <PlayerAction actions={playerActions} />}
        {countdown}
        {gameMusic}
      </div>
    </>
  );
};

Game.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default Game;

