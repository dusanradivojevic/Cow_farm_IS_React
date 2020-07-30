const express = require('express')
const router = express.Router()
const zaposleniModel = require('../models/zaposleniModel')
const redirect = require('./loadbalancing')

// GET ALL
router.get('/', redirect, async (req, res) => {
    try {
        const zaposleni = await zaposleniModel.find()
        res.json(zaposleni)
    } catch (error) {
        res.status(500).json({ message: error.message }) 
        // 500 - error was entirely on the server side
    }
})

// GET ONE
router.get('/:sifra', redirect, getZaposleni, async (req, res) => {
    res.json(res.zaposleni)
})

// INSERT
router.post('/', redirect, async (req, res) => {
    const postoji = await zaposleniModel.find({"sifra" : req.body.sifra})
    if (postoji.length > 0) {
        // console.log(postoji);
        res.status(400).json({ message: "Zaposleni sa tom šifrom već postoji!" })
        return;
    }

    const zaposleni = new zaposleniModel({
        sifra: req.body.sifra,
        ime: req.body.ime,
        prezime: req.body.prezime
    })

    try {
        const novi_zaposleni = await zaposleni.save()
        // res.status(201).json(novi_izvestaj)
        res.status(201).json({"message" : "Zaposleni je uspešno sačuvan!"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }    
})

// UPDATE
router.patch('/:sifra', redirect, getZaposleni, async (req, res) => {
    if(req.body.sifra) {
        res.zaposleni[0].sifra = req.body.sifra
    }
    if(req.body.ime) {
        res.zaposleni[0].ime = req.body.ime
    }
    if(req.body.prezime) {
        res.zaposleni[0].prezime = req.body.prezime
    }

    try {
        const azuriraniZaposleni = await res.zaposleni[0].save()
        // res.json(azuriranIzvestaj)
        res.json({"message" : "Zaposleni je uspešno ažuriran!"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE
router.delete('/:sifra', redirect, getZaposleni, async (req, res) => {
    try {
        await res.zaposleni[0].remove()
        res.json({ message: `Zaposleni je uspešno obrisan!` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// middleware
async function getZaposleni(req, res, next){
    let zaposleni
    let query = {"sifra" : req.params.sifra}
    try {
        zaposleni = await zaposleniModel.find(query)
        if(zaposleni == null) {
            return res.status(404).json({ message: 'Zaposleni nije pronadjen.' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.zaposleni = zaposleni // da bismo mogli da koristimo u gornjim funkcijama
    next()
}

module.exports = router