import * as React from 'react';
import "./Login.css"

interface IState{
    password: string,
    username: string
    submitted: boolean,
    signup: boolean,
    success: string,
    loading: boolean,
    error: string,
}

export default class SignupForm extends React.Component<{}, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            error: "",
            loading: false,
            password: "",
            signup: false,
            submitted: false,
            success: "",
            username: ""
        }
    }

    public handleResponse(response: Response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    location.reload(true);
                }
    
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data;
        });
    }


    public signup = () =>{
        this.setState({ submitted: true , loading: true });
        const { username, password } = this.state;

        // stop here if form is invalid
        if (!(username && password)) {
            return;
        }

        const body = {"Password": this.state.password,
                    "Username": this.state.username}
        return fetch("https://msascriberapido.azurewebsites.net/api/users/Signup", {
            body: JSON.stringify(body),
            headers: {
            Accept: "text/plain",
            "Content-Type": "application/json"
        },
        method: "POST"
        }).then(this.handleResponse)
        .then((message: any) => {
            this.setState({ error: "", success: message.message, loading: false });
        }).catch(err => {
            console.log(err);
            this.setState({ error: err, success: "", loading: false})
        }) 
    }

    public keyPress = (e:any) => {
        if(e.keyCode === 13){
            this.signup()
        }
    }

    public render() {
        const { error, success, loading, submitted, username, password } = this.state;
        return (
            <div>
                <h2>Signup</h2>
                <div className="login-box">
                    <div className="login-input-container">
                        <div className="inputs">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                className="input-form"
                                name="username" 
                                value={username}
                                onChange={(event: any) => this.setState({ username: event.target.value })} 
                                onKeyDown={this.keyPress}
                            />
                            {submitted && !username &&
                                <div>Username is required</div>
                            }
                        </div>        
                        <div className="inputs">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                className="input-form"
                                name="password" 
                                value={password} 
                                onChange={(event: any) => this.setState({ password: event.target.value })}
                                onKeyDown={this.keyPress}
                            />
                            {submitted && !password &&
                                <div>Password is required</div>
                            }
                        </div>
                            

                        <button className="btn btn-primary" disabled={loading} onClick={this.signup}>Signup</button>
                            {loading &&
                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                        {success &&
                            <div className={'alert alert-success'}>{success}</div>
                        }
                        {error &&
                            <div className={'alert alert-danger'}>{error}</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}