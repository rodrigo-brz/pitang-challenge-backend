const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema(
  {
    name: String,
    birthday: Date,
    schedulingDate: Date,
    check: Boolean,
  },
  {
    timestamps: true,
  }
)

// eslint-disable-next-line new-cap
const AppointmentModel = new mongoose.model('user', AppointmentSchema)

module.exports = AppointmentModel
