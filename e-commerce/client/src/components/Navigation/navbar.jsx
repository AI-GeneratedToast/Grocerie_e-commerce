// Importing necessary modules from React and React Bootstrap
import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/logo.jpg';
import config from '../../data/config.json';
import { faCartShopping, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import CartContext from '../cartContext/cartContext'; // Importing CartContext for managing cart state
import Button from 'react-bootstrap/Button';

function NavigationBar() {
  // Accessing cart state using useContext hook
  const cart = useContext(CartContext);
  const [user, setUser] = useState({}); // State for storing user data
  const navigate = useNavigate(); // Hook for navigating between pages
  const productCount = cart.items.reduce((sum, product) => sum + product.quantity, 0); // Calculating total products in cart

  // State for managing modal visibility
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // State for storing products fetched from API
  const [products, setProducts] = useState([]);

  // useEffect hook to fetch current user and products on component mount
  useEffect(() => {
    getCurrentUser();
    fetchProducts();
  }, []);

  // Function to initiate checkout process
  const checkout = async () => {
    await fetch(`${config.apiURL}/checkout`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: cart.items })
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.url) {
        window.location.assign(response.url); // Forwarding user to Stripe for payment
      }
    });
  }

  // Function to fetch current user data from backend
  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${config.apiURL}/user`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        console.log("There is no user session");
        setUser({});
      } else {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Function to fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${config.apiURL}/produits`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to log out user
  const logOutUser = async () => {
    try {
      const response = await fetch(`${config.apiURL}/user/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser({});
      navigate('/');
    } catch (err) {
      console.error("Error logging out: " + err);
    }
  };

  // Function to determine the page to navigate based on user authentication status
  const showProductPage = () => {
    if (user.email) {
      return '/catalog';
    } else {
      return '/login';
    }
  };

  return (
    <Container fluid>
      {/* Navbar component */}
      <Navbar className="shadow-sm" bg="light">
        <Nav className="me-auto">
          {/* Brand logo and name */}
          <Navbar.Brand href="/">
            <img
              src={logo}
              width="35"
              height="30"
              className="d-inline-block align-top"
              alt="Logo"
            />{' '}
            The Good Foods
          </Navbar.Brand>

          {/* Navigation links */}
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href={showProductPage()}>Products</Nav.Link>
          {user.role === 'admin' && <Nav.Link href='/adminpage'>Admin Page</Nav.Link>}
          <Nav.Link href={`${config.apiURL}/api-docs`}>API-Docs</Nav.Link>
        </Nav>

        {/* User-related navigation links */}
        <Nav>
          {/* Shopping cart icon with product count */}
          {user.email && (
            <Nav.Link onClick={handleShow}>
              ({productCount}) <FontAwesomeIcon size='lg' icon={faCartShopping} />
            </Nav.Link>
          )}
          {/* Display user email */}
          <Nav.Link className='fw-bold'>{user.email}</Nav.Link>
          {/* Logout icon */}
          {user.email && <Nav.Link onClick={logOutUser}><FontAwesomeIcon size='lg' icon={faSignOut} /></Nav.Link>}
        </Nav>
      </Navbar>

      {/* Shopping cart modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Shopping Cart</Modal.Title>
          <hr />
        </Modal.Header>
        <Modal.Body>
          {productCount > 0 ? (
            <>
              {/* Display items in cart */}
              <p>Items in your cart:</p>
              {cart.items.map((currentProduct, idx) => {
                const product = products.find(p => p.stripeId === currentProduct.stripeId); // Finding product details based on stripeId
                return (
                  <div key={idx}>
                    <h5>{product.libelle}</h5> {/* Displaying product name */}
                    <p>Quantity: {currentProduct.quantity}</p>
                    <hr />
                  </div>
                );
              })}
              {/* Display total cost and button for checkout */}
              <h4>Total: {cart.getTotalCost().toFixed(2)}$</h4>
              <Button variant="success" onClick={checkout}>
                Purchase items!
              </Button>
            </>
          ) : (
            // Message when cart is empty
            <h1>There are no items in your cart!</h1>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
export default NavigationBar;
