import * as React from 'react';

import ReactPlayer from 'react-player';
import CaptionArea from '../CaptionArea/CaptionArea';
import CommentsArea from '../CommentsArea/CommentsArea';
import VideoList from '../VideoList/VideoList';
import Header from '../Header/Header';
import './Home.css';

interface IState {
    hubConnection: any,
    player: any,
    playingURL: string,
    videoList: object,
    playingVideoId: number
}

interface IProps {
    logout: any,
    styles: any,
    user: string,
    userId: number,
    toggleTheme: any
}

export default class Home extends React.Component<IProps, IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props: any) {
        super(props);
        this.state = {
            hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://msascriberapido.azurewebsites.net/hub").build(),
            player: null,
            playingURL: "",
            playingVideoId: -1,
            videoList: [],
        }
    }

    public componentDidMount = () => {
        this.state.hubConnection.on("Connected", ()  => {
            console.log('A new user has connected to the hub.');
        });

        this.state.hubConnection.start().then(() => this.state.hubConnection.invoke("BroadcastMessage"));
    }

    public setRef = (playerRef: any) => {
        this.setState({
            player: playerRef
        })
    }

    public updateURL = (url: string, videoId: number) => {
        if(this.state.playingURL === url){
            this.setState({playingURL : "", playingVideoId: -1},() => this.setState({playingURL: url, playingVideoId: videoId}))
        }else{
            this.setState({playingURL:url, playingVideoId: videoId})
        }
        this.state.hubConnection.invoke("UpdateComments");
    }

    public render() {
        const { styles } = this.props;
        return (
            <div className = "home-container" style = {{ backgroundColor: styles.backgroundColor, color: styles.color}}>
                <Header user={this.props.user} toggleTheme = {this.props.toggleTheme} logout={this.props.logout} styles = {styles}/>
                <div className="main-container">
                    <div className = "video-container">
                        <div className = "player-container">
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
                        <div className = "list-container">
                            <VideoList styles = {styles} play={this.updateURL} />
                        </div>
                    </div>
                    <div style = {{width: '100%'}}>
                    <CaptionArea styles = {styles} currentVideo={this.state.playingURL} play={this.updateURL} />

                    </div>
                    { this.state.playingVideoId !== -1 &&
                        <CommentsArea styles = {styles} videoId={this.state.playingVideoId} user={this.props.user} userId={this.props.userId}/>
                    }
                </div>
            </div>

        )
    }
}