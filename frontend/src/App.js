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
        if (prompt === '') {
            return;
        }

        setPrompts([...prompts, prompt]);
        setPrompt('');
        const promptElement = document.getElementById('input-prompt');
        promptElement.value = '';

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
                    <div className='w-screen h-screen' style={{ backgroundColor: '#EFEFEF' }}>
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
                    </div>
                )
            }
            {
                page === 'chat' && (
                    <>
                        <div className='w-screen h-screen' style={{ backgroundColor: '#EFEFEF' }}>
                            <div className='grid grid-cols-2 h-5/6'>

                                <div className='overflow-auto'>
                                    <div className='flex justify-center'>
                                        <img src='logo.svg' alt='logo' className='w-64 m-10' />
                                    </div>
                                    {Array.from({ length: prompts.length }, (_, index) => (
                                        <div key={index}>

                                            <p className='font-semibold text-right mx-1 text-[#DDDDDD]'>
                                                You
                                            </p>
                                            <p className='font-semibold align-center rounded-lg bg-[#DDDDDD] min-h-10 w-1/2 flex items-center p-2 ml-auto mb-5 mx-1'>
                                                {prompts[index]}
                                            </p>

                                            {responses[index] &&
                                                <>
                                                    <p className='font-semibold text-left mx-1 text-[#FFA68A]'>
                                                        flawlesstest
                                                    </p>
                                                    <p className='font-semibold rounded-lg bg-[#FFA68A] min-h-10 w-1/2 flex items-center p-2 mb-5 mx-1'>
                                                        {responses[index]}
                                                    </p>
                                                </>
                                            }
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full h-full border-l-2 border-b-2 border-[#FF5722]">
                                    <iframe
                                        id="myIframe"
                                        src={siteURL}
                                        title="TrelloCopy"
                                        width="100%"
                                        height="100%"
                                    ></iframe>

                                </div>
                            </div>

                            <div className='flex justify-center items-center h-1/6'>
                                <input
                                    id="input-prompt"
                                    type="text"
                                    placeholder="Start typing a new prompt ..."
                                    className="input input-bordered w-3/4 mx-4"
                                    onChange={(e) => setPrompt(e.target.value)}
                                />

                                <button onClick={handleSendPrompt} className="btn btn-primary bg-[#FF5722] border-[#FF5722] text-white mx-2">
                                    Send Prompt
                                </button>
                                <button onClick={handleGenerateTest} className="btn btn-primary bg-[#FF5722] border-[#FF5722] text-white mx-0">
                                    Generate Test
                                </button>
                            </div>

                        </div>

                    </>
                )
            }

        </>
    );
}

export default App;
