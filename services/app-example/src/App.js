import React from 'react';
import './App.css';
import { useState } from 'react';

function App() {
    const [state, setState] = useState('login');
    const [username, setUsername] = useState('');
    const [cart, setCart] = useState([]);

    const handleLogin = () => {
        const password = document.getElementById('input-password').value;
        const username = document.getElementById('input-username').value;

        if (username === 'test' && password === 'test') {
            setState('home');
            setUsername(username);
        } else {
            setState('invalid-login');

            setTimeout(() => {
                setState('login');
            }, 2000);
        }
    }

    const handleLogout = () => {
        setState('login');
    }

    const handleAddCart = (name) => {
        setCart([...cart, name]);
    } 

    const handleToCart = () => {
        setState('cart');
    }

    return (
        <>

            {
                (state === 'login' || state === 'invalid-login') && (
                    <div className='flex flex-col h-screen justify-center items-center'>

                        <div className='text-2xl font-bold mb-8'>
                            Awesome App
                        </div>

                        <label className="input input-bordered flex items-center gap-2 mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input id='input-username' type="text" className="grow" placeholder="Username" />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mb-8">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                            </svg>
                            <input id='input-password' type="password" placeholder="Password" className="grow" />
                        </label>
                        <button id='button-login' className="btn btn-primary w-32 text-lg" onClick={() => handleLogin()}>Login</button>
                    </div>
                )
            }

            {
                state === 'invalid-login' && (
                    <div className="toast toast-top toast-center">
                        <div className="alert alert-error">
                            <span>Wrong password</span>
                        </div>
                    </div>
                )
            }

            {
                state === 'home' && (
                    <>
                        <div className="navbar bg-primary text-primary-content">
                            <div className="flex-1">
                                <a className="btn btn-ghost text-xl">Awesome App</a>
                            </div>
                            <div className="flex-none">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                        <div className="indicator">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="badge badge-sm indicator-item">{cart.length}</span>
                                        </div>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
                                        <div className="card-body">
                                            <span className="text-lg font-bold">{cart.length} Items</span>
                                            <span className="text-info">Subtotal: $999</span>
                                            <div className="card-actions">
                                                <button className="btn btn-primary btn-block" onClick={() => handleToCart()}>View cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img
                                                alt="Tailwind CSS Navbar component"
                                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                        </div>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu text-black menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                        <li><a onClick={() => handleLogout()}>Logout</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-wrap justify-center'>
                            <div className="card bg-base-100 w-96 shadow-xl m-8">
                                <figure>
                                    <img
                                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                        alt="Shoes" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">Shoes!</h2>
                                    <div className="card-actions justify-end">
                                        <button id='button-add-shoes1' onClick = {() => handleAddCart('shoes1')} className="btn btn-primary">Add to cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-base-100 w-96 shadow-xl m-8">
                                <figure>
                                    <img
                                        src="https://www.shooos.ro/media/catalog/product/cache/8/image/1350x778/9df78eab33525d08d6e5fb8d27136e95/a/d/adidas-campus-00s-h034721.jpg"
                                        alt="Shoes" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">Shoes!</h2>
                                    <div className="card-actions justify-end">
                                        <button id='button-add-shoes2' onClick = {() => handleAddCart('shoes2')} className="btn btn-primary">Add to cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-base-100 w-96 shadow-xl m-8">
                                <figure>
                                    <img
                                        src="https://www.shoepalace.com/cdn/shop/products/523e73600d33bd7a286c9188d373421a_2048x2048.jpg?v=1696266047&title=puma-396463-05-palermo-mens-lifestyle-shoes-green-yellow"
                                        alt="Shoes" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">Shoes!</h2>
                                    <div className="card-actions justify-end">
                                        <button id='button-add-shoes3' onClick = {() => handleAddCart('shoes3')} className="btn btn-primary">Add to cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-base-100 w-96 shadow-xl m-8">
                                <figure>
                                    <img
                                        src="https://m.media-amazon.com/images/I/61VsUwAaEQL._AC_UY900_.jpg"
                                        alt="Shoes" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">Shoes!</h2>
                                    <div className="card-actions justify-end">
                                        <button id='button-add-shoes4' onClick = {() => handleAddCart('shoes4')} className="btn btn-primary">Add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </>
                )
            }

            {
                state === 'cart' && (
                    <>
                        <div className="navbar bg-primary text-primary-content">
                            <div className="flex-1">
                                <a className="btn btn-ghost text-xl">Awesome App</a>
                            </div>
                            <div className="flex-none">
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
                                        <div className="card-body">
                                            <span className="text-lg font-bold">{cart.length} Items</span>
                                            <span className="text-info">Subtotal: $999</span>
                                            <div className="card-actions">
                                                <button className="btn btn-primary btn-block" onClick={() => handleToCart()}>View cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img
                                                alt="Tailwind CSS Navbar component"
                                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                        </div>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu text-black menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                        <li><a onClick={() => handleLogout()}>Logout</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>


                        
                    </>
                )
            }


        </>
    );
}

export default App;
