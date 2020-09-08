import React from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Container, Toolbar, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton:{
    marginRight: theme.spacing(1)
  },
  title: {
    flexGrow: 1
  },
  image: {
    width: '1em',
    height: '1em'
  },
  ulStyles: {
    listStyleType: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  active: {
    color: "red"
  },
  liItem: {
    marginLeft: 20,
  }
}))

const Navbar = () => {
  const classes = useStyles();

  return (
      <AppBar position={"relative"}>
        <Container>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" className={classes.menuB}>
              <img src="./favicon.png" className={classes.image}/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>Agile Master</Typography>
            <Typography type={"title"} color={"inherit"} className={classes.flex}>
              <ul className={classes.ulStyles}>
                <li className={classes.liItem}><NavLink exact activeClassName={classes.active} to='/'>Сотрудники</NavLink></li>
                <li className={classes.liItem}><NavLink activeClassName={classes.active} to='/Team'>Команды</NavLink></li>
              </ul>
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
  );
}

export default Navbar;