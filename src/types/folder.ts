export interface FileItem {
    id: string
    name: string
    folder_id: string
    size: string
    extension: string
    created_at: string
    updated_at: string
}

export interface Folder {
    id: string
    name: string
    parent_id: string
    created_at: string
    updated_at: string
    files?: FileItem[]
}
