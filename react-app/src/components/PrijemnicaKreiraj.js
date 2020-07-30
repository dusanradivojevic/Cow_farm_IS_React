import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
// Tabela
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import api_path from '../env';

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    }, 
}));

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    // console.log("datum:::", [year, month, day].join('-'));
    return [year, month, day].join('-');
}

function PrijemnicaKreiraj() {
    const [otpremnica, setOtpremnica] = useState({brojOtpremnice:'', stavke:[]});
    const [brojOtpremnice, setBrojOtpremnice] = useState('');
    const [brojPrijemnice, setBrojPrijemnice] = useState('');
    const [dobavljac, setDobavljac] = useState({naziv:'', sifra:'', pib:''})
    const [skladiste, setSkladiste] = useState('')
    const [datum, setDatum] = useState(new Date())
    const [prijemnica, setPrijemnica] = useState({stavke:[]});
    // Zaposleni
    const [sifraZap, setSifraZap] = useState('')
    const [imeZap, setImeZap] = useState('')
    const [prezimeZap, setPrezimeZap] = useState('')
    // Stavka za izmenu
    const [prikaziTreciRed, setPrikaziTreciRed] = useState(false)
    const [redniBroj, setRedniBroj] = useState(0);
    const [naziv, setNaziv] = useState('');
    const [kolicina, setKolicina] = useState(0);
    const [jm, setJm] = useState('');
    const [cena, setCena] = useState(0);
    const [rabat, setRabat] = useState(0);
    const [iznos, setIznos] = useState(0);
    // Tabela i ostalo
    const classes = useStyles();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(-1);
    const isSelected = (num) => selected === num;
    // Tabela prijemnica
    const [rowsPerPage2, setRowsPerPage2] = useState(5);
    const [page2, setPage2] = useState(0);
    const [selected2, setSelected2] = useState(-1);
    const isSelected2 = (num) => selected2 === num;
    // Alert
    const [open, setOpen] = useState('');
    const [tipModala, setTipModala] = useState("");
    const [tekstModala, setTekstModala] = useState("");
    
    const openModal = (tekst, tip) => {
        setOpen(true)
        setTipModala(tip)
        setTekstModala(tekst)
    }
    const closeModal = () => {
        setOpen(false)
    }

    const handleBrojOtp = (event) => {
        setBrojOtpremnice(event.target.value); 
    }

    const handleSkladiste = (event) => {
        setSkladiste(event.target.value)
    }

    const handleBrojPrm = (event) => {
        setBrojPrijemnice(event.target.value);
    }

    const handleDatum = (event) => {
        setDatum(new Date(event.target.value))
    }

    const vratiOtpremnicu = () => {
        if (brojOtpremnice === '') {
            openModal("Morate uneti broj otpremnice!", 'error')
            return;
        }

        fetch(`${api_path}/otpremnica/${brojOtpremnice}`)
        .then(response => response.json())
        .then(result => {
            if (result.length !== 0){
                setOtpremnica(result[0]);

                result[0].stavke.length <= 5 ?
                setRowsPerPage(result[0].stavke.length)  
                :
                setRowsPerPage(5)
            }
            else {
                openModal('Ne postoji otpremnica sa tim brojem!', 'error')
                setOtpremnica({brojOtpremnice:'', stavke:[]})
                setPrijemnica({stavke:[]})
                setSkladiste('')
                setDobavljac({naziv:'', sifra:'', pib:''})
                setDatum(new Date())
            }
        })
        .catch(error => console.log('error', error));        
    }

    useEffect(() => {
        if (otpremnica.dobavljac === undefined) return;

        // Punjenje forme
        setDobavljac(otpremnica.dobavljac)
        setSkladiste(otpremnica.skladiste)   

    }, [otpremnica])

    useEffect(() => {
        setIznos(Number(cena) * ((100 - Number(rabat))/100))
    }, [cena, rabat])    

    /// TABELA
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, otpremnica.stavke.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangePage2 = (event, newPage) => {
        setPage2(newPage);
    };

    const handleClick = (event, num) => {
        event.target.type === "checkbox" ?
            event.target.checked ? setSelected(num) : setSelected(-1) 
            :
            isSelected(num) ? setSelected(-1) : setSelected(num)
    };
    const handleClick2 = (event, num) => {
        event.target.type === "checkbox" ?
            event.target.checked ? setSelected2(num) : setSelected2(-1) 
            :
            isSelected2(num) ? setSelected2(-1) : setSelected2(num)
    };

    const prikaziStavku = () => {
        const stavka = otpremnica.stavke.filter(row => row.redniBroj === selected);       

        if (stavka[0] !== undefined) {
            setPrikaziTreciRed(true)
            setRedniBroj(stavka[0].redniBroj)
            setNaziv(stavka[0].naziv);
            setKolicina(stavka[0].kolicina);
            setJm(stavka[0].jm);
        } else {
          openModal("Morate izabrati stavku!", 'error');
          return;
        }
    }
    
    const potvrdiIzmene = () => {
        let novaStavka = {};
        novaStavka.redniBroj = redniBroj;
        novaStavka.naziv = naziv;
        novaStavka.kolicina = kolicina;
        novaStavka.jm = jm;
        novaStavka.cena = cena;
        novaStavka.rabat = rabat;
        novaStavka.iznos = iznos;

        const postoji = prijemnica.stavke.filter(row => row.redniBroj === novaStavka.redniBroj);
        if (postoji.length > 0) {
            openModal("Ne možete da unesete stavku koja već postoji!", 'error');
            return;
        }

        let prm = prijemnica;
        prm.stavke.push(novaStavka)
        setPrijemnica(prm)
        setRowsPerPage2(prm.stavke.length)
    }

    const obrisiStavku = () => {
        const stavka = prijemnica.stavke.filter(row => row.redniBroj === selected2);
    
        if (stavka[0] !== undefined) {
            let prm = prijemnica;
            prm.stavke = prijemnica.stavke.filter(row => row.redniBroj !== selected2)
            setPrijemnica(prm)
            setRowsPerPage2(prm.stavke.length)
        } else {
            openModal("Morate izabrati stavku!", 'error');
            return;
        }
    }
    /// END TABELA
    // Zaposleni
    const vratiZaposlenog = () => {
        if (sifraZap === '') {
            openModal("Morate uneti šifru zaposlenog!", 'error')
            return;
        }

        fetch(`${api_path}/zaposleni/${sifraZap}`)
        .then(response => response.json())
        .then(result => {
            if (result.length !== 0){
                setSifraZap(result[0].sifra);
                setImeZap(result[0].ime);
                setPrezimeZap(result[0].prezime);
            }           
            else {
                openModal("Ne postoji zaposleni sa tom šifrom!", 'error');
                setSifraZap('');
                setImeZap('');
                setPrezimeZap('');
            }                       
        })
        .catch(error => console.log('error', error)); 
    }
    // End Zaposleni
    const vratiPrijemnicu = (broj) => {
        if (broj === '') {
            return {status : "err", message : "Unesite broj prijemnice!"}
        }

        fetch(`${api_path}/prijemnica/${broj}`)
        .then(response => response.json())
        .then(result => {
            if(result.length > 0) {
                return {status : "err", message : "Prijemnica sa tim brojem već postoji!"}
            }
        })
        .catch((error) => openModal('error', error)); 

        return {status: "ok"}
    }

    // SACUVAJ PRIJEMNICU
    const validacijaPrijemnice = () => {
        if (otpremnica.stavke.length === 0) 
            return {status : "err", message : "Izaberite otpremnicu!"}        

        let v = vratiPrijemnicu(brojPrijemnice);
        if (v.status === 'err') {
            return v;
        }

        if (skladiste.trim() === '' || skladiste === null || skladiste === undefined){
            return {status : "err", message : "Morate uneti skladište!"}
        }

        if (brojOtpremnice.trim() === '' || brojOtpremnice === null || brojOtpremnice === undefined){
            return {status : "err", message : "Morate uneti broj otpremnice!"}
        }

        // Dobavljac ne mora jer ce da ga uhvati ranije

        if ( isNaN(new Date(datum).getDay()) ) return {status: "err", msg: "Neispravan datum!"};
        
        if (otpremnica.stavke.length !== prijemnica.stavke.length) 
            return {status: "err", message: "Morate uneti sve stavke iz otpremnice!"};

        if (imeZap === '')
            return {status: "err", message: "Unesite zaposlenog!"};

        return {status: "ok"};
    }

    const sacuvajPrijemnicu = () => {
        let v = validacijaPrijemnice();
        if (v.status !== "ok") {
            openModal(v.message, 'error');
            return;
        }

        let prm = {};
        prm.dobavljac = dobavljac;
        let zap = {};
        zap.sifra = sifraZap;
        zap.ime = imeZap;
        zap.prezime = prezimeZap;
        prm.zaposleni = zap;
        prm.brojOtpremnice = brojOtpremnice;
        prm.brojPrijemnice = brojPrijemnice;
        prm.skladiste = skladiste;
        prm.datum = datum;
        prm.stavke = prijemnica.stavke;
        
        let ukIznos = 0;
        prijemnica.stavke.forEach(el => ukIznos = ukIznos + el.iznos);
        prm.ukupanIznos = ukIznos;

        // POST METODA
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(prm);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${api_path}/prijemnica`, requestOptions)
        .then(response => response.json())
        .then(result => openModal(result.message, 'success'))
        .catch(() => openModal("Neuspešno čuvanje prijemnice!", 'error'));
    }

    // END SACUVAJ PRIJEMNICU
    return (        
        <div className='prijemnicaPage'> 
            <div className='prviRed'>           
                <div className="pronadjiOtpremnicu">
                    <label>Otpremnica</label><br/>
                    <TextField id="outlined-basic" label="Broj otpremnice" variant="outlined" 
                        margin='normal' type="number" className="sifraOtpremniceInput"
                        onChange={handleBrojOtp} name="sifraOtpremnice" value={brojOtpremnice}
                    /><br/><br/>
                    <Button variant="contained" className="pronadjiOtpBtn" margin='none'
                        onClick={vratiOtpremnicu}
                    >
                        Pronađi otpremnicu 
                    </Button> 
                    <p></p>
                </div>            
                <div className="sredina">
                    <TextField id="outlined-basic" label="Broj prijemnice" variant="outlined" 
                        margin='dense' type="text" 
                        name="brojPrijemnice" value={brojPrijemnice} onChange={handleBrojPrm}/><br/>
                    <TextField id="outlined-basic" label="Skladište" variant="outlined" 
                        margin='dense' type="text" onChange={handleSkladiste}
                        name="skladiste" value={skladiste}
                    /><br/>
                    <TextField id="outlined-basic" label="Broj otpremnice" variant="outlined" 
                        margin='dense' type="text"  disabled
                        name="brojOtpremnice" value={otpremnica.brojOtpremnice}
                    /><br/>
                    <TextField 
                        margin="dense"
                        name="datum"
                        id="date"
                        label="Datum"
                        type="date"
                        value={formatDate(datum)}
                        variant="outlined"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleDatum}
                    />
                </div>
                <div className="dobavljac">
                    <label>Dobavljač</label><br/>
                    <TextField id="outlined-basic" label="Šifra dobavljača" variant="outlined" 
                        margin='dense' type="text"  disabled
                        name="sifraDobavljaca" value={dobavljac.sifra}
                    /><br/>
                    <TextField id="outlined-basic" label="Naziv dobavljača" variant="outlined" 
                        margin='dense' type="text" disabled
                        name="nazivDobavljaca" value={dobavljac.naziv}
                    /><br/>
                    <TextField id="outlined-basic" label="PIB dobavljača" variant="outlined" 
                        margin='dense' type="text" disabled
                        name="pibDobavljaca" value={dobavljac.pib}
                    /><br/>
                </div>    
            </div>    
        {/* // Tabela stavki otpremnice */} 
            <label className='tableLabel'>Stavke otpremnice</label>
            <div className="prijemnicaTabela">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple dense table">
                    <TableHead>
                        <TableRow>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>RB</TableCell>
                        <TableCell align="right">Naziv</TableCell>
                        <TableCell align="right">Količina</TableCell>
                        <TableCell align="right">Jedinica mere</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>            
                        {otpremnica.stavke.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                        // {console.log(row)}
                        const isItemSelected = isSelected(row.redniBroj);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                            <TableRow 
                            hover
                            onClick={(event) => handleClick(event, row.redniBroj)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            // tabIndex={-1}
                            key={row.redniBroj}
                            selected={isItemSelected}
                            >
                            <TableCell padding="checkbox">
                                <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                                /> 
                            </TableCell>
                            <TableCell component="th" scope="row" id={labelId} >
                                {row.redniBroj}
                            </TableCell>
                            <TableCell align="right">{row.naziv}</TableCell>
                            <TableCell align="right">{row.kolicina}</TableCell>
                            <TableCell align="right">{row.jm}</TableCell>
                            </TableRow>
                        )
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53* emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={otpremnica.stavke.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    // onChangeRowsPerPage={handleChangeRowsPerPage}
                    labelRowsPerPage='Redova po strani:'
                    nextIconButtonText='Sledeća strana'
                    backIconButtonText='Prethodna strana'
                />
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    className={classes.button}
                    onClick={prikaziStavku}
                > 
                    Izaberi stavku
                </Button>
            </div>
            {/* Izmena stavki otpremnice */}
            {
                prikaziTreciRed ?
                <div>             
                    <div className="treciRed">
                        <TextField id="outlined-basic" label="Naziv" variant="outlined" 
                            margin='dense' type="text" 
                            name="nazivStavke" value={naziv} onChange={(e) => setNaziv(e.target.value)}
                        />
                        <TextField id="outlined-basic" label="Količina" variant="outlined" 
                            margin='dense' type="number" 
                            name="kolicinaStavke" value={kolicina} onChange={(e) => setKolicina(e.target.value)}
                        />
                        <TextField id="outlined-basic" label="Jedinica mere" variant="outlined" 
                            margin='dense' type="text" 
                            name="jmStavke" value={jm} onChange={(e) => setJm(e.target.value)}
                        />
                        <TextField id="outlined-basic" label="Cena" variant="outlined" 
                            margin='dense' type="number" 
                            name="cenaStavke" value={cena} onChange={(e) => setCena(e.target.value)}
                        />
                        <TextField id="outlined-basic" label="Rabat" variant="outlined" 
                            margin='dense' type="number" helperText="U procentima"
                            name="rabatStavke" value={rabat} onChange={(e) => setRabat(e.target.value)}
                        />                
                        <TextField id="outlined-basic" label="Iznos" variant="outlined" 
                            margin='dense' type="number" disabled 
                            name="iznosStavke" value={iznos} 
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="default"
                        size="medium"
                        className={classes.button}
                        onClick={potvrdiIzmene}
                    > 
                        Potvrdi izmene
                    </Button>
                </div>
                :
                <div></div>
            }
            {/* // Tabela stavki nove prijemnice */} 
            <label className='tableLabel'>Stavke prijemnice</label>
            <div className="prijemnicaTabela">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple dense table">
                    <TableHead>
                        <TableRow>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>RB</TableCell>
                        <TableCell align="right">Naziv</TableCell>
                        <TableCell align="right">Količina</TableCell>
                        <TableCell align="right">Jedinica mere</TableCell>
                        <TableCell align="right">Cena</TableCell>
                        <TableCell align="right">Rabat</TableCell>
                        <TableCell align="right">Iznos</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>            
                        {prijemnica.stavke.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2)
                        .map((row, index) => {
                        const isItemSelected = isSelected2(row.redniBroj);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                            <TableRow 
                                hover
                                onClick={(event) => handleClick2(event, row.redniBroj)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                // tabIndex={-1}
                                key={row.redniBroj}
                                selected={isItemSelected}
                            >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                /> 
                            </TableCell>
                            <TableCell component="th" scope="row" id={labelId} >
                                {row.redniBroj}
                            </TableCell>
                            <TableCell align="right">{row.naziv}</TableCell>
                            <TableCell align="right">{row.kolicina}</TableCell>
                            <TableCell align="right">{row.jm}</TableCell>
                            <TableCell align="right">{row.cena}</TableCell>
                            <TableCell align="right">{row.rabat}</TableCell>
                            <TableCell align="right">{row.iznos}</TableCell>
                            </TableRow>
                        )
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53* emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={prijemnica.stavke.length}
                    rowsPerPage={rowsPerPage2}
                    page={page2}
                    onChangePage={handleChangePage2}
                    labelRowsPerPage='Redova po strani:'
                    nextIconButtonText='Sledeća strana'
                    backIconButtonText='Prethodna strana'
                />                
                <IconButton aria-label="delete" onClick={obrisiStavku}>
                    <DeleteIcon />
                </IconButton>
                <br/><label>Obriši stavku prijemnice</label>
            </div>
            {/* Zaposleni */}
            <div className="petiRed">
                <div className="pronadjiZaposlenog">
                    <label>Zaposleni</label>
                    <div className="pretragaZap">
                        <TextField id="outlined-basic" label="Šifra zaposlenog" variant="outlined" 
                            margin='normal' type="number" className="sifraZaposlenogInput"
                            onChange={(e) => setSifraZap(e.target.value)} name="sifraOtpremnice" value={sifraZap}
                        />
                        <Button variant="contained" className="pronadjiZapBtn" margin='none'
                            onClick={vratiZaposlenog}
                        >
                            Pronađi zaposlenog 
                        </Button> 
                    </div>
                </div>
                <TextField id="outlined-basic" label="Prijemnicu kreirao" variant="outlined" 
                    margin='normal' type="text" className="imeZaposlenogInput" disabled
                    name="imeZaposlenog" value={imeZap + ' ' + prezimeZap}
                />
            </div>   

            <Button variant="contained" className="sacuvajPrmBtn" margin='none'
                onClick={sacuvajPrijemnicu} color="secondary"
            >
                Sačuvaj prijemnicu
            </Button> 

            {
                open ? 
                <Snackbar 
                    open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={5000} onClose={closeModal} 
                >
                    <Alert 
                        severity={tipModala}
                        onClose={closeModal}                            
                    >
                        {tekstModala}
                    </Alert>
                </Snackbar>
                :
                <div></div>         
            }
        </div>
    )
}

export default PrijemnicaKreiraj;