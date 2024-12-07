import React from 'react';
import './App.css';
import { useState } from 'react';

function App() {
    // const handleIframeLogin = () => {
    //     const iframe = document.getElementById("myIframe");
    //     iframe.contentWindow.postMessage("login", "http://localhost:3000");
    // };

    const [page, setPage] = useState('start');
    const [siteURL, setSiteURL] = useState('');

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
                            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-md" />
                            
                        </div>
                    </>
                )
            }
            {/* <div style={{ width: "100%", height: "40vh" }}>
                <iframe
                    id="myIframe"
                    src="http://localhost:3000"
                    title="TrelloCopy"
                    width="100%"
                    height="200%"
                ></iframe>
            <button onClick={handleIframeLogin} className="btn btn-primary mt-4">
                Login in Iframe
            </button>
            <input type="text" className="form-control mt-4" placeholder="Enter your name" />
            </div> */}
        </>
    );
}

export default App;
