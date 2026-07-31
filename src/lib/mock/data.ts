import type { User } from '@/types/auth';

export const MOCK_CREDENTIALS = {
  email: 'admin@lasrocas.com',
  password: '123456',
};

export const MOCK_USER: User = {
  id: 'usr_001',
  email: 'admin@lasrocas.com',
  name: 'Juan Pérez',
  organization: 'Las Rocas Restaurante',
  branch: 'Monsefú',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
