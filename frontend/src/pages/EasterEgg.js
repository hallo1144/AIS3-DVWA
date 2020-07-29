import React, { Component } from 'react';
import NavBar from '../component/AppBar';
import Aluka from '../component/Aluka';
import axios from 'axios';
import './EasterEgg.css';

// import { Link } from 'react-router-dom';
// import Button from '@material-ui/core/Button';
// import Footer from "../component/Footer";

class EasterEgg extends Component{
    constructor(){
        super();
        
        this.state = {isloggedin: false};
        axios.get('/api').then(res => {
            console.log(res)
            this.setState({isloggedin: res.data.isloggedin});
        }).catch(err => {
            alert('sorry, backend server seems to have some errors');
            console.log(err);
        })
    }

    render(){
        return (
        <div>
            <NavBar isloggedin={this.state.isloggedin} />
            <div id="pic">
                <Aluka />
            </div>
        </div>
        )
    }
}

export default EasterEgg;
