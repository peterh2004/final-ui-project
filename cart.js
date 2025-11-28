// Cart functionality using localStorage

// Initialize cart from localStorage or empty array
function getCart() {
    const cart = localStorage.getItem('rusticBeanCart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('rusticBeanCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(name, price, image) {
    const cart = getCart();
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartBadge();
    showAddedNotification(name);
}

// Remove item from cart
function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
    renderCart();
}

// Update item quantity
function updateQuantity(name, change) {
    const cart = getCart();
    const item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
            return;
        }
        saveCart(cart);
        renderCart();
    }
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem('rusticBeanCart');
    renderCart();
}

// Calculate cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart badge on cart icon
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    const count = getCartItemCount();
    
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Show notification when item is added
function showAddedNotification(name) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<span>✓</span> ${name} added to cart`;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Render cart on checkout page
function renderCart() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <p class="cart-empty-message">Your cart is empty</p>
            <a href="index.html" class="browse-menu-btn">Browse Menu</a>
        `;
        return;
    }
    
    let cartHTML = '<div class="cart-items">';
    
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">×</button>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    
    // Add cart summary
    const total = getCartTotal();
    const itemCount = getCartItemCount();
    
    cartHTML += `
        <div class="cart-summary">
            <div class="cart-summary-row">
                <span>Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="cart-summary-row">
                <span>Tax (8%)</span>
                <span>$${(total * 0.08).toFixed(2)}</span>
            </div>
            <div class="cart-summary-row cart-total">
                <span>Total</span>
                <span>$${(total * 1.08).toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>
                <button class="checkout-btn" onclick="processCheckout()">Place Order</button>
            </div>
        </div>
    `;
    
    cartContainer.innerHTML = cartHTML;
}

// Process checkout (placeholder)
function processCheckout() {
    const cart = getCart();
    if (cart.length === 0) return;
    
    const total = (getCartTotal() * 1.08).toFixed(2);
    alert(`Thank you for your order!\n\nTotal: $${total}\n\nYour order will be ready shortly.`);
    clearCart();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update cart badge
    updateCartBadge();
    
    // If on checkout page, render cart
    if (document.querySelector('.cart-container')) {
        renderCart();
    }
    
    // Add click handlers to all "Add to Order" buttons
    const addButtons = document.querySelectorAll('.add-to-order-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const name = card.querySelector('.product-name').textContent.trim();
            const priceText = card.querySelector('.product-price').textContent.trim();
            const price = priceText.replace('$', '');
            const image = card.querySelector('.product-image img').src;
            
            addToCart(name, price, image);
        });
    });
});

