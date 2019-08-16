import * as React from 'react';

import Login from 'src/Components/Login/Login';
import Home from 'src/Components/Home/Home';

interface IState {
    username: string,
    userId: number,
    theme: string
}

const styles = {
    dark: {
        backgroundColor: '#333333',
        border: 'white',
        color: 'white',
        backgroundColor2: '#444444',
        buttonTextColor: "#ADDE86"
    },
    light: {
        backgroundColor: '#eeeeee',
        border: '#111',
        color: '#111',
        backgroundColor2: '#ddd',
        buttonTextColor: 'black'
    }
}

class App extends React.Component<{}, IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props: any) {
        super(props);
        this.state = {
            theme: 'dark',
            userId: -1,
            username: ''
        }
        document.body.style.backgroundColor = styles[this.state.theme].backgroundColor;
    }

    public isEmpty = (obj:any) => {
        for(const key in obj) {
            if(obj.hasOwnProperty(key)){
                return false;
            }  
        }
        return true;
    }

    public toggleTheme = () => {
        const theme = this.state.theme === 'dark' ? 'light' : 'dark';
        document.body.style.backgroundColor = styles[theme].backgroundColor;
        this.setState({ theme: (this.state.theme === 'dark') ? 'light' : 'dark'});
    }

    public login = (name: string, id: number) => {
        this.setState({username: name, userId: id});
    }

    public logout = () => {
        this.setState({username: '', userId: -1});
    }

    public render() {
        return (
            <div className = "app-container" style = {{backgroundColor: styles[this.state.theme].backgroundColor}}>
                {(this.state.username === '') ? 
                <Login 
                    styles = {styles[this.state.theme]} 
                    login={this.login}
                />
                :
                <Home 
                    styles = {styles[this.state.theme]} 
                    toggleTheme = {this.toggleTheme}
                    logout={this.logout} 
                    user={this.state.username} 
                    userId={this.state.userId}/>
                }   
            </div>
        )
    }
}

export default App;