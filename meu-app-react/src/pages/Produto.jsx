import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/Produto.css';

export default function Produto() {
  const { nomeLoja, nomeProduto } = useParams();
  const [produto, setProduto] = useState(null);
  const [urlImagem, setUrlImagem] = useState(null);
  const [loja, setLoja] = useState(null);



  useEffect(() => {
    async function fetchProduto() {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('nome_loja', decodeURIComponent(nomeLoja))
        .eq('name', decodeURIComponent(nomeProduto))
        .single();

      if (!error && data) {
        setProduto(data);

            // Buscar dados da loja
        const { data: lojaData, error: lojaErro } = await supabase
        .from('lojas')
        .select('horario_funcionamento, endereco, telefone')
        .eq('nome', data.nome_loja)
        .single();

        if (!lojaErro && lojaData) {
        setLoja(lojaData);
        } else {
        console.error('❌ Erro ao buscar loja:', lojaErro);
        }

        const caminhoCompleto = `pasta/${data.imagem_url}`;

        const { data: publicData, error: urlError } = supabase
        .storage
        .from('produtos')
        .getPublicUrl(caminhoCompleto);

        console.log('🖼️ imagem_url bruto:', data.imagem_url);
        console.log('📂 Caminho forçado com pasta:', caminhoCompleto);
        console.log('🔗 URL pública:', publicData?.publicUrl);

        setUrlImagem(publicData?.publicUrl || null);

      } else {
        setProduto(null);
        console.error('Produto não encontrado ou erro:', error);
      }
    }

    fetchProduto();
  }, [nomeLoja, nomeProduto]);

  if (!produto) {
    return <p className="produto-mensagem">Produto não encontrado.</p>;
  }

    return (
    <div className="produto-container">
        <header className="home-header produto-header">
            <button onClick={() => window.location.href = '/'} className="botao-voltar">🔙</button>
            <h1 className="produto-titulo">{produto.nome_loja}</h1>
        </header>



        <div className="produto-card custom-produto-box">
        {urlImagem && (
            <img src={urlImagem} alt={produto.name} className="produto-imagem" />
        )}

        <div className="produto-info">
            <div className="produto-preco">
            {produto.name}
            </div>
            <div className="produto-preco">
            R$ {Number(produto.preco).toFixed(2)}
            </div>
            <div className="produto-descricao">
            {produto.descricao}
            </div>
            <div className="produto-quantidade">
            {produto.quantidade} unidades disponíveis
            </div>
        </div>
        </div>

        {loja && (
        <div className="loja-info-box">
            <p>🕒 {loja.horario_funcionamento}</p>
            <p>📍 {loja.endereco}</p>
            <p>📞 {loja.telefone}</p>
        </div>
        )}

    </div>
    );


}
