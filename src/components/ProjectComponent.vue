<template>
  <div class="container my-5">
    <h1>Gestión de Proyectos</h1>

    <div>
      <div class="d-flex gap-2 mb-4">
        <button v-if="!showCreateForm" @click="showCreateForm = true" class="btn btn-primary">
          Crear Nuevo Proyecto
        </button>
        <button @click="showCreateUserForm = true; showCreateForm = false" class="btn btn-primary">
          Crear Nuevo Usuario
        </button>
      </div>


      <!----------formulario para crear usuarios------------>
      <form v-if="showCreateUserForm" @submit.prevent="createUser" class="mb-4 p-4 border rounded bg-light">
        <h2 class="mb-3">Crear Nuevo Usuario</h2>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="userUsername" class="form-label">Nombre de usuario</label>
            <input type="text" id="userUsername" v-model="newUser.username" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label for="userPassword" class="form-label">Contraseña</label>
            <input type="password" id="userPassword" v-model="newUser.password" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label for="userEmail" class="form-label">Correo electrónico</label>
            <input type="email" id="userEmail" v-model="newUser.email" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label for="userFullName" class="form-label">Nombres</label>
            <input type="text" id="userFullName" v-model="newUser.firstName" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label for="userFullName" class="form-label">Apellidos</label>
            <input type="text" id="userFullName" v-model="newUser.lastName" class="form-control" required />
          </div>


          <div class="col-md-6">
            <label for="userRole" class="form-label">Rol</label>
            <select id="userRole" v-model="newUser.role" class="form-select" required>
              <option value="ADMIN">ADMIN</option>
              <option value="TECHNICIAN" selected>TECHNICIAN</option>
            </select>
          </div>
        </div>
        <div class="col-12 mt-3">
          <button type="submit" class="btn btn-success me-2">Crear Usuario</button>
          <button type="button" @click="showCreateUserForm = false" class="btn btn-secondary">Cancelar</button>
        </div>
      </form>


      <!----------formulario para crear projectos------------>

      <form v-if="showCreateForm" @submit.prevent="createProject" class="mb-4 p-4 border rounded bg-light">
        <h2 class="mb-3">Crear Nuevo Proyecto</h2>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="projectName" class="form-label">Nombre del Proyecto</label>
            <input type="text" id="projectName" v-model="newProject.projectName" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label for="city" class="form-label">Ciudad</label>
            <input type="text" id="city" v-model="newProject.city" class="form-control" required />
          </div>

          <div class="col-md-4">
            <label for="externalTechnician" class="form-label">Técnico Externo</label>
            <select id="externalTechnician" v-model="newProject.externalTechnicianUsername" class="form-select" required>
              <option disabled value="">Selecciona un técnico</option>
              <option v-for="technician in technicians" :key="technician.username" :value="technician.username">
                {{ technician.username + ' ' + technician.fullName }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="internalTechnician" class="form-label">Técnico Interno</label>
            <select id="internalTechnician" v-model="newProject.internalTechnicianUsername" class="form-select" required>
              <option disabled value="">Selecciona un técnico</option>
              <option v-for="technician in technicians" :key="technician.username" :value="technician.username">
                {{ technician.username + ' ' + technician.fullName }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="empalmeriaTechnician" class="form-label">Técnico de Empalmería</label>
            <select id="empalmeriaTechnician" v-model="newProject.empalmeriaTechnicianUsername" class="form-select" required>
              <option disabled value="">Selecciona un técnico</option>
              <option v-for="technician in technicians" :key="technician.username" :value="technician.username">
                {{ technician.username + ' ' + technician.fullName }}
              </option>
            </select>
          </div>

          <div class="col-12">
            <button type="submit" class="btn btn-primary me-2">Crear Proyecto</button>
            <button type="button" @click="showCreateForm = false" class="btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </form>
      <!---------------------------------------------------------------->

    </div>

    <div v-if="editingProject  && technicians.length > 0" class="mb-4 p-4 border rounded bg-light">
      <h2 class="mb-3">Editar Proyecto #{{ editingProject.id }}</h2>
      <form @submit.prevent="updateProject">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="editProjectName" class="form-label">Nombre del Proyecto</label>
            <input type="text" id="editProjectName" v-model="editingProject.projectName" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label for="editCity" class="form-label">Ciudad</label>
            <input type="text" id="editCity" v-model="editingProject.city" class="form-control" required />
          </div>
          <div class="col-md-4">
            <label for="editExternalTechnician" class="form-label">Técnico Externo</label>
            <select id="editExternalTechnician" v-model="editingProject.externalTechnicianUsername" class="form-select" required>
              <option disabled value="">Selecciona un técnico</option>
              <option v-for="technician in technicians" :key="technician.username" :value="technician.username">
                {{  technician.username + ' ' + technician.fullName   }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label for="editInternalTechnician" class="form-label">Técnico Interno</label>
            <select id="editInternalTechnician" v-model="editingProject.internalTechnicianUsername" class="form-select" required>
              <option disabled value="">Selecciona un técnico</option>
              <option v-for="technician in technicians" :key="technician.username" :value="technician.username">
                {{  technician.username + ' ' + technician.fullName   }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="editEmpalmeriaTechnician" class="form-label">Técnico de Empalmería</label>
            <select id="editEmpalmeriaTechnician" v-model="editingProject.empalmeriaTechnicianUsername" class="form-select" required>
              <option disabled value="">Selecciona un técnico</option>
              <option v-for="technician in technicians" :key="technician.username" :value="technician.username">
                {{  technician.username + ' ' + technician.fullName   }}
              </option>
            </select>
          </div>

          <div class="col-12">
            <button type="submit" class="btn btn-success me-2">Guardar Cambios</button>
            <button @click="editingProject = null" type="button" class="btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </form>
    </div>

    <h2>Lista de Proyectos</h2>
    <table class="table table-striped table-bordered table-hover">
      <thead class="table-dark">
      <tr>
        <th>ID</th>
        <th>Proyecto</th>
        <th>Ciudad</th>
        <th>Técnico Externo</th>
        <th>Técnico Interno</th>
        <th>Técnico Empalmería</th>
        <th>Estado Externo</th>
        <th>Estado Interno</th>
        <th>Estado Empalmería</th>
        <th>Creado en</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>{{ project.id }}</td>
          <td>{{ project.projectName }}</td>
          <td>{{ project.city }}</td>
          <td>{{ project.externalTechnicianName }}</td>
          <td>{{ project.internalTechnicianName }}</td>
          <td>{{ project.empalmeriaTechnicianName }}</td>
          <td>{{ project.externalStatus }}</td>
          <td>{{ project.internalStatus }}</td>
          <td>{{ project.empalmeriaStatus }}</td>
          <td>{{ project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A' }}</td>
          <td>
            <button @click="editProject(project)" class="btn btn-info btn-sm me-2">Editar</button>
            <button @click="deleteProject(project.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import authService from "@/services/authService.js";
import AuthService from "@/services/authService.js";

export default {
  setup() {
    const projects = ref([]);
    //const newProject = ref({ projectName: '' });
    const newProject = ref({ projectName: '', city: '', externalTechnicianUsername: '', internalTechnicianUsername: '', empalmeriaTechnicianUsername: '' })
    const editingProject = ref(null);

    const technicians = ref([]);
    const showCreateForm = ref(false);
    const showCreateUserForm = ref(false);

    const newUser = ref({ // NUEVA VARIABLE PARA LOS DATOS DEL USUARIO
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'TECHNICIAN' // Valor por defecto
    });
    //CREAR USUARIO
    const createUser = async () => {
      try {
        // Usamos el nuevo método de authService
        const response = await authService.registerUserByAdmin(newUser.value);

        if (response.status === 200) {
          alert('Usuario creado con éxito!');
          showCreateUserForm.value = false;
          // Limpiar el formulario
          newUser.value = {
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            role: 'TECHNICIAN'
          };
        }
      } catch (error) {
        console.error("Error al crear el usuario:", error.response || error);
        alert('Error al crear el usuario: ' + (error.response?.data || 'Por favor, revisa la consola.'));
      }
    };

    // Carga los proyectos existentes al iniciar el componente usando el cliente api

    const fetchProjects = async () => {
      try {
        const response = await api.get('projects/all');
        projects.value = response.data;
      } catch (error) {
        console.error("Error al cargar los proyectos:", error);
      }
    };

    // Envía la solicitud para crear un nuevo proyecto usando el cliente api
    const createProject = async () => {
      try {
        const response = await api.post('projects/create', newProject.value);

        if (response.status === 200) { // El endpoint de createProject devuelve 200 OK
          newProject.value = {
            projectName: '',
            city: '',
            externalTechnicianUsername: '',
            internalTechnicianUsername: '',
            empalmeriaTechnicianUsername: ''
          };
          showCreateForm.value = false;
          fetchProjects();
        } else {
          console.error("Error al crear el proyecto:", response);
        }
      } catch (error) {
        console.error("Error al enviar la solicitud:", error.response || error);
      }
    };
    const fetchTechnicians = async () => {
      try {
        const response = await authService.getTechnicians();
        technicians.value = response.data;
      } catch (error) {
        console.error("Error al cargar los técnicos:", error);
      }
    };
    const deleteProject = async (projectId) => {
      if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        try {
          const response = await api.delete(`projects/${projectId}`);
          if (response.status === 204) { // Código de éxito para una eliminación sin contenido
            fetchProjects(); // Recargamos la lista para que el proyecto eliminado desaparezca
          } else {
            console.error("Error al eliminar el proyecto:", response);
          }
        } catch (error) {
          console.error("Error al enviar la solicitud de eliminación:", error);
        }
      }
    };
    const editProject = (project) => {
      editingProject.value = { ...project }; // Copiamos el objeto para no modificarlo directamente
    };


    const updateProject = async () => {
      try {
        const response = await api.put(`projects/${editingProject.value.id}`, editingProject.value);

        if (response.status === 200) {
          editingProject.value = null; // Cerramos el formulario de edición
          fetchProjects(); // Recargamos la lista
        }
      } catch (error) {
        console.error("Error al actualizar el proyecto:", error);
      }
    };

    // Llama a fetchProjects cuando el componente se monta
    onMounted(() => {
      fetchProjects();
      fetchTechnicians();
    });

    return {
      projects,
      newProject,
      createProject,
      deleteProject,
      editingProject, // NO OLVIDES DEVOLVERLA
      editProject,
      updateProject,
      technicians,
      showCreateForm,
      showCreateUserForm, // NUEVO
      newUser, // NUEVO
      createUser
    };
  },
};
</script>

<style scoped>
/* Estilos simples para que se vea ordenado */
h1, h2 {
  color: #333;
}
form {
  margin-bottom: 20px;
}
input {
  padding: 8px;
  margin-right: 10px;
}
button {
  padding: 8px 12px;
  cursor: pointer;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}
</style>