import {createRouter, createWebHistory} from 'vue-router'
import Layout from "@/components/layout/Layout.vue";

const routes = [
    {
        path: '/',
        component: Layout,
        hidden: true,
        meta: { title: '首页', icon: 'dashboard' }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Layout,
        meta: { title: '首页', icon: 'icon-dashboard' },
        children: [
            {
                path: 'index',
                component: () => import('@/views/dashboard/Dashboard.vue'),
                meta: { title: '首页', icon: 'icon-dashboard' }
            }
        ]
    },
    {
        path: '/kafka',
        name: 'kafka',
        component: Layout,
        meta: { title: 'Kafka', icon: 'icon-kafka' },
        children: [
            {
                path: '',
                component: () => import('@/views/kafka/Index.vue'),
                meta: { title: 'Kafka首页', icon: 'icon-kafka-info' }
            },
            {
                path: 'sub',
                component: () => import('@/views/kafka/sub/Topic.vue'),
                meta: { title: 'Kafka topic', icon: 'icon-user' }
            }
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router