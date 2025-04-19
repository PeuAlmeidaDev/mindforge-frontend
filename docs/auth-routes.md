# 🔐 Rotas de Autenticação - Mindforge API

Este documento descreve as rotas de autenticação disponíveis na API do Mindforge.

## 📝 Rota de Registro
- [ ] Implementado no Frontend

**Descrição:** Cria uma nova conta de usuário no Mindforge.

**Rota:** `POST /api/auth/register`

**Formato da Requisição:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "primaryElementalType": "string",
  "interests": "string[]"
}
```

**Observação sobre Casas:**
A casa do usuário é determinada automaticamente com base nos interesses selecionados, seguindo esta distribuição:
- **Kazoku no Okami (Casa do Lobo)**: Saúde & Fitness, Condicionamento Físico, Artes Marciais, Organização & Produtividade, Estudos Acadêmicos
- **Alma das Águas Flamejantes**: Criatividade & Expressão, Sustentabilidade & Lifestyle, Aprendizado & Desenvolvimento, Relações & Impacto Social
- **Ordem das Três Faces**: Criatividade & Expressão, Aprendizado & Desenvolvimento, Estudos Acadêmicos, Autoconhecimento & Mindset, Organização & Produtividade
- **Chamas do Rugido**: Saúde & Fitness, Condicionamento Físico, Artes Marciais, Saúde & Bem-estar
- **Flor do Espírito Dourado**: Criatividade & Expressão, Aprendizado & Desenvolvimento, Sustentabilidade & Lifestyle, Autoconhecimento & Mindset, Saúde & Bem-estar, Relações & Impacto Social

**Tipos Elementais Válidos:**
- fire
- water
- earth
- air
- light
- dark
- nature
- electric
- ice
- psychic
- ghost
- steel
- poison
- flying
- rock

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "primaryElementalType": "string",
      "level": number,
      "experience": number,
      "house": {
        "id": "string",
        "name": "string"
      },
      "attributes": {
        "health": number,
        "physicalAttack": number,
        "specialAttack": number,
        "physicalDefense": number,
        "specialDefense": number,
        "speed": number
      },
      "interests": [
        {
          "id": "string",
          "name": "string"
        }
      ]
    },
    "token": "string"
  }
}
```

**Possíveis Erros:**
- 400: Campos obrigatórios faltando
- 400: Tipo elemental inválido
- 400: Casa não encontrada
- 400: Interesses inválidos
- 409: Email ou username já em uso
- 500: Erro interno no servidor

## 🔑 Rota de Login
- [ ] Implementado no Frontend

**Descrição:** Autentica um usuário existente.

**Rota:** `POST /api/auth/login`

**Formato da Requisição:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "primaryElementalType": "string",
      "level": number,
      "experience": number,
      "house": {
        "id": "string",
        "name": "string"
      },
      "attributes": {
        "health": number,
        "physicalAttack": number,
        "specialAttack": number,
        "physicalDefense": number,
        "specialDefense": number,
        "speed": number
      }
    },
    "token": "string"
  }
}
```

**Possíveis Erros:**
- 400: Email e senha são obrigatórios
- 401: Credenciais inválidas
- 500: Erro interno no servidor

## 🔒 Rota de Verificação de Token
- [ ] Implementado no Frontend

**Descrição:** Verifica se o token do usuário é válido.

**Rota:** `GET /api/auth/verify`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
}
```

**Possíveis Erros:**
- 401: Token não fornecido ou inválido
- 500: Erro interno no servidor

## 👤 Rota de Perfil
- [ ] Implementado no Frontend

**Descrição:** Obtém os dados do perfil do usuário autenticado.

