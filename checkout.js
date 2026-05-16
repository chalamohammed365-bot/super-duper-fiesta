// Checkout JavaScript - Order Processing & Payment Handler

class CheckoutManager {
    constructor() {
        this.cart = [];
        this.orderData = null;
        this.init();
    }

    init() {
        this.loadCart();
        this.setupPaymentMethodListeners();
        this.setupFormSubmission();
        this.displayOrderSummary();
    }

    loadCart() {
        const cartData = localStorage.getItem('novaShopCart');
        this.cart = cartData ? JSON.parse(cartData) : [];
        
        if (this.cart.length === 0) {
            this.showError('Your cart is empty. Redirecting to cart...');
            setTimeout(() => window.location.href = 'cart.html', 2000);
        }
    }

    displayOrderSummary() {
        const summaryItemsDiv = document.getElementById('summaryItems');
        let subtotal = 0;

        summaryItemsDiv.innerHTML = '';

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'summary-item';
            itemDiv.innerHTML = `
                <span class="summary-item-name">${item.name} x${item.quantity}</span>
                <span class="summary-item-price">ETB ${(itemTotal).toLocaleString()}</span>
            `;
            summaryItemsDiv.appendChild(itemDiv);
        });

        this.updateOrderTotals(subtotal);
    }

    updateOrderTotals(subtotal) {
        const tax = Math.round(subtotal * 0.15);
        const deliveryFee = subtotal > 5000 ? 0 : 250;
        const total = subtotal + tax + deliveryFee;

        document.getElementById('subtotal').textContent = `ETB ${subtotal.toLocaleString()}`;
        document.getElementById('taxAmount').textContent = `ETB ${tax.toLocaleString()}`;
        document.getElementById('deliveryFee').textContent = deliveryFee === 0 ? 'FREE' : `ETB ${deliveryFee}`;
        document.getElementById('totalPrice').textContent = `ETB ${total.toLocaleString()}`;

        this.orderData = {
            subtotal,
            tax,
            deliveryFee,
            total,
            items: this.cart
        };
    }

    setupPaymentMethodListeners() {
        const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
        
        paymentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                // Hide all details
                document.querySelectorAll('.payment-details').forEach(detail => {
                    detail.classList.remove('active');
                });
                
                // Show selected payment details
                const methodId = e.target.value + 'Details';
                const detailsElement = document.getElementById(methodId);
                if (detailsElement) {
                    detailsElement.classList.add('active');
                }
            });
        });
    }

    setupFormSubmission() {
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        
        placeOrderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.processCheckout();
        });
    }

    validateForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const zone = document.getElementById('zone').value.trim();

        if (!firstName || firstName.length < 2) {
            this.showError('Please enter a valid first name');
            return false;
        }

        if (!lastName || lastName.length < 2) {
            this.showError('Please enter a valid last name');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }

        if (!phone || phone.length < 10) {
            this.showError('Please enter a valid phone number');
            return false;
        }

        if (!address || address.length < 5) {
            this.showError('Please enter a valid street address');
            return false;
        }

        if (!city || city.length < 2) {
            this.showError('Please enter a valid city');
            return false;
        }

        if (!zone || zone.length < 2) {
            this.showError('Please enter a valid zone/region');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    processCheckout() {
        if (!this.validateForm()) {
            return;
        }

        const placeOrderBtn = document.getElementById('placeOrderBtn');
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Simulate processing delay
        setTimeout(() => {
            const order = this.generateOrder();
            this.saveOrder(order);
            this.showSuccessPage(order);
            
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
        }, 1500);
    }

    generateOrder() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zone = document.getElementById('zone').value;
        const notes = document.getElementById('notes').value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        const orderId = this.generateOrderId();
        const timestamp = new Date().toISOString();

        return {
            orderId,
            timestamp,
            customer: {
                firstName,
                lastName,
                email,
                phone
            },
            delivery: {
                address,
                city,
                zone,
                notes
            },
            paymentMethod,
            items: this.cart,
            subtotal: this.orderData.subtotal,
            tax: this.orderData.tax,
            deliveryFee: this.orderData.deliveryFee,
            total: this.orderData.total,
            status: 'confirmed'
        };
    }

    generateOrderId() {
        const prefix = 'NS';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    saveOrder(order) {
        // Get existing orders
        const ordersData = localStorage.getItem('novaShopOrders');
        const orders = ordersData ? JSON.parse(ordersData) : [];
        
        // Add new order
        orders.push(order);
        
        // Save back to localStorage
        localStorage.setItem('novaShopOrders', JSON.stringify(orders));
        
        // Store current order for display
        localStorage.setItem('currentOrder', JSON.stringify(order));
    }

    showSuccessPage(order) {
        // Hide checkout form
        const checkoutForm = document.getElementById('checkoutForm');
        const successContainer = document.getElementById('successContainer');
        
        checkoutForm.style.display = 'none';
        successContainer.classList.add('show');

        // Display order ID
        document.getElementById('orderIdDisplay').textContent = order.orderId;

        // Update WhatsApp link
        const whatsappLink = document.getElementById('whatsappLink');
        const whatsappMessage = `Hi NovaShop, I just placed order #${order.orderId}. Customer name: ${order.customer.firstName} ${order.customer.lastName}`;
        whatsappLink.href = `https://wa.me/0983156393?text=${encodeURIComponent(whatsappMessage)}`;

        // Track conversion
        if (window.fbq) {
            fbq('track', 'Purchase', {
                currency: 'ETB',
                value: order.total
            });
        }

        // Clear cart after successful order
        localStorage.removeItem('novaShopCart');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        errorText.textContent = message;
        errorElement.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);

        // Scroll to error
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialize checkout when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
});
