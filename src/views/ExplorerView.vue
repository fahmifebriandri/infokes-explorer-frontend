<!-- /src/views/ExplorerView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FolderTree from '@/components/FolderTree.vue'
import RightPanel from '@/components/RightPanel.vue'
import {
  getFolderContent,
  searchFoldersFiles,
  createItem,
  updateItem,
  deleteItem,
  getFolderPath
} from '@/api/folderApi'

const router = useRouter()
const props = defineProps<{ id?: string }>()
const ROOT = import.meta.env.VITE_ROOT_ID

const folderId = ref<string>(ROOT)
const data = ref<any>(null)
const path = ref<any[]>([])
const search = ref('')

onMounted(() => {
  open(props.id || ROOT)
})

async function open(id: string) {
  folderId.value = id === '1' ? ROOT : id
  data.value = await getFolderContent(folderId.value)
  path.value = await getFolderPath(folderId.value)
  router.push('/folders/' + folderId.value)
}

async function doSearch() {
  if (!search.value) {
    return open(folderId.value)
  }

  const result = await searchFoldersFiles(search.value)
  data.value = {
    subfolders: result.folders,
    filesInFolder: result.files
  }
}

async function add(type: 'folder' | 'file') {
  const name = prompt('Enter name')
  if (!name) return

  const payload =
    type === 'folder'
      ? { name, parent_id: folderId.value }
      : { name, folder_id: folderId.value }

  await createItem(type, payload)
  open(folderId.value)
}

async function rename(type: 'folder' | 'file', id: string, oldName: string) {
  const name = prompt('Enter new name', oldName)
  if (!name || name === oldName) return

  await updateItem(type, { id, name })
  open(folderId.value)
}

async function remove(type: 'folder' | 'file', id: string) {
  if (!confirm('Delete item?')) return
  await deleteItem(type, id)
  open(folderId.value)
}

function home() {
  window.location.href = '/'
}
</script>


<template>
  <div class="toolbar">
    <button @click="home">Home</button>
    <input v-model="search" @keyup.enter="doSearch" placeholder="Search..." />
    <button @click="doSearch">Search</button>
    <button @click="add('folder')">Add Folder</button>
    <button @click="add('file')">Add File</button>
  </div>

  <div class="explorer">
    <div class="left">
      <FolderTree :root-id="folderId" :active-id="folderId" @select="open" />
    </div>

    <div class="right">
      <RightPanel :data="data" :path="path" @select="open" @rename="rename" @delete="remove" />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.toolbar input {
  flex: 1;
  padding: 6px;
}

.explorer {
  display: flex;
  height: calc(100vh - 60px);
}

.left {
  width: 280px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.right {
  flex: 1;
  padding: 16px;
}
</style>
