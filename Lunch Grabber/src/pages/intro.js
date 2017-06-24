import React from 'react';
import { Link } from 'react-router';



class Intro extends React.Component {

  render(){
    return(


    <div className="Intro">
      <h1 style={{display: 'flex', justifyContent: 'center'}}> Welcome to Lunch Grabber</h1>
      <ul>
        <li style={{display: 'flex', justifyContent: 'center'}}><Link to="location">Add a Location</Link></li>
        <li style={{display: 'flex', justifyContent: 'center'}}><Link to="suggestions">Find a Place to Lunch!</Link></li>
      </ul>
    </div>
  )
  }
}

export default Intro
