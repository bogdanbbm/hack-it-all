import React from 'react';
import './App.css';
import { useState } from 'react';

function App() {
    window.addEventListener("message", (event) => {
        if (event.origin !== "http://localhost:4000") return; // Verify sender
        
        const loginButton = document.getElementById("button-login");
        if (loginButton) {
            loginButton.click();
        } else {
            console.error("Login button not found!");
        }
    });


    const [state, setState] = useState('login');
    const [cart, setCart] = useState([]);

    const handleLogin = () => {
        const password = document.getElementById('input-password').value;
        const username = document.getElementById('input-username').value;

        if (username === 'test' && password === 'test') {
            setState('home');
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

    const handleRemoveCart = (name) => {
        setCart(cart.filter((item) => item !== name));
    };

    const handleToCart = () => {
        setState('cart');
    }

    const handleToHome = () => {
        setState('home');
    }

    const handleOrder = () => {
        if (cart.length === 5) {
            setState('invalid-cart');
            
            setTimeout(() => {
                setState('cart');
            }, 2000);
            return;
        }

        setCart([]);
        setState('submit');
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
                                        <button id='button-add-shoes1' onClick={() => handleAddCart(`Shoe ${cart.length + 1}`)} className="btn btn-primary">Add to cart</button>
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
                                        <button id='button-add-shoes2' onClick={() => handleAddCart(`Shoe ${cart.length + 1}`)} className="btn btn-primary">Add to cart</button>
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
                                        <button id='button-add-shoes3' onClick={() => handleAddCart(`Shoe ${cart.length + 1}`)} className="btn btn-primary">Add to cart</button>
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
                                        <button id='button-add-shoes4' onClick={() => handleAddCart(`Shoe ${cart.length + 1}`)} className="btn btn-primary">Add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )
            }

            {
                (state === 'cart' || state === 'invalid-cart') && (
                    <>
                        <div className="navbar bg-primary text-primary-content">
                            <div onClick={() => handleToHome()} className="flex-1">
                                <a className="btn btn-ghost text-xl">Awesome App</a>
                            </div>
                            <div className="flex-none">
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

                        <div className='flex justify-center'>
                            {
                                cart.length === 0 && (
                                    <div className='flex flex-col justify-center items-center'>
                                        <div className='text-2xl font-bold mb-8'>
                                            Cart is empty
                                        </div>
                                    </div>
                                )
                            }

                            {
                                cart.length > 0 && (
                                    <div class="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 w-96">
                                        <nav class="flex min-w-[240px] flex-col gap-1 p-1.5">
                                            {
                                                cart.map((item) => (
                                                    <div
                                                        role="button"
                                                        class="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                                                    >
                                                        {item === 'Shoe 5' ? 'Shoe 5 (out of stock)' : item}
                                                        <div class="ml-auto grid place-items-center justify-self-end">
                                                            <button onClick={() => handleRemoveCart(item)} class="rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                                                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <div
                                                class="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                                            >
                                                Subtotal: $999
                                            </div>
                                        </nav>
                                        
                                        <button className="btn btn-primary w-32 text-lg m-4" onClick={() => handleOrder()}>Submit</button>
                                    </div>
                                )
                            }
    

                        </div>


                    </>
                )
            }

            {
                state === 'invalid-cart' && (
                    <div className="toast toast-top toast-center">
                        <div className="alert alert-error">
                            <span>Items out of stock!</span>
                        </div>
                    </div>
                )
            }

            {
                state === 'submit' && (
                    <>
                        <div className="navbar bg-primary text-primary-content">
                            <div onClick={() => handleToHome()} className="flex-1">
                                <a className="btn btn-ghost text-xl">Awesome App</a>
                            </div>
                            <div className="flex-none">
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

                        <div className='flex justify-center'>
                            <div className='flex flex-col justify-center items-center'>
                                <div className='text-2xl font-bold mb-8'>
                                    Order submitted!
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
