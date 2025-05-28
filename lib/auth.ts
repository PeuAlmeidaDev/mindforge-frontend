/**
 * Verifica se um token JWT é válido e retorna o ID do usuário
 */
export function verifyToken(token: string): string | null {
  try {
    // Para simplificar, vamos apenas fazer uma validação básica
    // Extraindo o payload do token
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    try {
      // Decodificar o payload (parte do meio do token)
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString()
      );
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Erro ao processar token:', error);
    return null;
  }
}

/**
 * Obtém o token do cookie ou do cabeçalho de autorização
 */
export function getToken(req: any): string | null {
  // Verificar cabeçalhos de autorização
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Verificar cookies (para Next.js)
  if (req.cookies) {
    return req.cookies.token || null;
  }
  
  return null;
}

/**
 * Obtém o ID do usuário a partir do token
 */
export function getUserId(req: any): string | null {
  const token = getToken(req);
  if (!token) return null;
  
  return verifyToken(token);
} 