import { apiFetch } from './client';
import type { CreateSubjectRequest, Subject, SubjectPage, UpdateSubjectRequest } from '../types/studyPlanner';

export const subjectApi = {
  getSubjects: async (page = 0, size = 20, sort = 'id,asc'): Promise<SubjectPage> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
    });
    return apiFetch<SubjectPage>(`/api/v1/subjects?${params.toString()}`);
  },

  getSubject: async (id: number): Promise<Subject> => {
    return apiFetch<Subject>(`/api/v1/subjects/${id}`);
  },

  createSubject: async (request: CreateSubjectRequest): Promise<Subject> => {
    return apiFetch<Subject>('/api/v1/subjects', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  updateSubject: async (id: number, request: UpdateSubjectRequest): Promise<Subject> => {
    return apiFetch<Subject>(`/api/v1/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  deleteSubject: async (id: number): Promise<void> => {
    return apiFetch<void>(`/api/v1/subjects/${id}`, {
      method: 'DELETE',
    });
  },
};
