import { apiClient, API_ENDPOINTS } from '@/core/api';
import { FolderResDTO, MoveFolderReqDTO } from '@/domains/folder.types';

export const folderRepository = {
    /** Get complete folder hierarchy for current user's bank */
    getFolderTree(): Promise<FolderResDTO[]> {
        return apiClient.get<FolderResDTO[]>(API_ENDPOINTS.FOLDERS.TREE);
    },

    /** Get root-level folders only */
    getRootFolders(): Promise<FolderResDTO[]> {
        return apiClient.get<FolderResDTO[]>(API_ENDPOINTS.FOLDERS.ROOT);
    },

    /** Get all folders (paginated) */
    getAllFolders(page = 0, size = 20): Promise<any> {
        return apiClient.get<any>(API_ENDPOINTS.FOLDERS.BASE, { params: { page, size } });
    },

    /** Create new folder */
    createFolder(req: { name: string; bankId: number; parentId?: number }): Promise<FolderResDTO> {
        return apiClient.post<FolderResDTO>(API_ENDPOINTS.FOLDERS.BASE, req);
    },

    /** Get folder details by ID */
    getFolderById(folderId: number): Promise<FolderResDTO> {
        return apiClient.get<FolderResDTO>(API_ENDPOINTS.FOLDERS.BY_ID(folderId));
    },

    /** Update/rename folder */
    updateFolder(folderId: number, req: { name?: string; bankId: number; parentId?: number }): Promise<FolderResDTO> {
        return apiClient.put<FolderResDTO>(API_ENDPOINTS.FOLDERS.BY_ID(folderId), req);
    },

    /** Move folder to new parent (drag & drop) */
    moveFolder(folderId: number, req: MoveFolderReqDTO): Promise<FolderResDTO> {
        return apiClient.put<FolderResDTO>(API_ENDPOINTS.FOLDERS.MOVE(folderId), req);
    },

    /** Delete folder and all its contents (cascade soft delete) */
    deleteFolder(folderId: number): Promise<void> {
        return apiClient.delete<void>(API_ENDPOINTS.FOLDERS.BY_ID(folderId));
    },
};
