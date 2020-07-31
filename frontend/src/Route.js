// /src/pages.js
import React from 'react';
import Home from "./pages/Home";
import EasterEgg from "./pages/EasterEgg";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Message from "./pages/Message";
import Null from "./pages/Null";
import ReShell from "./pages/ReShell";

const Home_page = () => {
    return <Home/>;
};
const Easter_egg = () => {
    return <EasterEgg />;
};
const Login_page = () => {
    return <Login/>;
};
const Register_page = () => {
    return <Register/>
};
const Profile_page = () => {
    return <Profile/>;
};
const Message_page = () => {
    return <Message/>;
};
const Logout_page = () => {
    return <Logout/>;
};
const ReShell_page = () => {
    return <ReShell/>;
}
const Null_page = () => {
    return <Null />;
};

export { Home_page, Easter_egg, Login_page, Register_page, Profile_page, Message_page, Logout_page, ReShell_page, Null_page };