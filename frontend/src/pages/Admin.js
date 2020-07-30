import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import NavBar from '../component/AppBar';
import "./Admin.css";

class Admin extends Component{
    constructor(){
        super();
        
        this.state = {
            isLocalhost: false,
            userList: []
        };
        axios.get('/api/admin').then(res => {
            let data = res.data;
            console.log(res);
            if (!data.status) {
                this.setState({
                    isLocalhost: data.isLocalhost,
                    userList: data.userList
                });
            } else {
                alert(data.status);
            }
        }).catch(err => {
            alert('sorry, backend server seems to have some errors');
            console.log(err);
        })
    }

    render(){
        return (
            <div>
                <NavBar isloggedin={false} />
                <div class="page">
                { this.state.isLocalhost ? 
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Avatar</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Visit Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.userList.map((user) => (
                            <TableRow key={user.username}>
                                <TableCell><img src={'/api/image/' + user["img"]} alt="ERROR" /></TableCell>
                                <TableCell>{user["username"]}</TableCell>
                                <TableCell>{user["visit_time"]}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    : 
                    <p>Sorry, only user from localhost is allowed to access admin panel.</p>
                }
                </div>
            </div>
        )
    }
}

export default Admin;
