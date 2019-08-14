import * as React from 'react';

// import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from 'src/Components/Login/Login';
import Home from 'src/Components/Home/Home';

interface IState {
    displayLogin: boolean 
}

class App extends React.Component<{}, IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props: any) {
        super(props);
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        this.state = {
            displayLogin:  this.isEmpty(user),
        }
    }

    public isEmpty = (obj:any) => {
        for(const key in obj) {
            if(obj.hasOwnProperty(key)){
                return false;
            }  
        }
        return true;
    }

    public login = (loginSuccessful: boolean) => {
        if (loginSuccessful) {
            this.setState({displayLogin: false}); 
        }
    }

    public logout = () => {
        localStorage.removeItem('user');
        this.setState({displayLogin: true}); 
    }

    public render() {
        return (
            <div>
                {this.state.displayLogin ? <Login login={this.login}/>:<Home logout={this.logout}/>}   
            </div>
        )
    }
}

export default App;