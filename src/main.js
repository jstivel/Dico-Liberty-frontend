// import { createApp } from 'vue';
// import App from './App.vue';
// //import router from './router'
//
// // Importa los estilos de Bootstrap
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
// import app from "@/App.vue";
//
// createApp(App).mount('#app');

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <-- DESCOMENTADO Y USADO

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const app = createApp(App);
app.use(router); // <-- Usa el enrutador
app.mount('#app');