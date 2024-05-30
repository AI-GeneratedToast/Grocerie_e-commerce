// Importing necessary modules from React
import React, { createContext, useState, useEffect } from 'react';
import config from '../../data/config.json'; // Importing configuration data

// Creating CartContext using createContext
export const CartContext = createContext({
    items: [],
    getProductQuantity: () => {},
    addOneToCart: () => {},
    removeOneFromCart: () => {},
    deleteFromCart: () => {},
    getTotalCost: () => {}
});

// CartProvider component to manage cart state
export function CartProvider({ children }) {
    // State for storing cart products and products fetched from backend
    const [cartProducts, setCartProducts] = useState([]);
    const [products, setProducts] = useState([]);

    // Fetching products from backend on component mount
    useEffect(() => {
        fetch(`${config.apiURL}/produits`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    // Function to get quantity of a product in cart
    function getProductQuantity(stripeId) {
        const quantity = cartProducts.find(product => product.stripeId === stripeId)?.quantity;
        return quantity === undefined ? 0 : quantity;
    }

    // Function to add one product to cart
    function addOneToCart(stripeId) {
        const quantity = getProductQuantity(stripeId);

        if (quantity === 0) {
            setCartProducts([...cartProducts, {stripeId, quantity: 1 }]);
        } else {
            setCartProducts(
                cartProducts.map(
                    product =>
                        product.stripeId === stripeId
                            ? { ...product, quantity: product.quantity + 1 }
                            : product
                )
            );
        }
    }

    // Function to remove one product from cart
    function removeOneFromCart(stripeId) {
        const quantity = getProductQuantity(stripeId);

        if (quantity === 1) {
            deleteFromCart(stripeId);
        } else {
            setCartProducts(
                cartProducts.map(
                    product =>
                        product.stripeId === stripeId
                            ? { ...product, quantity: product.quantity - 1 }
                            : product
                )
            );
        }
    }

    // Function to delete a product from cart
    function deleteFromCart(stripeId) {
        setCartProducts(
            cartProducts.filter(product => product.stripeId !== stripeId)
        );
    }

    // Function to calculate total cost of items in cart
    function getTotalCost() {
        let totalCost = 0;
        cartProducts.forEach((cartItem) => {
            const productData = products.find(product => product.stripeId === cartItem.stripeId);
            totalCost += (productData.prix * cartItem.quantity);
        });
        return totalCost;
    }

    // Value for CartContext provider
    const contextValue = {
        items: cartProducts,
        getProductQuantity,
        addOneToCart,
        removeOneFromCart,
        deleteFromCart,
        getTotalCost
    };

    // Rendering children components with CartContext.Provider
    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;
