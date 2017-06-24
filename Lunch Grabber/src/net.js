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

 var CommentBox = React.createClass({
   render: function(){
     return (
       <div>
         <label>Have a question?</label>
         <br/>
         <textarea type="text" onChange={this.props.valChange} value=      {this.props.val} />
         <br/>
       </div>
     );
   }
 });

 var Contact = React.createClass({
    getInitialState: function(){
      return {}
    },

    submit: function (e){
      var self

      e.preventDefault()
      self = this

      console.log(this.state);

      var data = {
        name: this.state.name,
        email: this.state.email,
        comment: this.state.comment
      }

      // Submit form via jQuery/AJAX
      $.ajax({
        type: 'POST',
        url: '/some/url',
        data: data
      })
      .done(function(data) {
        self.clearForm()
      })
      .fail(function(jqXhr) {
        console.log('failed to register');
      });

    },

    clearForm: function() {
      this.setState({
        name: "",
        email: "",
        comment: ""
      });
    },

    nameChange: function(e){
      this.setState({name: e.target.value})
    },

    emailChange: function(e){
     this.setState({email: e.target.value})
    },

    commentChange: function(e){
      this.setState({comment: e.target.value})
    },

    render: function(){
       return (
        <form onSubmit={this.submit} >
          <BasicInputBox label="Name:" valChange={this.nameChange} val={this.state.name}/>
          <BasicInputBox label="Email:" valChange={this.emailChange} val={this.state.email}/>
          <CommentBox valChange={this.commentChange} val={this.state.comment}/>
          <button type="submit">Submit</button>
        </form>
      );
    }
});

React.render(<Contact></Contact>, document.body);
