<!-- /src/components/RightPanel.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Folder, FileItem } from '@/types/folder'

const props = defineProps<{
  data: {
    subfolders: Folder[]
    filesInFolder: FileItem[]
  } | null
}>()

const emit = defineEmits<{
  select: [id: string]
  rename: [type: 'folder' | 'file', id: string, name: string]
  delete: [type: 'folder' | 'file', id: string]
}>()

const key = ref('name')
const order = ref<'asc' | 'desc'>('asc')

const menuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const selectedItem = ref<any>(null)

const items = computed(() => {
  if (!props.data) return []

  const folders = props.data.subfolders.map(f => ({
    ...f,
    type: 'folder',
    size: '',
    extension: ''
  }))

  const files = props.data.filesInFolder.map(f => ({
    ...f,
    type: 'file'
  }))

  return [...folders, ...files].sort((a, b) => {
    let x = a[key.value]
    let y = b[key.value]

    if (key.value.includes('at')) {
      x = new Date(x).getTime()
      y = new Date(y).getTime()
    }

    return order.value === 'asc' ? x > y ? 1 : -1 : x < y ? 1 : -1
  })
})

function sortBy(name: string) {
  key.value = name
  order.value = key.value === name && order.value === 'asc' ? 'desc' : 'asc'
}

function clickItem(item: any) {
  if (item.type === 'folder') {
    emit('select', item.id)
  }
}

function openMenu(e: MouseEvent, item: any) {
  selectedItem.value = item
  menuX.value = e.clientX
  menuY.value = e.clientY
  menuVisible.value = true
}

function closeMenu() {
  menuVisible.value = false
  selectedItem.value = null
}

function renameItem() {
  emit('rename', selectedItem.value.type, selectedItem.value.id, selectedItem.value.name)
  closeMenu()
}

function deleteItem() {
  emit('delete', selectedItem.value.type, selectedItem.value.id)
  closeMenu()
}

function handleClickOutside() {
  closeMenu()
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div v-if="data && (data.subfolders.length || data.filesInFolder.length)">
    <table class="details-table">
      <thead>
        <tr>
          <th @click="sortBy('name')">Name</th>
          <th @click="sortBy('size')">Size</th>
          <th @click="sortBy('extension')">Ext</th>
          <th @click="sortBy('created_at')">Created</th>
          <th @click="sortBy('updated_at')">Updated</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="clickItem(item)" @contextmenu.prevent="openMenu($event, item)"
          :class="{ clickable: item.type === 'folder' }">
          <td>{{ item.type === 'folder' ? '📁' : '📄' }} {{ item.name }}</td>
          <td>{{ item.size }}</td>
          <td>{{ item.extension }}</td>
          <td>{{ new Date(item.created_at).toLocaleString() }}</td>
          <td>{{ new Date(item.updated_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="empty-message">
    Folder is empty
  </div>

  <div v-if="menuVisible" class="context-menu" :style="{ top: menuY + 'px', left: menuX + 'px' }">
    <div class="menu-item" @click="renameItem">Rename</div>
    <div class="menu-item danger" @click="deleteItem">Delete</div>
  </div>
</template>

<style scoped>
.details-table {
  width: 100%;
  border-collapse: collapse;
}

.details-table th,
.details-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.details-table th {
  background: #f2f2f2;
  cursor: pointer;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background-color: #f5f5f5;
}

.empty-message {
  text-align: center;
  padding: 32px;
  color: #777;
}

.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  z-index: 9999;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.menu-item.danger {
  color: #c0392b;
}
</style>
