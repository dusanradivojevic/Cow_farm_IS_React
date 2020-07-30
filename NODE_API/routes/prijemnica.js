const express = require('express')
const router = express.Router()
const prijemnicaModel = require('../models/prijemnicaModel')
const redirect = require('./loadbalancing')

// // Server pool
// const servers = [
//     { name:'server0', ip:'217.182.197.96' },
//     { name:'server1', ip:'172.217.17.142' },
//     { name:'server2', ip:'37.187.137.123' },
//     { name:'server3', ip:'87.116.154.195' },
//     { name:'server4', ip:'81.93.64.34' }
// ]

// GET ALL
router.get('/', redirect, async (req, res) => {
    try {
        const prijemnica = await prijemnicaModel.find()
        res.json(prijemnica)
    } catch (error) {
        res.status(500).json({ message: error.message }) 
        // 500 - error was entirely on the server side
    }
})

// GET ONE
router.get('/:broj', redirect, getPrijemnica, async (req, res) => {
    res.json(res.prijemnica)
})

// INSERT
router.post('/', redirect, async (req, res) => {
    const postoji = await prijemnicaModel.find({"brojPrijemnice" : req.body.brojPrijemnice})
    if (postoji.length > 0) {
        res.status(400).json({ message: "Prijemnica sa tim brojem već postoji!" })
        return;
    }

    const prijemnica = new prijemnicaModel({
        brojOtpremnice: req.body.brojOtpremnice,
        brojPrijemnice: req.body.brojPrijemnice,
        skladiste: req.body.skladiste,
        datum: req.body.datum,
        zaposleni: req.body.zaposleni,
        dobavljac: {
            sifra: req.body.dobavljac.sifra,
            naziv: req.body.dobavljac.naziv,
            pib: req.body.dobavljac.pib
        },
        stavke: req.body.stavke,
        ukupanIznos: req.body.ukupanIznos
    })

    try {
        const nova_prijemnica = await prijemnica.save()
        res.status(201).json({message : "Prijemnica je uspešno sačuvana!"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }    
})

// UPDATE
router.patch('/:broj', redirect, getPrijemnica, async (req, res) => {
    if(req.body.brojOtpremnice) {
        res.prijemnica[0].brojOtpremnice = req.body.brojOtpremnice
    }
    if(req.body.brojPrijemnice) {
        res.prijemnica[0].brojPrijemnice = req.body.brojPrijemnice
    }
    if(req.body.skladiste) {
        res.prijemnica[0].skladiste = req.body.skladiste
    }
    if(req.body.datum) {
        res.prijemnica[0].datum = req.body.datum
    }
    if(req.body.dobavljac) {
        res.prijemnica[0].dobavljac = req.body.dobavljac
    }
    if(req.body.stavke.length > 0) {
        res.prijemnica[0].stavke = req.body.stavke
    }
    if(req.body.zaposleni) {
        res.prijemnica[0].zaposleni = req.body.zaposleni
    }
    if(req.body.ukupanIznos) {
        res.prijemnica[0].ukupanIznos = req.body.ukupanIznos
    }

    try {
        const azuriranaPrijemnica = await res.prijemnica[0].save()
        res.json({"message" : "Prijemnica je uspešno ažurirana!"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE
router.delete('/:broj', redirect, getPrijemnica, async (req, res) => {
    try {
        await res.prijemnica[0].remove()
        res.json({ message: `Prijemnica je uspešno obrisana!` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Middleware
async function getPrijemnica(req, res, next){
    let prijemnica
    let query = {"brojPrijemnice" : req.params.broj}
    try {
        prijemnica = await prijemnicaModel.find(query)
        if(prijemnica == null) {
            return res.status(404).json({ message: 'Prijemnica nije pronadjena.' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.prijemnica = prijemnica 
    next()
}

// function redirect(req, res, next) {
//     const id = req.requestId;

//     let index = stringToHash(id); // requestId (string) -> number (Int32)
//     index = numberToOneDigit(index); // any integer -> one digit number
//     index = serverIndex(index); // one digit number -> one number from 0 
//                                 // to number of available servers

//     let chosenServer = servers[index];
//     console.log(`Request with id: ${id} is redirected to: ${chosenServer.name} (${chosenServer.ip})`);
//     res.server = chosenServer;

//     next();
// }

// // Hash functions 
// function stringToHash(string) {                   
//     var hash = 0; 
      
//     if (string.length == 0) return hash; 
      
//     for (i = 0; i < string.length; i++) { 
//         char = string.charCodeAt(i); 
//         hash = ((hash << 5) - hash) + char; 
//         hash = hash & hash; 
//     } 
      
//     return hash; 
// } 

// function numberToOneDigit(number) {
//     let num = number > 0 ? number : -1 * number;

//     if (num < 10) return num;

//     let digitSum = 0;
//     while(num > 0) {
//         digitSum += num % 10;
//         num = Math.trunc(num / 10);
//     }

//     let oneNumber = digitSum;
//     while(oneNumber > 9) {
//         oneNumber = Math.trunc(oneNumber % 10);
//     }

//     return oneNumber;
// }

// function serverIndex(number) {
//     return number < servers.length ? number : number % servers.length;    
// }

module.exports = router