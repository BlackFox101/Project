import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Person from './components/Person/Person';
import Team from './components/Team/Index';
import { BrowserRouter, Route } from "react-router-dom";
import { Container } from "@material-ui/core";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Container fixed>
        <div className='app-wrapper-content'>
          <Route exact path='/' component={Person}/>
          <Route path='/Team' component={Team}/>
        </div>
      </Container>
    </BrowserRouter>
  );
}

export default App;
