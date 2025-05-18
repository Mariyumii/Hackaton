import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Loja from './pages/Loja'; // ← Crie esse componente
import Produto from './pages/Produto';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/loja/:nomeLoja" element={<Loja />} /> ← Aqui! */}
         <Route path="/loja/:nomeLoja/:nomeProduto" element={<Produto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
