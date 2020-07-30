import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import PrijemnicaKreiraj from './PrijemnicaKreiraj';
import PrijemnicaIzmeni from './PrijemnicaIzmeni';
import '../css/Prijemnica.scss'


function Prijemnica() {
    const [izbor, setIzbor] = useState('kreiraj')
    const [kreirajColor, setKreirajColor] = useState('secondary')
    const [izmeniColor, setIzmeniColor] = useState('')

    const kreiraj = () => {
        setIzbor('kreiraj')
        setKreirajColor('secondary')
        setIzmeniColor('default')
    }

    const izmeni = () => {
        setIzbor('izmeni')
        setKreirajColor('default')
        setIzmeniColor('secondary')
    }

    return (
        <div>
            <div className='izborButtons'>
                <Button variant="contained" color={kreirajColor} onClick={kreiraj}>Kreiraj prijemnicu</Button>
                <Button variant="contained" color={izmeniColor} onClick={izmeni}>Izmeni prijemnicu</Button>
            </div>
            {
                /// U zavisnosti od cekirane opcije renderuje komponenta za kreiranje
                // odnosno izmenu prijemnice      
                izbor === 'kreiraj' ?
                <PrijemnicaKreiraj /> : <PrijemnicaIzmeni />                
            }       
        </div>
    )
}

export default Prijemnica;