import React from 'react';
import pic from '../img/404.jpg'; // Tell Webpack this JS file uses this image
import { makeStyles } from '@material-ui/styles';
// import { positions } from '@material-ui/system';

const useStyles = makeStyles({
    pic: {
        height:540,
        width:960,
        paddingTop:10
    },
  });

function Header() {
  // Import result is the URL of your image
  const classes = useStyles();
  return <img className={classes.pic} src={pic} alt="So bad QQ" />;
}

export default Header;