# Website Management System Documentation

## Overview
The Website Management system allows administrators to control the availability of modules and challenges on the CyberEd platform. This is useful for maintenance periods, feature rollouts, or temporarily disabling problematic content.

## Accessing the System
1. Log in as an admin user
2. Click on "Options" in the top bar
3. Select "Website Management"

## Features

### Statistics Dashboard
View real-time statistics:
- **Total Modules**: Number of learning modules available
- **Active Modules**: Number of currently enabled modules
- **Total Challenges**: Number of game challenges available
- **Active Challenges**: Number of currently enabled challenges

### System Status Indicator
- **Green (Operational)**: All features are enabled
- **Red (Maintenance)**: One or more features are disabled

## Managing Modules
The system includes 4 core learning modules:
1. **Web Security** - Protecting websites and web applications
2. **Network Defense** - Network security fundamentals
3. **Cryptography** - Encryption and secure communication
4. **Malware Defense** - Detecting and defending against malware

Each module can be toggled on/off individually.

## Managing Challenges
The system includes 4 game challenges:
1. **Cyber Runner** (Easy) - Endless runner with quiz questions
2. **Crypto Crack** (Medium) - Caesar cipher decoding game
3. **Intrusion Intercept** (Hard) - Branching security scenarios
4. **Header Check** (Easy) - Email security card game

Each challenge can be toggled on/off individually.

## Using the Controls

### Toggle Switches
- Click any toggle switch to enable/disable a feature
- **Green** = Enabled
- **Gray** = Disabled
- When disabled, a "⚠️ Under Maintenance" badge appears

### Action Buttons

#### Save All Changes
- Saves the current configuration to localStorage
- Persists across browser sessions
- Shows confirmation toast notification

#### Refresh Status
- Reloads the configuration from storage
- Updates all statistics and UI
- Use this to sync with other admin changes

#### Reset to Defaults
- Restores all features to enabled state
- Requires confirmation
- Use this to quickly recover from issues

## User Experience

### When a Module is Disabled
- Module appears grayed out with reduced opacity
- Shows "⚠️ Under Maintenance" badge
- "Start Module" button is disabled
- Clicking shows alert: "This module is currently under maintenance"

### When a Challenge is Disabled
- Challenge appears grayed out with reduced opacity
- Shows "⚠️ Under Maintenance" badge
- "Play" button shows "Under Maintenance"
- Clicking shows alert: "This challenge is currently under maintenance"

## Technical Details

### Storage
Configuration is stored in localStorage under the key:
```
website_management_config
```

### Data Structure
```javascript
{
  modules: [
    {
      id: 'web-security',
      name: 'Web Security',
      description: '...',
      enabled: true
    },
    // ... more modules
  ],
  challenges: [
    {
      id: 'cyber-runner',
      name: 'Cyber Runner',
      description: '...',
      difficulty: 'Easy',
      enabled: true
    },
    // ... more challenges
  ]
}
```

### Integration Points
The system is integrated with:
- `modules.js` - Checks module availability before rendering
- `challenges.js` - Checks challenge availability before rendering
- Both files call helper functions:
  - `isModuleEnabled(moduleId)`
  - `isChallengeEnabled(challengeId)`

### API Export
The management system exports a global API:
```javascript
window.WebsiteManagement = {
  isModuleEnabled: (moduleId) => boolean,
  isChallengeEnabled: (challengeId) => boolean,
  getConfig: () => configObject
}
```

## Best Practices

### Planned Maintenance
1. Announce maintenance to users in advance
2. Disable affected features before starting work
3. Test thoroughly before re-enabling
4. Monitor user feedback after re-enabling

### Emergency Maintenance
1. Quickly disable the problematic feature
2. Investigate and fix the issue
3. Test in a separate environment if possible
4. Re-enable when confirmed working

### Feature Rollouts
1. Start with features disabled
2. Test with select users
3. Enable for all users once stable
4. Keep monitoring for issues

### Multi-Admin Coordination
- Changes are saved locally per browser
- Use "Refresh Status" to check current state
- Communicate with other admins when making changes
- Consider implementing a backend API for centralized control (future enhancement)

## Troubleshooting

### Changes Not Reflected
- Click "Save All Changes" button
- Refresh the page
- Check browser console for errors

### Users Still Seeing Disabled Features
- Users need to refresh their browser
- Changes take effect immediately upon page reload
- Consider adding a notification system (future enhancement)

### Reset Not Working
- Check browser console for localStorage errors
- Try clearing browser cache
- Check if localStorage is available/enabled

## Future Enhancements
- Backend API integration for centralized control
- User notification system for maintenance announcements
- Scheduled maintenance with automatic enable/disable
- Feature usage analytics
- Granular permissions (per-admin role-based access)
- Audit log of all changes
