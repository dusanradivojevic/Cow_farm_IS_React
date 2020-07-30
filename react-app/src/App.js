import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Izvestaj from './components/IzvestajPage';
import Prijemnica from './components/PrijemnicaPage';
import Nav from './components/Navigation';
import Home from './components/HomePage';
import Footer from './components/Footer'


function App() {
  return (
    <Router>
      <div className="App">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/izvestaj" component={Izvestaj} />
            <Route path="/prijemnica" component={Prijemnica} />
          </Switch>
          <Footer />
      </div>
    </Router>
  );
}

export default App;
