import { NextApiRequest, NextApiResponse } from 'next';
import { API_URL } from '../../lib/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  try {
    // Buscar interesses da API backend
    const response = await fetch(`${API_URL}/interests`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        message: errorData.message || 'Erro ao buscar interesses',
      });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar interesses:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao buscar interesses',
    });
  }
} 