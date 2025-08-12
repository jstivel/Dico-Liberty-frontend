<template>
  <header class="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
    <h1 class="h3 mb-0">Gestor de Proyectos Telecom</h1>
    <div v-if="currentUser">
      <p class="mb-0 me-3 d-inline-block">Bienvenido, {{ currentUser.username }}</p>
      <button @click="logout" class="btn btn-warning">Cerrar Sesión</button>
    </div>
  </header>
  <main class="container mt-4">
    <router-view></router-view>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from './services/authService.js';

const currentUser = ref(null);
const router = useRouter();

const logout = () => {
  AuthService.logout();
  currentUser.value = null;
  router.push('/');
};

onMounted(() => {
  currentUser.value = AuthService.getCurrentUser();
  if (currentUser.value) {
    if (currentUser.value.roles.includes('ROLE_ADMIN')) {
      router.push('/admin');
    } else if (currentUser.value.roles.includes('ROLE_TECHNICIAN')) {
      router.push('/technician');
    }
  }
});
</script>

<style scoped>
/* Estilos de App.vue */
</style>