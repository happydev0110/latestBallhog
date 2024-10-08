// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// import Dashboard from './components/Dashboard';
import React, { useState } from 'react';
import Event from './components/Event';

import 'bootstrap/dist/css/bootstrap.css'
import './assets/App.css';

const PASSWORD = 'BallHog'

function App() {
  const [access, setAccess] = useState(false);
  const [pass, setPass] = useState();

  const getAccess = () => {
    // console.log(localStorage.getItem('password'), 'password')
    let status = false;

    if (localStorage.getItem('password') === PASSWORD) {
      status = true
    }

    return status
  }

  return (
    <>
      <div className="p-2 bg-primary text-white text-left">
        <h1 className='text-center text-uppercase'>BALLHOG</h1>
      </div>
      <div className='container'>
        {/* <Dashboard /> */}
        <Event /> 
        {/* {
          getAccess() ?
            <Event /> :
            <div className='my-3'>
              <div className='row'>
                <div className='col-12 text-center'>
                  <input
                    className='col-12'
                    value={pass}
                    onChange={(evt) => {
                      setPass(evt.target.value);
                      setAccess(false);
                    }}
                  />
                  <button
                    className='btn btn-primary mt-3'
                    onClick={() => {
                      setAccess(true);
                      localStorage.setItem('password', pass);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
        } */}
      </div>
    </>
  );
}

export default App;
