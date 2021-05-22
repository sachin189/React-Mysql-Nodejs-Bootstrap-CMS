import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import './Login.css';

const  LoginPage = ()=>{
    let history = useHistory();
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });

    const { username, password } = inputs;
    const [submitted, setSubmitted] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (username && password) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            };
        
            return fetch(`http://localhost:3030/api/v1/manage/users/login`, requestOptions)
                .then( response => {
                    if ( response.status >= 400 ) {
                        throw new Error("Server responds with error!");
                    }
                    return response.json()
                })
                .then( user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                    history.replace('/manage/dashboard');

                },error=>{ console.log(error)} );
        }
    }
    
    return (
        <div id="login">
            <h3 className="text-center text-white pt-5">Login form</h3>
            <div className="container">
                <div id="login-row" className="row justify-content-center align-items-center">
                    <div id="login-column" className="col-md-6">
                        <div id="login-box" className="col-md-12">
                            <form id="login-form" className="form" onSubmit={handleSubmit}>
                                <h3 className="text-center text-info">Login</h3>
                                <div className="form-group">
                                    <label htmlFor="username" className="text-info">Username:</label><br/>
                                    <input type="text" name="username" id="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
                                    {submitted && !username &&
                                        <div className="invalid-feedback">Username is required</div>
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="text-info">Password:</label><br/>
                                    <input type="password" name="password" id="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} />
                                    {submitted && !password &&
                                        <div className="invalid-feedback">Password is required</div>
                                    }
                                </div>
                                
                                <div className="form-group">
                                    <input type="submit" name="submit" className="btn btn-info btn-md" value="submit" />
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )   
}

export { LoginPage }