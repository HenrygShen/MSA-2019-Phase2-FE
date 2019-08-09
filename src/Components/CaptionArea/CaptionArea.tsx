import * as React from 'react';
import customButton from "./searchicon.png";
import "./CaptionArea.css";

interface IState {
    input: string,
    result: any,
    body:any,
}

interface IProps {
    currentVideo:any,
    play: any
}

export default class CaptionArea extends React.Component<IProps, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            body: [],
            input: "",
            result: [],
        }
    }
        

    public search = () => {
        if(this.state.input.trim() === ""){
            this.setState({result:[]},()=>this.makeTableBody())
        }else{
            fetch("https://localhost:44307/api/Videos/SearchByTranscriptions/"+this.state.input, {
                headers: {
                  Accept: "text/plain"
                },
                method:"GET"
            }).then(response => {
                return response.json()
            }).then(answer => {
                this.setState({result:answer},()=>this.makeTableBody())
            })
        }
    }

    public handleTableClick = (videoUrl:any, timedURL: string) => {
        window.scrollTo(0,0);
        this.props.play(videoUrl + "&t=" + timedURL + "s")
    }

    public makeTableBody = () => {
        const toRet: any[] = [];
        this.state.result.sort((a:any, b:any)=>{
            if(a.webUrl === b.webUrl){
                return 0;
            }else if(a.webUrl === this.props.currentVideo){
                return -1;
            }else if(b.webUrl === this.props.currentVideo){
                return 1;
            }
            else{
                return a.videoTitle.localeCompare(b.videoTitle);
            }
        })
        this.state.result.forEach((video: any) => {
            video.transcription.forEach((caption: any) => {
                toRet.push(
                    <tr onClick={() => this.handleTableClick(video.webUrl,caption.startTime)}>
                        <td>{caption.startTime}</td>
                        <td>{caption.phrase}</td>
                        <td>{video.videoTitle}</td>
                    </tr>)
            })
        });
        if (toRet.length === 0) {
            if(this.state.input.trim() === ""){
                const errorCase = <div><p>Sorry you need to still search</p></div>
                this.setState({body:errorCase})
            }else{
                const errorCase = <div><p>Sorry no results were returned for "{this.state.input}"</p></div>
                this.setState({body:errorCase})
            }
        }
        else{
            this.setState({body:toRet})
        }
    }

    public keyPress = (e:any) => {
        if(e.keyCode === 13){
            this.search()
        }
    }
    public render() {
        return (
            <div>
                <div className= "caption-header">
                    <div>
                        <h1><span className="red-heading">search</span>caption</h1>
                    </div>
                    <div className="right-header">
                        <input
                            id="Search-Bar"
                            className="search-bar"
                            placeholder="Search Captions"
                            onChange={(event: any) => this.setState({ input: event.target.value })}
                            value={this.state.input}
                            onKeyDown={this.keyPress}
                        />
                        <img src={customButton} className="custom-button" onClick={() => this.search()}/>
                    </div>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <th>Time</th>
                            <th>Caption</th>
                            <th>Video</th>
                        </tr>
                    </tbody>
                    <tbody>
                        {this.state.body}
                    </tbody>
                </table>
            </div>
            
        )
    }
}