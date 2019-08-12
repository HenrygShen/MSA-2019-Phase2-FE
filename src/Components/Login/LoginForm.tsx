import * as React from 'react';
import "./Login.css"
import {Redirect} from 'react-router-dom'

interface IState{
    password: string,
    username: string
    submitted: boolean,
    signup: boolean,
    loading: boolean,
    error: string,
    loginSuccessful:boolean
}

export default class Login extends React.Component<{}, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            error: "",
            loading: false,
            loginSuccessful: false,
            password: "",
            signup: false,
            submitted: false,
            username: ""
        }
    }

    public handleResponse(response: Response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    this.logout();
                    location.reload(true);
                }
    
                const error = (data && data.message) || response.statusText;
                console.log("Asdasdasd");
                return Promise.reject(error);
            }
    
            return data;
        });
    }

    // public handleSubmit = (e:any) => {
    //     e.preventDefault();

    //     this.setState({ submitted: true });
    //     const { username, password } = this.state;

    //     // stop here if form is invalid
    //     if (!(username && password)) {
    //         return;
    //     }

    //     this.setState({ loading: true });
    //     this.login()
    //         .then(
    //             error => this.setState({ error: "", loading: false, loginSuccessful: true })
    //         );
    // }

    public login = () =>{
        
        this.setState({ submitted: true });
        const { username, password } = this.state;

        // stop here if form is invalid
        if (!(username && password)) {
            return;
        }

        this.setState({ loading: true });

        const body = {"Password": this.state.password,
                    "Username": this.state.username}
        return fetch("https://localhost:44307/api/users/Authenticate", {
            body: JSON.stringify(body),
            headers: {
            Accept: "text/plain",
            "Content-Type": "application/json"
        },
        method: "POST"
        }).then(this.handleResponse)
        .then((user: any) => {
            // login successful if there's a user in the response
            if (user) {
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(this.state.username + ':' + this.state.password);
                localStorage.setItem('user', JSON.stringify(user));
            }
            this.setState({ error: "", loading: false, loginSuccessful: true });
            return user;
        })
        .catch(err => {
            console.log(err)
            this.setState({ error: err, loading: false})
        })
    }

    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
    }

    public keyPress = (e:any) => {
        if(e.keyCode === 13){
            this.login();
        }
    }

    public render() {
        const { error, loading, submitted, username, password, loginSuccessful } = this.state;
        if (loginSuccessful === true) {
            return <Redirect to="/" />
        }
        return (
            <div className="login-box">
            <h2>Login</h2>
            <div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="username" 
                        value={username}
                        onChange={(event: any) => this.setState({ username: event.target.value })} 
                        onKeyDown={this.keyPress}
                    />
                    {submitted && !username &&
                        <div>Username is required</div>
                    }
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        name="password" 
                        value={password} 
                        onChange={(event: any) => this.setState({ password: event.target.value })}
                        onKeyDown={this.keyPress}
                    />
                    {submitted && !password &&
                        <div>Password is required</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" disabled={loading} onClick={this.login}>Login</button>
                    {loading &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }
                </div>
                {error &&
                    <div className={'alert alert-danger'}>{error}</div>
                }
            </div>
            </div>
        )
    }
}