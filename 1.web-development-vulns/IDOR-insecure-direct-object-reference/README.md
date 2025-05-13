# IDOR (Insecure Direct Object Reference)
IDOR is a type of access control vulnerability that occurs when an application exposes internal implementation objects (like database keys, filenames, or IDs) to users without proper authorization checks.

## Key Characteristics of IDOR
- The application uses direct references to objects (like user_id=123)
- No proper authorization checks are performed
- Attackers can manipulate these references to access unauthorized data

## Common Examples
1. Changing a URL parameter: `example.com/profile?user_id=123` → `example.com/profile?user_id=124`
2. Modifying API requests: `GET /api/orders/1001` → `GET /api/orders/1002`
3. Altering form fields: <input type="hidden" name="document_id" value="456">

## Prevention Techniques
- Implement proper access control checks for every request
- Use indirect references (maps internal IDs to temporary session IDs)
- Validate user permissions for each object access
- Use UUIDs instead of sequential IDs where appropriate
- Log and monitor for suspicious access patterns

## Impact
IDOR vulnerabilities can lead to unauthorized access to sensitive data, data breaches, and privacy violations.

## 1. Detailed Explanation of IDOR
IDOR occurs when an application exposes internal object references (e.g., database IDs, filenames) in URLs, API endpoints, or hidden form fields without proper authorization checks. Attackers can manipulate these references to access unauthorized data.

### Common Attack Scenarios
- URL Parameter Tampering:
`https://example.com/profile?id=123` → `https://example.com/profile?id=124`
- API Endpoint Manipulation:
`GET /api/invoices/1001` → `GET /api/invoices/1002`

### Hidden Field Modification:
`<input type="hidden" name="document_id" value="456">` → Changed to "457"

## 2. Node.js Example (Vulnerable Code)

### Scenario:
A web app allows users to view their own orders by passing an orderId in the URL. However, the backend does not verify if the requested order belongs to the logged-in user.

### Vulnerable Code (server.js):

```javascript
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
```

### Exploitation:

1. **Legitimate Request:**
User 1 accesses their own order:
`GET /orders/1001` → Returns `{ id: 1001, userId: 1, product: "Laptop" }` ✅

2. **Malicious Request:**
User 1 changes orderId to 1002 (belongs to User 2):
`GET /orders/1002` → Returns `{ id: 1002, userId: 2, product: "Phone" }` ❌ (Unauthorized access!)

### 3. Fixing IDOR in Node.js

**Solution: Check User Ownership Before Returning Data**

```javascript
app.get('/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const currentUserId = 1; // Normally from session/token

    const order = orders[orderId];

    if (!order) {
        return res.status(404).send("Order not found");
    }

    // ✅ Check if the order belongs to the current user
    if (order.userId !== currentUserId) {
        return res.status(403).send("Unauthorized access");
    }

    res.json(order);
});
```
### Best Practices to Prevent IDOR

1. Use Indirect References (e.g., UUIDs instead of sequential IDs).
2. Validate Permissions on every request (RBAC/ABAC).
3. Avoid Exposing Sensitive IDs in URLs or responses.
4. Use Session-Based Access Control (e.g., JWT claims).
5. Log & Monitor Suspicious Requests (e.g., repeated ID guessing).

## Final Thoughts
**IDOR** is a critical vulnerability that can lead to data breaches and privacy violations. Always implement proper authorization checks and follow the principle of least privilege. 🚀