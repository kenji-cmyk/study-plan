import { apiFetch } from "./client";
import type {
  CreateStudyPlanRequest,
  StudyPlan,
  PlanPage,
} from "../types/studyPlanner";

export const planApi = {
  getPlans: async (
    page = 0,
    filters: { year?: number; month?: number } = {},
    size = 9,
  ): Promise<PlanPage> => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort: "year,desc",
    });
    params.append("sort", "month,desc");
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    return apiFetch<PlanPage>(`/api/v1/study-plan?${params}`);
  },
  previewPlan: async (
    year: number,
    month: number,
    slotsPerDay: number,
  ): Promise<StudyPlan> => {
    const params = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
      slotsPerDay: slotsPerDay.toString(),
    });
    return apiFetch<StudyPlan>(
      `/api/v1/study-plan/preview?${params.toString()}`,
    );
  },

  savePlan: async (request: CreateStudyPlanRequest): Promise<StudyPlan> => {
    return apiFetch<StudyPlan>("/api/v1/study-plan", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};
