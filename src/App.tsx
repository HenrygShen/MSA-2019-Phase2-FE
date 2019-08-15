import * as React from 'react';

import Login from 'src/Components/Login/Login';
import Home from 'src/Components/Home/Home';

interface IState {
    username: string,
    userId: number
}

class App extends React.Component<{}, IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props: any) {
        super(props);
        this.state = {
            userId: -1,
            username: ''
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

    public login = (name: string, id: number) => {
        this.setState({username: name, userId: id});
    }

    public logout = () => {
        this.setState({username: '', userId: -1});
    }

    public render() {
        return (
            <div>
                {(this.state.username === '') ? <Login login={this.login}/>:<Home logout={this.logout} user={this.state.username} userId={this.state.userId}/>}   
            </div>
        )
    }
}

export default App;