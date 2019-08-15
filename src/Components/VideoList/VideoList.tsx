import Close from '@material-ui/icons/Close'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import * as React from 'react'

import customButton from "./searchicon.png";
import './VideoList.css';

interface IState{
    hubConnection:any
    videoList: any,
    input: any
} 

interface IProps{
    play:any
}

export default class VideoList extends React.Component<IProps,IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props:any){
        super(props);
        this.state = {
            hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://localhost:44307/hub").build(),
            input: "",
            videoList: []
        }
        this.updateList();
    }

    public deleteVideo = (id:any) => {
        fetch("https://localhost:44307/api/Videos/"+id,{
            method:'DELETE'
        }).then(() => {
            this.updateList()
        }).then(() => {this.state.hubConnection.invoke("UpdateVideos")});
    }

    public playVideo = (videoUrl:string, videoId: number) => {
        this.props.play(videoUrl, videoId)
    }

    public updateList = () => {
        fetch('https://localhost:44307/api/Videos',{
            method:'GET'
        }).then((ret:any) => {
            return ret.json();
        }).then((result:any) => {
            const output:any[] = []
            result.forEach((video:any) => {
                const row = (<tr key = {`${Math.random()} ${Math.random()}`}>
                    <td className="align-middle" onClick={() => this.handleLike(video)}>{video.isFavourite === true?<Star color="primary"/>:<StarBorder/>}</td>
                    <td className="align-middle" onClick={() => this.playVideo(video.webUrl, video.videoId)}><img src={video.thumbnailUrl} width="100px" alt="Thumbnail"/></td>
                    <td className="align-middle" onClick={() => this.playVideo(video.webUrl, video.videoId)}><b>{video.videoTitle}</b></td>
                    <td className="align-middle video-list-close"><button onClick={() => this.deleteVideo(video.videoId)}><Close/></button></td>
                </tr>)
                if(video.isFavourite){
                    output.unshift(row);
                }else{
                    output.push(row);
                }
            });
            this.setState({videoList:output})
        })
    }

    public addVideo = () => {
        const body = {"url": this.state.input}
        fetch("https://localhost:44307/api/Videos", {
            body: JSON.stringify(body),
            headers: {
            Accept: "text/plain",
            "Content-Type": "application/json"
        },
        method: "POST"
        }).then(() => {
            this.updateList();
        }).then(() => {this.state.hubConnection.invoke("UpdateVideos")});
    }

    public keyPress = (e:any) => {
        if(e.keyCode === 13){
            this.addVideo()
        }
    }

    public handleLike = (video:any) => {
        const toSend = [{
            "from":"",
            "op":"replace",
            "path":"/isFavourite",
            "value":!video.isFavourite,
        }]
        fetch("https://localhost:44307/api/Videos/update/"+video.videoId, {
            body:JSON.stringify(toSend),
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json-patch+json"
            },
            method: "PATCH"
          }).then(() => {
              this.updateList();
          }).then(() => {this.state.hubConnection.invoke("UpdateVideos")});
    }
    
    public componentDidMount = () => {
        this.updateList()

        this.state.hubConnection.on("UpdateVideoList", ()  => {
            this.updateList();
        });

        this.state.hubConnection.start().then(() => this.state.hubConnection.invoke("BroadcastMessage"));
    }

    public render() {
        return (
            <div className="video-list">
                <div className="video-list-header"> 
                    <h1 className="play-heading"><span className="red-heading">Play</span>video</h1>
                    <div className="right-header">
                        <input
                        id= "Search-Bar"
                        className="search-bar"
                        placeholder="Add Video Url"
                        onChange = { (event: any ) => this.setState({input:event.target.value})}
                        onKeyDown={this.keyPress}
                        value = {this.state.input}
                        />
                        <img src={customButton} className="custom-button" onClick={this.addVideo}/>
                    </div>
                </div>
                
                <table className="table">
                    <tbody>
                        {this.state.videoList}
                    </tbody>
                </table>
            </div>
        )
    }
}