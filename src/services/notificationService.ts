import { HireFairStore } from './apiClient';
import { AppNotification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    return HireFairStore.getNotifications();
  },

  async markAsRead(id: string): Promise<void> {
    const notifs = HireFairStore.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    HireFairStore.saveNotifications(updated);
  },

  async markAllAsRead(): Promise<void> {
    const notifs = HireFairStore.getNotifications();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    HireFairStore.saveNotifications(updated);
  },

  async addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert', link?: string): Promise<AppNotification> {
    const notifs = HireFairStore.getNotifications();
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
      link,
    };
    HireFairStore.saveNotifications([newNotif, ...notifs]);
    return newNotif;
  },
};
