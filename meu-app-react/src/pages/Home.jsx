import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: '/pino-de-localizacao.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

import 'leaflet/dist/leaflet.css';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  const [busca, setBusca] = useState('');
  const [lojas, setLojas] = useState([]);
  const [produtos, setProduto] = useState([]);
  const [cidade, setCidade] = useState('Londrina');


 const buscarLojasPorProduto = async (e) => {
  e.preventDefault();

  if (!busca.trim()) return;

  console.log('🔍 Iniciando busca por:', busca);

  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*')
    .ilike('name', `%${busca}%`);
  setProduto(produtos);

  if (error) {
    console.error('❌ Erro na busca:', error);
    setLojas([]);
    return;
  }

  if (!produtos || produtos.length === 0) {
    console.log('ℹ️ Nenhum produto encontrado com esse nome.');
    setLojas([]);
    return;
  }

  console.log('✅ Produtos encontrados:', produtos);

  const nomesUnicos = [...new Set(produtos.map(p => p.nome_loja))];

const { data: lojasData, error: erroLojas } = await supabase
  .from('lojas')
  .select('id, nome, latitude, longitude')
  .in('nome', nomesUnicos)
  .eq('cidade', cidade); // <-- filtro por cidade


  if (erroLojas || !lojasData) {
    console.error('Erro ao buscar lojas:', erroLojas);
    setLojas([]);
    return;
  }
  console.log('🏪 Lojas únicas:', nomesUnicos);


  setLojas(lojasData);
};


  return (
    <div className="home-container">
      <header className="home-header">

        <form onSubmit={buscarLojasPorProduto} className="form-busca">
          <label htmlFor="busca-input">Item a buscar</label>
          <div className="input-wrapper">
            <input
              id="busca-input"
              type="text"
              placeholder="O que está buscando?"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button type="submit" className="botao-busca-inline">🔍</button>
          </div>

          <label htmlFor="cidade-select">Cidade</label>
          <select
            id="cidade-select"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          >
            <option value="Londrina">Londrina</option>
          </select>
        </form>

        
      </header>


      <div className="map-wrapper">
        <MapContainer center={[-23.3045, -51.1696]} zoom={13} scrollWheelZoom={true}  zoomControl={false} style={{ height: '300px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {lojas.map((loja) => (
            <Marker key={loja.id} position={[loja.latitude, loja.longitude]}>
              icon={customIcon}
              <Popup>
                {loja.nome}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

      </div>

        <div className="lojas-list">
          <h2>Produtos encontrados</h2>
          <ul>
            {produtos.map((p, index) => (
              <li key={p.id || index}>
                <Link to={`/loja/${encodeURIComponent(p.nome_loja)}/${encodeURIComponent(p.name)}`}>
                  {p.name} — {p.nome_loja}
                </Link>
              </li>
            ))}
          </ul>
        </div>




      <nav className="footer-nav">
        <Link to="/">Home</Link>
        <Link to="/about">Perfil</Link>
      </nav>
      
    </div>
  );
}
