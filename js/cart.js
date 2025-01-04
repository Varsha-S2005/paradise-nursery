// cart.js

// Initialize cart if it doesn't already exist in local storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart icon and cart summary
function updateCart() {
    // Update cart icon count
    const cartIcon = document.querySelector('header nav a[href="cart.html"]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartIcon.textContent = `Cart (${totalItems})`;

    // Update cart summary on the cart page
    if (document.body.classList.contains('cart-page')) {
        const cartContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');

        cartContainer.innerHTML = ''; // Clear current cart items

        let totalCost = 0;
        cart.forEach(item => {
            totalCost += item.quantity * item.price;

            // Create cart item elements
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h2>${item.name}</h2>
                <p>$${item.price}</p>
                <div class="quantity">
                    <button class="decrease">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
                <p>Total: $${item.quantity * item.price}</p>
                <button class="remove">Remove</button>
            `;

            // Add event listeners for quantity change and removal
            cartItem.querySelector('.increase').addEventListener('click', () => changeQuantity(item.name, 1));
            cartItem.querySelector('.decrease').addEventListener('click', () => changeQuantity(item.name, -1));
            cartItem.querySelector('.remove').addEventListener('click', () => removeItem(item.name));

            cartContainer.appendChild(cartItem);
        });

        // Update total cost
        cartSummary.querySelector('p:nth-child(1)').textContent = `Total Number of Items: ${totalItems}`;
        cartSummary.querySelector('p:nth-child(2)').textContent = `Total Cost: $${totalCost.toFixed(2)}`;
    }
}

// Function to add an item to the cart
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    // Save cart to local storage and update cart
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Function to change the quantity of an item in the cart
function changeQuantity(name, delta) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeItem(name); // If quantity goes to zero, remove item
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }
}

// Function to remove an item from the cart
function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Call updateCart to initialize the cart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});
