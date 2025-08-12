<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Usuario:</label>
        <input type="text" id="username" v-model="user.username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="user.password" required />
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/authService.js';

export default {
  setup() {
    const user = ref({
      username: '',
      password: ''
    });
    const message = ref('');
    const router = useRouter();

    const handleLogin = async () => {
      try {
        const loggedInUser = await AuthService.login(user.value.username, user.value.password);

        message.value = 'Inicio de sesión exitoso.';

        if (loggedInUser.roles.includes('ROLE_ADMIN')) {
          router.push('/admin');
        } else if (loggedInUser.roles.includes('ROLE_TECHNICIAN')) {
          router.push('/technician');
        }

      } catch (error) {
        message.value = 'Error en el inicio de sesión. Verifica tus credenciales.';
        console.error("Error en el login:", error.response || error);
      }
    };

    return {
      user,
      message,
      handleLogin,
    };
  },
};
</script>

<style scoped>
/* Estilos básicos para el formulario */
form div {
  margin-bottom: 1rem;
}
.message {
  margin-top: 1rem;
  color: red;
}
</style>