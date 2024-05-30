// Importing necessary modules from React and React Bootstrap
import React, { useEffect, useState, useContext } from 'react';
import NavigationBar from '../Navigation/navbar'; // Importing navigation bar component
import FoodImg from '../../assets/logo.jpg'; // Importing food image
import { CartContext } from '../cartContext/cartContext'; // Importing CartContext for managing cart state
import { Card, Button, Form, Row, Col, Container, Spinner } from 'react-bootstrap'; // Importing Bootstrap components

const config = require('../../data/config.json'); // Importing configuration data

function Catalog() {
  // State for storing products and loading status
  const [produits, setProduits] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const cart = useContext(CartContext); // Accessing cart state using useContext hook

  // Fetching products from backend on component mount
  useEffect(() => {
    fetch(`${config.apiURL}/produits`)
      .then(res => res.json())
      .then(data => {
        setProduits(data);
        setDataLoaded(true);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // Function to display product card
  const displayCard = (produit, index) => {
    return (
      <Card key={produit.code} style={{ width: '19rem', margin: '10px' }}>
        <Card.Img variant="top" src={FoodImg} />
        <Card.Body>
          <hr />
          <Card.Title className='fs-3'>{produit.libelle}</Card.Title> {/* Displaying product name */}
          <Card.Text>Price: {produit.prix}$</Card.Text> {/* Displaying product price */}
          {/* Conditional rendering for adding/removing product from cart */}
          {cart.getProductQuantity(produit.stripeId) > 0 ? (
            <div>
              <Form as={Row}>
                <Form.Label column="true" sm="6">In Cart: {cart.getProductQuantity(produit.stripeId)}</Form.Label>
                <Col sm="6" className="d-flex">
                  <Button onClick={() => cart.addOneToCart(produit.stripeId)} className="mx-2">+</Button>
                  <Button onClick={() => cart.removeOneFromCart(produit.stripeId)} className="mx-2">-</Button>
                </Col>
              </Form>
              <Button variant="danger" onClick={() => cart.deleteFromCart(produit.stripeId)} className="my-2">Remove from cart</Button>
            </div>
          ) : (
            <Button onClick={() => cart.addOneToCart(produit.stripeId)} variant="primary">Add to cart</Button>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      {/* Render NavigationBar component */}
      <NavigationBar />
      {/* Header for displaying available products */}
      <h1 className='text-center mt-3 mb-5'>Available Products</h1>
      <Container>
        <Row className='d-flex'>
          {/* Conditional rendering based on data loading status */}
          {dataLoaded ? produits.map((produit, index) => (
            <Col key={index} lg={4}>
              {displayCard(produit, index)}
            </Col>
          )) : (
            <Col className='text-center'>
              {/* Spinner for indicating loading */}
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <h2 className='mt-3 text-primary'>Loading products...</h2>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Catalog;
