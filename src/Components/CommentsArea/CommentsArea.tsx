import * as React from 'react';

import "./CommentsArea.css";
import Comment from './Comment';

interface IState {
    hubConnection: any,
    comments: any,
    newComment: string,
    body: any
}

interface IProps {
    videoId: number,
    userId: number,
    user: string,
    styles: any
}

export default class CommentsArea extends React.Component<IProps, IState>{
    public signalR = require("@aspnet/signalr");
    public constructor(props: any) {
        super(props);
        this.state = { 
            body: [],
            comments: [],
            hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://localhost:44307/hub").build(),
            newComment: ''
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
        this.setState({ newComment: '' });

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

    public deleteComment = (commentId: number) => {
        fetch('https://localhost:44307/api/Comments/'+commentId,{
            method:'DELETE'
        }).then((ret:any) => {
            return ret.json();
        }).then(() => {
            this.updateList();
        })
    }

    public onKeyDown = (event:any) => {
        if (event.keyCode === 13) {
            this.addComment();
        }
    }

    public updateList = () => {
        fetch('https://localhost:44307/api/Comments/'+this.props.videoId,{
            method:'GET'
        }).then((ret:any) => {
            return ret.json();
        }).then((result:any) => {
            const output = result.map((comment: any) => {
                return (<Comment 
                    key = {`${Math.random()}`}
                    username = {comment.username}
                    comment = {comment.comment}
                    handleLike={this.handleLike}
                    timeStamp = {comment.timeStamp}
                    deleteComment={this.deleteComment}
                    isLiked = {this.checkLiked(comment.likesList)}
                    likes = {comment.likes}
                    styles={this.props.styles}
                    user = {this.props.user}
                    commentId = {comment.commentId}
                />)
            })
            output.reverse();
            
            this.setState({comments:output});
        })
    }

    public render() {
        return (
            <div className = "comment-section-container">
                <div className="comments-header">
                    <h1><span className="red-heading">Comments</span></h1>
                </div>
                <div className="comment-input-container">
                    <input
                        className="comment-input"
                        placeholder="Enter a comment here"
                        onKeyDown={this.onKeyDown}
                        value={this.state.newComment}
                        onChange={(event: any) => this.setState({ newComment: event.target.value })}
                    />
                    <button style = {{color: this.props.styles.color, borderColor: this.props.styles.color}} onClick={this.addComment}>Submit</button>
                </div>

                <div className = "comment-table">
                    {this.state.comments}
                </div>
            </div>    
        )
    }
}