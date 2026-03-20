import { folderRepository } from '@/repositories';
import { FolderResDTO, MoveFolderReqDTO } from '@/domains/folder.types';

export class FolderService {
    async getFolderTree(): Promise<FolderResDTO[]> {
        return await folderRepository.getFolderTree();
    }

    async getRootFolders(): Promise<FolderResDTO[]> {
        return await folderRepository.getRootFolders();
    }

    async getAllFolders(page = 0, size = 20): Promise<any> {
        return await folderRepository.getAllFolders(page, size);
    }

    async createFolder(req: { name: string; bankId: number; parentId?: number }): Promise<FolderResDTO> {
        return await folderRepository.createFolder(req);
    }

    async getFolderById(folderId: number): Promise<FolderResDTO> {
        return await folderRepository.getFolderById(folderId);
    }

    async updateFolder(folderId: number, req: { name?: string; bankId: number; parentId?: number }): Promise<FolderResDTO> {
        return await folderRepository.updateFolder(folderId, req);
    }

    async moveFolder(folderId: number, newParentFolderId: number | null): Promise<FolderResDTO> {
        return await folderRepository.moveFolder(folderId, { newParentFolderId });
    }

    async deleteFolder(folderId: number): Promise<void> {
        return await folderRepository.deleteFolder(folderId);
    }
}

export const folderService = new FolderService();
