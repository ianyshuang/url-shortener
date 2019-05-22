const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  original: {
    type: String,
    required: true
  },
  shortened: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Url', urlSchema)