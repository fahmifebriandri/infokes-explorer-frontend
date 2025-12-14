<!-- /src/components/FolderTree.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { getFolderContent } from "@/api/folderApi"
import type { Folder } from "@/types/folder"

const props = defineProps<{
  rootId?: string
  folder?: Folder
  activeId?: string
}>()

const emit = defineEmits<{
  (e: "select", id: string): void
}>()

const open = ref(false)
const children = ref<Folder[]>([])
const loaded = ref(false)

async function load(id: string) {
  if (loaded.value) return
  const data = await getFolderContent(id)
  children.value = data.subfolders
  loaded.value = true
}

async function clickFolder() {
  if (!props.folder) return
  emit("select", props.folder.id)
  open.value = !open.value
  if (open.value) {
    await load(props.folder.id)
  }
}

watch(
  () => props.activeId,
  async (id) => {
    if (!props.folder || !id) return
    if (props.folder.id === id) return

    if (!loaded.value) {
      await load(props.folder.id)
    }

    if (children.value.some(c => c.id === id)) {
      open.value = true
    }
  }
)

onMounted(async () => {
  if (props.rootId) {
    await load(props.rootId)
    open.value = true
  }
})
</script>

<template>
  <div>
    <template v-if="rootId">
      <FolderTree v-for="item in children" :key="item.id" :folder="item" :active-id="activeId"
        @select="emit('select', $event)" />
    </template>

    <template v-else>
      <div class="folder" :class="{ active: folder?.id === activeId }" @click="clickFolder">
        📁 {{ folder?.name }}
      </div>

      <div v-if="open" class="children">
        <FolderTree v-for="item in children" :key="item.id" :folder="item" :active-id="activeId"
          @select="emit('select', $event)" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.folder {
  padding: 4px;
  cursor: pointer;
}

.folder.active {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 600;
}

.children {
  padding-left: 16px;
}
</style>
