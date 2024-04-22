import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Link

import io from 'socket.io-client';

import Splash from "./pages/splash";
// import TestAPI from "./pages/testAPI";
import Onboarding from "./pages/onboarding";
import Game from "./pages/game";

const socket = io('http://127.0.0.1:3000');

import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          {/* <Route path="/testAPI" element={<TestAPI />} /> */}
          <Route path="/onboarding" element={<Onboarding socket={socket} />} />
          <Route path="/game" element={<Game socket={socket} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
