# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login) require the `adminPin` header:
```
Headers:
  adminPin: "1234"
```

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

Request:
```json
{
  "pin": "1234"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "admin-token"
}
```

Response (Failed):
```json
{
  "success": false,
  "message": "Invalid PIN"
}
```

---

## Task Endpoints

### Create Task
**POST** `/tasks/create`

Headers:
```
adminPin: 1234
Content-Type: application/json
```

Request:
```json
{
  "title": "Repair drain",
  "description": "Fix drainage issue in campus",
  "priority": "High",
  "category": "Request",
  "sector": "Vignan University",
  "dueDate": "2026-03-20",
  "referencePhone": "+919908939746"
}
```

Response:
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Repair drain",
    "description": "Fix drainage issue in campus",
    "priority": "High",
    "category": "Request",
    "sector": "Vignan University",
    "status": "Pending",
    "dueDate": "2026-03-20T00:00:00Z",
    "referencePhone": "+919908939746",
    "createdAt": "2026-03-16T10:30:00Z",
    "updatedAt": "2026-03-16T10:30:00Z"
  }
}
```

---

### Get All Tasks
**GET** `/tasks/all`

Headers:
```
adminPin: 1234
```

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Task 1",
    "description": "Description",
    "status": "Pending",
    "priority": "Medium",
    "category": "Request",
    "sector": "Vignan University",
    "dueDate": "2026-03-20T00:00:00Z",
    "createdAt": "2026-03-16T10:30:00Z"
  }
]
```

---

### Get Tasks by Sector
**GET** `/tasks/sector/:sector`

Parameters:
- `sector`: "Vignan University" or "Narasarapet Region"

Headers:
```
adminPin: 1234
```

---

### Get Task Statistics
**GET** `/tasks/stats`

Headers:
```
adminPin: 1234
```

Response:
```json
{
  "total": 4,
  "pending": 2,
  "inProgress": 0,
  "completed": 2
}
```

---

### Get Single Task
**GET** `/tasks/:id`

Parameters:
- `id`: Task ID (MongoDB ObjectId)

Headers:
```
adminPin: 1234
```

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Repair drain",
  "description": "Fix drainage issue in campus",
  "status": "Pending",
  "priority": "High",
  "category": "Request",
  "sector": "Vignan University",
  "dueDate": "2026-03-20T00:00:00Z",
  "createdAt": "2026-03-16T10:30:00Z"
}
```

---

### Update Task Status
**PUT** `/tasks/update/:id`

Headers:
```
adminPin: 1234
Content-Type: application/json
```

Request:
```json
{
  "status": "In Progress"
}
```

Response (Start Task):
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "In Progress",
    "startTime": "2026-03-16T11:00:00Z",
    "updatedAt": "2026-03-16T11:00:00Z"
  }
}
```

Response (Complete Task):
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "Completed",
    "endTime": "2026-03-16T12:30:00Z",
    "duration": "1h 30m 5s",
    "updatedAt": "2026-03-16T12:30:00Z"
  }
}
```

---

### Assign Task
**PUT** `/tasks/assign/:id`

Headers:
```
adminPin: 1234
Content-Type: application/json
```

Request:
```json
{
  "assignedTo": "John Doe",
  "assignedToPhone": "+919876543210"
}
```

Response:
```json
{
  "message": "Task assigned successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "assignedTo": "John Doe",
    "assignedToPhone": "+919876543210",
    "status": "In Progress",
    "startTime": "2026-03-16T11:00:00Z"
  }
}
```

---

### Delete Task
**DELETE** `/tasks/delete/:id`

Headers:
```
adminPin: 1234
```

Response:
```json
{
  "message": "Task deleted successfully"
}
```

---

## WhatsApp Endpoints

### Send Task Assignment via WhatsApp
**POST** `/whatsapp/send-assignment`

Headers:
```
adminPin: 1234
Content-Type: application/json
```

Request:
```json
{
  "taskId": "507f1f77bcf86cd799439011",
  "recipientPhone": "+919876543210"
}
```

Response:
```json
{
  "message": "WhatsApp message sent successfully",
  "messageId": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "assignedTo": "+919876543210",
    "assignedToPhone": "+919876543210"
  }
}
```

---

### Get WhatsApp Status
**GET** `/whatsapp/status`

Headers:
```
adminPin: 1234
```

Response:
```json
{
  "status": "active",
  "provider": "Twilio",
  "webhookUrl": "/api/whatsapp/webhook"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Task created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Invalid PIN |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Example cURL Commands

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"pin":"1234"}'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks/create \
  -H "Content-Type: application/json" \
  -H "adminPin: 1234" \
  -d '{
    "title":"New Task",
    "description":"Task description",
    "priority":"High",
    "category":"Request",
    "sector":"Vignan University",
    "dueDate":"2026-03-20"
  }'
```

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks/all \
  -H "adminPin: 1234"
```

### Get Statistics
```bash
curl -X GET http://localhost:5000/api/tasks/stats \
  -H "adminPin: 1234"
```

---

## Response Examples

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Operation failed",
  "error": "Specific error reason"
}
```

---

## Rate Limiting
Currently: No rate limiting (to be added in production)

## CORS Policy
Allows requests from frontend on localhost:3000

---

**Last Updated**: March 16, 2026
