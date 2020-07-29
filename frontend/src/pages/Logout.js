import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Logout extends Component{
    constructor(){
        super();
        
        this.state = {finish: false};
        axios.get('/api/logout').then(() =>{
            this.setState({finish: true})
        }).catch(err => {
            console.log(err)
        })
    }

    render(){
        if(this.state.finish)
            return <Redirect to="/" />;
        else
            return <div></div>;
    }
}

export default Logout;