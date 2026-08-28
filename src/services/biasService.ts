import { HireFairStore } from './apiClient';
import { BiasFlag, BiasStatus } from '../types';

export const biasService = {
  async getBiasFlags(): Promise<BiasFlag[]> {
    return HireFairStore.getBiasFlags();
  },

  async getBiasFlagsByJob(jobId: string): Promise<BiasFlag[]> {
    const flags = HireFairStore.getBiasFlags();
    return flags.filter((f) => f.jobId === jobId);
  },

  async updateBiasStatus(
    flagId: string,
    status: BiasStatus,
    resolvedBy?: string
  ): Promise<BiasFlag> {
    const flags = HireFairStore.getBiasFlags();
    const index = flags.findIndex((f) => f.id === flagId);
    if (index === -1) throw new Error('Bias flag not found');

    const updated: BiasFlag = {
      ...flags[index],
      status,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
      resolvedBy: status === 'resolved' ? resolvedBy || 'Sarah Jenkins' : undefined,
    };

    flags[index] = updated;
    HireFairStore.saveBiasFlags(flags);
    return updated;
  },
};
