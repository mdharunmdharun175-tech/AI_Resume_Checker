import { HireFairStore } from './apiClient';
import { ScreeningResult, ScreeningWeights, Candidate, Job } from '../types';
import { AiService } from './aiService';

export const screeningService = {
  async getScreenings(): Promise<Record<string, ScreeningResult>> {
    return HireFairStore.getScreenings();
  },

  async getScreening(candidateId: string, jobId: string): Promise<ScreeningResult | undefined> {
    const screenings = HireFairStore.getScreenings();
    return screenings[`${candidateId}_${jobId}`];
  },

  async runCandidateScreening(
    candidate: Candidate,
    job: Job,
    weights?: ScreeningWeights
  ): Promise<ScreeningResult> {
    const currentWeights = weights || HireFairStore.getSettings().screeningWeights;
    const result = AiService.calculateScreeningScore(candidate, job, currentWeights);

    const screenings = HireFairStore.getScreenings();
    screenings[`${candidate.id}_${job.id}`] = result;
    HireFairStore.saveScreenings(screenings);

    return result;
  },

  async batchScreenCandidates(
    candidates: Candidate[],
    job: Job,
    weights?: ScreeningWeights,
    onProgress?: (progressIndex: number, stage: string) => void
  ): Promise<ScreeningResult[]> {
    const stages = [
      '1. Uploading candidate documents',
      '2. Parsing unstructured PDF/DOCX schemas',
      '3. Extracting technical competencies & tenures',
      '4. Normalizing skill taxonomies',
      '5. Computing semantic embedding alignments',
      '6. Calculating transparent weighted scores',
      '7. Evaluating bias & fair screening constraints',
      '8. Synthesizing explainable evidence logs',
      '9. Finalizing candidate rankings',
    ];

    for (let i = 0; i < stages.length; i++) {
      if (onProgress) {
        onProgress(i + 1, stages[i]);
      }
      await new Promise((r) => setTimeout(r, 220));
    }

    const currentWeights = weights || HireFairStore.getSettings().screeningWeights;
    const results: ScreeningResult[] = [];
    const screenings = HireFairStore.getScreenings();

    for (const candidate of candidates) {
      const result = AiService.calculateScreeningScore(candidate, job, currentWeights);
      screenings[`${candidate.id}_${job.id}`] = result;
      results.push(result);
    }

    HireFairStore.saveScreenings(screenings);
    return results;
  },
};
