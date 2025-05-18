import { useNavigate  } from 'react-router-dom';
import { Link } from 'react-router-dom';
export default function About() {
  const navigate = useNavigate();
  return( 
    <div className="home-container">
      <header className="home-header produto-header">
        </header>
        <h1>Trabalhando em atualizacoes</h1>
            <nav className="footer-nav">
        <Link to="/">Home</Link>
        <Link to="/about">Perfil</Link>
      </nav>
    </div>
  );
}
