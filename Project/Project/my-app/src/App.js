import React from "react";
import NavMenu from "./components/Nav/NavMenu";
import People from "./components/People/People";
import Team from "./components/Team/Team";
import {Container} from "@material-ui/core";
import {Route} from "react-router"
import {BrowserRouter} from "react-router-dom";

const App = () => {
  let people = [
    {Id: 1, Name: 'Alexei'},
    {Id: 2, Name: 'Ivan'},
    {Id: 3, Name: 'Andrey'},
    {Id: 4, Name: 'Sasha'}
  ]

  return (
    <BrowserRouter>
      <NavMenu/>
      <Container>
        <Route path='/People' render={ () => <People people={people}/>}/>
        <Route path='/Team' render={ () => <Team />} />
      </Container>
    </BrowserRouter>
  );
}

export default App;
