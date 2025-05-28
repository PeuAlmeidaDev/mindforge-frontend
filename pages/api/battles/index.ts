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

  if (req.method === 'GET') {
    try {
      // Buscar batalhas do backend
      const response = await fetch(`${API_URL}/battles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao obter batalhas');
      }

      let data = await response.json();
      
      // Se a resposta já estiver no formato que queremos, apenas retorna
      if (data.success && Array.isArray(data.data)) {
        // Processar o resultado de cada batalha para verificar os vencedores corretamente
        const processedBattles = data.data.map((battle: any) => {
          // Se a batalha não está finalizada, retorna como está
          if (!battle.isFinished) {
            return battle;
          }
          
          // Se tem winnerId definido, mantém como está
          if (battle.winnerId) {
            return battle;
          }
          
          // Caso contrário, precisamos determinar o vencedor pelo HP
          if (battle.participants && battle.participants.length > 0) {
            const userParticipant = battle.participants.find(
              (p: any) => p.participantType === 'user' && p.userId === userId
            );
            
            const enemyParticipant = battle.participants.find(
              (p: any) => p.participantType === 'enemy'
            );
            
            if (userParticipant && enemyParticipant) {
              // Se o usuário está com HP positivo e o inimigo com HP zero ou negativo
              if (userParticipant.currentHealth > 0 && enemyParticipant.currentHealth <= 0) {
                battle.winnerId = userParticipant.id;
              }
              // Se o usuário está com HP zero ou negativo, o inimigo venceu
              else if (userParticipant.currentHealth <= 0) {
                battle.winnerId = enemyParticipant.id;
              }
            }
          }
          
          return battle;
        });
        
        return res.status(200).json({
          success: true,
          message: 'Batalhas obtidas com sucesso',
          data: processedBattles
        });
      }
      
      // Caso a resposta não esteja no formato esperado, ajustamos
      return res.status(200).json({
        success: true,
        message: 'Batalhas obtidas com sucesso',
        data: []
      });
    } catch (error) {
      console.error('Erro ao buscar batalhas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar batalhas',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido` });
  }
} 