**Rota:** `GET /api/auth/profile`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "primaryElementalType": "string",
    "level": number,
    "experience": number,
    "house": {
      "id": "string",
      "name": "string"
    },
    "attributes": {
      "health": number,
      "physicalAttack": number,
      "specialAttack": number,
      "physicalDefense": number,
      "specialDefense": number,
      "speed": number
    },
    "userSkills": [
      {
        "skill": {
          "id": "string",
          "name": "string",
          "description": "string",
          "elementalType": "string",
          "power": number,
          "accuracy": number
        },
        "equipped": boolean
      }
    ],
    "interests": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
}
```

**Possíveis Erros:**
- 401: Token não fornecido ou inválido
- 404: Usuário não encontrado
- 500: Erro interno no servidor

## 📝 Observações Importantes

1. O token JWT retornado deve ser armazenado e enviado no header `Authorization` em todas as requisições autenticadas:
```
Authorization: Bearer {token}
```

2. O token expira em 7 dias após sua emissão.

3. Todas as respostas seguem o formato padrão:
```json
{
  "success": boolean,
  "message": "string",
  "data": object | null
}
``` 

# 👤 Rotas de Usuário - Mindforge API

Esta seção descreve as rotas relacionadas ao usuário disponíveis na API do Mindforge.

## 📊 Rota de Atualização de Atributos
- [ ] Implementado no Frontend

**Descrição:** Permite ao usuário distribuir pontos de atributos disponíveis.

**Rota:** `PUT /api/users/attributes`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Formato da Requisição:**
```json
{
  "health": number,
  "physicalAttack": number,
  "specialAttack": number,
  "physicalDefense": number,
  "specialDefense": number,
  "speed": number
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Atributos atualizados com sucesso",
  "data": {
    "id": "string",
    "userId": "string",
    "health": number,
    "physicalAttack": number,
    "specialAttack": number,
    "physicalDefense": number,
    "specialDefense": number,
    "speed": number
  }
}
```

**Possíveis Erros:**
- 400: Pontos insuficientes para distribuir
- 401: Token não fornecido ou inválido
- 404: Usuário não encontrado
- 500: Erro interno no servidor

## ⚔️ Rota de Gerenciamento de Habilidades
- [ ] Implementado no Frontend

**Descrição:** Permite ao usuário selecionar as habilidades que deseja equipar (máximo 4).

**Rota:** `PUT /api/users/skills`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Formato da Requisição:**
```json
{
  "equippedSkills": ["string", "string", "string", "string"]
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Habilidades equipadas com sucesso",
  "data": [
    {
      "id": "string",
      "userId": "string",
      "skillId": "string",
      "equipped": true,
      "skill": {
        "id": "string",
        "name": "string",
        "description": "string",
        "elementalType": "string",
        "baseDamage": number,
        "accuracy": number
      }
    }
  ]
}
```

**Possíveis Erros:**
- 400: Array de habilidades não fornecido
- 400: Limite de 4 habilidades excedido
- 400: Uma ou mais habilidades não pertencem ao usuário
- 401: Token não fornecido ou inválido
- 500: Erro interno no servidor

# 🎯 Rotas de Metas - Mindforge API

Esta seção descreve as rotas relacionadas às metas diárias disponíveis na API do Mindforge.

## 📋 Rota de Obtenção de Metas Diárias
- [ ] Implementado no Frontend

**Descrição:** Obtém as metas diárias do usuário para o dia atual.

**Rota:** `GET /api/goals/daily`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "goalId": "string",
      "completed": boolean,
      "isOptional": boolean,
      "dateAssigned": "string",
      "goal": {
        "id": "string",
        "name": "string",
        "description": "string",
        "rewardHealth": number,
        "rewardPhysicalAttack": number,
        "rewardSpecialAttack": number,
        "rewardPhysicalDefense": number,
        "rewardSpecialDefense": number,
        "rewardSpeed": number,
        "hasSkillChance": boolean,
        "skillUnlockChance": number,
        "interest": {
          "id": "string",
          "name": "string",
          "description": "string"
        }
      }
    }
  ]
}
```

**Possíveis Erros:**
- 401: Token não fornecido ou inválido
- 500: Erro interno no servidor

## 🔄 Rota de Geração de Metas Diárias
- [ ] Implementado no Frontend

**Descrição:** Gera novas metas diárias para o usuário com base em seus interesses.

**Rota:** `POST /api/goals/generate`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Metas diárias geradas com sucesso",
  "data": [
    {
      "id": "string",
      "userId": "string",
      "goalId": "string",
      "completed": false,
      "isOptional": boolean,
      "dateAssigned": "string",
      "goal": {
        "id": "string",
        "name": "string",
        "description": "string",
        "interest": {
          "id": "string",
          "name": "string"
        }
      }
    }
  ]
}
```

**Possíveis Erros:**
- 400: As metas diárias já foram geradas para hoje
- 400: Usuário não tem interesses cadastrados
- 400: Não há metas disponíveis para os interesses do usuário
- 401: Token não fornecido ou inválido
- 500: Erro interno no servidor

## ✅ Rota de Conclusão de Meta
- [ ] Implementado no Frontend

**Descrição:** Marca uma meta como concluída e atribui as recompensas ao usuário.

**Rota:** `PUT /api/goals/complete/:goalId`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Meta concluída com sucesso",
  "data": {
    "goal": {
      "id": "string",
      "userId": "string",
      "goalId": "string",
      "completed": true,
      "isOptional": boolean,
      "dateAssigned": "string",
      "goal": {
        "id": "string",
        "name": "string",
        "description": "string"
      }
    },
    "unlockedSkill": {
      "id": "string",
      "name": "string",
      "description": "string",
      "elementalType": "string",
      "baseDamage": number,
      "accuracy": number
    }
  }
}
```

