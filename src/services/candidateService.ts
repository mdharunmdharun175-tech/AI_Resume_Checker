import { HireFairStore } from './apiClient';
import { Candidate, CandidateStatus, RecruiterDecision } from '../types';

export const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    return HireFairStore.getCandidates();
  },

  async getCandidatesByJob(jobId: string): Promise<Candidate[]> {
    const candidates = HireFairStore.getCandidates();
    return candidates.filter((c) => c.appliedJobId === jobId);
  },

  async getCandidateById(id: string): Promise<Candidate | undefined> {
    const candidates = HireFairStore.getCandidates();
    return candidates.find((c) => c.id === id);
  },

  async updateCandidateStatus(
    candidateId: string,
    newStatus: CandidateStatus,
    recruiterId: string,
    recruiterName: string,
    reason: string,
    notes?: string
  ): Promise<{ candidate: Candidate; decision: RecruiterDecision }> {
    const candidates = HireFairStore.getCandidates();
    const index = candidates.findIndex((c) => c.id === candidateId);
    if (index === -1) throw new Error('Candidate not found');

    const candidate = candidates[index];
    const previousStatus = candidate.status;
    candidate.status = newStatus;
    if (notes) candidate.notes = notes;
    candidates[index] = candidate;
    HireFairStore.saveCandidates(candidates);

    const screenings = HireFairStore.getScreenings();
    const scrKey = `${candidate.id}_${candidate.appliedJobId}`;
    const matchScore = screenings[scrKey]?.overallScore || 80;

    const decision: RecruiterDecision = {
      id: `dec-${Date.now()}`,
      candidateId: candidate.id,
      candidateCode: candidate.candidateCode,
      candidateName: candidate.name,
      jobId: candidate.appliedJobId,
      jobTitle: 'Senior Python Backend Developer',
      recruiterId,
      recruiterName,
      decision: newStatus === 'shortlisted' ? 'shortlist' : newStatus === 'rejected' ? 'reject' : 'review',
      previousStatus,
      newStatus,
      reason,
      notes,
      timestamp: new Date().toISOString(),
      aiSuggestedMatch: matchScore,
    };

    const decisions = HireFairStore.getDecisions();
    HireFairStore.saveDecisions([decision, ...decisions]);

    return { candidate, decision };
  },

  async addCandidate(candidate: Candidate): Promise<Candidate> {
    const candidates = HireFairStore.getCandidates();
    const updated = [candidate, ...candidates.filter((c) => c.id !== candidate.id)];
    HireFairStore.saveCandidates(updated);
    return candidate;
  },
};
