import * as React from 'react';

import liked from './likedbutton.png';
import unliked from './unlikedbutton.png';
import "./CommentsArea.css";

interface IState {
    hubConnection: any,
    comments: any,
    newComment: string,
    editedComment: string
    editCommentId: number,
    body: any,
    submitted: boolean
}

interface IProps {
    videoId: number,
    userId: number,
    user: string
}

export default class CommentsArea extends React.Component<IProps, IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props: any) {
        super(props);
        this.state = { 
            body: [],
            comments: [],
            editCommentId: -1,
            editedComment: '',
            hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://localhost:44307/hub").build(),
            newComment: '',
            submitted: true
        }
    }

    public componentDidMount = () => {
        this.updateList();
        this.state.hubConnection.on("UpdateComments", ()  => {
            this.updateList();
        });

        this.state.hubConnection.start();
    }

    public handleLike = (commentId: number, like: boolean) => {
        const body = {
                    "commentId": commentId,
                    "like": like,
                    "userId": this.props.userId
                    }
        return fetch("https://localhost:44307/api/Comments/UpdateLikes", {
            body: JSON.stringify(body),
            headers: {
            Accept: "text/plain",
            "Content-Type": "application/json"
        },
        method: "PUT"
        }).then(() => {
            this.updateList();
        })
        .catch(err => {
            console.log(err)
        })
    }

    public checkLiked = (likeList: string) => {
        const userString = this.props.userId + "-";
        if (likeList.includes(userString)){
            return true;
        } else {
            return false;
        }
    }

    public addComment = () => {
        this.setState({ submitted: true });

        // stop here if form is invalid
        if (!(this.state.newComment)) {
            return;
        }
        const dateVal = new Date().getTime();
        const date = new Date( parseFloat( dateVal.toString()));
        const dateString = date.toString();
        const pos = dateString.indexOf("GMT");
        const body = {"comment": this.state.newComment,
                    "likes": 0,
                    "likesList": "",
                    "timeStamp": dateString.slice(0,pos),
                    "username": this.props.user,
                    "videoId": this.props.videoId
                    }
        return fetch("https://localhost:44307/api/Comments/", {
            body: JSON.stringify(body),
            headers: {
            Accept: "text/plain",
            "Content-Type": "application/json"
        },
        method: "POST"
        }).then((message: any) => {
            this.updateList();
        })
        .catch(err => {
            console.log(err)
        })
    }

    public editComment = (commentId: number) => {
        const body = {"comment": this.state.newComment,
                    "commentId": commentId
                    }
        fetch('https://localhost:44307/api/Comments/UpdateComment',{
            body: JSON.stringify(body),
            headers: {
            Accept: "text/plain",
            "Content-Type": "application/json"
        },
            method:'PUT'
        }).then((ret:any) => {
            return ret.json();
        }).then(() => {
            this.updateList();
        })
    }

    public deleteComment = (commentId: number) => {
        fetch('https://localhost:44307/api/Comments/'+commentId,{
            method:'DELETE'
        }).then((ret:any) => {
            return ret.json();
        }).then(() => {
            this.updateList();
        })
    }

    public updateList = () => {
        fetch('https://localhost:44307/api/Comments/'+this.props.videoId,{
            method:'GET'
        }).then((ret:any) => {
            return ret.json();
        }).then((result:any) => {
            const output:any[] = []
            result.forEach((comment:any) => {
                const row = (<tr key = {`${Math.random()} ${Math.random()}`}>
                    <td className="align-middle">{comment.username}</td>
                    <td className="align-middle comment-overflow">{(this.state.editCommentId !== comment.Id) ? 
                                                <input
                                                    value={this.state.editedComment}
                                                    onChange={(event: any) => this.setState({ editedComment: event.target.value })}
                                                />
                                                :comment.comment}
                    </td>
                    <td className="align-middle">{comment.timeStamp}</td>
                    <td className="align-middle">{this.checkLiked(comment.likesList) ? <img src={liked} className="custom-button" onClick={() => this.handleLike(comment.commentId, false)}/>
                                                :<img src={unliked} className="custom-button" onClick={() => this.handleLike(comment.commentId, true)}/>}
                    </td>
                    <td className="align-middle">{comment.likes}</td>
                    <td className="align-middle video-list-close">{(comment.username === this.props.user) && <button onClick={() => this.setState({editCommentId: comment.commentId})}>Edit</button>}</td>
                    <td className="align-middle video-list-close">{(comment.username === this.props.user) && <button onClick={() => this.deleteComment(comment.commentId)}>Delete</button>}</td>
                </tr>)
                output.push(row);
            });
            this.setState({comments:output});
        })
    }

    public render() {
        return (
            <div>
                <div className="comments-header">
                    <h1><span className="red-heading">Comments</span></h1>
                </div>
                <input
                    className="comment-input"
                    placeholder="Enter a comment here"
                    onChange={(event: any) => this.setState({ newComment: event.target.value })}
                />
                <button onClick={this.addComment}>Submit</button>
                <table className="table">
                    <tbody>
                    {this.state.comments}
                    </tbody>
                </table>
            </div>    
        )
    }
}