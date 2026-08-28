import { HireFairStore } from './apiClient';
import { AuditEvent, UserRole } from '../types';

export const auditService = {
  async getAuditLogs(): Promise<AuditEvent[]> {
    return HireFairStore.getAuditLogs();
  },

  async logEvent(
    action: string,
    entityType: 'job' | 'resume' | 'candidate' | 'screening' | 'bias_flag' | 'settings' | 'auth',
    entityId: string,
    details: string,
    entityName?: string
  ): Promise<AuditEvent> {
    const user = HireFairStore.getCurrentUser();
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityType,
      entityId,
      entityName,
      details,
    };

    const logs = HireFairStore.getAuditLogs();
    HireFairStore.saveAuditLogs([newEvent, ...logs]);
    return newEvent;
  },
};
