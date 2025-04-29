# IDOR (Insecure Direct Object Reference)
IDOR is a type of access control vulnerability that occurs when an application exposes internal implementation objects (like database keys, filenames, or IDs) to users without proper authorization checks.

## Key Characteristics of IDOR
The application uses direct references to objects (like user_id=123)

No proper authorization checks are performed

Attackers can manipulate these references to access unauthorized data

## Common Examples
Changing a URL parameter: example.com/profile?user_id=123 → example.com/profile?user_id=124

Modifying API requests: GET /api/orders/1001 → GET /api/orders/1002

Altering form fields: <input type="hidden" name="document_id" value="456">

## Prevention Techniques
Implement proper access control checks for every request

Use indirect references (maps internal IDs to temporary session IDs)

Validate user permissions for each object access

Use UUIDs instead of sequential IDs where appropriate

Log and monitor for suspicious access patterns

## Impact
IDOR vulnerabilities can lead to unauthorized access to sensitive data, data breaches, and privacy violations.