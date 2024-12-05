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
            if (!roomTypeId) return this.accommodations
            
            const roomType = this.roomTypes.find(type => type.id === roomTypeId)
            if (!roomType) return this.accommodations

            
            return this.accommodations.filter(acc => {
                return true
            })
        },
        async saveHotel() {
            try {
                await api.post('/hotels', this.hotel)
                await this.fetchHotels()
                this.resetForm()
            } catch (error) {
                console.error(error)
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
