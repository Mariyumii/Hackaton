import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      const { data, error } = await supabase.from('produtos').select('*');
      if (error) {
        console.error(error);
      } else {
        setDados(data);
      }
    }

    carregarDados();
  }, []);

  return (
    <div>
      <h1>Home RECEBA</h1>
      <ul>
        {dados.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}
