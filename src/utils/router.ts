import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/host',
    name: 'Host',
    component: () => import('@/views/host.vue'),
  },
  {
    path: '/client',
    name: 'Client',
    component: () => import('@/views/client.vue'),
  },
  {
    path: '/music',
    name: 'Music',
    component: () => import('@/views/Music/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
