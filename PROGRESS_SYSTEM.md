# Real-Time Progress & Achievement System

## Overview
A comprehensive real-time progress tracking system that syncs achievements, badges, and goals across modules, quizzes, and challenges.

## Features

### 1. **Dynamic Achievement Counter**
- Tracks total achievements from:
  - Completed lessons (16 total)
  - Completed challenges (5 total)
  - Earned badges (8 total)
- Displays as `X / Y` format on profile page
- Updates in real-time when completing activities

### 2. **Smart Next Goal System**
Priority-based goal suggestions:
1. **Lessons First**: "Complete X more lessons" (if < 16)
2. **Challenges Second**: "Complete X more challenges" (if < 5)
3. **XP Milestones**: "Reach X XP" (500, 1000, 2000, 3000, 5000, 10000)
4. **Completion**: "Master of CyberEd!" (when everything is done)

### 3. **8 Unlockable Badges**

| Badge | Criteria | Icon |
|-------|----------|------|
| **First Steps** | Complete your first lesson quiz | 🎯 |
| **Quick Learner** | Complete 5 lesson quizzes | ⚡ |
| **Code Master** | Complete 3 challenges | 💻 |
| **Security Pro** | Complete all lessons in any module (4 lessons) | 🛡️ |
| **Challenge Champion** | Complete all 5 challenges | 🏆 |
| **Master Hacker** | Complete all 16 lessons AND reach level 10 | 👑 |
| **Streak Warrior** | Maintain a 30-day login streak | 🔥 |
| **XP Master** | Reach 5000 XP | ⭐ |

### 4. **Progress Display**
- Each locked badge shows progress percentage
- Badges transform with golden glow when earned
- Real-time popup notifications when new badges are unlocked

## Technical Implementation

### Backend (`/backend/src/`)

#### New Model Fields (`models/User.js`)
```javascript
moduleProgress: [{
  moduleId: String,        // cryptography, web-security, etc.
  lessonNumber: Number,    // 1-4
  completed: Boolean,
  quizScore: Number,
  quizPassed: Boolean,
  completedAt: Date
}],
badges: [{
  badgeId: String,
  earnedAt: Date,
  progress: Number
}],
achievementCount: Number
```

#### New API Endpoints (`routes/progress.js`)
- **POST `/api/progress/quiz`**: Record quiz completion
  - Tracks module and lesson completion
  - Awards 100 XP per passed quiz
  - Checks for new badges
  - Returns updated stats

- **GET `/api/progress/stats`**: Get full progress overview
  - Returns achievements count
  - Returns next goal
  - Returns all badges with progress
  - Returns module completion percentages

### Frontend (`/frontend/src/`)

#### Battle Quiz Integration (`js/battle-quiz.js`)
- Syncs victory to backend when score ≥ 8
- Dispatches `progressUpdated` event
- Shows badge notification popup
- Auto-updates profile stats

#### Profile Page (`js/profile.js`)
- `loadProgressStats()`: Fetches and displays all stats
- `updateBadgesDisplay()`: Renders badge grid with progress
- Listens for `progressUpdated` events
- Real-time achievement updates

#### Challenge Integration
- Challenges already sync via `/api/challenges/complete`
- Backend automatically checks for badge unlocks
- XP and level calculation included

## User Experience

### When Completing a Quiz:
1. User completes battle quiz with score ≥ 8
2. Progress synced to backend
3. Backend checks if any badges were earned
4. Frontend receives response with new badges
5. Popup notification appears for each new badge
6. Profile stats update automatically
7. Badge grid updates with earned status

### On Profile Page:
1. Page loads progress stats from backend
2. **Achievements**: Shows "X / Y" (e.g., "5 / 29")
3. **Next Goal**: Dynamic suggestion (e.g., "Complete 11 more lessons")
4. **Badges**: 8 badges displayed with:
   - Locked badges: Gray with lock icon + progress %
   - Earned badges: Golden glow with emoji icon

## XP & Level System

### XP Rewards:
- **Quiz Victory**: 100 XP
- **Challenge Completion**: 50-300 XP (varies by difficulty)
- **Daily Mission**: 35 XP

### Level Calculation:
```javascript
level = floor(1 + sqrt(experience / 100))
```

### XP Milestones:
- 500 XP → Level ~3
- 1000 XP → Level ~4
- 2000 XP → Level ~5
- 5000 XP → Level ~8
- 10000 XP → Level ~11

## Visual Design

### Badge States:
- **Locked**: Grayscale, lock icon, shows progress %
- **Earned**: Golden gradient background, emoji icon, unlock animation

### Notifications:
- Golden gradient popup
- Trophy icon with bounce animation
- Badge name and description
- Auto-dismisses after 4 seconds
- Multiple badges stack with 0.5s delay

## Integration with Existing Systems

### Modules:
- 4 modules: Cryptography, Web Security, Network Defense, Malware Defense
- 4 lessons each = 16 total lessons
- Each lesson has a battle quiz

### Challenges:
- 5 challenges already implemented
- Score submission handled by backend
- Automatic progress tracking

### Streak System:
- Already tracked via daily login
- Syncs with profile page
- Tree sprite changes based on streak days

## Future Enhancements

1. **More Badges**: Add badges for specific achievements
   - Module-specific badges
   - Perfect score badges
   - Speed run badges

2. **Leaderboard Integration**: Rank by achievements
3. **Badge Sharing**: Share accomplishments
4. **Achievement History**: Timeline of unlocked badges
5. **Pixelated Badge Icons**: Replace emojis with custom pixel art

## Testing

### Test a Badge Unlock:
1. Complete a quiz with score ≥ 8
2. Check profile page for updated achievements
3. Verify "First Steps" badge unlocks

### Test Next Goal:
1. Complete various activities
2. Check that goal updates appropriately
3. Verify priority (lessons > challenges > XP)

### Test Progress Sync:
1. Complete quiz in one tab
2. Check profile refreshes stats
3. Verify `progressUpdated` event works

## Database Schema Updates

Run these changes when updating an existing database:
```javascript
// No migration needed - new fields have defaults
// Existing users will have:
// - moduleProgress: []
// - badges: []
// - achievementCount: 0
```

## API Response Examples

### Quiz Completion:
```json
{
  "success": true,
  "progress": {
    "moduleId": "cryptography",
    "lessonNumber": 1,
    "completed": true,
    "score": 9
  },
  "newBadges": [{
    "id": "first-steps",
    "name": "First Steps",
    "description": "Complete your first lesson quiz"
  }],
  "totalAchievements": 1,
  "nextGoal": "Complete 15 more lessons",
  "experience": 100,
  "level": 2
}
```

### Progress Stats:
```json
{
  "achievements": {
    "current": 5,
    "max": 29,
    "display": "5 / 29"
  },
  "nextGoal": "Complete 2 more challenges",
  "streak": 7,
  "badges": {
    "earned": [...],
    "available": [...]
  },
  "modules": {
    "cryptography": { "completed": 2, "total": 4, "percentage": 50 }
  },
  "challenges": { "completed": 3, "total": 5 }
}
```

## Notes

- Progress syncs automatically on quiz completion
- Challenges already integrated
- All stats persist in database
- Real-time updates via events
- Backwards compatible with existing data
