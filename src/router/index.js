import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from '../components/LoginComponent.vue';
import ProjectComponent from '../components/ProjectComponent.vue';
import TechnicianComponent from '../components/TechnicianComponent.vue';
import PhotoRecordComponent from '../components/PhotoRecordComponent.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginComponent,
        meta: { requiresAuth: false },
    },
    {
        path: '/admin',
        name: 'Admin',
        component: ProjectComponent,
        meta: { requiresAuth: true, role: 'ROLE_ADMIN' },
    },
    {
        path: '/technician',
        name: 'Technician',
        component: TechnicianComponent,
        meta: { requiresAuth: true, role: 'ROLE_TECHNICIAN' },
    },
    {
        path: '/technician/project/:projectId/record-photo',
        name: 'photoRecord',
        component: PhotoRecordComponent,
        props: true,
        meta: { requiresAuth: true, role: 'ROLE_TECHNICIAN' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('user');
    const user = loggedIn ? JSON.parse(loggedIn) : null;
    const requiresAuth = to.meta.requiresAuth;

    if (requiresAuth && !loggedIn) {
        return next('/');
    }

    if (!requiresAuth && loggedIn) {
        if (user && user.roles.includes('ROLE_ADMIN')) {
            return next('/admin');
        } else if (user && user.roles.includes('ROLE_TECHNICIAN')) {
            return next('/technician');
        }
    }

    if (to.meta.role && user && !user.roles.includes(to.meta.role)) {
        alert('Acceso denegado. No tienes permisos para ver esta página.');
        return next(user.roles.includes('ROLE_ADMIN') ? '/admin' : '/technician');
    }

    next();
});

export default router;