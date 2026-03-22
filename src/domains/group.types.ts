// Group (Lobby) related types – aligned with BE api.json DTOs
import { QuizResDTO } from './quiz.types';
import { NotificationResDTO } from './notification.types';

// === Response DTOs (from BE) ===

// Matches BE LobbyResDTO
export interface LobbyResDTO {
  id: number;
  lobbyName: string;
  hostName: string;
  totalMembers?: number;
}

export interface LobbyInviteCodeResDTO {
  lobbyId: number;
  codeInvite: string;
}

// === Request DTOs (to BE) ===

// Matches BE LobbyNotificationResDTO
export interface LobbyNotificationResDTO {
  id: number;
  notificationResDTOS: NotificationResDTO[];
}

// Matches BE LobbyQuizResDTO
export interface LobbyQuizResDTO {
  id: number;
  quizzes: QuizResDTO[];
}

// Matches BE LobbyReqDTO
export interface LobbyReqDTO {
  lobbyName: string;
}

// === Aliases ===
export type Group = LobbyResDTO;
export type CreateGroupRequest = LobbyReqDTO;
export type UpdateGroupRequest = LobbyReqDTO;
