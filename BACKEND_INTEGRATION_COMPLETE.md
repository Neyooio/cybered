# Website Management System - Backend Integration Summary

## ✅ What Was Implemented

### Backend Components Created:

1. **Database Model**: `backend/src/models/WebsiteConfig.js`
   - Stores module and challenge enable/disable states in MongoDB
   - Single document configuration (not per-user)
   - Auto-creates default config if none exists

2. **API Routes**: `backend/src/routes/websiteConfig.js`
   - `GET /api/website/config` - Get current configuration (PUBLIC - all users)
   - `PUT /api/website/config` - Update configuration (ADMIN ONLY)
   - `POST /api/website/config/reset` - Reset to defaults (ADMIN ONLY)

3. **Server Integration**: `backend/src/server.js`
   - Added route: `/api/website` → websiteConfigRouter

### Frontend Components Updated:

1. **Admin Management Script**: `frontend/src/js/admin-website-management.js`
   - Changed from localStorage to backend API
   - All save/load/reset operations now use API calls
   - Shows loading states during API operations

2. **Modules Page**: `frontend/src/js/modules.js`
   - Checks API for module availability (not localStorage)
   - Async rendering to fetch config from backend
   - Shows maintenance badges for disabled modules

3. **Challenges Page**: `frontend/src/js/challenges.js`
   - Checks API for challenge availability (not localStorage)
   - Async rendering to fetch config from backend
   - Shows maintenance badges for disabled challenges

4. **HTML Page**: `frontend/src/html/admin/website-management.html`
   - Added `type="module"` to script tag for ES6 imports

## 🔄 How It Works Now

### Admin Workflow:
1. Admin logs into website management page
2. Toggles features on/off
3. Clicks "Save All Changes"
4. Configuration is saved to **MongoDB database**
5. All users immediately affected (on next page load/refresh)

### User Experience:
1. User visits modules or challenges page
2. Page fetches current config from API: `GET /api/website/config`
3. Disabled features show:
   - Grayed out appearance
   - "⚠️ Under Maintenance" badge
   - Disabled buttons
4. Clicking disabled features shows alert
5. When admin re-enables, users see it on next page refresh

## 🌐 Cross-User Synchronization

### Before (localStorage):
- ❌ Config stored per browser
- ❌ Only affected that admin's browser
- ❌ Other users unaffected

### Now (Backend API):
- ✅ Config stored in MongoDB
- ✅ Single source of truth
- ✅ **ALL users see the same state**
- ✅ Changes propagate to everyone
- ✅ Works across all devices/browsers

## 🔐 Security

- **Public Endpoint**: `GET /api/website/config` - Anyone can check feature status
- **Admin Only**: `PUT /api/website/config` - Requires authentication + admin role
- **Admin Only**: `POST /api/website/config/reset` - Requires authentication + admin role

## 📡 API Examples

### Get Current Configuration
```javascript
GET /api/website/config

Response:
{
  "success": true,
  "config": {
    "modules": [
      {
        "id": "web-security",
        "name": "Web Security",
        "description": "...",
        "enabled": true
      },
      ...
    ],
    "challenges": [
      {
        "id": "cyber-runner",
        "name": "Cyber Runner",
        "description": "...",
        "enabled": false  // DISABLED
      },
      ...
    ],
    "lastUpdated": "2025-12-11T..."
  }
}
```

### Update Configuration (Admin)
```javascript
PUT /api/website/config
Headers: { Authorization: "Bearer <admin-token>" }
Body: {
  "modules": [...],
  "challenges": [...]
}

Response:
{
  "success": true,
  "message": "Configuration updated successfully",
  "config": { ... }
}
```

### Reset to Defaults (Admin)
```javascript
POST /api/website/config/reset
Headers: { Authorization: "Bearer <admin-token>" }

Response:
{
  "success": true,
  "message": "Configuration reset to defaults",
  "config": { ... }
}
```

## 🚀 Deployment Notes

### Database Requirement:
- Requires MongoDB connection
- Uses existing MongoDB instance
- Creates `websiteconfigs` collection automatically

### First Launch:
- Server auto-creates default config on first API call
- All features enabled by default
- No manual setup needed

### Environment:
- Works in both development and production
- Uses same MONGODB_URI as rest of app
- No additional environment variables needed

## 🎯 Testing

1. **Start backend**: `npm start` (already running ✅)
2. **Login as admin**
3. **Visit**: `/src/html/admin/website-management.html`
4. **Toggle a feature off**
5. **Click "Save All Changes"**
6. **Open modules/challenges page in different browser/incognito**
7. **Verify**: Feature shows as "Under Maintenance"
8. **Go back to admin panel**
9. **Toggle feature back on**
10. **Click "Save All Changes"**
11. **Refresh user page**
12. **Verify**: Feature is now available again

## 📋 Migration from Old System

Old localStorage data is ignored. The system now uses:
- **Single source of truth**: MongoDB
- **Persistent**: Survives browser clears
- **Centralized**: All users see same state
- **Real-time**: Changes effective immediately

No data migration needed - starts fresh with all features enabled.

---

**Status**: ✅ Fully Implemented and Running
**Backend Server**: Running on http://localhost:4000
**API Endpoint**: http://localhost:4000/api/website/config
