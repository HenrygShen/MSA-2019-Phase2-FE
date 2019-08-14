import * as React from 'react';
import "./Login.css"
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface IState{
    signup: boolean
}

interface IProps{
    login: any
}

export default class Login extends React.Component<IProps, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            signup: false,
        }
    }

    public render() {
        return (
            <div className="login-container">
                {this.state.signup ? 
                <div>
                    <SignupForm/>
                    <div>
                        Already have an account? <button className="button-link" onClick={() => this.setState({signup: false})}>Login in here</button>
                    </div>
                </div>
                :
                <div>
                    <LoginForm loginFunc={this.props.login}/>
                    <div>
                        Don't have an account? <button className="button-link" onClick={() => this.setState({signup: true})}>Sign up here</button>
                    </div>
                </div>
                }     
            </div>
        )
    }
}