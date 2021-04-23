const express = require('express')

const AppointmentForm = require('../controllers/appointmentForm.controller')

const Routes = express.Router()

Routes.put('/agendamento/:id', AppointmentForm.update)
Routes.delete('/agendamento/:id', AppointmentForm.remove)
Routes.get('/agendamento', AppointmentForm.index)
Routes.post('/agendamento', AppointmentForm.store)

module.exports = Routes
