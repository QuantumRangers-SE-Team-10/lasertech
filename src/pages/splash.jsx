import gameLogo from "../assets/images/logo.png";
import splashStyling from "../css/splash.module.css";
import ParticleAnimation from "../components/particleAnimation.jsx";

export default Splash;

function Splash() {
  let timeLeft = 2;
  setInterval(() => {
    document.getElementById("countdown").innerHTML = timeLeft;
    timeLeft -= 1;
    if (timeLeft < 0) {
      timeLeft = 0;
    }
  }, 1000);

  return (
    <>
      <div id="countdown" className={splashStyling.countdown}> 3 </div>
      <ParticleAnimation />
      <div>
        <img src={gameLogo} className={splashStyling.logo} alt="Game logo" />
      </div>
      <div>
        <meta httpEquiv="refresh" content="3;url=/onboarding" />
      </div>
    </>
  );
}
