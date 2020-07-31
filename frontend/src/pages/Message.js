import React, { Component } from 'react';
import NavBar from '../component/AppBar';
import axios from 'axios';
import './Message.css';
import { TextField, Paper } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import ScrollArea from 'react-scrollbar';



class Message extends Component{
    constructor(){
        super();
        this.state = {
            message: {},
            newmessage: '',
            isloggedin: false
        };

        axios.get('/api').then(res => {
            // console.log(res)
            this.setState({isloggedin: res.data.isloggedin});

            axios.get('/api/message').then(res => {
                if(!res.data || !res.data.success){
                    alert('sorry, backend server meets some error.');
                    window.location = "/";
                }
                this.setState({message: res.data.message});
                console.log(res.data.message)
            }).catch(err => {
                alert('sorry, backend server meets some error.');
                // console.log(err)
                window.location = "/";
            })
        }).catch(err => {
            alert('sorry, backend server seems to have some errors');
            // console.log(err);
        })
        
        this.sendMessage = this.sendMessage.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    sendMessage(){
        if(this.state.newmessage === '')
        {
            alert('Type in something, will you?');
            return;
        }
        
        axios.post("/api/sendMessage", {message: this.state.newmessage}).then(res => {
            if(!res.data){
                alert('sorry, some errors occur when posting data')
                return;
            }
            else if(!res.data.success){
                if(res.data.status === "not_logged_in"){
                    alert('Please login first :(');
                }
                else if(res.data.status === "no_message"){
                    alert('Type in something, will you?');
                }
            }
            else{
                window.location.pathname = '/message';
            }
            
        }).catch(err => {
            alert('sorry, some errors occur when posting data')
        })
    }

    handleInputChange(event) {
		const value = event.target.value;
		
		this.setState({
		  newmessage: value
		});
	}

    deleteMessage = param => event => {
        var f = window.confirm('Are you sure you want to remove this message permanently?');
        if(!f){
            return;
        }

        axios.post('/api/deleteMessage', {id: param}).then(res => {
            if(!res.data){
                alert('sorry, some errors occur when posting data');
                return;
            }
            else if(!res.data.success){
                alert('fail deleting message :(');
            }
            else{
                alert('delete successfully!');
                window.location.pathname = '/message';
            }
        }).catch(err => {
            alert('sorry, backend server seems to have some errors');
            console.log(err);
        })
    }

    render(){
        let messages = [];

        for (let i in this.state.message) {
            var message = this.state.message[i].message.split('\n');
            let messagehtml = [];
            for(var j = 0; j < message.length; j++){
                let dangerXss = {"html": "<label id='Messages_message_text'>"+message[j]+"</label>"}
                messagehtml.push(<div dangerouslySetInnerHTML={{_html:dangerXss}}></div>);
                if(j !== message.length - 1)
                    messagehtml.push(<br />);
            }
            messages.push(
                <Paper id="Message_messages_column">
                    <div id="Message_messages_column_left_container">
                        <div id="Message_messages_column_image_container">
                            <img id="Message_messages_column_image" src={'/api/image/' + this.state.message[i].imgpath} alt="ERROR" />
                        </div>
                        <div id="Message_messages_column_title_container">
                            <label id="Messages_message_username">{this.state.message[i].username + ' says:'}</label>
                            <br />
                            {messagehtml}
                        </div>
                    </div>
                    {this.state.message[i].own ? 
                        <div id="Message_messages_column_title_delete_button">
                            <Fab color="primary" id={i} aria-label="edit" onClick={this.deleteMessage(i)}>
                                <DeleteIcon />
                            </Fab>
                        </div>
                        : <div></div>
                    }
                </Paper>)
        }
        
        const myScrollbar = {
            width: '30vw',
            height: '30vw',
        };

        return (
        <div>
            <NavBar isloggedin={this.state.isloggedin} />
            <div id="Message_container">
                <div id="Message_logo_container">
                    <p id="Message_logo_text">Message Board</p>
                </div>
                <div id="Message_message_box_container">
                    <div
                        id="Message_messages_container">
                        <ScrollArea
                            speed={0.8}
                            className="area"
                            contentClassName="content"
                            horizontal={false}
                            style={myScrollbar}
                        >
                                {messages}
                        </ScrollArea>
                    </div>
                    <div id="Message_message_box_send_container">
                        <Paper id="Message_message_box_send_textfield_container">
                            <TextField id="Message_message_box_send_textfield"
                                multiline variant="outlined"
                                fullWidth={true} size="medium"
                                inputProps={{
                                    style: {
                                        fontSize: 24,
                                        lineHeight: '24px'
                                    }
                                }}
                                rowsMax={4}
                                onChange={this.handleInputChange}
                                placeholder="say something ..." />
                        </Paper>
                        <Fab color="secondary" id="Message_message_box_send_button" aria-label="edit" onClick={this.sendMessage}>
                            <SendIcon />
                        </Fab>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Message;