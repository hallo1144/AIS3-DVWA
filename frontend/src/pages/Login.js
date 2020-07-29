import React, { Component } from 'react';
import NavBar from '../component/AppBar';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import './Login.css';

class Login extends Component{
    constructor(){
        super()
        this.state = {
            username: '',
            password: '',
            isLoggedin: false
        }

        axios.get('/api')
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
		const value = event.target.value;
		const name = event.target.name;
		
		this.setState({
		  [name]: value
		});
	}

    handleSubmit(event) {
        // console.log(this.state)
        event.preventDefault();
        
        axios.post("/api/login", 
            {username:this.state.username,
            password:this.state.password}
        ).then(res => {
            if(res.data){
                // console.log(res.data);
                this.setState( {isLoggedin: res.data.isLoggedin} );

                if(res.data.isLoggedin){
                    alert('welcome, ' + this.state.username + '!!');
                }
                else{
                    this.setState({username: '', password: ''});

                    if(res.data.status === "miss_acc_or_pass"){
                        alert("please type in username AND password :)");
                    }
                    else if(res.data.status === "acc_pass_too_long"){
                        alert("username or password is too long!! ( > 48 chars )");
                    }
                    else if(res.data.status === "server_err"){
                        alert("sorry, some errors occur when querying db");
                    }
                    else if(res.data.status === "username_dup"){
                        alert("sorry, there seems to be duplicate usernames in the db. please re-register this username.");
                    }
                    else if(res.data.status === "username_no_match"){
                        alert("username or password is incorrect!!");
                    }
                }
            }
            else
            {
                alert("sorry, some errors occur when posting data");
            }
        }).catch(error => {
            // console.log(error)
            alert("sorry, some errors occur when posting data");
        })
	}

    render(){
        if(this.state.isLoggedin === true)
        {
            return <Redirect to="/" />;
        
        }
        return (
        <div>
            <NavBar isloggedin={this.state.isloggedin} />
            <div id="Login_form_container">
                <form onSubmit={this.handleSubmit}>
                    <div id="Login_row">
                        <div id="Login_login_text_container">
                            <p id="Login_login_text">Login :)</p>
                        </div>
                        <div>
                            <div id="Login_row">
                                <p id="Login_label_text">請輸入帳號: </p>
                                <div id="Login_textfield_container">
                                    <TextField id="Login_textfield" name="username" type="text" onChange={this.handleInputChange} value={this.state.username} />
                                </div>
                            </div>
                            <div id="Login_row">
                                <p id="Login_label_text">請輸入密碼: </p>
                                <div id="Login_textfield_container">
                                    <TextField id="Login_textfield" name="password" type="password" onChange={this.handleInputChange} value={this.state.password} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="Login_button_container">
                        <Button id="Login_button" type="submit">submit</Button>
                    </div>
                </form>
            </div>
        </div>
        )
    }
}

export default Login;
