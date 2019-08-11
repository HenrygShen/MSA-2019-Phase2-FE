import * as React from 'react';

import ReactPlayer from 'react-player';
import CaptionArea from '../CaptionArea/CaptionArea';
import VideoList from '../VideoList/VideoList';


interface IState {
    hubConnection: any,
    updateVideoList: any,
    player: any,
    playingURL: string,
    user: any,
    videoList: object
}

export default class Home extends React.Component<{}, IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props: any) {
        super(props);
        this.state = {
            hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://localhost:44307/hub").build(),
            player: null,
            playingURL: "",
            updateVideoList: null,
            user: {},
            videoList: [],
        }
    }

    public componentDidMount = () => {
        this.setState({
            user: JSON.parse(localStorage.getItem('user') || '{}'),
        });
        console.log(localStorage.getItem('user'));
        this.state.hubConnection.on("Connected", ()  => {
            console.log('A new user has connected to the hub.');
        });

        this.state.hubConnection.on("UpdateVideoList", ()  => {
            this.state.updateVideoList();
        });

        this.state.hubConnection.start().then(() => this.state.hubConnection.invoke("BroadcastMessage"));
    }

    public setRef = (playerRef: any) => {
        this.setState({
            player: playerRef
        })
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

    public updateURL = (url: string) => {
        if(this.state.playingURL === url){
            this.setState({playingURL : ""},() => this.setState({playingURL: url}))
        }else{
            this.setState({playingURL:url})
        }
    }

    public listMounted = (callbacks: any) => {
        this.setState({ updateVideoList: callbacks })
    }

    public render() {
        return (
            <div className="container">
                <h1>Hi {this.state.user.username}!</h1>
                <div className="row">
                    <div className="col-7">
                        <ReactPlayer
                            className="player"
                            ref={this.setRef}
                            controls={true}
                            url={this.state.playingURL}
                            width="100%"
                            height="400px"
                            playing={true}
                                config={{
                                youtube: {
                                playerVars: { showinfo: 1 },
                                preload: true
                                }
                            }
                        }
                        />
                    </div>
                    <div className="col-5">
                        <VideoList play={this.updateURL} mount={this.listMounted} />
                    </div>
                </div>
                <CaptionArea currentVideo={this.state.playingURL} play={this.updateURL} />
            </div>
        )
    }
}