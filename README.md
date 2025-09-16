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
false
```

---

## Users API (`user.routes.js`)

### POST `/users/checkUser`
**Description:** Authenticates user with username and password, returns authentication status and user role

**Request Example:**
```json
{
  "username": "adminTest",
  "password": "adminTest"
}
```

**Response Example - Success:**
```json
{
  "status": true,
  "role": "admin"
}
```

**Response Example - Failed:**
```json
false
```

---

### GET `/users`
**Description:** Returns all users from the users table

**Response:** Array of user objects from the database

---

## Suspicious Points API (`suspicious.routes.js`)

### POST `/suspiciousPoints`
**Description:** Adds a new suspicious point to the database

**Request Example:**
```json
{
  "description": "Suspicious activity reported",
  "lat": 31.4167,
  "lon": 34.3333,
  "status": "pending"
}
```

**Response Example:**
```json
{
  "result": "success",
  "message": "Suspicious point added successfully"
}
```

**Error Response:**
```json
{
  "message": "All fields are required"
}
```

---

### GET `/suspiciousPoints`
**Description:** Returns all suspicious points from the database

**Response Example:**
```json
[
  {
    "id": 1,
    "created_at": "2025-09-15T10:56:25.370917+00:00",
    "description": "Suspicious activity reported",
    "lat": 31.4167,
    "lon": 34.3333,
    "status": "pending"
  }
]
```

---

## Database Schema

**Tables:**
- `locations` - Stores location data with coordinates and type
- `users` - Stores user authentication data
- `SuspiciousPoints` - Stores suspicious activity reports

**Required Fields:**
- **Locations:** `description`, `lat`, `lon`, `type`
- **Users:** `username`, `password`, `role`
- **Suspicious Points:** `description`, `lat`, `lon` (status is optional)

---

## Notes
- Base URL: `http://localhost:6578`
- All coordinates use standard latitude/longitude format
- User types include "soldier" and potentially others
- Authentication returns boolean status with user role
- Images are processed into 384x384 pixel tiles
- CORS is enabled for cross-origin requests
- Server runs with `--watch` flag for development