<template>
    <div>
      <h2>Hoteles Decameron</h2>
      <div class="hotel-form">
        <form @submit.prevent="saveHotel">
          <input v-model="hotel.name" placeholder="Nombre del Hotel" required>
          <input v-model="hotel.address" placeholder="Dirección" required>
          <input v-model="hotel.city" placeholder="Ciudad" required>
          <input v-model="hotel.nit" placeholder="NIT" required>
          <input v-model="hotel.total_rooms" type="number" placeholder="Número de Habitaciones" required>
          
          <div v-for="(room, index) in hotel.rooms" :key="index">
            <select v-model="room.room_type_id" required>
              <option v-for="type in roomTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
            <select v-model="room.accommodation_id" required>
              <option v-for="acc in validAccommodations(room.room_type_id)" :key="acc.id" :value="acc.id">
                {{ acc.name }}
              </option>
            </select>
            <input v-model="room.quantity" type="number" placeholder="Cantidad" required>
            <button type="button" @click="removeRoom(index)">Eliminar</button>
          </div>
          <button type="button" @click="addRoom">Agregar Habitación</button>
          <button type="submit">Guardar Hotel</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/config/axios'
  
  export default {
    data() {
      return {
        hotels: [],
        hotel: {
          name: '',
          address: '',
          city: '',
          nit: '',
          total_rooms: '',
          rooms: []
        },
        roomTypes: [],
        accommodations: []
      }
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
  