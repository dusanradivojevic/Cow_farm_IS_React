const express = require('express')
const router = express.Router()
const otpremnicaModel = require('../models/otpremnicaModel')
const redirect = require('./loadbalancing')

// GET ALL
router.get('/', redirect, async (req, res) => {
    try {
        const otpremnica = await otpremnicaModel.find()
        res.json(otpremnica)
    } catch (error) {
        res.status(500).json({ message: error.message }) 
        // 500 - error was entirely on the server side
    }
})

// GET ONE
router.get('/:broj', redirect, getOtpremnica, async (req, res) => {
    res.json(res.otpremnica)
})

// INSERT
router.post('/', redirect, async (req, res) => {
    const postoji = await otpremnicaModel.find({"brojOtpremnice" : req.body.brojOtpremnice})
    if (postoji.length > 0) {
        res.status(400).json({ message: "Otpremnica sa tim brojem već postoji!" })
        return;
    }

    const otpremnica = new otpremnicaModel({
        brojOtpremnice: req.body.brojOtpremnice,
        skladiste: req.body.skladiste,
        dobavljac: {
            sifra: req.body.dobavljac.sifra,
            naziv: req.body.dobavljac.naziv,
            pib: req.body.dobavljac.pib
        },
        stavke: req.body.stavke
    })

    try {
        const nova_otpremnica = await otpremnica.save()
        res.status(201).json({"message" : "Otpremnica je uspešno sačuvana!"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }    
})

// UPDATE
router.patch('/:broj', redirect, getOtpremnica, async (req, res) => {
    if(req.body.brojOtpremnice) {
        res.otpremnica[0].brojOtpremnice = req.body.brojOtpremnice
    }
    if(req.body.skladiste) {
        res.otpremnica[0].skladiste = req.body.skladiste
    }
    if(req.body.dobavljac) {
        res.otpremnica[0].dobavljac = req.body.dobavljac
    }
    if(req.body.stavke.length > 0) {
        res.otpremnica[0].stavke = req.body.stavke
    }

    try {
        const azuriranaOtpremnica = await res.otpremnica[0].save()
        res.json({"message" : "Otpremnica je uspešno ažurirana!"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE
router.delete('/:broj', redirect, getOtpremnica, async (req, res) => {
    try {
        await res.otpremnica[0].remove()
        res.json({ message: `Otpremnica je uspešno obrisana!` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// middleware
async function getOtpremnica(req, res, next){
    let otpremnica
    let query = {"brojOtpremnice" : req.params.broj}
    try {
        otpremnica = await otpremnicaModel.find(query)
        if(otpremnica == null) {
            return res.status(404).json({ message: 'Otpremnica nije pronadjena.' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.otpremnica = otpremnica 
    next()
}

module.exports = router