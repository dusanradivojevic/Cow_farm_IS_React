import React from 'react';
import '../css/Navigation.css'
import { Link } from 'react-router-dom';
import logo from '../assets/cow_head.png';

function Nav() {

    return (
        <nav>
            <Link to='/' >
                <img src={logo} alt="Logo" className="nav-logo" ></img>
            </Link>
            <ul className="nav-links">
                <Link to='/prijemnica' className="link" >
                    <li>Prijemnica za kravu</li>
                </Link>
                <Link to='/izvestaj' className="link" >
                    <li>Godišnji finansijski izveštaj</li>
                </Link>
            </ul>
        </nav>
    )
}

export default Nav;