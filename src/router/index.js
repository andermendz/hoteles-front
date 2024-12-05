import { createRouter, createWebHistory } from 'vue-router'
import Hotels from '@/views/Hotels/Index.vue'

const routes = [
    {
        path: '/',
        name: 'hotels',
        component: Hotels
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
