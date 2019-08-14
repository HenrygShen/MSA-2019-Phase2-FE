import * as React from 'react';
import "./Header.css";

interface IState {
    input:string
}

interface IProps {
    logout:any
}

export default class Header extends React.Component<IProps,IState> {
    public constructor(props:any){
        super(props);
        this.state = {
            input:""
        }
    }

    public render() {
        return (
            <div className="header-container">
                <h1><span className="red-heading">Like</span>&amp;Scribr</h1>
                <button className="logout-button" onClick={this.props.logout}>Logout</button>
            </div>
        )
    }
}
