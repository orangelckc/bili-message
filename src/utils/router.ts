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
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/Setting/index.vue'),
    redirect: '/setting/danmu',
    children: [
      {
        path: 'danmu',
        name: 'Setting-Danmu',
        component: () => import('@/views/Setting/Danmu.vue'),
      },
      {
        path: 'speech',
        name: 'Setting-Speech',
        component: () => import('@/views/Setting/Speech.vue'),
      },
      {
        path: 'music',
        name: 'Setting-Music',
        component: () => import('@/views/Setting/Music.vue'),
      },
      {
        path: 'background',
        name: 'Setting-Background',
        component: () => import('@/views/Setting/Background.vue'),
      },
      {
        path: 'about',
        name: 'Setting-About',
        component: () => import('@/views/Setting/About.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