**Possíveis Erros:**
- 400: Meta já foi concluída
- 401: Token não fornecido ou inválido
- 404: Meta não encontrada
- 500: Erro interno no servidor

# ⚔️ Rotas de Batalha - Mindforge API

Esta seção descreve as rotas relacionadas às batalhas disponíveis na API do Mindforge.

## 📋 Rota de Obtenção de Batalhas do Usuário
- [ ] Implementado no Frontend

**Descrição:** Obtém todas as batalhas associadas ao usuário autenticado.

**Rota:** `GET /api/battles`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Batalhas obtidas com sucesso",
  "data": [
    {
      "id": "string",
      "currentTurn": number,
      "isFinished": boolean,
      "winnerId": "string" | null,
      "startedAt": "string",
      "endedAt": "string" | null,
      "participants": [
        {
          "id": "string",
          "battleId": "string",
          "participantType": "string",
          "userId": "string" | null,
          "enemyId": "string" | null,
          "teamId": "string",
          "position": number,
          "currentHealth": number,
          "currentPhysicalAttack": number,
          "currentSpecialAttack": number,
          "currentPhysicalDefense": number,
          "currentSpecialDefense": number,
          "currentSpeed": number,
          "user": {
            "id": "string",
            "username": "string",
            "profileImageUrl": "string" | null,
            "primaryElementalType": "string",
            "level": number
          } | null,
          "enemy": {
            "id": "string",
            "name": "string",
            "imageUrl": "string",
            "elementalType": "string",
            "rarity": "string",
            "isBoss": boolean
          } | null,
          "statusEffects": [],
          "buffs": [],
          "debuffs": []
        }
      ]
    }
  ]
}
```

**Possíveis Erros:**
- 401: Usuário não autenticado
- 500: Erro ao obter batalhas

## 🔍 Rota de Obtenção de Batalha por ID
- [ ] Implementado no Frontend

**Descrição:** Obtém os detalhes de uma batalha específica pelo seu ID.

**Rota:** `GET /api/battles/:id`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Batalha obtida com sucesso",
  "data": {
    "id": "string",
    "currentTurn": number,
    "isFinished": boolean,
    "winnerId": "string" | null,
    "startedAt": "string",
    "endedAt": "string" | null,
    "participants": [
      {
        "id": "string",
        "battleId": "string",
        "participantType": "string",
        "userId": "string" | null,
        "enemyId": "string" | null,
        "teamId": "string",
        "position": number,
        "currentHealth": number,
        "currentPhysicalAttack": number,
        "currentSpecialAttack": number,
        "currentPhysicalDefense": number,
        "currentSpecialDefense": number,
        "currentSpeed": number,
        "user": {
          "id": "string",
          "username": "string",
          "profileImageUrl": "string" | null,
          "primaryElementalType": "string",
          "level": number
        } | null,
        "enemy": {
          "id": "string",
          "name": "string",
          "imageUrl": "string",
          "elementalType": "string",
          "rarity": "string",
          "isBoss": boolean
        } | null,
        "statusEffects": [],
        "buffs": [],
        "debuffs": []
      }
    ]
  }
}
```

**Possíveis Erros:**
- 401: Usuário não autenticado
- 404: Batalha não encontrada
- 500: Erro ao obter batalha

## 🏁 Rota de Criação de Batalha Aleatória
- [ ] Implementado no Frontend

**Descrição:** Inicia uma nova batalha aleatória contra inimigos.

**Rota:** `POST /api/battles/random`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Formato da Requisição:**
```json
{
  "difficulty": "easy" | "normal" | "hard",
  "aiDifficulty": number
}
```

**Observações:**
- O parâmetro `difficulty` define a dificuldade geral da batalha, afetando o número e raridade dos inimigos:
  - `easy`: 1 inimigo, principalmente comum
  - `normal`: 2 inimigos, comuns e incomuns
  - `hard`: 3 inimigos, comuns, incomuns e raros
