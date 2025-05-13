const express = require('express');
const app = express();
const port = 3000;

// Mock database of orders
const orders = {
    1001: { id: 1001, userId: 1, product: "Laptop" },
    1002: { id: 1002, userId: 2, product: "Phone" },
    1003: { id: 1003, userId: 1, product: "Tablet" }
};

// Middleware to simulate authentication (but no authorization check!)
app.get('/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const order = orders[orderId];

    if (!order) {
        return res.status(404).send("Order not found");
    }

    // ❌ No check if the order belongs to the current user!
    res.json(order);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});