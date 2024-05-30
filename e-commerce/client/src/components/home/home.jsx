import React, { useEffect } from 'react';
import NavigationBar from '../Navigation/navbar';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import OnTime from '../../assets/onTime.jpg';
import Produce from '../../assets/produce.jpg';
import Trust from '../../assets/trust.jpeg';
import Container from 'react-bootstrap/esm/Container';
import { useNavigate } from 'react-router-dom';
const config = require('../../data/config.json');

function Home() {
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${config.apiURL}/user`, {
        method: 'GET',
        credentials: 'include'
      });
      
      //If the response can't get a user there is no cookie
      if (!response.ok) {
        navigate('/signup');
      }else{
        navigate('/catalog');
      }
            
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  return (
    <div>
      <NavigationBar/>
      <Container  className=" mt-4 py-5 text-center bg-light shadow-sm">
        <h1 className="display-5 fw-bold">Welcome To The Good Foods</h1>
        <p className="fs-4 col-md-12">Effortlessly stock your pantry and fridge with our comprehensive selection of groceries, delivered right to your door for ultimate convenience</p>

        <Carousel className='shadow-lg' style={{ height: '650px' , objectFit: 'cover'}}> 
          <Carousel.Item interval={1000}>
            <img
              className="d-block w-100"
              src={OnTime}
              alt="First slide"
              style={{ height: '650px', objectFit: 'cover' }} 
            />
          </Carousel.Item>
          <Carousel.Item interval={1000}>
            <img
              className="d-block w-100"
              src={Produce}
              alt="Second slide"
              style={{ height: '650px', objectFit: 'cover' }} 
            />
          </Carousel.Item>
          <Carousel.Item interval={1000}>
            <img
              className="d-block w-100"
              src={Trust}
              alt="Third slide"
              style={{ height: '650px', objectFit: 'cover' }}
            />
          </Carousel.Item>
        </Carousel>

        <button onClick={getCurrentUser} className="btn btn-primary btn-lg mt-4">
          Start Shopping
        </button>
      </Container>
    </div>
  );
}

export default Home;
