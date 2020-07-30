const mongoose = require('mongoose')

const otpremnicaSema = new mongoose.Schema({
    brojOtpremnice: {
        type: Number,
        required: true
    },
    skladiste: String,
    dobavljac: {
        sifra: {
            type: Number,
            required: true
        },
        naziv: {
            type: String,
            required: true
        },
        pib: { // 9 cifara
            type: String,
            required: true
        }
    },
    stavke: [{ 
        redniBroj: {
            type: Number,
            required: true
        },
        naziv: {
            type: String,
            required: true
        },
        kolicina: Number,
        jm: String
    }]
})

module.exports = mongoose.model('otpremnicas', otpremnicaSema)
