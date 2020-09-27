import React from "react";
import IzvestajForm from "./IzvestajForm";
import Table from "./IzvestajTable";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

// const api_path = "http://localhost:7150";

class Izvestaj extends React.Component {
  constructor() {
    super();
    this.state = {
      id: "",
      vlasnik: "",
      fiskalnaGodina: 0,
      datumDonosenjaOdluke: new Date().toLocaleDateString(),
      datumStanjaNaDan: new Date().toLocaleDateString(),
      iznos: 0,
      sviIzvestaji: [],
      izabrani_rb: -1,
      izabrani_id: "",
      izabrani_vlasnik: "",
      izabrani_fiskalnaGodina: 0,
      izabrani_datumDonosenjaOdluke: new Date().toLocaleDateString(),
      izabrani_datumStanjaNaDan: new Date().toLocaleDateString(),
      izabrani_iznos: 0,
      openModal: "",
      modalTekst: "",
      modalTip: "",
    };
  }

  createData(
    rb,
    id,
    vlasnik,
    fiskalnaGodina,
    datumDonosenjaOdluke,
    datumStanjaNaDan,
    iznos
  ) {
    return {
      rb,
      id,
      vlasnik,
      fiskalnaGodina,
      datumDonosenjaOdluke,
      datumStanjaNaDan,
      iznos,
    };
  }

  ucitajSveIzvestaje = () => {
    fetch(`/izvestaj`)
      .then((response) => response.json())
      .then((response) => {
        let svi = [];
        Array.prototype.push.apply(svi, response);
        this.setState({
          sviIzvestaji: svi,
        });
      });
  };

  ucitajIzvestaj = (id) => {
    fetch(`/izvestaj/${id}`)
      .then((response) => response.json())
      .then((response) => {
        const izvestaj = response;
        this.setState({
          id: izvestaj._id,
          vlasnik: izvestaj.vlasnik,
          fiskalnaGodina: izvestaj.fiskalnaGodina,
          datumDonosenjaOdluke: new Date(
            izvestaj.datumDonosenjaOdluke
          ).toLocaleDateString(),
          datumStanjaNaDan: new Date(
            izvestaj.datumStanjaNaDan
          ).toLocaleDateString(),
          iznos: izvestaj.iznos,
        });
      })
      .catch((err) => console.log("Error: ", err));
  };

  componentDidMount() {
    this.ucitajSveIzvestaje();
    setTimeout(this.pripremiIzvestajeZaTabPrikaz, 1000);
  }

  pripremiIzvestajeZaTabPrikaz = () => {
    let svi = [];
    this.state.sviIzvestaji.forEach((e, index) =>
      svi.push(
        this.createData(
          index + 1,
          e._id,
          e.vlasnik,
          e.fiskalnaGodina,
          e.datumDonosenjaOdluke,
          e.datumStanjaNaDan,
          e.iznos
        )
      )
    );

    this.setState({
      sviIzvestaji: svi,
    });
  };

  izabraniIzvestaj = (izvestajIzTabele) => {
    this.setState({
      izabrani_rb: izvestajIzTabele.rb,
      izabrani_id: izvestajIzTabele.id,
      izabrani_vlasnik: izvestajIzTabele.vlasnik,
      izabrani_fiskalnaGodina: izvestajIzTabele.fiskalnaGodina,
      izabrani_datumDonosenjaOdluke: new Date(
        izvestajIzTabele.datumDonosenjaOdluke
      ),
      izabrani_datumStanjaNaDan: new Date(izvestajIzTabele.datumStanjaNaDan),
      izabrani_iznos: izvestajIzTabele.iznos,
    });
  };

