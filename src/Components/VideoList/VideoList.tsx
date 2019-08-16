import Close from '@material-ui/icons/Close'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import * as React from 'react'
import Icon from '@material-ui/core/Icon'
import './VideoList.css';

interface IState{
    hubConnection:any
    videoList: any,
    input: any
} 

interface IProps{
    play:any,
    styles: any
}

export default class VideoList extends React.Component<IProps,IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props:any){
        super(props);
        this.state = {
            hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://msascriberapido.azurewebsites.net/hub").build(),
            input: "",
            videoList: []
        }
        this.updateList();
    }

    public deleteVideo = (id:any) => {
        fetch("https://msascriberapido.azurewebsites.net/api/Videos/"+id,{
            method:'DELETE'
        }).then(() => {
            this.updateList()
        }).then(() => {this.state.hubConnection.invoke("UpdateVideos")});
    }

    public playVideo = (videoUrl:string, videoId: number) => {
        this.props.play(videoUrl, videoId)
    }

    public updateList = () => {
        fetch('https://msascriberapido.azurewebsites.net/api/Videos',{
            method:'GET'
        }).then((ret:any) => {
            return ret.json();
        }).then((result:any) => {
            const output:any[] = []
            result.forEach((video:any) => {
                const row = (<tr key = {`${Math.random()} ${Math.random()}`} style = {{ borderColor: this.props.styles.color}}>
                    <td className="align-middle" onClick={() => this.handleLike(video)}>{video.isFavourite === true?<Star color="primary"/>:<StarBorder/>}</td>
                    <td className="align-middle" onClick={() => this.playVideo(video.webUrl, video.videoId)}><img src={video.thumbnailUrl} width="100px" alt="Thumbnail"/></td>
                    <td className="align-middle" onClick={() => this.playVideo(video.webUrl, video.videoId)}>{video.videoTitle}</td>
                    <td className=" align-middle video-list-close"><button onClick={() => this.deleteVideo(video.videoId)}><Close color="inherit"/></button></td>
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
        // Remove part of url that specifies playlist or timestamp
        const listPos = this.state.input.indexOf("&list=");
        const timePos = this.state.input.indexOf("&t=");
        let videoURL = '';
        if (listPos !== -1){
            videoURL = this.state.input.substring(0,listPos);
        } else if (timePos !== -1) {
            videoURL = this.state.input.substring(0,timePos);
        } else {
            videoURL = this.state.input;
        }
        console.log(videoURL);
        const body = {"url": videoURL}
        fetch("https://msascriberapido.azurewebsites.net/api/Videos", {
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
        fetch("https://msascriberapido.azurewebsites.net/api/Videos/update/"+video.videoId, {
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
        const {styles} = this.props;
        return (
            <div className="video-list" style = {{backgroundColor: styles.backgroundColor2, color: styles.color}}>
                <div className="video-list-header"> 
                    <h1 className="play-heading"><span className="red-heading">Play</span> Video</h1>
                    <div className="right-header">
                        <input
                        id= "Search-Bar"
                        className="search-bar"
                        placeholder="Add Video Url"
                        onChange = { (event: any ) => this.setState({input:event.target.value})}
                        onKeyDown={this.keyPress}
                        value = {this.state.input}
                        />
                        <div className = "add-icon"> 
                            <Icon>add</Icon>
                        </div>
                    </div>
                </div>
                
                <table className="table" style = {{color: styles.color}}>
                    <tbody>
                        {this.state.videoList}
                    </tbody>
                </table>
            </div>
        )
    }
}