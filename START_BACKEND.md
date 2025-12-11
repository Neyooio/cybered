# Start Backend Server

## The announcement feature requires the backend server to be running!

### For the Host (Person Sharing the Workspace):

1. **Open a NEW terminal** in VS Code (Terminal → New Terminal)

2. **Navigate to the backend folder:**
   ```powershell
   cd backend
   ```

3. **Start the backend server:**
   ```powershell
   npm run dev
   ```
   
   OR
   
   ```powershell
   npm start
   ```

4. **Verify it's running:**
   You should see:
   ```
   [db] connected
   [socket.io] game socket initialized
   [socket.io] header-check socket initialized
   [server] listening on http://localhost:4000
   [server] accessible from network at http://<your-ip>:4000
   [socket.io] ready for multiplayer connections
   ```

5. **Test the API:**
   Open your browser and go to: `http://localhost:4000/api/health`
   
   You should see:
   ```json
   {
     "ok": true,
     "service": "cybered-backend",
     "time": "2025-12-11T...",
     "db": { ... }
   }
   ```

### What I Fixed:

✅ Added announcement routes to the backend:
- `POST /api/faculty-modules/:spaceId/announcements` - Create announcement
- `DELETE /api/faculty-modules/:spaceId/announcements/:announcementId` - Delete announcement

✅ Routes are properly ordered (announcement routes come before generic space routes)

✅ Added comprehensive logging and error handling

✅ Improved frontend error messages

### Once Backend is Running:

The announcement posting will work immediately! You'll be able to:
- Create announcements with title and content
- See success notifications
- View announcements in the space

---

## Troubleshooting:

**If you get "port already in use" error:**
```powershell
# Find and kill the process using port 4000
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F
```

**If you get MongoDB connection error:**
- Make sure MongoDB is running
- Check your `.env` file has correct `MONGODB_URI`

**If npm command not found:**
- Make sure Node.js is installed
- Restart VS Code terminal
