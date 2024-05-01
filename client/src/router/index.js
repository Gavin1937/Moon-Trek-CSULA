import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/upload',
            name: 'upload',
            component: () => import('../views/UploadView.vue')
        },
        {
            path: '/registration',
            name: 'registration',
            component: () => import('../views/RegistrationView.vue')
        },
        {
            path: '/model',
            name: 'model',
            component: () => import('../views/ModelView.vue')
        },
        {
            path: '/zoom',
            name: 'zoom',
            component: () => import('../views/InfiniteZoomViewNew.vue')
        }
    ]
})

export default router
