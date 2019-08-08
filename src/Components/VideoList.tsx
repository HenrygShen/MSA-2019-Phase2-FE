import Close from '@material-ui/icons/Close'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import * as React from 'react'

interface IState{
    hubConnection: any,
    videoList: any
} 

interface IProps{
    mount:any
    play:any
}

export default class VideoList extends React.Component<IProps,IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props:any){
        super(props);
        this.state = {
            hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://localhost:44307/hub").build(),
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

    public playVideo = (videoUrl:string) => {
        this.props.play(videoUrl)
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
                    <td className="align-middle" onClick={() => this.playVideo(video.webUrl)}><img src={video.thumbnailUrl} width="100px" alt="Thumbnail"/></td>
                    <td className="align-middle" onClick={() => this.playVideo(video.webUrl)}><b>{video.videoTitle}</b></td>
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
        this.props.mount(this.updateList)
        this.updateList()

        this.state.hubConnection.on("UpdateVideoList", ()  => {
            this.updateList();
        });
    
        this.state.hubConnection.start().then(() => this.state.hubConnection.invoke("BroadcastMessage"));
    }



    public render() {
        return (
            <div className="video-list">
                <h1 className="play-heading"><span className="red-heading">play</span>video</h1>
                <table className="table">
                    <tbody>
                        {this.state.videoList}
                    </tbody>
                </table>
            </div>
        )
    }
}