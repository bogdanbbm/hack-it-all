import React from 'react';
import './App.css';
import { useState } from 'react';

function App() {
    
    const [page, setPage] = useState('start');
    const [siteURL, setSiteURL] = useState('http://localhost:3000');

    const [prompt, setPrompt] = useState('');
    const [prompts, setPrompts] = useState([]);

    const [response, setResponse] = useState('');
    const [responses, setResponses] = useState([]);

    const handleURLChange = () => {
        const regexURL = new RegExp('^(http|https)://', 'i');
        if (!regexURL.test(siteURL)) {
            alert('Invalid URL');
            return;
        }
        setPage('chat');
    }

    const handleSendPrompt = () => {
        setPrompts([...prompts, prompt]);
        setPrompt('');

        // const iframe = document.getElementById("myIframe");
        // iframe.contentWindow.postMessage("login", "http://localhost:3000");
    };

    const handleGenerateTest = () => {
        const response = fetch('http://127.0.0.1:5000/api/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_input: prompts
            })
        })

        response.then(res => res.json())
            .then(data => {
                console.log(data);
            });
    
    }

    console.log(prompts);

    return (
        <>
            {
                page === 'start' && (
                    <>
                        <div className="flex flex-col justify-center items-center w-full">
                            <img src='logo.svg' alt='logo' className='w-600 m-10' />

                            <div className='text-lg'>
                                Begin by adding an URL
                            </div>
                            <input
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-md"
                                value={siteURL}
                                onChange={(e) => setSiteURL(e.target.value)}
                            />
                            <button onClick={() => handleURLChange()} className="btn btn-ghost">Start</button>
                        </div>
                    </>
                )
            }
            {
                page === 'chat' && (
                    <div style={{ width: "100%", height: "40vh" }}>
                        <iframe
                            id="myIframe"
                            src={siteURL}
                            title="TrelloCopy"
                            width="100%"
                            height="200%"
                        ></iframe>
                        <input 
                            type="text" 
                            className="form-control mt-4" 
                            placeholder="prompt" 
                            onChange={(e) => setPrompt(e.target.value)}
                        />

                        <button onClick={handleSendPrompt} className="btn btn-primary mt-4">
                            Send Prompt
                        </button>
                        <button onClick={handleGenerateTest} className="btn btn-primary mt-4">
                            Generate Test
                        </button>
                    </div>
                )
            }

        </>
    );
}

export default App;
