import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import gameStyles from "../css/game.module.css";
import {useNavigate} from 'react-router-dom';

const useCountdown = (startTime, gameTime, socket) => {
  const [countdown, setCountdown] = useState(startTime);
  const [gameTimeRemaining, setGameTimeRemaining] = useState(gameTime);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let countdownInterval;
    let gameTimeInterval;

    if (countdown === 0) {
      if (!gameStarted) {
        socket.emit('game-start');
        setGameStarted(true);
      }

      gameTimeInterval = setInterval(() => {
        if (gameTimeRemaining > 0) {
          setGameTimeRemaining((prevTime) => prevTime - 1);
        } else {
          clearInterval(gameTimeInterval);
          socket.emit('game-end');
        }
      }, 1000);

      return () => {
        clearInterval(gameTimeInterval);
      };
    } else if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [countdown, gameStarted, gameTimeRemaining, socket]);

  return { countdown, gameTimeRemaining };
};

const Countdown = ({ startTime, gameTime, socket, setGameEnd }) => {
  const { countdown, gameTimeRemaining } = useCountdown(startTime, gameTime, socket, setGameEnd);
  const navigate = useNavigate();
  const handleNewGame = () => {
    navigate('/onboarding');
    window.location.reload();
  }; 

  useEffect(() => {
    if (gameTimeRemaining === 0) {
      setGameEnd(true);
    }
  }, [gameTimeRemaining, setGameEnd]);

  return (
    <div className={gameStyles.timeRemaining}>
      {countdown > 0 ? (
        <p>Starting in {countdown} seconds...</p>
      ) : gameTimeRemaining !== null ? (
        <p>Time remaining: {gameTimeRemaining} seconds</p>
      ) : (
        <p>Game ended</p>
      )}
      {gameTimeRemaining <= 0 && (
      <button className={gameStyles.button} onClick={handleNewGame}>
      New Game
      </button>
      )}
    </div>
  );
};

Countdown.propTypes = {
  startTime: PropTypes.number.isRequired,
  gameTime: PropTypes.number.isRequired,
  socket: PropTypes.object.isRequired,
  setGameEnd: PropTypes.func.isRequired,
};

export default Countdown;