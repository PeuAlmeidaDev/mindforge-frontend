import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../lib/auth';
import { API_URL } from '../../../lib/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar autenticação
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }

  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }

  if (req.method === 'PUT') {
    try {
      // Enviar atualização de atributos para o backend
      const response = await fetch(`${API_URL}/users/attributes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Erro ao atualizar atributos:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar atributos',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido` });
  }
} 