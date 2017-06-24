import React from 'react';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem, Button } from 'reactstrap'



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


class Suggestions extends React.Component {

  constructor() {
      super();
      this.state = { items: [], city:'' };
      this.handleClick = this.handleClick.bind(this)
   }

  cityChange(e){
      this.setState({city: e.target.value})
  }

  handleClick(event){
      var self = this
      var x = this.state.city
      var url = "http://localhost:8080/locations/" + x

      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(result=>result.json()).then(items=>this.setState({items}))
  }


  render(){
    return(
      <div className="Suggestions">
        <h1 style={{display: 'flex', justifyContent: 'center'}}> Find a Place to Lunch!</h1>
        <BasicInputBox label="City:" valChange={this.cityChange.bind(this)} val={this.state.city}/>
        <Button onClick={this.handleClick} >Get Suggestions</Button>
        <ListGroup>
        {this.state.items.map(item=><ListGroupItem key={item.id}>
          {item.id},
          {item.city},
          {item.country},
          {item.street},
          {item.number}</ListGroupItem>)}
          <li><Link to="location">Add a Location</Link></li>
        </ListGroup>
      </div>
  )
  }
}

export default Suggestions
