import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Subject } from './subject.types';
import { SubjectReqDTO } from './subject.dto';

export const SubjectApi = {
  getAll(): Promise<Subject[]> {
    return apiClient.get(API_ENDPOINTS.SUBJECTS.BASE);
  },

  getById(id: number): Promise<Subject> {
    return apiClient.get(API_ENDPOINTS.SUBJECTS.BY_ID(id));
  },

  create(data: SubjectReqDTO): Promise<void> {
    return apiClient.post(API_ENDPOINTS.SUBJECTS.CREATE, data);
  },

  update(id: number, data: SubjectReqDTO): Promise<Subject> {
    return apiClient.put(API_ENDPOINTS.SUBJECTS.UPDATE(id), data);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.SUBJECTS.DELETE(id));
  },
};
