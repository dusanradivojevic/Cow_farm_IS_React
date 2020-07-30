import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import '../css/Izvestaj.css';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
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

export default function SimpleTable(props) {
  const classes = useStyles();
  const [selected, setSelected] = useState(-1);
  const isSelected = (num) => selected === num;
  const [open, setOpen] = useState('');
  const [tipModala, setTipModala] = useState("");
  const [tekstModala, setTekstModala] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setSelected(-1)
  }, [props.osveziTabelu])

  const openModal = (tekst, tip) => {
    setTipModala(tip)
    setTekstModala(tekst)
    setOpen(true)
  }
  const closeModal = () => {
      setOpen(false)
  }

  const handleClick = (event, num) => {
    event.target.type === "checkbox" ?
      event.target.checked ? setSelected(num) : setSelected(-1) 
      :
      isSelected(num) ? setSelected(-1) : setSelected(num)
  };

  const prikaziIzvestaj = () => {
    const izvestaj = props.rows.filter(row => row.rb === selected);

    if (izvestaj[0] !== undefined) {
      props.vratiIzvestaj(izvestaj[0]);
    } else {
      openModal("Morate izabrati izveštaj!", 'error');
      return;
    }
  }

  const obrisiIzvestaj = () => {
    const izvestaj = props.rows.filter(row => row.rb === selected);

    if (izvestaj[0] !== undefined) {
      props.obrisiIzvestaj(izvestaj[0]);
    } else {
      openModal("Morate izabrati izveštaj!", "error");
      return;
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="izvestajTabela">
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>RB</TableCell>
              <TableCell align="right">Fiskalna godina</TableCell>
              <TableCell align="right">Datum donosenja odluke</TableCell>
              <TableCell align="right">Datum stanja na dan</TableCell>
              <TableCell align="right">Iznos</TableCell>
              <TableCell align="right">Vlasnik</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>            
            {props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              // {console.log(row)}
              const isItemSelected = isSelected(row.rb);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow 
                  hover
                  onClick={(event) => handleClick(event, row.rb)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  // tabIndex={-1}
                  key={row.rb}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                    /> 
                  </TableCell>
                  <TableCell component="th" scope="row" id={labelId} >
                    {row.rb}
                  </TableCell>
                  <TableCell align="right">{row.fiskalnaGodina}</TableCell>
                  <TableCell align="right">{(new Date(row.datumDonosenjaOdluke)).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{(new Date(row.datumStanjaNaDan)).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{row.iznos}</TableCell>
                  <TableCell align="right">{row.vlasnik}</TableCell>
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
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage='Redova po strani:'
        nextIconButtonText='Sledeća strana'
        backIconButtonText='Prethodna strana'
      />

      <IconButton aria-label="delete" onClick={obrisiIzvestaj} >
        <DeleteIcon />
      </IconButton>

      <Button
        variant="contained"
        color="default"
        size="medium"
        className={classes.button}
        onClick={prikaziIzvestaj}
      > 
        Prikaži podatke izveštaja
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
  );
}
