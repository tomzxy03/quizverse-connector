export interface FolderReqDTO {
    name?: string;
    bankId?: number;
    parentId?: number;
}

export interface MoveFolderReqDTO {
    newParentFolderId: number | null;
}

export interface FolderResDTO {
    id: number;
    name?: string;
    parentId?: number;
    bankId?: number;
    subfolderCount?: number;
    questionCount?: number;
    createdAt?: string;
    updatedAt?: string;
    children?: FolderResDTO[];
}
