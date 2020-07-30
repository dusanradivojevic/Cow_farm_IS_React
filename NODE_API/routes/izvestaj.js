const express = require('express')
const router = express.Router()
const izvestajModel = require('../models/izvestajModel')
const redirect = require('./loadbalancing')

// GET ALL
router.get('/', redirect, async (req, res) => {
    try {
        const izvestaji = await izvestajModel.find()
        res.json(izvestaji)
    } catch (error) {
        res.status(500).json({ message: error.message }) 
        // 500 - error was entirely on the server side
    }
})

// GET ONE
router.get('/:id', redirect, getIzvestaj, async (req, res) => {
    res.json(res.izvestaj)
})

// INSERT
router.post('/', redirect, async (req, res) => {
    const izvestaj = new izvestajModel({
        fiskalnaGodina: req.body.fiskalnaGodina,
        datumDonosenjaOdluke: req.body.datumDonosenjaOdluke,
        datumStanjaNaDan: req.body.datumStanjaNaDan,
        iznos: req.body.iznos,
        vlasnik: req.body.vlasnik
    })

    try {
        const novi_izvestaj = await izvestaj.save()
        // res.status(201).json(novi_izvestaj)
        res.status(201).json({"message" : "Izveštaj je uspešno sačuvan!"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }    
})

// UPDATE
// patch apdejtuje samo jednu proslednjenu vrednost dok put apdejtuje sve na objektu
router.patch('/:id', redirect, getIzvestaj, async (req, res) => {
    if(req.body.fiskalnaGodina) {
        res.izvestaj.fiskalnaGodina = req.body.fiskalnaGodina
    }
    if(req.body.datumDonosenjaOdluke) {
        res.izvestaj.datumDonosenjaOdluke = req.body.datumDonosenjaOdluke
    }
    if(req.body.datumStanjaNaDan) {
        res.izvestaj.datumStanjaNaDan = req.body.datumStanjaNaDan
    }
    if(req.body.iznos) {
        res.izvestaj.iznos = req.body.iznos
    }
    if(req.body.vlasnik) {
        res.izvestaj.vlasnik = req.body.vlasnik
    }

    try {
        const azuriranIzvestaj = await res.izvestaj.save()
        // res.json(azuriranIzvestaj)
        res.json({"message" : "Izveštaj je uspešno ažuriran!"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE
router.delete('/:id', redirect, getIzvestaj, async (req, res) => {
    try {
        await res.izvestaj.remove()
        res.json({ message: `Izveštaj je uspešno obrisan!` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// middleware
async function getIzvestaj(req, res, next){
    let izvestaj
    try {
        izvestaj = await izvestajModel.findById(req.params.id)
        if(izvestaj == null) {
            return res.status(404).json({ message: 'Izvestaj nije pronadjen.' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.izvestaj = izvestaj // da bismo mogli da koristimo u gornjim funkcijama
    next()
}

module.exports = router