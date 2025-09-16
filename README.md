# Server API Documentation

## Locations API (`locations.routes.js`)

### GET `/locations`
**Description:** Returns all locations stored in the database

**Response Example:**
```json
[
  {
    "id": 3,
    "created_at": "2025-09-15T10:56:25.370917+00:00",
    "description": "living in the building",
    "lat": 31.4167,
    "lon": 34.3333,
    "type": "soldier"
  }
]
```

---

### POST `/locations`
**Description:** Adds a new location to the database

**Request Example:**
```json
{
  "description": "test",
  "lat": 31.4167,
  "lon": 34.3333,
  "type": "soldier"
}
```

**Response Example:**
```json
{
  "message": "Location added successfully"
}
```

---

### GET `/locations/:lat/:lon`
**Description:** Checks if a location point exists in the database and returns its information

**Request Example:**
```
GET http://localhost:6578/locations/31.4167/34.3333
```

**Response Example - If exists:**
```json
[
  {
    "id": 3,
    "created_at": "2025-09-15T10:56:25.370917+00:00",
    "description": "living in the building",
    "lat": 31.4167,
    "lon": 34.3333,
    "type": "soldier"
  }
]
```

**Response Example - If not exists:**
```json
{
  "exists": false
}
```

---

## Users API (`user.routes.js`)

### POST `/users/login`
**Description:** Authenticates user with username and password, returns authentication status and user role

**Request Example:**
```json
{
  "username": "adminTest",
  "password": "adminTest"
}
```

**Response Example:**
```json
{
  "status": true,
  "role": "admin"
}
```

---

### GET `/users`
**Description:** Returns all users from the users table

**Response:** Array of user objects from the database

---

## Notes
- Base URL: `http://localhost:6578`
- All coordinates use standard latitude/longitude format
- User types include "soldier" and potentially others
- Authentication returns boolean status with user role