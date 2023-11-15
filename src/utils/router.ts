import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/host',
    children: [
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
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
