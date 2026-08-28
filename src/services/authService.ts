import { HireFairStore } from './apiClient';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

export const authService = {
  async getCurrentUser(): Promise<User> {
    return HireFairStore.getCurrentUser();
  },

  async login(email: string, role: UserRole = 'recruiter'): Promise<User> {
    const user = mockUsers.find((u) => u.role === role) || mockUsers[0];
    const updatedUser = { ...user, email: email || user.email };
    HireFairStore.setCurrentUser(updatedUser);
    return updatedUser;
  },

  async loginDemo(role: UserRole): Promise<User> {
    const user = mockUsers.find((u) => u.role === role) || mockUsers[0];
    HireFairStore.setCurrentUser(user);
    return user;
  },

  async logout(): Promise<void> {
    // Keep standard user state or switch to null if requested
  },
};
