const mongoose = require('mongoose')
mongoose.set('strict', false)
mongoose.connect('mongodb://127.0.0.1:27017/app-mongo')