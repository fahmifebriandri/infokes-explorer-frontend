import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ExplorerView from '@/views/ExplorerView.vue'

const ROOT_ID = import.meta.env.VITE_ROOT_ID

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/folders/' + ROOT_ID
  },
  {
    path: '/folders/:id',
    component: ExplorerView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router