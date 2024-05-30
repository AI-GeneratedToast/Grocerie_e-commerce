import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from '../Navigation/navbar';
const config = require("../../data/config.json");

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const EnterAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiURL}/user/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        setEmailError(errorData.errors.email);
        setPasswordError(errorData.errors.password);
      } else {
        // Clear any error messages
        setEmailError('');
        setPasswordError('');
        // Navigate to the catalog page and replace history
        window.history.replaceState(null, '' ,'/')
        navigate('/catalog');
      }
    } catch (error) {
      console.log("Cannot create a user: " + error);
    }
  };

  return (
    <div>
      <NavigationBar />

      <form onSubmit={EnterAccount}>
        <MDBContainer className="my-5">

          <MDBCard>
            <MDBRow className='g-0'>

              <MDBCol md='6'>
                <MDBCardImage src={logo} alt="login form" className='rounded-start w-100' />
              </MDBCol>

              <MDBCol md='6'>
                <MDBCardBody className='d-flex flex-column'>

                  <div className='d-flex flex-row mt-2'>
                    <span className="h1 fw-bold mb-0">The Good Foods</span>
                  </div>

                  <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>

                  <MDBInput
                    name='email'
                    onChange={e => { setEmail(e.target.value) }}
                    required
                    wrapperClass='mb-4'
                    label='Email address'
                    id='formControlLg'
                    type='email'
                    size="lg"
                  />
                  <p className='text-danger' name='emailError'>{emailError}</p>
                  <MDBInput
                    name='password'
                    onChange={e => { setPassword(e.target.value) }}
                    required
                    wrapperClass='mb-4'
                    label='Password'
                    id='formControlLg'
                    type='password'
                    size="lg"
                  />
                  <p className='text-danger' name='passwordError'>{passwordError}</p>

                  <MDBBtn className="mb-4 px-5" color='dark' size='lg'>Log in</MDBBtn>
                  <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account? <Link to={'/signup'} style={{ color: '#393f81' }}>Register here</Link></p>

                </MDBCardBody>
              </MDBCol>

            </MDBRow>
          </MDBCard>

        </MDBContainer>
      </form>
    </div>
  );
}

export default LogIn;
