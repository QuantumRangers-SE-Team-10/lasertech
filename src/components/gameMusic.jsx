import Track01 from "../assets/music/Track01.mp3"
import Track02 from "../assets/music/Track02.mp3"
import Track03 from "../assets/music/Track03.mp3"
import Track04 from "../assets/music/Track04.mp3"
import Track05 from "../assets/music/Track05.mp3"
import Track06 from "../assets/music/Track06.mp3"
import Track07 from "../assets/music/Track07.mp3"
import Track08 from "../assets/music/Track08.mp3"
import {useEffect} from "react";

const GameMusic = () => {
    let musicArray = new Array(Track01, Track02, Track03, Track04, Track05, Track06, Track07, Track08);

    let musicFile = musicArray[Math.floor(Math.random()*8)];

    useEffect(() => {
      let audio = document.getElementById("music");

      setTimeout(() => {
        audio.play();
      }, 13000);
    }, []);

    return(
        <audio id="music" src={musicFile}></audio>
    );
}

export default GameMusic;