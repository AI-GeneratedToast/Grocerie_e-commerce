// Importing necessary modules from React and React Bootstrap
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import NavigationBar from '../../components/Navigation/navbar'; // Importing navigation bar component
import { useNavigate } from 'react-router-dom'; // Importing hook for navigation
const config = require('../../data/config.json'); // Importing configuration data

const AdminPage = () => {
  // State for storing products, new product data, and categories
  const [produits, setProduits] = useState([]);
  const [newProduit, setNewProduit] = useState({
    code: '',
    libelle: '',
    prix: '',
    categorie: ''
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  // Fetching products and categories from backend on component mount
  useEffect(() => {
    fetchProduits();
    fetchCategories();
  }, []);

  // Function to fetch products from backend
  const fetchProduits = async () => {
    try {
      const response = await fetch(`${config.apiURL}/produits`);
      const data = await response.json();
      setProduits(data);
    } catch (error) {
      console.error("There was an error fetching the products!", error);
    }
  };

  // Function to fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.apiURL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("There was an error fetching the categories!", error);
    }
  };

  // Function to handle input change for new product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduit({ ...newProduit, [name]: value });
  };

  // Function to create new product
  const handleCreateProduit = async () => {
    try {
      const response = await fetch(`${config.apiURL}/produit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newProduit),
      });
      if (response.ok) {
        console.log(newProduit)
        fetchProduits();
        navigate(0)
      } else {
        console.error("There was an error creating the product!");
      }
    } catch (error) {
      console.error("There was an error creating the product!", error);
    }
  };
  
  // Function to delete a product
  const handleDeleteProduit = async (id) => {
    try {
      const response = await fetch(`${config.apiURL}/produit/${id}`, {
        method: 'DELETE',
        credentials: 'include', 
      });

      if (response.ok) {
        fetchProduits();
        navigate(0)
      } else {
        console.error("There was an error deleting the product!");
      }
    } catch (error) {
      console.error("There was an error deleting the product!"+ error);
    }
  };
  

  return (
    <Container fluid>
      {/* Render NavigationBar component */}
      <NavigationBar/>
      {/* Header for Admin Page */}
      <h1 className="my-4">Admin Page</h1>
      <Row className="mb-4">
        <Col>
          {/* Form to create new product */}
          <h2>Create New Product</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={newProduit.code}
                onChange={handleInputChange}
                placeholder="Enter product code"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Libelle</Form.Label>
              <Form.Control
                type="text"
                name="libelle"
                value={newProduit.libelle}
                onChange={handleInputChange}
                placeholder="Enter product libelle"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prix</Form.Label>
              <Form.Control
                type="number"
                name="prix"
                value={newProduit.prix}
                onChange={handleInputChange}
                placeholder="Enter product price"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categorie</Form.Label>
              <Form.Control
                as="select"
                name="categorie"
                value={newProduit.categorie}
                onChange={handleInputChange}
              >
                <option>Select category</option>
                {/* Mapping categories to options */}
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.designation}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {/* Button to create product */}
            <Button variant="primary" onClick={handleCreateProduit}>
              Create Product
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Table to display product list */}
          <h2>Product List</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Code</th>
                <th>Libelle</th>
                <th>Prix</th>
                <th>Categorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapping products to table rows */}
              {produits.map((produit) => (
                <tr key={produit._id}>
                  <td>{produit.code}</td>
                  <td>{produit.libelle}</td>
                  <td>{produit.prix}</td>
                  {/* Finding category designation for each product */}
                  <td>{categories.find((categorie) => categorie._id === produit.categorie)?.designation}</td>
                  <td>
                    {/* Button to delete product */}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteProduit(produit._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
