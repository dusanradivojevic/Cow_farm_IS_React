import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import {
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import '../css/Izvestaj.css';

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

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    button: {
        margin: theme.spacing(1),
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));  
 
// Prikaz detalja jednog izvestaja
function IzvestajPresentation(props) {
    // const [rb, setRb] = useState(-1)
    const [id, setID] = useState("")
    const [vlasnik, setVlasnik] = useState("")
    const [fiskalnaGodina, setFiskalnaGodina] = useState(2020)
    const [datumDonosenjaOdluke, setDatumDonosenjaOdluke] = useState(new Date())
    const [datumStanjaNaDan, setDatumStanjaNaDan] = useState(new Date())
    const [iznos, setIznos] = useState(0)
    const [check, setCheck] = useState(false)
    const [open, setOpen] = useState('');
    const [tipModala, setTipModala] = useState("");
    const [tekstModala, setTekstModala] = useState("");
    const classes = useStyles();

    // Za datume
    const handleDateChange = (event) => {
        const {name, value} = event.target

        // console.log("name ", name, " value ", value, " formatiranje ", new Date(value));
        name === "datumDonosenjaOdluke" ? setDatumDonosenjaOdluke(new Date(value)) : setDatumStanjaNaDan(new Date(value))

        // event.preventDefault();
    };

    // Za checkbox
    const handleCheckbox = (event) => {
        setCheck(!check)
    }

    // Za fiskalnuGodinu, iznos i vlasnika
    const handleChange = (event) => {
        const {name, value, type} = event.target;

        if (type === "number") {
            name === "iznos" ? setIznos(value) : setFiskalnaGodina(value)
        } else {
            setVlasnik(value)
        }
    }

    useEffect(() => {
        if(props.id === undefined) return;

        setID(props.id)
        // setRb(props.rb)
        setVlasnik(props.vlasnik)
        setDatumDonosenjaOdluke(props.datumDonosenjaOdluke)
        setDatumStanjaNaDan(props.datumStanjaNaDan)
        setFiskalnaGodina(props.fiskalnaGodina)
        setIznos(props.iznos)
    }, [props])

    const openModal = (tekst, tip) => {
        setOpen(true)
        setTipModala(tip)
        setTekstModala(tekst)
    }
    const closeModal = () => {
        setOpen(false)
    }

    const formValidation = () => {
        
        if ( isNaN(new Date(datumDonosenjaOdluke).getDay()) ) {
            return {status: "err", msg: "Neispravan datum donošenja odluke!"};
        }

        if ( isNaN(new Date(datumStanjaNaDan).getDay()) ) {
            return {status: "err", msg: "Neispravan datum stanja na dan!"};
        }
        
        let hasNumber = /\d/;
        if ( (vlasnik.trim()).length < 5 || hasNumber.test(vlasnik) ) {
            return {status: "err", msg: `Ime i prezime vlasnika ne sme sadržati brojeve 
                    i mora imati najmanje 5 karaktera!`};
        }

        if ( !isFinite(fiskalnaGodina) || fiskalnaGodina < 1900  
            || fiskalnaGodina > (new Date().getFullYear() + 1) ) {
            
            return {status: "err", msg: "Neispravna fiskalna godina!"};   
        }

        if ( !isFinite(iznos) || iznos < 0 ) {
            return {status: "err", msg: "Neispravan iznos!"};  
        }

        return {status: "ok", msg: ""};
    }

    const submitHandler = () => {
        const validation = formValidation()

        if(validation.status !== "ok") {
            openModal(validation.msg, "error");
            return;
        } else {
            let newIzvestaj = {};
            newIzvestaj.id = id;
            newIzvestaj.vlasnik = vlasnik;
            newIzvestaj.fiskalnaGodina = fiskalnaGodina;
            newIzvestaj.datumDonosenjaOdluke = datumDonosenjaOdluke;
            newIzvestaj.datumStanjaNaDan = datumStanjaNaDan;
            newIzvestaj.iznos = iznos;
            newIzvestaj.check = check
            ocistiPolja();
            props.sacuvajIzvestaj(newIzvestaj);
        }        
    }

    const ocistiPolja = () => {
        setVlasnik('')
        setDatumDonosenjaOdluke(new Date())
        setDatumStanjaNaDan(new Date())
        setFiskalnaGodina(2020)
        setIznos(0)
        setCheck(false)
    }

    return (
        <div className="izvestajForm">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div>
                    <TextField 
                        margin="normal"
                        variant="outlined" 
                        name="datumDonosenjaOdluke"
                        id="date"
                        label="Datum donošenja odluke"
                        type="date"
                        value={formatDate(datumDonosenjaOdluke)}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleDateChange}
                    />
                    <TextField
                        margin="normal"
                        variant="outlined" 
                        name="datumStanjaNaDan"
                        id="date"
                        label="Datum stanja na dan"
                        type="date"
                        value={formatDate(datumStanjaNaDan)}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleDateChange}
                    />
                </div>
                <div>
                    <TextField                 
                        id="standard-basic" label="Fiskalna godina" type="number" margin="normal"                    
                        name="fiskalnaGodina" value={fiskalnaGodina} variant="outlined" 
                        className={classes.textField}
                        onChange={handleChange}
                    />
                    <TextField 
                        id="standard-basic" label="Iznos" type="number" margin="normal"
                        name="iznos" value={iznos} className={classes.textField} variant="outlined" 
                        onChange={handleChange}
                    />
                </div>
                {/* <FormGroup>                 */}
                    <div className='imePrezime'>
                        <TextField 
                            id="standard-basic" label="Ime i prezime vlasnika" type="text" 
                            name="vlasnik" value={vlasnik} className={classes.textField}
                            onChange={handleChange} variant="outlined" 
                        />
                    </div>
                    <div className='checkBoxSacuvaj'>
                        <FormControlLabel
                            control={<Checkbox checked={check} onChange={handleCheckbox} name="check" />}
                            label="Sačuvaj kao novi izveštaj"
                        />
                    </div>
                {/* </FormGroup> */}
                <br/>
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    className='sacuvajIzvestajBtn'
                    startIcon={<SaveIcon />}
                    onClick={submitHandler}
                > 
                    Sačuvaj izveštaj
                </Button>
            </MuiPickersUtilsProvider>
            
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

export default IzvestajPresentation;