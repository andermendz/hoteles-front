<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">

    

      <transition
  enter-active-class="transform ease-out duration-300 transition"
  enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
  enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
  leave-active-class="transition ease-in duration-200"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
        <div 
    v-if="notification.show"
    :class="{
      'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50': true,
      'bg-green-100 text-green-800': notification.type === 'success',
      'bg-red-100 text-red-800': notification.type === 'error',
      'bg-yellow-100 text-yellow-800': notification.type === 'warning'
    }"
  >
  <div class="flex items-center">
    <svg 
      v-if="notification.type === 'success'"
      class="w-5 h-5 mr-2" 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
    </svg>
    <svg 
      v-if="notification.type === 'error'"
      class="w-5 h-5 mr-2" 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
    </svg>
    <span class="font-medium">{{ notification.message }}</span>
  </div>
</div>
      </transition>
   

    <!-- Botón Toggle Dashboard -->
    <button
      @click="toggleDashboard"
      class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Ver Dashboard
    </button>

    <transition name="modal">
      <div
        v-if="showDashboard"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-4"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[95vh] flex flex-col"
        >
          <div
            class="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg z-10"
          >
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-800">
                Dashboard del Proyecto
              </h2>
              <button
                @click="toggleDashboard"
                class="text-gray-500 hover:text-gray-700 text-2xl transition duration-200"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Grid de Hoteles -->
          <div class="overflow-y-auto p-6">
            <div class="space-y-6">
              <div
                class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-200"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-semibold text-gray-800">Hoteles</h3>
                  <span
                    class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {{ hotels.length }} total
                  </span>
                </div>
                <div class="grid gap-4">
                  <div
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="border-b pb-3 hover:bg-gray-50 p-4 rounded-md transition duration-200"
                  >
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <h4 class="font-medium text-blue-700 text-lg">
                          {{ hotel.name }}
                        </h4>
                        <p class="text-sm text-gray-600">
                          {{ hotel.city }} - {{ hotel.address }}
                        </p>
                        <p class="text-sm text-gray-500">
                          NIT: {{ hotel.nit }}
                        </p>
                      </div>
                      <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {{ hotel.total_rooms }} habitaciones
                      </span>
                    </div>

                    <div class="mt-3">
                      <p class="text-sm font-medium text-gray-700 mb-2">
                        Distribución de Habitaciones:
                      </p>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          v-for="room in hotel.hotel_rooms"
                          :key="room.id"
                          class="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                          <div class="flex-1">
                            <div class="flex items-center">
                              <span class="text-sm font-medium text-gray-800">
                                {{ room.room_type?.name }}
                              </span>
                              <span class="mx-2 text-gray-400">•</span>
                              <span class="text-sm text-gray-600">
                                {{ room.accommodation?.name }}
                              </span>
                            </div>
                            <div class="flex items-center mt-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 text-gray-400 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                              <span class="text-sm text-gray-500">
                                {{ room.quantity }} unidad{{
                                  room.quantity !== 1 ? "es" : ""
                                }}
                              </span>
                            </div>
                          </div>
                          <div
                            class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {{
                              (
                                (room.quantity / hotel.total_rooms) *
                                100
                              ).toFixed(1)
                            }}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tipos de Habitación -->
              <div
                class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-200"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-semibold text-gray-800">
                    Tipos de Habitación
                  </h3>
                  <span
                    class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {{ roomTypes.length }} tipos
                  </span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div
                    v-for="type in roomTypes"
                    :key="type.id"
                    class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100200"
                  >
                    <span class="text-gray-700 font-medium">{{
                      type.name
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Acomodaciones -->
              <div
                class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-200"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-semibold text-gray-800">
                    Acomodaciones
                  </h3>
                  <span
                    class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {{ accommodations.length }} tipos
                  </span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div
                    v-for="acc in accommodations"
                    :key="acc.id"
                    class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-200"
                  >
                    <span class="text-gray-700 font-medium">{{
                      acc.name
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Formulario Principal -->
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Registro de Hotel
      </h2>

      <form
        @submit.prevent="saveHotel"
        class="bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200"
      >
        <!-- Información Básica -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div v-for="field in basicFields" :key="field.name">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ field.label }}
            </label>
            <input
              v-model="hotel[field.name]"
              :type="field.type || 'text'"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              :placeholder="field.placeholder"
              required
            />
          </div>
        </div>

        <!-- Configuración de Habitaciones -->
        <div class="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
              Configuración de Habitaciones
            </h3>
            <button
              type="button"
              @click="addRoom"
              class="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
            >
              + Añadir Habitación
            </button>
          </div>

          <div class="grid gap-4">
            <div
              v-for="(room, index) in hotel.rooms"
              :key="index"
              class="bg-white p-4 rounded-lg border border-gray-200 relative"
            >
              <button
                type="button"
                @click="removeRoom(index)"
                class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition duration-200"
              >
                ×
              </button>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Habitación
                  </label>
                  <select
                    v-model="room.room_type_id"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option
                      v-for="type in roomTypes"
                      :key="type.id"
                      :value="type.id"
                    >
                      {{ type.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Acomodación
                  </label>
                  <select
                    v-model="room.accommodation_id"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Seleccionar acomodación</option>
                    <option
                      v-for="acc in validAccommodations(room.room_type_id)"
                      :key="acc.id"
                      :value="acc.id"
                    >
                      {{ acc.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <input
                    v-model="room.quantity"
                    type="number"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          >
            Guardar Hotel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/config/axios";

export default {
  data() {
    return {
      showDashboard: false,
      hotel: {
        name: "",
        address: "",
        city: "",
        nit: "",
        total_rooms: "",
        rooms: [],
      },
      hotels: [],
      roomTypes: [],
      accommodations: [],
      notification: {
        show: false,
        message: '',
        type: 'success' // success, error, warning
      },
      basicFields: [
        {
          name: "name",
          label: "Nombre del Hotel",
          placeholder: "Ingrese el nombre",
        },
        {
          name: "address",
          label: "Dirección",
          placeholder: "Ingrese la dirección",
        },
        { name: "city", label: "Ciudad", placeholder: "Ingrese la ciudad" },
        { name: "nit", label: "NIT", placeholder: "Ingrese el NIT" },
        {
          name: "total_rooms",
          label: "Número de Habitaciones",
          type: "number",
          placeholder: "Total habitaciones",
        },
      ],
    };
  },
  methods: {
    toggleDashboard() {
      this.showDashboard = !this.showDashboard;
    },
    async fetchHotels() {
      const response = await api.get("/hotels");
      this.hotels = response.data;
    },
    async fetchRoomTypes() {
      const response = await api.get("/room-types");
      this.roomTypes = response.data;
    },
    async fetchAccommodations() {
      const response = await api.get("/accommodations");
      this.accommodations = response.data;
    },
    addRoom() {
      this.hotel.rooms.push({
        room_type_id: "",
        accommodation_id: "",
        quantity: "",
      });
    },
    removeRoom(index) {
      this.hotel.rooms.splice(index, 1);
    },
    validAccommodations(roomTypeId) {
      if (!roomTypeId) return this.accommodations;

      switch (roomTypeId) {
        case 1: // ESTANDAR
          return this.accommodations.filter(
            (acc) => [1, 2].includes(acc.id) // Solo SENCILLA o DOBLE
          );
        case 2: // JUNIOR
          return this.accommodations.filter(
            (acc) => [3, 4].includes(acc.id) // Solo TRIPLE o CUÁDRUPLE
          );
        case 3: // SUITE
          return this.accommodations.filter(
            (acc) => [1, 2, 3].includes(acc.id) // Solo SENCILLA, DOBLE o TRIPLE
          );
        default:
          return this.accommodations;
      }
    },
    showNotification(message, type = 'success') {
      this.notification = {
        show: true,
        message,
        type
      };
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },
    async saveHotel() {
      try {
        const totalRoomsSum = this.hotel.rooms.reduce(
          (sum, room) => sum + parseInt(room.quantity),
          0
        );

        if (totalRoomsSum !== parseInt(this.hotel.total_rooms)) {
          this.showNotification('La suma de habitaciones no coincide con el total especificado', 'error');
          return;
        }

        const combinations = new Set();
        for (const room of this.hotel.rooms) {
          const combo = `${room.room_type_id}-${room.accommodation_id}`;
          if (combinations.has(combo)) {
            this.showNotification('No se permiten combinaciones duplicadas de tipo y acomodación', 'error');
            return;
          }
          combinations.add(combo);
        }

        await api.post("/hotels", this.hotel);
        this.showNotification('Hotel creado exitosamente', 'success');
        await this.fetchHotels();
        this.resetForm();
      } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || 'Error al guardar el hotel';
        this.showNotification(message, 'error');
      }
    },
    resetForm() {
      this.hotel = {
        name: "",
        address: "",
        city: "",
        nit: "",
        total_rooms: "",
        rooms: [],
      };
    },
  },
  async mounted() {
    await Promise.all([
      this.fetchHotels(),
      this.fetchRoomTypes(),
      this.fetchAccommodations(),
    ]);
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
