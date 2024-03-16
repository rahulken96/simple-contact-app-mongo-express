const mongoose = require('mongoose')

// Membuat Schema
const contactSchema = {
  nama: {
    type: String,
    required: true,
  },
  noHP: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
}
const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact