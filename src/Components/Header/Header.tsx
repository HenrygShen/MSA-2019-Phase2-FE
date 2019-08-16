import * as React from 'react';
import "./Header.css";

interface IState {
    input:string
}

interface IProps {
    logout:any,
    styles: any
}

export default class Header extends React.Component<IProps,IState> {
    public constructor(props:any){
        super(props);
        this.state = {
            input:""
        }
    }

    public render() {
        const { styles } = this.props;
        return (
            <div className="header-container" style = {{backgroundColor: styles.backgroundColor2 }}>
                <h1 style={{color: styles.color}}><span className="red-heading">Video</span>Lounge</h1>
                <button style={{color: styles.color}} className="logout-button" onClick={this.props.logout}>Logout</button>
            </div>
        )
    }
}
