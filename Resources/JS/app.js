import React, { useState } from 'react';
import '../CSS/style.css';
import axios from 'axios';

// YouTube Video Tutorial but not using it 
function App() {
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const register = () => {
        Axios({
            method: "POST",
            data: {
                username: registerUsername,
                password: registerPassword,
            },
            withCredentials: true,
            url: "http://localhost:8000/register",
        }).then((res) => console.log(res));
    };
    const login = () => {
        Axios({
            method: "POST",
            data: {
                username: loginUsername,
                password: loginPassword,
            },
            withCredentials: true,
            url: "http://localhost:8000/login",
        }).then((res) => console.log(res));
    };
    const getUser = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8000/getUser",
        }).then((res) => console.log(res));
    };
    return (
        //code for buttons etc
        <div>
            <input
            placeholder="username"
            onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <input
            placeholder="password"
            onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button onClick={register}>Submit</button>
        </div>
    )
}