// Notification types – aligned with BE api.json DTOs

import { NotificationType } from '@/core/types';

// === Response DTOs (from BE) ===

// Matches BE NotificationResDTO
export interface NotificationResDTO {
    id: number;
    title: string;
    content: string;
    type: string;
    lobbyName?: string;
    hostName: string;
    createdAt: string;
}

// === Request DTOs (to BE) ===

// Matches BE NotificationReqDTO
export interface NotificationReqDTO {
    title?: string;
    content: string;
    lobbyId?: number;
    type?: NotificationType;
    hostId: number;
}
