require('dotenv').config()

const requestID = require('request-id/express');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

// database
mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("Connected to database successfully."))

// middleware
app.use(express.json()) // omogucava prihvatanje json-a
app.use(cors())
app.use(requestID())

// rutiranje godisnjeg finansijskog izvestaja
const izvestajRuter = require('./routes/izvestaj')
app.use('/izvestaj', izvestajRuter)

// rutiranje otpremnice
const otpremnicaRuter = require('./routes/otpremnica')
app.use('/otpremnica', otpremnicaRuter)

// rutiranje prijemnice
const prijemnicaRuter = require('./routes/prijemnica')
app.use('/prijemnica', prijemnicaRuter)

// rutiranje zaposlenih
const zaposleniRuter = require('./routes/zaposleni')
app.use('/zaposleni', zaposleniRuter)

const port = 7150
app.listen(port, () => console.log(`Server started on port ${port}`))