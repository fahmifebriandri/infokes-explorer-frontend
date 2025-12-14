// /src/api/folderApi.ts
import type { Folder, FileItem } from '@/types/folder'

const BASE_URL = import.meta.env.VITE_BASE_API_URL

export async function getFolderContent(folderId: string): Promise<{
    subfolders: Folder[]
    filesInFolder: FileItem[]
}> {
    // Uncomment below to use real API
    try {
        const res = await fetch(`${BASE_URL}/folders/${folderId}/subfolder`)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const json = await res.json()
        return json.data
    } catch (error) {
        console.error('Error fetching folder content:', error)
        // Fallback to empty data
        return {
            subfolders: [],
            filesInFolder: []
        }
    }
}

export async function getFolderPath(folderId: string): Promise<Folder[]> {
    const res = await fetch(`${BASE_URL}/folders/${folderId}/path`)
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json()
    return json.data
}


export async function searchFoldersFiles(q: string): Promise<{
    folders: Folder[]
    files: FileItem[]
}> {
    const res = await fetch(`${BASE_URL}/folders_n_files/search?q=${encodeURIComponent(q)}`)
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json()
    return json.data
}

export async function createItem(type: 'folder' | 'file', data: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/folders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data })
    })
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json()
    return json.data
}

export async function updateItem(type: 'folder' | 'file', data: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/folders/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data })
    })
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json()
    return json.data
}

export async function deleteItem(type: 'folder' | 'file', id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/folders/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
    })
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = await res.json()
    return json
}
