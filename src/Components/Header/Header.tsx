import * as React from 'react';
import customButton from "./searchicon.png";
import "./Header.css";
import { Link } from 'react-router-dom';

interface IProps{
    addVideo:any,
}

interface IState{
    input:string
}

export default class Header extends React.Component<IProps,IState> {
    public constructor(props:any){
        super(props);
        this.state = {
            input:""
        }
    }

    public addVideo = () =>{            
        this.props.addVideo(this.state.input)
    }

    public keyPress = (e:any) => {
        if(e.keyCode === 13){
            this.addVideo()
        }
    }

    public render() {
        return (
            <div className="header-container">
                <div>
                    <h1><span className="red-heading">Like</span>&amp;Scribr</h1>
                </div>

                <div className="navigation">
                    <Link className="nav-style" to="/Login">
                        <div>Login</div>
                    </Link>
                    <Link className="nav-style" to="/">
                        <div>Home</div>
                    </Link>
                </div>
                
                
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
        )
    }
}
