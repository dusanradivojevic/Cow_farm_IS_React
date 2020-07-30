const mongoose = require('mongoose')

const zaposleniSema = new mongoose.Schema({
    sifra: {
        type: Number,
        required: true
    },
    ime: {
        type: String,
        required: true
    },
    prezime: {
        type: String,
        required: true
    }
})

// naziv tabele u bazi
module.exports = mongoose.model('zaposlenis', zaposleniSema)