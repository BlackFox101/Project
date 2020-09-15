import React from 'react';
import NavMenu from "./components/Nav/NavMenu";
import People from "./components/People/People";
import CreatePerson from "./components/People/Create";
import Team from "./components/Team/Team";
import {Route} from "react-router";
import {Container} from "@material-ui/core";
import "./App.css"

const App = (props) => {
  const delPerson = (id) => {
    console.log('По кнопке кликнули' + id);
    fetch("api/People/" + id, {
      method: 'DELETE'
    }).then(response => response.text())
      .catch(() => console.log('ошибка'));
  }

  return (
    <div>
      <NavMenu/>
      <Container>
        <Route exact path='/People' history={props.history} render={ () => <People delPerson={delPerson}/>}/>
        <Route path='/People/Create' render={ () => <CreatePerson />} />

        <Route exact path='/Team' render={ () => <Team />} />
      </Container>
    </div>
  );
}

export default App;