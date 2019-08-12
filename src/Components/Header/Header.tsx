import * as React from 'react';
import "./Header.css";
import { Link } from 'react-router-dom';

interface IState{
    input:string
}

export default class Header extends React.Component<{},IState> {
    public constructor(props:any){
        super(props);
        this.state = {
            input:""
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
        </div>
        )
    }
}