  openModal = (tekst, tip) => {
    this.setState({
      openModal: true,
      modalTip: tip,
      modalTekst: tekst,
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  sacuvajIzvestaj = (izvestaj) => {
    // Kreiranje izvestaja
    let newIzvestaj = {};
    newIzvestaj.vlasnik = izvestaj.vlasnik;
    newIzvestaj.fiskalnaGodina = izvestaj.fiskalnaGodina;
    newIzvestaj.datumDonosenjaOdluke = izvestaj.datumDonosenjaOdluke;
    newIzvestaj.datumStanjaNaDan = izvestaj.datumStanjaNaDan;
    newIzvestaj.iznos = izvestaj.iznos;

    // Priprema zahteva
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(newIzvestaj);
    let requestOptions;
    let path;

    // Ukoliko je cekirana opcija za kreiranje novog izvestaja
    if (izvestaj.check) {
      path = `/izvestaj`;
      requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
    } else {
      if (
        izvestaj.id === null ||
        izvestaj.id === undefined ||
        izvestaj.id.trim() === ""
      ) {
        this.openModal(
          `Iz tabele izaberite izveštaj koji želite da ažurirate, 
                    ili označite čuvanje novog izveštaja!`,
          "error"
        );
      }
      // Patch request
      path = `/izvestaj/${izvestaj.id}`;
      requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
    }

    fetch(path, requestOptions)
      .then((response) => response.json())
      .then((result) => this.openModal(result.message, "success"))
      .then(() => {
        // Refresh
        // this.setState({
        //     izabrani_rb : -1,
        //     izabrani_id : "",
        //     izabrani_vlasnik : "",
        //     izabrani_fiskalnaGodina : 0,
        //     izabrani_datumDonosenjaOdluke : (new Date()).toLocaleDateString(),
        //     izabrani_datumStanjaNaDan : (new Date()).toLocaleDateString(),
        //     izabrani_iznos : 0
        // })
        this.ucitajSveIzvestaje();
        setTimeout(this.pripremiIzvestajeZaTabPrikaz, 500);
      })
      .catch(() => {
        this.openModal("Neuspešno čuvanje izveštaja!", "error");
      });
  };

  obrisiIzvestaj = (izvestaj) => {
    // Priprema zahteva
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    let path = `/izvestaj/${izvestaj.id}`;

    fetch(path, requestOptions)
      .then((response) => response.json())
      .then((result) => this.openModal(result.message, "success"))
      .then(() => {
        // Refresh
        this.ucitajSveIzvestaje();
        setTimeout(this.pripremiIzvestajeZaTabPrikaz, 500);
        // this.setState({
        //     izabrani_rb : -1,
        //     izabrani_id : "",
        //     izabrani_vlasnik : "",
        //     izabrani_fiskalnaGodina : 0,
        //     izabrani_datumDonosenjaOdluke : (new Date()).toLocaleDateString(),
        //     izabrani_datumStanjaNaDan : (new Date()).toLocaleDateString(),
        //     izabrani_iznos : 0
        // })
      })
      .catch((error) => {
        this.openModal("Neuspešno brisanje izveštaja!", "error");
      });
  };

  render() {
    return (
      <div className="izvestajPage">
        <Table
          rows={this.state.sviIzvestaji}
          vratiIzvestaj={this.izabraniIzvestaj}
          obrisiIzvestaj={this.obrisiIzvestaj}
        />
        {this.state.izabrani_rb !== -1 ? (
          <IzvestajForm
            rb={this.state.izabrani_rb}
            id={this.state.izabrani_id}
            vlasnik={this.state.izabrani_vlasnik}
            fiskalnaGodina={this.state.izabrani_fiskalnaGodina}
            datumDonosenjaOdluke={this.state.izabrani_datumDonosenjaOdluke}
            datumStanjaNaDan={this.state.izabrani_datumStanjaNaDan}
            iznos={this.state.izabrani_iznos}
            sacuvajIzvestaj={this.sacuvajIzvestaj}
          />
        ) : (
          <IzvestajForm sacuvajIzvestaj={this.sacuvajIzvestaj} />
        )}
        {this.state.openModal ? (
          <Snackbar
            open={this.openModal}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={5000}
            onClose={this.closeModal}
          >
            <Alert severity={this.state.modalTip} onClose={this.closeModal}>
              {this.state.modalTekst}
            </Alert>
          </Snackbar>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default Izvestaj;
