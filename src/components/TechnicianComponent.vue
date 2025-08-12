<template>
  <div>
    <h2 class="mb-4">Mis Proyectos Asignados</h2>
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
      <tr>
        <th>ID</th>
        <th>Proyecto</th>
        <th>Ciudad</th>
        <th>Estado Externo</th>
        <th>Estado Interno</th>
        <th>Estado Empalmería</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="project in projects" :key="project.id">
        <td>{{ project.id }}</td>
        <td>{{ project.projectName }}</td>
        <td>{{ project.city }}</td>
        <td>
          <span v-if="!isAssignedToPhase(project, 'EXTERNAL')" class="text-muted">{{ project.externalStatus }}</span>
          <select v-else v-model="project.externalStatus" class="form-select">
            <option value="PENDIENTE">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </td>
        <td>
          <span v-if="!isAssignedToPhase(project, 'INTERNAL')" class="text-muted">{{ project.internalStatus }}</span>
          <select v-else v-model="project.internalStatus" class="form-select">
            <option value="PENDIENTE">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </td>
        <td>
          <span v-if="!isAssignedToPhase(project, 'EMPALMERIA')" class="text-muted">{{ project.empalmeriaStatus }}</span>
          <select v-else v-model="project.empalmeriaStatus" class="form-select">
            <option value="PENDIENTE">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </td>
        <td>
          <div class="d-flex flex-column gap-2">
            <button @click="saveChanges(project)" class="btn btn-success btn-sm">Guardar</button>
            <button class="btn btn-info btn-sm" @click="uploadPhotoRecord(project)">
              Subir Registro Fotográfico
            </button>
            <button @click="registerMaterial(project)" class="btn btn-secondary btn-sm">Registrar material</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // <-- Añade esta importación
import api from '../services/api';
import authService from '../services/authService.js';

const router = useRouter(); // <-- Instancia el enrutador
const projects = ref([]);
const currentUser = ref(null);

const fetchMyProjects = async () => {
  try {
    currentUser.value = authService.getCurrentUser();
    const response = await api.get('projects/my-projects');
    projects.value = response.data;
  } catch (error) {
    console.error("Error al cargar los proyectos del técnico:", error);
  }
};

const isAssignedToPhase = (project, phase) => {
  if (!currentUser.value) return false;
  const username = currentUser.value.username;
  if (phase === 'EXTERNAL' && project.externalTechnicianUsername === username) return true;
  if (phase === 'INTERNAL' && project.internalTechnicianUsername === username) return true;
  if (phase === 'EMPALMERIA' && project.empalmeriaTechnicianUsername === username) return true;
  return false;
};

const saveChanges = async (project) => {
  const userRole = isAssignedToPhase(project, 'EXTERNAL') ? 'EXTERNAL' :
      isAssignedToPhase(project, 'INTERNAL') ? 'INTERNAL' :
          isAssignedToPhase(project, 'EMPALMERIA') ? 'EMPALMERIA' : null;
  if (!userRole) {
    alert('No tienes permiso para actualizar este proyecto.');
    return;
  }
  const newStatus = userRole === 'EXTERNAL' ? project.externalStatus :
      userRole === 'INTERNAL' ? project.internalStatus :
          project.empalmeriaStatus;
  const payload = {
    id: project.id,
    statusToUpdate: userRole,
    newStatus: newStatus
  };
  try {
    const response = await api.put('/projects/technician/updateStatus', payload);
    if (response.status === 200) {
      alert('Estado del proyecto actualizado con éxito.');
      fetchMyProjects();
    }
  } catch (error) {
    console.error('Error al actualizar el estado del proyecto:', error.response || error);
    alert('Hubo un error al actualizar el estado del proyecto. Por favor, revisa la consola.');
  }
};

const uploadPhotoRecord = (project) => {
  router.push({ name: 'photoRecord', params: { projectId: project.id } });
};

const registerMaterial = (project) => {
  alert(`Registrar material para el proyecto ${project.id}`);
};

onMounted(fetchMyProjects);
</script>