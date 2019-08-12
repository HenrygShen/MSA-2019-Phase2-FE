import * as React from 'react';

import Header from 'src/Components/Header/Header';

import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from 'src/Components/Login/Login';
import Home from 'src/Components/Home/Home';

interface IState {
    hubConnection: any,
    updateVideoList: any,
    player: any,
    playingURL: string,
    videoList: object
}

class App extends React.Component<{}, IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props: any) {
        super(props);
        this.state = {
            hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://localhost:44307/hub").build(),
            player: null,
            playingURL: "",
            updateVideoList: null,
            videoList: [],
        }
    }

    public videoList = (callback: any) => {
        this.setState({ updateVideoList: callback });
    }

    public render() {
        return (
            <Router>
                <div>
                    <Header/>
                    <Switch>
                        <Route path="/" exact={true} component={Home} videoList={this.videoList}/>
                        <Route path="/login" component={Login} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;