import React, {useEffect, useState} from 'react';
import teamScoreDisplay from "/src/css/teamScoreDisplay.module.css";

const TeamScoreDisplay = ({playerSession}) => {
    const [teamScore, setTeamScore] = useState(0);
    
    useEffect(() => {
        const tScore = playerSession.reduce((acc,curr) =>  acc + curr.playerScore, 0)
        setTeamScore(tScore)
    },[playerSession])
  
    return(
        <div className={teamScoreDisplay.teamScoreBox}>
            <span>{teamScore}</span>
        </div>
    )
};

export default TeamScoreDisplay;