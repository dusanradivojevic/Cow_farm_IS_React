const mongoose = require('mongoose')

const prijemnicaSema = new mongoose.Schema({
    brojOtpremnice: {
        type: Number,
        required: true
    },
    brojPrijemnice: {
        type: Number,
        required: true
    },
    skladiste: String,
    datum: Date,
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
        jm: String,
        cena: Number,
        rabat: Number,
        iznos: Number
    }],
    ukupanIznos: Number,
    zaposleni: {
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
    }
})

module.exports = mongoose.model('prijemnicas', prijemnicaSema)
