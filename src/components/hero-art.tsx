import "./hero-art.css";

export function HeroArt() {
  return (
    <div
      className="hero-art"
      aria-label="An abstract bridge connecting talent and opportunity"
      role="img"
    >
      <div className="art-grid" />
      <span className="art-label">THE HUMAN SIDE OF TECHNOLOGY</span>
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="bridge" />
      <div className="art-caption">
        <span>
          Talent meets
          <br />
          <b>what’s next.</b>
        </span>
        <span className="asterisk">✳</span>
      </div>
      <div className="art-tag">
        <span className="dot" /> CONNECTED BY HIRECRAFT
      </div>
    </div>
  );
}
