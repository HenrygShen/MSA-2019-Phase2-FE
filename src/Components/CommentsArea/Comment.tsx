import * as React from 'react';
import './Comment.css';
import liked from './likedbutton.png';
import unliked from './unlikedbutton.png';

const Comment = (props: any) => {

    const { username, comment, timeStamp, isLiked, commentId, likes, user } = props;
    return (
        <div className = "comment-card">
            <div className = "username">{username}</div>
            <div className = "comment"><span className="comment-overflow">{ comment }</span></div>
            <div className = "timestamp">{timeStamp}</div>
            <div className = "likeButton"><img src={(isLiked) ? liked : unliked} className="custom-button" onClick={() => props.handleLike(commentId, !isLiked)}/></div>
            <div className = "likes">{likes}</div>
            <div className = "video-list-close">{(username === user) && <button onClick={() => props.deleteComment(commentId)}>Delete</button>}</div>
        </div>
    )
}

export default Comment;