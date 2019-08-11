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

    public addVideo = (url: string) => {
        const body = {"url": url}
        fetch("https://localhost:44307/api/Videos", {
            body: JSON.stringify(body),
            headers: {
            Accept: "text/plain",
            "Content-Type": "application/json"
        },
        method: "POST"
        }).then(() => {
            this.state.updateVideoList();
        }).then(() => {this.state.hubConnection.invoke("UpdateVideos")});
    }

    public render() {
        return (
            <Router>
                <div>
                    <Header addVideo={this.addVideo} />
                    <Switch>
                        <Route path="/" exact={true} component={Home} />
                        <Route path="/login" component={Login} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;