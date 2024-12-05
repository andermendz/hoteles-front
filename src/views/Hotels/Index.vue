<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Hoteles
      </h2>

      <form @submit.prevent="saveHotel" class="bg-white shadow-md rounded-lg p-6 sm:p-8">
        <!-- Información Básica -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div v-for="field in basicFields" :key="field.name">
            <label class="block text-sm font-medium text-gray-600 mb-1">
              {{ field.label }}
            </label>
            <input 
              v-model="hotel[field.name]" 
              :type="field.type || 'text'"
              class="w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :placeholder="field.placeholder"
              required
            />
          </div>
        </div>

        <!-- Configuración de Habitaciones -->
        <div class="bg-gray-50 rounded-md p-4 sm:p-6 mb-6 border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-base font-semibold text-gray-700">
              Configuración de Habitaciones
            </h3>
            <button 
              type="button" 
              @click="addRoom"
              class="flex items-center px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              + Habitación
            </button>
          </div>

          <transition-group 
            name="fade" 
            tag="div" 
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div 
              v-for="(room, index) in hotel.rooms" 
              :key="index" 
              class="bg-white border rounded-md p-4 shadow-sm relative transition"
            >
              <button 
                type="button" 
                @click="removeRoom(index)" 
                class="absolute top-2 right-2 text-red-500 hover:text-red-600 transition"
              >
                ×
              </button>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  Tipo de Habitación
                </label>
                <select 
                  v-model="room.room_type_id" 
                  class="w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option 
                    v-for="type in roomTypes" 
                    :key="type.id" 
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="mt-3">
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  Acomodación
                </label>
                <select 
                  v-model="room.accommodation_id" 
                  class="w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option 
                    v-for="acc in validAccommodations(room.room_type_id)" 
                    :key="acc.id" 
                    :value="acc.id"
                  >
                    {{ acc.name }}
                  </option>
                </select>
              </div>
              <div class="mt-3">
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  Cantidad
                </label>
                <input 
                  v-model="room.quantity" 
                  type="number"
                  class="w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
            </div>
          </transition-group>
        </div>

        <div class="flex justify-end">
          <button 
            type="submit" 
            class="px-5 py-2 rounded-md bg-green-500 text-white text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            Guardar Hotel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

 import api from '@/config/axios'

export default {
  data() {
    return {
      hotel: {
        name: "",
        address: "",
        city: "",
        nit: "",
        total_rooms: "",
        rooms: [],
      },
      roomTypes: [],
      accommodations: [],
      basicFields: [
        { name: "name", label: "Nombre del Hotel", placeholder: "Ingrese el nombre" },
        { name: "address", label: "Dirección", placeholder: "Ingrese la dirección" },
        { name: "city", label: "Ciudad", placeholder: "Ingrese la ciudad" },
        { name: "nit", label: "NIT", placeholder: "Ingrese el NIT" },
        { name: "total_rooms", label: "Número de Habitaciones", type: "number", placeholder: "Total habitaciones" },
      ],
    };
  },
  methods: {
      async fetchHotels() {
        const response = await api.get('/hotels')
        this.hotels = response.data
      },
      async fetchRoomTypes() {
        const response = await api.get('/room-types')
        this.roomTypes = response.data
      },
      async fetchAccommodations() {
        const response = await api.get('/accommodations')
        this.accommodations = response.data
      },
      addRoom() {
        this.hotel.rooms.push({
          room_type_id: '',
          accommodation_id: '',
          quantity: ''
        })
      },
      removeRoom(index) {
        this.hotel.rooms.splice(index, 1)
      },
      validAccommodations(roomTypeId) {
        if (!roomTypeId) return this.accommodations;
        
        // Validaciones según tipo de habitación
        switch (roomTypeId) {
          case 1: // ESTANDAR
            return this.accommodations.filter(acc => 
              [1, 2].includes(acc.id) // Solo SENCILLA o DOBLE
            );
          case 2: // JUNIOR
            return this.accommodations.filter(acc => 
              [3, 4].includes(acc.id) // Solo TRIPLE o CUÁDRUPLE
            );
          case 3: // SUITE
            return this.accommodations.filter(acc => 
              [1, 2, 3].includes(acc.id) // Solo SENCILLA, DOBLE o TRIPLE
            );
          default:
            return this.accommodations;
        }
      },
      async saveHotel() {
        try {
          // Validar que la suma total de habitaciones coincida
          const totalRoomsSum = this.hotel.rooms.reduce((sum, room) => 
            sum + parseInt(room.quantity), 0
          );
          
          if (totalRoomsSum !== parseInt(this.hotel.total_rooms)) {
            alert('La suma de habitaciones no coincide con el total especificado');
            return;
          }
  
          // Verificar combinaciones únicas de tipo-acomodación
          const combinations = new Set();
          for (const room of this.hotel.rooms) {
            const combo = `${room.room_type_id}-${room.accommodation_id}`;
            if (combinations.has(combo)) {
              alert('No se permiten combinaciones duplicadas de tipo y acomodación');
              return;
            }
            combinations.add(combo);
          }
  
          await api.post('/hotels', this.hotel);
          await this.fetchHotels();
          this.resetForm();
        } catch (error) {
          console.error(error);
          if (error.response?.data?.message) {
            alert(error.response.data.message);
          } else {
            alert('Error al guardar el hotel');
          }
        }
      },
      resetForm() {
        this.hotel = {
          name: '',
          address: '',
          city: '',
          nit: '',
          total_rooms: '',
          rooms: []
        }
      }
    },
    async mounted() {
      await Promise.all([
        this.fetchHotels(),
        this.fetchRoomTypes(),
        this.fetchAccommodations()
      ])
    }
  }
  </script>
  
  <style>
  .fade-enter-active, .fade-leave-active {
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
  </style>