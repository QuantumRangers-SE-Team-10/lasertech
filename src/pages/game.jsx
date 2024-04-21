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
        // console.log('PlayerSessions:', ps);
        const playerInfo = await Promise.all(
          ps.map(async (player) => {
            const playerInfo = await getPlayer(player.playerId);
            return {
              ...player,
              codename: playerInfo.codename,
            };
          })
        );
        console.log(playerInfo)
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
        recipientColor: recipient.team.toLowerCase() === 'red' ? 'red' : '#0f0',
      };
      setPlayerActions((prevActions) => [...prevActions, action]);
    });

    return () => {
      socket.off('hit');
    };
  }, [players, playerInfo, game]);

  const buttonHandler = () => {
      let button = document.getElementById("startbutton");
      button.parentNode.removeChild(button);
      addCountdown();
      let window = document.getElementById("window");
      window.style = "{{display: 'block'}}";
    }

    function addCountdown() {
      setCountdown(<Countdown startTime={5} gameTime={360} />);
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
          <img className={gameStyles.gameImage} src={`../../assets/game.png`} alt='Game'/>
        </div>
        {!!game.error || <PlayerDisplay playerInfo={playerInfo} />}
        {!!game.error || <PlayerAction actions={playerActions} />}
        <GameMusic />
        {countdown}
      </div>
    </>
  );
};

Game.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default Game;

