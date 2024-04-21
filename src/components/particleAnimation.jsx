import particleStyling from "../css/particle.module.css";

const ParticleAnimation = () => {

  return (
    <div id="particle-container">
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} className={particleStyling.particle}></div>
      ))}
    </div>
  );
};

export default ParticleAnimation;