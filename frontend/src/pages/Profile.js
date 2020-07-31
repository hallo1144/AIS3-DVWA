import React, { Component } from 'react';
import NavBar from '../component/AppBar';
import ImageUploader from 'react-images-upload';
import { Button, TextField, Paper } from '@material-ui/core';
import axios from 'axios';
import './Profile.css';

// const images = require.context('../upload/images', true);

class Profile extends Component{
    constructor() {
        super();

        this.state = {
            global_count: 0,
            personal_count: 0,
            file: null,
            filename: "",
            fileSelected: false,
            username: 'default user',
            isloggedin: false,
            editting: false,
            editText: "",
            text: window.localStorage.getItem("profileText") || "",
        }

        axios.get('/api').then(res => {
            this.setState({isloggedin: res.data.isloggedin});

            axios.get('/api/profile').then(res => {
                this.setState({
                    global_count: res.data.global_count,
                    personal_count: res.data.personal_count,
                    username: res.data.username,
                })
            }).catch(err => {
                alert('sorry, backend server seems to have some errors')
            })
        }).catch(err => {
            alert('sorry, backend server seems to have some errors');
            console.log(err);
        })
        
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
    }
    
    handleImageChange(picture){
        if(picture.length !== 0){
            this.setState({
                filename: picture[0].name,
                file: picture[0],
                fileSelected: true
            });
        }
        else{
            this.setState({
                filename: '',
                file: null,
                fileSelected: false
            })
        }
    }

    handleSubmit(event) {
        if(this.state.fileSelected){
            const data = new FormData();
            data.append('file', this.state.file);
            axios.post("/api/upload", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if(res.data.success){
                    alert('success!');
                    window.location.pathname = "/profile";
                }
                else if(res.data.status === "not_logged_in"){
                    alert('please login first!');
                }
                else if(res.data.status === "no_image_uploaded"){
                    alert("where is your image? QQ ");
                }
                else if(res.data.status === "not_an_image"){
                    alert("please upload IMAGE!!");
                }
                else if(res.data.status === "not_an_image"){
                    alert("sorry, some errors occur when uploading your image. please try it later.");
                }
            }).catch(err => {
                // console.log(err)
                alert("sorry, some errors occur when posting data");
            })
        }
    }

    handleEditChange(event) {
        this.setState({editText: event.target.value})
    }

    handleEdit() {
        this.setState(
            {
                editting: !this.state.editting,
                text: this.state.editText
            }
        );

        window.localStorage.setItem("profileText", this.state.editText);

        let buff = new Buffer(this.state.editText);
        let base64 = buff.toString('base64');

        if(this.state.editting)
        {            
            axios.post("/api/editprofile",
                {pay: base64}
            ).then(res => {
                if(res.data){
                    
                }
                else{
                    alert("sorry, some errors occur when posting data");
                }
            })
        }
    }

    render(){
        return (
        <div>
            <NavBar isloggedin={this.state.isloggedin} />
            <div id="Profile_container">
                <div id="Profile_image_container">
                    <img id="Profile_image" src={'/api/profileImage'} alt="ERROR" />
                    <br /><hr />
                    <div id="Profile_text_container" class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded">
                        <label id="Profile_self_username">
                            {this.state.username + '\'s self intro:'}
                        </label>
                        <br />
                        <label id="Profile_self_text">
                            &nbsp;&nbsp;&nbsp;&nbsp;{this.state.text}
                        </label>
                    </div>
                    <br />
                    <div id="Profile_edit_container">
                        <Paper id="Profile_edit_textfield_container">
                            {this.state.editting ? 
                                <TextField id="Profile_edit_textfield"
                                multiline variant="outlined"
                                fullWidth={true} size="medium"
                                inputProps={{
                                    style: {
                                        fontSize: 24,
                                        lineHeight: '24px'
                                    }
                                }}
                                rowsMax={4}
                                onChange={this.handleEditChange} />
                                :
                                <div></div>
                            }
                        </Paper>
                        {this.state.editting ? <br /> : <span></span>}
                        <Button id="Profile_edit_button" type="submit" onClick={this.handleEdit}>
                            {this.state.editting ? "save" : "edit"}
                        </Button>
                    </div>
                </div>
                <div id="Profile_content_container">
                    <label id="Profile_welcome_text">Welcome, {this.state.username}!!</label>
                    <h1 id="Profile_count_text">本網站已被瀏覽 {this.state.global_count} 次!!</h1>
                    <h1 id="Profile_count_text">您已造訪本網站 {this.state.personal_count} 次!!</h1>
                    <div id="Profile_image_upload_container">
                        <span id="Profile_image_upload_text">更改照片: </span>
                        <div id="Profile_image_upload_component_container">
                            <ImageUploader
                                withIcon={true}
                                buttonText='Choose images'
                                imgExtension={['.jpg', '.gif', '.png', '.jpeg', '.bmp']}
                                withPreview={true}
                                singleImage={true}
                                maxFileSize={12582912}
                                label={'Max file size: 12MB, ' + (this.state.fileSelected ? 'select ' + this.state.filename : 'no image selected')}
                                onChange={this.handleImageChange}
                            />
                            <Button id="Profile_image_upload_button" type="submit" onClick={this.handleSubmit}>submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Profile;
