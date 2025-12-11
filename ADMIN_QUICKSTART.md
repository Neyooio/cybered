# 🚀 Website Management - Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Access the System
1. Log in to CyberEd as an **admin**
2. Click **"Options"** button in the top-right corner
3. Select **"Website Management"** from the dropdown

### Step 2: Control Features
**To Disable a Feature:**
- Click the toggle switch next to any module or challenge
- The card will gray out and show "⚠️ Under Maintenance"
- Users will see the maintenance badge and cannot access it

**To Enable a Feature:**
- Click the toggle switch again
- The card returns to normal appearance
- Users can immediately access it (after refresh)

### Step 3: Save Your Changes
- Click the **"💾 Save All Changes"** button at the bottom
- You'll see a success notification
- Changes are now permanent until you change them again

## 🎯 Quick Actions

### Disable Everything for System Maintenance
1. Click each toggle switch to disable
2. System status changes to "Maintenance Mode Active" (red)
3. Click "Save All Changes"

### Enable Everything After Maintenance
- Click the **"⚠️ Reset to Defaults"** button
- Confirm the action
- All features are re-enabled instantly

### Check Current Status
- Look at the **Statistics Dashboard** at the top
- Shows: Total vs Active modules and challenges
- **Green badge** = Everything operational
- **Red badge** = Some features under maintenance

## 💡 Common Scenarios

### Scenario 1: A Challenge Has a Bug
```
Problem: Crypto Crack has a game-breaking bug
Solution:
1. Find "Crypto Crack" in the Challenges section
2. Click its toggle to disable
3. Click "Save All Changes"
4. Fix the bug in the code
5. Return and enable it again
```

### Scenario 2: Rolling Out a New Module
```
Situation: New module isn't ready for all users
Solution:
1. Keep it disabled initially
2. Test with admin accounts
3. When ready, toggle it on
4. Click "Save All Changes"
```

### Scenario 3: Weekend Maintenance
```
Plan: Disable all features for server maintenance
Solution:
1. On Friday evening, disable all toggles
2. Save changes
3. Perform maintenance work
4. On Monday morning, click "Reset to Defaults"
5. All features re-enabled at once
```

## 🔍 Understanding the Interface

### Statistics Cards (Top Row)
```
┌─────────────┬─────────────┬──────────────┬──────────────┐
│   Total     │   Active    │    Total     │   Active     │
│  Modules    │  Modules    │  Challenges  │ Challenges   │
│     4       │     4       │      4       │      4       │
└─────────────┴─────────────┴──────────────┴──────────────┘
```

### Feature Cards
```
┌────────────────────────────────────────┐
│  📚 Web Security                       │
│     web-security                       │
│                                        │
│  Learn about protecting websites...   │
│                                        │
│  [●──────] Enabled                    │
└────────────────────────────────────────┘
```

### When Disabled
```
┌────────────────────────────────────────┐
│  📚 Web Security              (grayed) │
│     web-security                       │
│                                        │
│  Learn about protecting websites...   │
│  ⚠️ Under Maintenance                 │
│                                        │
│  [───●───] Disabled                   │
└────────────────────────────────────────┘
```

## 🎮 What Users See

### When Feature is Enabled (Normal)
- ✅ Card has normal colors
- ✅ Button says "Start Module" or "Play"
- ✅ Click works normally

### When Feature is Disabled (Maintenance)
- ⚠️ Card appears faded/grayed
- ⚠️ Red maintenance badge visible
- ⚠️ Button says "Under Maintenance"
- ⚠️ Click shows alert: "This [feature] is currently under maintenance"

## ⚙️ Action Buttons Explained

### 💾 Save All Changes
- **When to use**: After making any changes
- **What it does**: Saves configuration to browser storage
- **Effect**: Changes become permanent
- **Notification**: Green checkmark toast

### 🔄 Refresh Status
- **When to use**: To check current state
- **What it does**: Reloads from storage
- **Effect**: Shows latest configuration
- **Notification**: "Status refreshed"

### ⚠️ Reset to Defaults
- **When to use**: To quickly enable everything
- **What it does**: Enables all modules and challenges
- **Effect**: Back to default state
- **Confirmation**: Requires "Yes" click

## 📱 Mobile Access

On mobile devices:
1. Tap the **hamburger menu** (☰) in top-left
2. Scroll to **"Options"**
3. Tap **"Website Management"**
4. Interface adapts to single-column layout
5. All features work the same way

## ⚠️ Important Notes

### Changes Take Effect Immediately
- Once you save, the config is live
- Users need to refresh their browser to see changes
- No server restart required

### Storage Location
- Configuration saved in browser localStorage
- Specific to each admin's browser
- **Important**: Other admins won't automatically see your changes
- Each admin should coordinate changes

### No Undo Button
- Changes are immediate when saved
- Use "Refresh" to see last saved state
- Use "Reset" to go back to all-enabled

### Coordination with Other Admins
- Talk to other admins before major changes
- They can check status with "Refresh" button
- Consider announcing in team chat

## 🆘 Troubleshooting

### "Nothing happens when I toggle"
➡️ Click "Save All Changes" - toggles don't auto-save

### "Users still see disabled features"
➡️ Tell users to refresh their browser (F5 or Ctrl+R)

### "I want to undo my changes"
➡️ Click "Refresh Status" to see saved state
➡️ Toggle back and "Save All Changes"
➡️ Or use "Reset to Defaults" to enable all

### "Can't access the page"
➡️ Make sure you're logged in as admin
➡️ Check if "Options" button is visible in top bar

## 📊 Best Practices

### ✅ DO:
- Save after every batch of changes
- Test disabled features yourself before announcing
- Communicate maintenance windows to users
- Use "Reset to Defaults" after maintenance
- Check statistics to verify changes

### ❌ DON'T:
- Disable features without testing first
- Forget to save your changes
- Disable everything without notifying users
- Leave features disabled longer than necessary
- Make changes during peak usage hours

## 🎓 Pro Tips

1. **Use the statistics**: Quick way to see how many features are active
2. **Test first**: Disable in off-peak hours to test user experience
3. **Batch changes**: Make all changes, then save once
4. **Document reasons**: Keep notes on why features are disabled
5. **Set reminders**: Don't forget to re-enable after fixing issues

## 📞 Need Help?

- Check **WEBSITE_MANAGEMENT_GUIDE.md** for detailed documentation
- Review **WEBSITE_MANAGEMENT_IMPLEMENTATION.md** for technical details
- Contact the development team for system issues

---

**Remember**: With great power comes great responsibility! 
Users trust you to keep the platform running smoothly. 🚀

**Last Updated**: December 11, 2025
