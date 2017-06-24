import React from 'react';
import { Link } from 'react-router';
import { Button } from 'reactstrap'

var BasicInputBox = React.createClass ({
  render: function (){
    return (
     <div>
       <label>{this.props.label}</label>
       <br/>
       <input type="text" onChange={this.props.valChange} value= {this.props.val} />
       <br/>
     </div>
    );
  }
 });


var Location = React.createClass( {

  getInitialState: function(){
    return {}
  },
  clearForm: function() {
    this.setState({
      name:"",
      city: "",
      country: "",
      street: "",
      number:"",
    });
  },
  nameChange: function(e){
    this.setState({name: e.target.value})
  },
  cityChange: function(e){
    this.setState({city: e.target.value})
  },
  countryChange: function(e){
    this.setState({country: e.target.value})
  },
  streetChange: function(e){
    this.setState({street: e.target.value})
  },
  numberChange: function(e){
    this.setState({number: e.target.value})
  },
  handleSubmit(event) {
    var self

    self = this

    // Submit form via jQuery/AJAX
    fetch("http://localhost:8080/locations", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: this.state.name,
      city: this.state.city,
      country: this.state.country,
      street: this.state.street,
      number: this.state.number,
    })
  }).then(self.clearForm())

    event.preventDefault();

  },
  render(){
    return(
    <div className="Location Form">
      <h1 style={{display: 'flex', justifyContent: 'center'}}> Add a Location</h1>
        <form onSubmit={this.handleSubmit} inline >
          <BasicInputBox label="Name:" valChange={this.nameChange} val={this.state.name}/>
          <BasicInputBox label="City:" valChange={this.cityChange} val={this.state.city}/>
          <BasicInputBox label="Country:" valChange={this.countryChange} val={this.state.country}/>
          <BasicInputBox label="Street:" valChange={this.streetChange} val={this.state.street}/>
          <BasicInputBox label="Number:" valChange={this.numberChange} val={this.state.number}/>
          <Button type="submit" bsStyle="primary" >Submit</Button>
        </form>
        <li><Link to="suggestions">Get a Suggestion!</Link></li>
      </div>
  )
  }
})

export default Location
