import React, { Component } from 'react';
import NavBar from '../component/AppBar';
import NotFound from '../component/NotFound';
import axios from 'axios';
import './Null.css';

// import { Link } from 'react-router-dom';
// import Button from '@material-ui/core/Button';
// import Footer from "../component/Footer";

class Null extends Component{
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
                <NotFound />
            </div>
        </div>
        )
    }
}

export default Null;
