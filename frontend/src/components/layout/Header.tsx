import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        🎙 AI Creator Studio
      </div>

      <nav>
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">About</a>
      </nav>
    </header>
  );
}