/* TODOs
1) Explore other options related to Fragments that solve the issue. 
2)  */

import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Bridge from "./Bridge.js";
import Header from "./Header";
import Shop from "./Shop";
import Home from "./Home";
import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Header />
          <Route exact path="/" component={Home}></Route>
          <Route path="/shop" component={Shop}></Route>
          <Route path="/bridge" component={Bridge}></Route>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;



