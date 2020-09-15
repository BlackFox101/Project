import React from 'react';
import NavMenu from "./components/Nav/NavMenu";
import People from "./components/People/People.jsx";
import Team from "./components/Team/Team";
import {Route} from "react-router";
import {Container} from "@material-ui/core";
import { FetchData } from "./components/FetchData";
import { Counter } from "./components/Counter";
import "./App.css"

const App = () => {
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
        <Route path='/People' render={ () => <People delPerson={delPerson}/>}/>
        <Route path='/Team' render={ () => <Team />} />
        <Route path='/Counter' render={ () => <Counter />} />
        <Route path='/Fetch-data' render={ () => <FetchData />} />
      </Container>
    </div>
  );
}

export default App;