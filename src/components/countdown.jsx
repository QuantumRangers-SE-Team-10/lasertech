import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import gameStyles from "../css/game.module.css";
import io from 'socket.io-client';
import {useNavigate} from 'react-router-dom';

const socket = io('http://localhost:3000');

const useCountdown = (startTime, gameTime) => {
  const [countdown, setCountdown] = useState(startTime);
  const [gameTimeRemaining, setGameTimeRemaining] = useState(gameTime);


  useEffect(() => {
    if (countdown === 0) {

      const gameTimeInterval = setInterval(() => {
        setGameTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(gameTimeInterval);
        if (gameTimeRemaining === 0) {
          socket.emit('game-end');
        }
      };
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    socket.emit('game-start');

    return () => clearInterval(countdownInterval);
  }, [countdown, gameTimeRemaining]);

  return { countdown, gameTimeRemaining };
};

const Countdown = ({ startTime, gameTime }) => {
  const { countdown, gameTimeRemaining } = useCountdown(startTime, gameTime);
  const navigate = useNavigate();
  const handleNewGame = () => {
    navigate('/onboarding');
  
  }; 

  return (
    <div className={gameStyles.timeRemaining}>
      {countdown > 0 ? (
        <p>Starting in {countdown} seconds...</p>
      ) : gameTimeRemaining !== null ? (
        <p>Time remaining: {gameTimeRemaining} seconds</p>
      ) : (
        <p>Game ended</p>
      )}
      {countdown === 0 && gameTimeRemaining <= 0 && (
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
};

export default Countdown;