- O parâmetro `aiDifficulty` (opcional) define o nível de dificuldade da IA inimiga, numa escala de 1 a 10:
  - Se não for especificado, será definido automaticamente com base na dificuldade:
    - `easy`: 1
    - `normal`: 3
    - `hard`: 5

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Batalha iniciada com sucesso",
  "data": {
    "id": "string",
    "currentTurn": number,
    "isFinished": boolean,
    "winnerId": null,
    "startedAt": "string",
    "endedAt": null,
    "participants": [
      {
        "id": "string",
        "battleId": "string",
        "participantType": "string",
        "userId": "string" | null,
        "enemyId": "string" | null,
        "teamId": "string",
        "position": number,
        "currentHealth": number,
        "currentPhysicalAttack": number,
        "currentSpecialAttack": number,
        "currentPhysicalDefense": number,
        "currentSpecialDefense": number,
        "currentSpeed": number,
        "user": {
          "id": "string",
          "username": "string",
          "profileImageUrl": "string" | null,
          "primaryElementalType": "string",
          "level": number
        } | null,
        "enemy": {
          "id": "string",
          "name": "string",
          "imageUrl": "string",
          "elementalType": "string",
          "rarity": "string",
          "isBoss": boolean
        } | null,
        "statusEffects": [],
        "buffs": [],
        "debuffs": []
      }
    ]
  }
}
```

**Possíveis Erros:**
- 401: Usuário não autenticado
- 404: Usuário ou atributos não encontrados
- 500: Erro ao iniciar batalha

## ⚙️ Rota de Processamento de Turno
- [ ] Implementado no Frontend

**Descrição:** Executa ações de um turno da batalha.

**Rota:** `POST /api/battles/:id/turn`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Formato da Requisição:**
```json
{
  "actions": [
    {
      "actorId": "string",
      "actionType": "attack" | "defend" | "skill" | "item",
      "skillId": "string",
      "targetParticipantId": "string",
      "itemId": "string"
    }
  ]
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Turno processado com sucesso",
  "data": {
    "turnNumber": number,
    "isFinished": boolean,
    "winnerTeam": "player" | "enemy" | null,
    "playerActions": {
      "participantId": {
        "success": boolean,
        "actorId": "string",
        "targetId": "string",
        "actionType": "string",
        "damage": number,
        "critical": boolean,
        "effectiveness": "normal" | "effective" | "ineffective",
        "statusEffectsApplied": [],
        "buffsApplied": [],
        "debuffsApplied": []
      }
    },
    "enemyActions": {
      "participantId": {
        "success": boolean,
        "actorId": "string",
        "targetId": "string",
        "actionType": "string",
        "damage": number,
        "critical": boolean,
        "effectiveness": "normal" | "effective" | "ineffective",
        "statusEffectsApplied": [],
        "buffsApplied": [],
        "debuffsApplied": []
      }
    },
    "participants": [
      {
        "id": "string",
        "battleId": "string",
        "participantType": "string",
        "userId": "string" | null,
        "enemyId": "string" | null,
        "teamId": "string",
        "position": number,
        "currentHealth": number,
        "currentPhysicalAttack": number,
        "currentSpecialAttack": number,
        "currentPhysicalDefense": number,
        "currentSpecialDefense": number,
        "currentSpeed": number,
        "statusEffects": [],
        "buffs": [],
        "debuffs": []
      }
    ],
    "battle": {
      "id": "string",
      "currentTurn": number,
      "isFinished": boolean,
      "winnerId": "string" | null,
      "startedAt": "string",
      "endedAt": "string" | null
    },
    "rewards": {
      "experience": number,
      "gold": number,
      "items": [],
      "unlockedSkills": []
    }
  }
}
```

**Possíveis Erros:**
- 400: Ações de turno inválidas
- 400: Formato de ação inválido
- 400: Habilidade não pertence ao usuário
- 400: Alvo inválido
- 401: Usuário não autenticado
- 404: Batalha não encontrada
- 404: Participante não encontrado
- 500: Erro ao processar turno 

## 🏆 Rota de Recompensas de Batalha
- [ ] Implementado no Frontend

**Descrição:** Obtém as recompensas de uma batalha finalizada.

**Rota:** `GET /api/battles/:id/rewards`

**Headers Necessários:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Recompensas obtidas com sucesso",
  "data": {
    "experience": number,
    "levelUp": boolean,
    "attributePointsGained": number
  }
}
```

**Possíveis Erros:**
- 400: Batalha ainda não foi finalizada
- 400: Usuário já recebeu recompensas por esta batalha
- 401: Usuário não autenticado
- 403: Usuário não pode receber recompensas por uma batalha que não venceu
- 403: Usuário não participou desta batalha
- 404: Batalha não encontrada
- 500: Erro ao obter recompensas da batalha 