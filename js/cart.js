// Initialize cart array in localStorage (if it's not already there)
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Get the cart data
function getCart() {
    return JSON.parse(localStorage.getItem('cart'));
}

// Update cart in localStorage
function updateCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(product) {
    const cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Product already in the cart, increment quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to the cart
        cart.push({ ...product, quantity: 1 });
    }

    updateCart(cart);
    updateCartIcon();
}

// Update cart icon with total item count
function updateCartIcon() {
    const cart = getCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.querySelector('.cart-icon').textContent = `Cart (${totalItems})`;
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    updateCart(cart);
    updateCartIcon();
    renderCart();
}

// Increase quantity of an item in cart
function increaseQuantity(productId) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    }

    updateCart(cart);
    renderCart();
    updateCartIcon();
}

// Decrease quantity of an item in cart
function decreaseQuantity(productId) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1 && cart[productIndex].quantity > 1) {
        cart[productIndex].quantity -= 1;
    }

    updateCart(cart);
    renderCart();
    updateCartIcon();
}

// Render the cart on cart page
function renderCart() {
    const cart = getCart();
    const cartContainer = document.querySelector('.cart-items');
    const totalCostContainer = document.querySelector('.total-cost');

    cartContainer.innerHTML = ''; // Clear existing cart items
    let totalCost = 0;

    cart.forEach(item => {
        totalCost += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h2>${item.name}</h2>
                <p>$${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    totalCostContainer.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
}

// Load initial cart data and update cart icon
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
    renderCart();
});
