import React from 'react';
import axios from 'axios';
import './App.css';
import Main from './components/Main';

class App extends React.Component{
  state = {
      data: ''
  }
  componentDidMount(){
      axios.get('http://5dd1894f15bbc2001448d28e.mockapi.io/playlist')
      .then(response => {
          this.setState({
              data: response.data
          });
      })
      .catch(err => {
          console.log(err);
      })
  }
  render(){
      //console.log(this.state.data);
      return(
        <div className="body">  
            <Main musicdata={this.state.data} />
        </div>
      )
  }
}
export default App;