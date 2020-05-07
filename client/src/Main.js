import React from 'react';
import logo from './logo.svg';
import Home from "./components/Home";
import MangaInfo from "./components/MangaInfo";
import Chapter from "./components/Chapter";
import {BrowserRouter, Switch, Route,Link} from "react-router-dom";
import Navbar from './components/Navbar';

function Main() {
  return (
    <React.Fragment>
     <BrowserRouter>
     <Navbar />
       <Switch>
         <Route exact path="/" render={(props) => <Home {...props}  /> } />
         <Route exact path="/manga/:manga" render={(props) => <MangaInfo {...props}  /> } />
         <Route exact path="/manga/:manga/chapter/:chapter" render={(props) => <Chapter {...props}  /> } />
       </Switch>
     </BrowserRouter>
    </React.Fragment>
  );
}

export default Main;
