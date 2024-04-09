import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/host',
    name: 'Host',
    component: () => import('@/views/Host/index.vue'),
  },
  {
    path: '/client',
    name: 'Client',
    children: [
      {
        path: 'danmu',
        name: 'Client-Danmu',
        component: () => import('@/views/Client/Danmu.vue'),
      },
      {
        path: 'music',
        name: 'Client-Music',
        component: () => import('@/views/Client/Music.vue'),
      },
      {
        path: 'background',
        name: 'Client-Background',
        component: () => import('@/views/Client/Background.vue'),
      },
    ],
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
