import { HireFairStore } from './apiClient';
import { Job, BiasFlag } from '../types';
import { AiService } from './aiService';

export const jobService = {
  async getJobs(): Promise<Job[]> {
    return HireFairStore.getJobs();
  },

  async getJobById(id: string): Promise<Job | undefined> {
    const jobs = HireFairStore.getJobs();
    return jobs.find((j) => j.id === id);
  },

  async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'candidateCount' | 'biasFlagCount' | 'avgMatchScore'>): Promise<Job> {
    const jobs = HireFairStore.getJobs();
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      candidateCount: 0,
      biasFlagCount: 0,
      avgMatchScore: 0,
    };

    // Analyze bias automatically on creation
    const biasFlags = await AiService.analyzeJobBias(newJob.description, newJob.id, newJob.title);
    newJob.biasFlagCount = biasFlags.length;

    const currentFlags = HireFairStore.getBiasFlags();
    HireFairStore.saveBiasFlags([...biasFlags, ...currentFlags]);

    HireFairStore.saveJobs([newJob, ...jobs]);
    return newJob;
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const jobs = HireFairStore.getJobs();
    const index = jobs.findIndex((j) => j.id === id);
    if (index === -1) throw new Error('Job not found');

    const updated: Job = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    jobs[index] = updated;
    HireFairStore.saveJobs(jobs);
    return updated;
  },
};
