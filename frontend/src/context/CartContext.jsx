import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, quantity, instructions) => {
        setCartItems(prevItems => {
            // Check if item already exists with the same instructions
            const existingItemIndex = prevItems.findIndex(
                i => i.id === item.id && i.instructions === instructions
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                return [...prevItems, { ...item, quantity, instructions }];
            }
        });
    };

    const removeFromCart = (cartItemId) => {
        // Here we use a unique index or internal ID for the cart line item
        // But for simplicity, we'll filter by a combination of ID and instructions if index isn't passed
        setCartItems(prevItems => prevItems.filter((_, index) => index !== cartItemId));
    };

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].quantity = newQuantity;
            return updatedItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalCount,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
