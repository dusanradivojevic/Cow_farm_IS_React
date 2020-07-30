const mongoose = require('mongoose')

const izvestajSchema = new mongoose.Schema({
    fiskalnaGodina: {
        type: Number,
        required: true
    },
    datumDonosenjaOdluke: {
        type: Date,
        required: true
    },
    datumStanjaNaDan: {
        type: Date,
        required: true
    },
    iznos: {
        type: Number,
        required: true
    },
    vlasnik: {
        type: String,
        required: true,
        default: "Dusan Radivojevic"
    }
})

// naziv tabele u bazi
module.exports = mongoose.model('godisnji_finansijski_izvestajs', izvestajSchema)