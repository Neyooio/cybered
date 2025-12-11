# 🎨 Website Management - Visual Design Reference

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        🔵 CyberEd Header Bar                       │
│  [Home] [Modules] [Challenges] [Space]      [Options▼] [Logout]   │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Website Management                    🟢 All Systems Operational  │
│  ═══════════════════                                               │
│                                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                 │
│  │   4    │  │   4    │  │   4    │  │   4    │                 │
│  │ Total  │  │ Active │  │ Total  │  │ Active │                 │
│  │Modules │  │Modules │  │Challeng│  │Challeng│                 │
│  └────────┘  └────────┘  └────────┘  └────────┘                 │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  📚 Learning Modules                                         │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │ Web Security │  │ Network      │  │ Cryptography │     │  │
│  │  │ web-security │  │ Defense      │  │ cryptography │     │  │
│  │  │              │  │ network-...  │  │              │     │  │
│  │  │ Learn about  │  │ Master net-  │  │ Understand   │     │  │
│  │  │ protecting   │  │ work security│  │ encryption   │     │  │
│  │  │ websites...  │  │ fundament... │  │ techniques   │     │  │
│  │  │              │  │              │  │              │     │  │
│  │  │ [●─────]     │  │ [●─────]     │  │ [●─────]     │     │  │
│  │  │ Enabled      │  │ Enabled      │  │ Enabled      │     │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │  │
│  │                                                              │  │
│  │  ┌──────────────┐                                           │  │
│  │  │ Malware      │                                           │  │
│  │  │ Defense      │                                           │  │
│  │  │ malware-...  │                                           │  │
│  │  │              │                                           │  │
│  │  │ Detect and   │                                           │  │
│  │  │ defend...    │                                           │  │
│  │  │              │                                           │  │
│  │  │ [●─────]     │                                           │  │
│  │  │ Enabled      │                                           │  │
│  │  └──────────────┘                                           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  🎮 Challenges & Games                                       │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │ Cyber Runner │  │ Crypto Crack │  │ Intrusion    │     │  │
│  │  │ cyber-runner │  │ crypto-crack │  │ Intercept    │     │  │
│  │  │      Easy    │  │    Medium    │  │     Hard     │     │  │
│  │  │              │  │              │  │              │     │  │
│  │  │ Jump over    │  │ Decode en-   │  │ Navigate se- │     │  │
│  │  │ cyber thre...│  │ crypted msg..│  │ curity brea..│     │  │
│  │  │              │  │              │  │              │     │  │
│  │  │ [●─────]     │  │ [●─────]     │  │ [●─────]     │     │  │
│  │  │ Enabled      │  │ Enabled      │  │ Enabled      │     │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │  │
│  │                                                              │  │
│  │  ┌──────────────┐                                           │  │
│  │  │ Header Check │                                           │  │
│  │  │ header-check │                                           │  │
│  │  │     Easy     │                                           │  │
│  │  │              │                                           │  │
│  │  │ Multiplayer  │                                           │  │
│  │  │ card elimin..│                                           │  │
│  │  │              │                                           │  │
│  │  │ [●─────]     │                                           │  │
│  │  │ Enabled      │                                           │  │
│  │  └──────────────┘                                           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  [💾 Save All Changes] [🔄 Refresh Status] [⚠️ Reset to Defaults] │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Background Gradient
- Base: `#0b1740` (dark blue)
- Gradient: `#1c3fa9` → `#1db3d7` → `#6b55e7`
- Cards: `rgba(15,23,42,.85)` with blur effect

### Accent Colors
- **Primary Orange**: `#f97316` (borders, highlights)
- **Secondary Orange**: `#fb923c` (hover states)
- **Indigo**: `#4338ca` - `#6366f1` (buttons, cards)
- **Green**: `#22c55e` (enabled, success)
- **Red**: `#ef4444` (disabled, maintenance)
- **Slate**: `#94a3b8` (text, borders)

## Component Details

### Toggle Switch - ENABLED
```
┌──────────────────────┐
│ [●─────────]         │  ← Green background (#22c55e at 30%)
│ Enabled              │  ← Green text (#4ade80)
└──────────────────────┘
     ↑
   Slider on right, green circle
```

### Toggle Switch - DISABLED
```
┌──────────────────────┐
│ [─────────●]         │  ← Gray background (rgba(148,163,184,.3))
│ Disabled             │  ← Gray text (#94a3b8)
└──────────────────────┘
     ↑
   Slider on left, gray circle
```

