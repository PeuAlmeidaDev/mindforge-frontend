import { z } from 'zod';

// Esquema básico para validação de login
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Esquema para validação de registro
export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não correspondem',
  path: ['confirmPassword'],
});

// Esquema para validação de metas
export const goalSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  type: z.enum(['FÍSICO', 'MENTAL', 'SOCIAL', 'CRIATIVO', 'ESPIRITUAL']),
  points: z.number().int().min(1).max(10),
});

// Esquema para validação de perfil
export const profileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  bio: z.string().max(300, 'A biografia deve ter no máximo 300 caracteres').optional(),
  interests: z.array(z.string()).min(1, 'Escolha pelo menos um interesse'),
});

// Tipo para o schema de login
export type LoginFormData = z.infer<typeof loginSchema>;

// Tipo para o schema de registro
export type RegisterFormData = z.infer<typeof registerSchema>;

// Tipo para o schema de meta
export type GoalFormData = z.infer<typeof goalSchema>;

// Tipo para o schema de perfil
export type ProfileFormData = z.infer<typeof profileSchema>; 