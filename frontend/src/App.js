import React from 'react';
import './App.css';

function App() {

    const loginOnIframe = () => {
        const iframe = document.getElementById('myIframe');
        if (iframe) {
            // Send a message to the iframe to perform the action
            iframe.contentWindow.postMessage({ action: 'clickButton', target: '#login-button' }, 'http://localhost:3000');
        }
    };

    return (
        <>
            <div style={{ width: "100%", height: "40vh" }}>
                <iframe
                    id='myIframe'
                    src="http://localhost:3000"
                    title="TrelloCopy"
                    width="100%"
                    height="200%"
                ></iframe>
                <button onClick={() => loginOnIframe()}>Login on Iframe</button>
            </div>
        </>
    );
}

export default App;
