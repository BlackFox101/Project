import React from "react";
import {NavLink} from "react-router-dom";
import {AppBar, Container, IconButton, Toolbar, Typography, Box} from "@material-ui/core";
import s from "./NavMenu.module.css";

const Link = (props) => (
  <NavLink className={s.menu_button} activeClassName={s.active} to={props.Url}>{props.Title}</NavLink>
);

const NavMenu = () => (
  <header>
    <AppBar position={"relative"}>
      <Container>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <img className={s.icon} src="favicon.png" alt={"favicon"}/>
          </IconButton>
          <Typography variant="h6" className={s.title}>Agile Master</Typography>
          <Box mr={10}>
            <Link Url="/People" Title="People"/>
            <Link Url="/Team" Title="Team"/>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  </header>
);

export default NavMenu;
