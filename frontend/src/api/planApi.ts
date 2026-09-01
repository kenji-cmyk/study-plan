import { apiFetch } from './client';
import type { CreateStudyPlanRequest, StudyPlan } from '../types/studyPlanner';

export const planApi = {
  previewPlan: async (year: number, month: number, slotsPerDay: number): Promise<StudyPlan> => {
    const params = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
      slotsPerDay: slotsPerDay.toString(),
    });
    return apiFetch<StudyPlan>(`/api/v1/study-plan/preview?${params.toString()}`);
  },

  savePlan: async (request: CreateStudyPlanRequest): Promise<StudyPlan> => {
    return apiFetch<StudyPlan>('/api/v1/study-plan', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};
