# API Structure

## Base URL

```
/api
```

## Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Admin login, returns access + refresh tokens |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/me` | GET | Get current admin profile |
| `/auth/logout` | POST | Invalidate refresh token |

## Proposals

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/proposals` | GET | List all proposals (admin) |
| `/proposals` | POST | Create a new proposal |
| `/proposals/{id}` | GET | Get proposal by internal ID (admin) |
| `/proposals/{id}` | PUT | Update proposal (admin) |
| `/proposals/{id}` | DELETE | Delete proposal (admin) |
| `/proposals/{id}/renew` | POST | Create renewal from existing proposal |
| `/proposals/{id}/analytics` | GET | Get engagement analytics for a proposal |

## Public / Client

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/public/proposals/{token}` | GET | Get proposal by token (client viewer) |
| `/public/proposals/{token}/view` | POST | Record a view event |
| `/public/proposals/{token}/download` | GET | Download proposal PDF |
| `/public/proposals/{token}/accept` | POST | Accept a quotation |

## Responses

All API responses follow a consistent envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  },
  "meta": {}
}
```
