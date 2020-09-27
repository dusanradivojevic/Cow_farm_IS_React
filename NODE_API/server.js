require("dotenv").config();

const requestID = require("request-id/express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

// database
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database successfully."));

// middleware
app.use(express.json()); // omogucava prihvatanje json-a
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    noSniff: false,
  })
);
app.use(requestID());

// pokretanje react klijentske aplikacije
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "../react-app/build/index.html"));
});

// rutiranje godisnjeg finansijskog izvestaja
const izvestajRuter = require("./routes/izvestaj");
app.use("/api/izvestaj", izvestajRuter);

// rutiranje otpremnice
const otpremnicaRuter = require("./routes/otpremnica");
app.use("/api/otpremnica", otpremnicaRuter);

// rutiranje prijemnice
const prijemnicaRuter = require("./routes/prijemnica");
app.use("/api/prijemnica", prijemnicaRuter);

// rutiranje zaposlenih
const zaposleniRuter = require("./routes/zaposleni");
app.use("/api/zaposleni", zaposleniRuter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../react-app/build")));
}

const port = process.env.PORT || 7150;
app.listen(port, () => console.log(`Server started on port ${port}`));
