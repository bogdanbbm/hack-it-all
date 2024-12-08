import React from 'react';
import './App.css';
import { useState } from 'react';


function App() {
    const [page, setPage] = useState('start');
    const [siteURL, setSiteURL] = useState('');

    const [prompt, setPrompt] = useState('');
    const [prompts, setPrompts] = useState([]);

    const [responses, setResponses] = useState([]);

    const [generatedTest, setGeneratedTest] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const sendMessageToIframe = (iframe) => {
        return new Promise((resolve, reject) => {
            const messageListener = (event) => {
                if (event.origin !== "http://localhost:3000") return; // Validate the origin
                if (event.data.action === 'html-response') {
                    window.removeEventListener("message", messageListener);
                    resolve(event.data.html);
                }
            };

            window.addEventListener("message", messageListener);

            iframe.contentWindow.postMessage({ action: "get-html" }, "http://localhost:3000");

            setTimeout(() => {
                window.removeEventListener("message", messageListener);
                reject(new Error('Timeout waiting for iframe response'));
            }, 5000);
        });
    };

    const sendActionToIframe = (iframe, data) => {
        iframe.contentWindow.postMessage(data, "http://localhost:3000");
    };

    const handleURLChange = () => {
        const regexURL = new RegExp('^(http|https)://', 'i');
        if (!regexURL.test(siteURL)) {
            alert('Invalid URL');
            return;
        }
        setPage('chat');
    }

    const handleSendPrompt = async () => {
        if (!prompt) {
            return;
        }
    
        const iframe = document.getElementById("myIframe");
        
        setIsLoading(true);

        try {
            const html = await sendMessageToIframe(iframe);
            setPrompts((prevPrompts) => [...prevPrompts, { prompt, html }]);
    
            const userInput = [{ prompt, html }];
            const response = await fetch('http://127.0.0.1:5000/api/prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_input: userInput }),
            });
    
            const responseText = await response.text();
            setResponses((prevResponses) => [
                ...prevResponses,
                typeof responseText === 'string' ? responseText : JSON.stringify(responseText),
            ]);
    
            const convertResponse = await fetch('http://127.0.0.1:5000/api/convert-playwright', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playwright_input: responseText, html_content: html }),
            });
    
            const convertData = await convertResponse.text();
            try {
                const json = JSON.parse(convertData.match(/\[.*\]/)[0]);
                console.log('Parsed JSON:', json);
            } catch (error) {
                console.error('Error parsing JSON:', convertData, error);
            }
            const json = JSON.parse('[' + convertData.split('[')[1].split(']')[0] + ']');
            console.log('responseText:', responseText);
            console.log('convertData:', convertData);
            setIsLoading(false);

            for (const element of json) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        sendActionToIframe(iframe, element);
                        resolve();
                    }, 200);
                });
            }
    
            console.log(json);
            setPrompt('');
            document.getElementById('input-prompt').value = '';
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const handleGenerateTest = () => {
        setIsLoading(true);
        fetch('http://127.0.0.1:5000/api/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: prompts, // Your list of commands
            }),
        })
            .then((res) => res.text()) // Read the response as plain text
            .then((data) => {
                setGeneratedTest(data.split('```')[1]) // Store it for further use
                setIsLoading(false);
                document.getElementById('my_modal_1').showModal()
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    console.log('responses', responses[0])
    return (
        <>
            {
                isLoading && (
                    <span className="absolute loading loading-spinner loading-lg" style={{
                        top: '50%',
                        left: '25%',
                        transform: 'translate(-50%, -50%)',
                    }}></span>
                )
            }
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
                            <button onClick={() => handleURLChange()} className="btn btn-ghost mt-2">Start</button>
                        </div>
                    </div>
                )
            }
            
            {
                (page === 'chat') && (
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
                                                {prompts[index].prompt}
                                            </p>

                                            {responses[index] && (
                                                <>
                                                    <p className='font-semibold text-left mx-1 text-[#FFA68A]'>
                                                        flawlesstest - Python Code
                                                    </p>
                                                    <div className='rounded-lg bg-[#FFA68A] min-h-10 w-3/4 mb-5 mx-1'>
                                                    <pre className="overflow-auto p-4 text-black font-semibold rounded-lg">
                                                    <code>
                                                        {responses[index]
                                                            .replace(/^```python\s*/, '') // Remove starting ```python
                                                            .replace(/```$/, '')}
                                                    </code>
                                                </pre>
                                                    </div>
                                                </>
                                            )}
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

            <dialog id="my_modal_1" className="modal">
                <div className="modal-box" style={{
                    minWidth: '50vw',
                }}>
                    <h3 className="font-bold text-lg">Generated test</h3>
                    <pre className="p-4 text-black text-semibold rounded-lg">
                        <code>
                            {generatedTest
                                .replace(/^```python\s*/, '') // Remove starting ```python
                                .replace(/```$/, '')}     
                        </code>
                    </pre>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
                    
                
            

        </>
    );
}

export default App;