### Feature Card - ENABLED
```
┌─────────────────────────────────────┐
│ 📚 Web Security                     │  ← Title (white, 1rem)
│    web-security                     │  ← ID (gray, 0.75rem, mono)
│                                     │
│ Learn about protecting websites,    │  ← Description (slate-300)
│ web applications, and web services  │
│ from malicious attacks.             │
│                                     │
│ [●─────] Enabled                    │  ← Toggle (green)
└─────────────────────────────────────┘
  ↑
Border: rgba(79,70,229,.4) with glow
Hover: Lifts up with shadow
```

### Feature Card - DISABLED
```
┌─────────────────────────────────────┐
│ 📚 Web Security             [faded] │
│    web-security                     │
│                                     │
│ Learn about protecting websites...  │
│                                     │
│ ⚠️ Under Maintenance                │  ← Red badge
│                                     │
│ [─────●] Disabled                   │  ← Toggle (gray)
└─────────────────────────────────────┘
  ↑
Opacity: 0.6 (faded appearance)
Border: rgba(148,163,184,.4) (muted)
```

### Status Badge - OPERATIONAL
```
┌────────────────────────────────┐
│ ● All Systems Operational      │  ← Green border and bg
└────────────────────────────────┘
  ↑
Pulsing green dot animation
Background: rgba(34,197,94,.2)
Border: #22c55e (2px)
```

### Status Badge - MAINTENANCE
```
┌────────────────────────────────┐
│ ● Maintenance Mode Active      │  ← Red border and bg
└────────────────────────────────┘
  ↑
Pulsing red dot animation
Background: rgba(239,68,68,.2)
Border: #ef4444 (2px)
```

### Statistics Card
```
┌─────────────┐
│     4       │  ← Large number (2rem, orange gradient)
│             │
│   Total     │  ← Label (0.875rem, slate-300)
│  Modules    │
└─────────────┘
   ↑
Background: rgba(30,27,75,.6)
Border: rgba(79,70,229,.4)
```

### Action Button - PRIMARY
```
┌──────────────────────┐
│ 💾 Save All Changes  │  ← Indigo background (#4338ca)
└──────────────────────┘
   ↑
Border: 2px solid #4338ca
Hover: Lifts up with glow
```

### Toast Notification - SUCCESS
```
┌────────────────────────────────┐
│ ✅  Configuration saved        │  ← Slides up from bottom
│     successfully!              │
└────────────────────────────────┘
   ↑
Green border (#22c55e)
Auto-dismisses after 3 seconds
Position: Fixed bottom-right
```

### Toast Notification - ERROR
```
┌────────────────────────────────┐
│ ❌  Error saving               │
│     configuration              │
└────────────────────────────────┘
   ↑
Red border (#ef4444)
```

## Responsive Breakpoints

### Desktop (> 768px)
- Grid: 3-4 columns auto-fill
- Cards: min-width 280px
- Full header layout
- Hover effects active

### Mobile (< 768px)
- Grid: 1 column
- Cards: full width
- Stacked header
- Touch-optimized toggles

## Animation Details

### Toggle Switch
- Transition: 0.3s ease
- Slider moves smoothly
- Color fades between states

### Feature Card Hover
```css
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(79,70,229,.3);
transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Toast Slide-in
```css
/* Hidden */
transform: translateY(150%);
opacity: 0;

/* Visible */
transform: translateY(0);
opacity: 1;
transition: 0.3s ease;
```

### Status Badge Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
animation: pulse 2s ease-in-out infinite;
```

### Loading Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
animation: spin 1s linear infinite;
```

## Typography

### Fonts
- Primary: `'Share Tech Mono', monospace`
- Headings: Same (consistent with CyberEd)

### Sizes
- Page Title: 2rem
- Section Title: 1.5rem
- Feature Name: 1rem
- Feature ID: 0.75rem
- Description: 0.875rem
- Button: 0.875rem

### Weights
- Regular: 400
- Semi-bold: 600
- Bold: 700

## Spacing

### Padding
- Page: 1.5rem
- Card: 1.25rem - 1.5rem
- Button: 0.625rem 1.25rem

### Gaps
- Grid: 1rem - 1.5rem
- Elements: 0.5rem - 1rem
- Sections: 1.5rem

### Border Radius
- Small: 0.375rem
- Medium: 0.5rem - 0.75rem
- Large: 1rem

## Icons

- 📚 Learning Modules
- 🎮 Challenges
- 💾 Save
- 🔄 Refresh
- ⚠️ Warning/Reset
- ✅ Success
- ❌ Error
- ● Status Indicator

## Accessibility

- **Contrast**: All text meets WCAG AA standards
- **Focus**: Visible focus indicators on all interactive elements
- **Labels**: Clear, descriptive text for all controls
- **Alt Text**: Icons supplemented with text labels
- **Keyboard**: Full keyboard navigation support

---

**Design System**: CyberEd v1.0
**Color Reference**: See global.css variables
**Last Updated**: December 11, 2025
