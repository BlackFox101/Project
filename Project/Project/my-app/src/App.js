import React from 'react';
import NavMenu from "./components/Nav/NavMenu";
import People from "./components/People/People";
import CreatePerson from "./components/People/Create";
import Team from "./components/Team/Team";
import {Route} from "react-router";
import {Container} from "@material-ui/core";
import "./App.css"
import PersonDetails from "./components/People/Person";

const App = () => {
  return (
    <div>
      <NavMenu/>
      <Container>
        <Route exact path='/People' render={ () => <People />}/>
        <Route path='/People/Create' render={ () => <CreatePerson />} />
        <Route path='/People/Details' render={ () => <PersonDetails  />} />

        <Route exact path='/Team' render={ () => <Team />} />
      </Container>
    </div>
  );
}

export default App;