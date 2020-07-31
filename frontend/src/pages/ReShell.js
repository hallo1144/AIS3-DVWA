import React, { Component } from 'react';
import NavBar from '../component/AppBar';
import axios from 'axios';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import './ReShell.css';

// import { Link } from 'react-router-dom';

class ReShell extends Component{
    constructor(){
        super();
        
        this.state = {
            acount: "",
            password: "",
            password_confirm: "",
            isRegistered: false,
            file: null,
            filename: "",
            fileSelected: false,
            isloggedin: false,
            pay: ""
        };

        axios.get('/api').then(res => {
            console.log(res)
            this.setState({isloggedin: res.data.isloggedin});
        }).catch(err => {
            alert('sorry, backend server seems to have some errors');
            console.log(err);
        })

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
		const value = event.target.value;
		const name = event.target.name;
		
		this.setState({[name]: value});
	}

    handleSubmit(event) {
		event.preventDefault();
        // console.log(this.state);

        let buff = new Buffer(this.state.pay);
        let base64 = buff.toString('base64');

        axios.post("/api/reshell",
            {pay: base64}
        ).then(res => {
            if(res.data){
                console.log(res.data);
            }
            else{
                alert("sorry, some errors occur when posting data");
            }
        })
	}

    render(){
        return (
        <div>
            <NavBar isloggedin={this.state.isloggedin} />
            <div id="ReShell_root_container">
                <div id="ReShell_form_container">
                    <form onSubmit={this.handleSubmit}>
                        <div id="ReShell_row">
                            <div id="ReShell_login_text_container">
                                <p id="ReShell_login_text">ReShell :)</p>
                            </div>
                            <div>
                                <div id="ReShell_row">
                                    <p id="ReShell_label_text">請輸入payload: </p>
                                    <div id="ReShell_textfield_container">
                                        <TextField id="ReShell_textfield" name="pay" type="text" onChange={this.handleInputChange}  />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="ReShell_button_container">
                            <Button id="ReShell_submit_button" type="submit">submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}

export default ReShell;