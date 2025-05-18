import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Loja() {
  const { nomeLoja } = useParams();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchProdutos() {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('nome_loja', decodeURIComponent(nomeLoja));

      if (!error && data) {
        setProdutos(data);
      }
    }

    fetchProdutos();
  }, [nomeLoja]);

  return (
    <div className="loja-container" style={{ padding: '20px' }}>
      <h1>Produtos da loja: {decodeURIComponent(nomeLoja)}</h1>

      {produtos.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div className="produtos-grid" style={{ display: 'grid', gap: '20px' }}>
          {produtos.map(produto => (
            <div
              key={produto.id}
              className="produto-card"
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '15px',
                maxWidth: '300px'
              }}
            >
              {produto.imagem_url && (
                <img
                  src={produto.imagem_url}
                  alt={produto.name}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              )}
              <h2>{produto.name}</h2>
              <p><strong>Preço:</strong> R$ {Number(produto.preco).toFixed(2)}</p>
              <p><strong>Descrição:</strong> {produto.descricao}</p>
              <p><strong>Quantidade:</strong> {produto.quantidade}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
