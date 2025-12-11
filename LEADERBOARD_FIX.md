# Leaderboard Sync Issue - RESOLVED

## Problem Identified

**Root Cause:** The leaderboard routes were using `req.userId` to access the user ID, but the JWT authentication middleware sets `req.user` with the user ID stored in `req.user.sub`.

### Issue Details

1. **JWT Payload Structure:**
   ```javascript
   const payload = { sub: user.id, role: user.role, email: user.email };
   ```
   The user ID is stored as `sub` (subject) in the JWT token.

2. **Auth Middleware:**
   ```javascript
   req.user = payload; // Sets req.user with {sub, role, email}
   ```

3. **Leaderboard Routes (BEFORE FIX):**
   ```javascript
   const user = await User.findById(req.userId); // ❌ req.userId is undefined!
   ```

## Solution Applied

Changed all instances of `req.userId` to `req.user.sub` in the leaderboard routes:

### Files Modified
- `backend/src/routes/leaderboard.js`

### Changes Made
1. ✅ Submit score endpoint: `req.userId` → `req.user.sub`
2. ✅ Find existing entry: `userId: req.userId` → `userId: req.user.sub`
3. ✅ Create new entry: `userId: req.userId` → `userId: req.user.sub`
4. ✅ My stats endpoint: `req.userId` → `req.user.sub`
5. ✅ My rank endpoint: `userId: req.userId` → `userId: req.user.sub`

## How to Test

### 1. Play a Game
- Log in as a **student** account
- Play any of these games:
  - Cyber Runner
  - Cyber Runner MP
  - Intrusion Intercept
  - Crypto Crack
- Complete the game or get a score

### 2. Check Leaderboard
- Navigate to the Leaderboards page
- Select the challenge tab you played
- Your score should now appear!

### 3. Verify in Database
If you have MongoDB Compass installed:
- Connect to `mongodb://localhost:27017`
- Database: `CyberEdCapstone`
- Collection: `leaderboards`
- You should see entries with your userId

### 4. Check Console Logs
Open browser developer tools (F12) and check the console:
- Should see: `[Leaderboard] Score submitted: {data}`
- If new high score: `🏆 New High Score!` notification appears

## What Was Happening Before

1. Game completes and calls `submitToLeaderboard()`
2. Request sent to `/api/leaderboard/submit` with token
3. Backend receives request, auth middleware works correctly
4. Leaderboard route tries to find user with `req.userId` (undefined)
5. Database query fails: `User.findById(undefined)` returns null
6. Returns error: "User not found"
7. Score never saved to database
8. Leaderboard remains empty

## What Happens Now

1. Game completes and calls `submitToLeaderboard()`
2. Request sent to `/api/leaderboard/submit` with token
3. Backend receives request, auth middleware sets `req.user.sub`
4. Leaderboard route finds user with `req.user.sub` ✅
5. Database query succeeds
6. Score saved to `leaderboards` collection ✅
7. Frontend receives success response
8. Leaderboard displays the score ✅

## Additional Notes

### Why Only Students?
The leaderboard system includes validation:
```javascript
if (user.role !== 'student') {
  return res.status(403).json({ error: 'Only students can submit scores' });
}
```

Faculty and admins can play games but won't appear on leaderboards.

### High Score Logic
- If user already has a score for a challenge, only updates if new score is higher
- Prevents score spamming
- Encourages improvement

### Challenge Names Must Match
Ensure game submissions use exact challenge names:
- ✅ `'Cyber Runner'`
- ✅ `'Cyber Runner MP'`
- ✅ `'Intrusion Intercept'`
- ✅ `'Crypto Crack'`
- ❌ `'Header Check'` (not in leaderboard enum)

## Backend Status
✅ Server restarted with fix applied
✅ All routes now use correct user ID reference
✅ Ready to receive and store scores

## Next Steps for Testing

1. Clear browser cache (optional, for clean test)
2. Log in as a student
3. Play any game and complete it
4. Check Leaderboards page - your score should appear
5. Play again with higher score - leaderboard should update

The issue is now resolved!
