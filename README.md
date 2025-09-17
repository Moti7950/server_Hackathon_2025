# API Documentation - Intelligence Attack System

## מידע כללי 📡

**Base URL:** `http://localhost:6578`  
**Production URL:** `https://server-hackathon-2025.onrender.com:6578`  
**Protocol:** HTTP/HTTPS  
**Format:** JSON  
**Authentication:** JWT Tokens (where applicable)

---

## 🏢 Users API (`/users`)

### POST `/users/checkUser`
**תיאור:** אימות משתמש במערכת

**Headers:**
```
Content-Type: application/json
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | ✅ | שם המשתמש |
| password | string | ✅ | סיסמת המשתמש |

**Request Example:**
```json
{
  "username": "adminTest",
  "password": "adminTest"
}
```

**Response - הצלחה:**
```json
{
  "status": true,
  "role": "admin"
}
```

**Response - כשל:**
```json
false
```

**Status Codes:**
- `200` - אימות הצליח
- `401` - פרטי התחברות שגויים
- `400` - חסרים פרמטרים נדרשים

---

### GET `/users`
**תיאור:** קבלת רשימת כל המשתמשים במערכת

**Response Example:**
```json
[
  {
    "id": 1,
    "username": "adminTest",
    "role": "admin",
    "created_at": "2025-09-15T10:56:25.370917+00:00"
  },
  {
    "id": 2,
    "username": "operator1",
    "role": "operator",
    "created_at": "2025-09-15T11:20:15.220817+00:00"
  }
]
```

---

## 📍 Locations API (`/locations`)

### GET `/locations`
**תיאור:** קבלת כל המיקומים שמורים במערכת

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
  },
  {
    "id": 4,
    "created_at": "2025-09-15T11:15:30.140292+00:00",
    "description": "patrol checkpoint",
    "lat": 31.4180,
    "lon": 34.3350,
    "type": "checkpoint"
  }
]
```

---

### POST `/locations`
**תיאור:** הוספת מיקום חדש למסד הנתונים

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| description | string | ✅ | תיאור המיקום |
| lat | number | ✅ | קו רוחב (latitude) |
| lon | number | ✅ | קו אורך (longitude) |
| type | string | ✅ | סוג המיקום (soldier, checkpoint, etc.) |

**Request Example:**
```json
{
  "description": "Forward observation post",
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

**Status Codes:**
- `201` - מיקום נוסף בהצלחה
- `400` - חסרים פרמטרים נדרשים
- `500` - שגיאת שרת פנימית

---

### GET `/locations/:lat/:lon`
**תיאור:** בדיקה אם מיקום ספציפי קיים במסד הנתונים

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| lat | number | קו רוחב |
| lon | number | קו אורך |

**Request Example:**
```
GET /locations/31.4167/34.3333
```

**Response - המיקום קיים:**
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

**Response - המיקום לא קיים:**
```json
false
```

---

### POST `/locations/area`
**תיאור:** בדיקת מיקומים בתוך אזור גיאוגרפי מוגדר (polygon)

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| polygon | GeoJSON | ✅ | משולש או מצולע בפורמט GeoJSON |

**Request Example:**
```json
{
  "polygon": {
    "type": "Polygon",
    "coordinates": [[
      [34.3300, 31.4150],
      [34.3400, 31.4150],
      [34.3400, 31.4200],
      [34.3300, 31.4200],
      [34.3300, 31.4150]
    ]]
  }
}
```

---

## 🚨 Suspicious Points API (`/suspiciousPoints`)

### POST `/suspiciousPoints`
**תיאור:** הוספת נקודה חשודה חדשה למערכת

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| description | string | ✅ | תיאור הפעילות החשודה |
| lat | number | ✅ | קו רוחב |
| len | number | ✅ | קו אורך |
| status | string | ❌ | סטטוס (pending, investigating, resolved) |

**Request Example:**
```json
{
  "description": "Unknown vehicle spotted near perimeter",
  "lat": 31.4167,
  "len": 34.3333,
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

**Status Codes:**
- `201` - נקודה חשודה נוספה בהצלחה
- `400` - חסרים פרמטרים נדרשים
- `500` - שגיאת שרת פנימית

---

### GET `/suspiciousPoints`
**תיאור:** קבלת כל הנקודות החשודות מהמערכת

**Response Example:**
```json
[
  {
    "id": 1,
    "created_at": "2025-09-15T10:56:25.370917+00:00",
    "description": "Unknown vehicle spotted near perimeter",
    "lat": 31.4167,
    "lon": 34.3333,
    "status": "pending"
  },
  {
    "id": 2,
    "created_at": "2025-09-15T12:30:45.220918+00:00",
    "description": "Unusual movement pattern detected",
    "lat": 31.4180,
    "lon": 34.3350,
    "status": "investigating"
  }
]
```

---

## 🗄️ Database Schema

### Locations Table
```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT NOT NULL,
    lat DECIMAL(10,7) NOT NULL,
    lon DECIMAL(10,7) NOT NULL,
    type VARCHAR(50) NOT NULL
);
```

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'operator'
);
```

### SuspiciousPoints Table
```sql
CREATE TABLE "SuspiciousPoints" (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT NOT NULL,
    lat DECIMAL(10,7) NOT NULL,
    lon DECIMAL(10,7) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);
```

---

## 🔧 Technical Details

### Dependencies
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Supabase** - Database hosting
- **bcrypt** - Password hashing
- **JWT** - Authentication tokens
- **Turf.js** - Geospatial analysis
- **Sharp** - Image processing
- **CORS** - Cross-origin requests

### Environment Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
PORT=6578
```

### CORS Configuration
```javascript
// All origins allowed for development
app.use(cors());
```

### Error Handling
כל ה-endpoints מחזירים שגיאות בפורמט עקבי:
```json
{
  "message": "Error description",
  "error": "Technical error details (development only)"
}
```

---

## 📝 Usage Notes

1. **Coordinates Format:** כל הקואורדינטות במערכת WGS84 (EPSG:4326)
2. **Date Format:** כל התאריכים בפורמט ISO 8601 עם timezone
3. **Image Processing:** תמונות מרחפנים מעובדות ל-384x384 פיקסלים
4. **Authentication:** נדרש JWT token לחלק מהפעולות המתקדמות
5. **Rate Limiting:** אין הגבלות בסביבת פיתוח

---

## 🚀 Development Server

```bash
# הפעלה עם watch mode
npm run dev

# הפעלה רגילה
npm start

# הפעלה עם פרמטרים נוספים
node --watch server.js
```

**Server Port:** 6578  
**Health Check:** `GET /` (Returns server status)  
**Logging:** כל בקשה נרשמת עם method ו-URL

---

## 📞 Support & Contact

- **GitHub Repository:** https://github.com/Moti7950/server_Hackathon_2025
- **Issues & Bugs:** https://github.com/Moti7950/server_Hackathon_2025/issues
- **Documentation Updates:** ניתן לעדכן דרך pull requests

---

*API זה פותח במסגרת הקטון 2025 למטרות חינוכיות ופיתוח בלבד*