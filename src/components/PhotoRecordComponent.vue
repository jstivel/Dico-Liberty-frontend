<template>
  <div class="container my-5">
    <h1 class="mb-4">Registro Fotográfico del Proyecto #{{ projectId }}</h1>

    <form @submit.prevent="generateExcel" class="p-4 border rounded bg-light">
      <div class="mb-3">
        <label for="formato" class="form-label">Formato:</label>
        <select id="formato" v-model="form.formato" class="form-select" required>
          <option disabled value="">Selecciona un formato</option>
          <option v-for="op in formatos" :key="op" :value="op">{{ op }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="ejecutor" class="form-label">Ejecutor:</label>
        <select id="ejecutor" v-model="form.ejecutor" class="form-select" required>
          <option disabled value="">Selecciona un ejecutor</option>
          <option v-for="op in ejecutores" :key="op.nombre" :value="op.nombre">{{ op.nombre }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="direccion" class="form-label">Dirección:</label>
        <input type="text" id="direccion" v-model="form.direccion" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="fechaVisita" class="form-label">Fecha de la Visita:</label>
        <input type="date" id="fechaVisita" v-model="form.fechaVisita" class="form-control" required />
      </div>

      <div class="mb-3" v-if="form.formato === 'clientes interno' || form.formato === 'clientes externo' || form.formato === 'Factibilidades'">
        <label for="cliente" class="form-label">Nombre del sitio:</label>
        <input type="text" id="cliente" v-model="form.cliente" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="telefono" class="form-label">Teléfono:</label>
        <input type="text" id="telefono" v-model="form.telefono" class="form-control" disabled />
      </div>

      <div class="mb-3">
        <label for="photos" class="form-label">Subir Registros Fotográficos:</label>
        <input type="file" id="photos" multiple @change="handleFileChange" class="form-control" required />
      </div>

      <div v-if="form.files.length > 0" class="mb-4">
        <h3 class="h5">Vista Previa</h3>
        <div class="row g-3">
          <div v-for="(file, index) in form.files" :key="index" class="col-md-4">
            <div class="card">
              <img :src="file.url" class="card-img-top" alt="Vista Previa de la Foto" />
              <div class="card-body">
                <input type="text" v-model="form.descriptions[index]" class="form-control" :placeholder="'Descripción para la foto ' + (index + 1)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2 mt-4">
        <button type="submit" class="btn btn-primary">Generar Excel</button>
        <button @click="goBack" type="button" class="btn btn-secondary">Volver</button>
      </div>

      <div v-if="message" class="mt-3 alert" :class="message.type === 'success' ? 'alert-success' : 'alert-danger'">
        {{ message.text }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api'; // Asegúrate de que tu servicio 'api' esté importado

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const form = ref({
  formato: '',
  ejecutor: '',
  direccion: '',
  fechaVisita: '',
  cliente: '',
  telefono: '',
  files: [],
  descriptions: [],
});

const message = ref(null);

const formatos = ["Preventivo", "Recorredor", "clientes interno", "clientes externo", "Factibilidades", "Cartera"];
const ejecutores = [
  { nombre: "BRAYAN STIVEN SALAMANCA CASTAÑEDA", telefono: "3133977853" },
  { nombre: "JUAN CARLOS RODRIGUEZ CHIQUILLO", telefono: "3214522373" },
  { nombre: "YOVANNI GOMEZ PEÑA", telefono: "3112973928" },
  { nombre: "MICHAEL ESTEBAN URQUIJO LOPEZ", telefono: "3114669376" },
  { nombre: "FABIAN DAVID CIFUENTES GRUESO", telefono: "3112042566" },
  { nombre: "JOHN EZEQUIEL TANGARIFE ARENAS", telefono: "3118859551" },
  { nombre: "ELIAS ALBERTO CADENA AGUDELO", telefono: "3102619401" },
  { nombre: "NICOLAS EDUARDO ALVARADO CASTAÑO", telefono: "3208216107" },
  { nombre: "DEISON RAUL HURTADO MOSQUERA", telefono: "3202366550" },
  { nombre: "JHON HAMILTON BARRERA ALARCON", telefono: "3208550790" },
  { nombre: "NEIDER ALEXANDER ARENAS MORALES", telefono: "3114890889" },
  { nombre: "EDISON ESTEBAN SEPULVEDA VALENCIA", telefono: "3154928823" },
  { nombre: "JOHN ALEXANDER VEGA SALAMANCA", telefono: "3219662645" },
];

// Actualiza el teléfono automáticamente
watch(() => form.value.ejecutor, (newEjecutor) => {
  const selectedEjecutor = ejecutores.find(e => e.nombre === newEjecutor);
  form.value.telefono = selectedEjecutor ? selectedEjecutor.telefono : '';
});

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  form.value.files = files.map(file => ({
    file,
    url: URL.createObjectURL(file),
  }));
  form.value.descriptions = files.map(() => '');
};

const generateExcel = async () => {
  if (!form.value.files.length) {
    message.value = { text: 'Por favor, sube al menos una foto.', type: 'danger' };
    return;
  }

  const formData = new FormData();
  formData.append('projectId', props.projectId);
  formData.append('formato', form.value.formato);
  formData.append('ejecutor', form.value.ejecutor);
  formData.append('direccion', form.value.direccion);
  formData.append('fechaVisita', form.value.fechaVisita);
  formData.append('cliente', form.value.cliente);
  formData.append('telefono', form.value.telefono);

  form.value.files.forEach((fileObj) => {
    formData.append('photos', fileObj.file);
  });
  form.value.descriptions.forEach((description, index) => {
    formData.append(`descriptions[${index}]`, description);
  });

  try {
    const response = await api.post('/projects/generate-excel', formData, {
      responseType: 'blob', // Importante para descargar archivos
    });

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Registro_fotografico_${props.projectId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    message.value = { text: '¡El archivo Excel ha sido generado y descargado exitosamente!', type: 'success' };

  } catch (error) {
    message.value = { text: 'Error al generar el archivo. Por favor, revisa la consola.', type: 'danger' };
    console.error("Error al generar el Excel:", error.response || error);
  }
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
/* Añade aquí estilos para el formulario, si lo deseas */
.card-img-top {
  width: 100%;
  height: 200px; /* Tamaño fijo para la vista previa */
  object-fit: cover;
}
</style>