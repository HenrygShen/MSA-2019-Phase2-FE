import * as React from 'react';
import "./CaptionArea.css";
import Icon from '@material-ui/core/Icon'

interface IState {
    input: string,
    result: any,
    body:any,
}

interface IProps {
    currentVideo:any,
    play: any,
    styles: any
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
            fetch("https://msascriberapido.azurewebsites.net/api/Videos/SearchByTranscriptions/"+this.state.input, {
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

    public handleTableClick = (videoUrl:any, timedURL: string, videoId: number) => {
        
        this.props.play(videoUrl + "&t=" + timedURL + "s", videoId.toString());
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
        let i = 0;
        this.state.result.forEach((video: any) => {
            video.transcription.forEach((caption: any) => {
                toRet.push(
                    <tr key={i} onClick={() => this.handleTableClick(video.webUrl, caption.startTime, video.videoId)}>
                        <td>{caption.startTime}</td>
                        <td>{caption.phrase}</td>
                        <td>{video.videoTitle}</td>
                    </tr>)
                i++;
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
                        <h1><span className="red-heading">Search By Caption</span></h1>
                    </div>
                    <div className="right-header" style ={{display: 'flex', alignItems: 'center'}}>
                        <input
                            id="Search-Bar"
                            className="search-bar"
                            placeholder="Search Captions"
                            onChange={(event: any) => this.setState({ input: event.target.value })}
                            value={this.state.input}
                            onKeyDown={this.keyPress}
                        />
                        <div onClick={() => this.search()} className="custom-button">
                            <Icon>search</Icon>
                        </div>
                    </div>
                </div>
                {(this.state.body.length > 0) ?
                <div className="transcription-table">
                    <table id="transcriptions">
                        <tbody>
                            <tr>
                                <th style = {{color: this.props.styles.color}}>Time</th>
                                <th style = {{color: this.props.styles.color}}>Caption</th>
                                <th style = {{color: this.props.styles.color}}>Video</th>
                            </tr>
                        </tbody>
                        <tbody>
                            {this.state.body}
                        </tbody>
                    </table>
                </div>
                :
                null
                }

            </div>
            
        )
    }
}