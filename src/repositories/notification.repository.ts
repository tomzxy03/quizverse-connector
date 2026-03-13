import { apiClient, API_ENDPOINTS } from '@/core/api';
import { NotificationResDTO, NotificationReqDTO } from '@/domains';
import { PageResponse } from '@/core/types';

export const notificationRepository = {
    getAll(page: number, size: number): Promise<PageResponse<NotificationResDTO>> {
        return apiClient.get<PageResponse<NotificationResDTO>>(API_ENDPOINTS.NOTIFICATIONS.BASE, { page, size });
    },

    getById(id: number): Promise<NotificationResDTO> {
        return apiClient.get<NotificationResDTO>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    },

    create(data: NotificationReqDTO): Promise<void> {
        return apiClient.post<void>(API_ENDPOINTS.NOTIFICATIONS.BASE, data);
    },

    update(id: number, data: NotificationReqDTO): Promise<NotificationResDTO> {
        return apiClient.put<NotificationResDTO>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id), data);
    },

    delete(id: number): Promise<void> {
        return apiClient.delete<void>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    }
};
