/*TODO
1) Need to add more content to aid with interactions.
2) Need to use React Router to create a seamless flow.
3)Perhaps a step wise guide to interacting with thedapp. 
 */

import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>Welcome to the Market! To bridge funds via RenJS click Bridge. 
        <br/>Fill up and head over to Market to buy some goods!</h3>
      </div>
    );
  }
}

export default Home;

