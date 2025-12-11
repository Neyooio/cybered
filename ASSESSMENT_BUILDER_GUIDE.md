# Assessment Builder Documentation

## Overview
The Assessment Builder allows faculty members to create interactive assessments by combining game templates with custom questions imported from Excel/CSV files.

## Features

### 1. **Game Templates**
Six interactive game templates available:
- **Quiz** 📝 - Traditional multiple choice with instant feedback
- **Cyber Runner** 🏃 - Answer questions while navigating obstacles
- **Intrusion Intercept** 🛡️ - Defend against attacks by answering correctly
- **Crypto Crack** 🔐 - Solve cryptography questions to crack codes
- **Flashcards** 🗂️ - Study mode with flippable cards
- **Matching Game** 🎯 - Match terms with definitions

### 2. **File Upload System**
- **Supported Formats**: CSV (.csv), Excel (.xlsx, .xls - coming soon)
- **Drag & Drop**: Simply drag files into the upload zone
- **Real-time Preview**: See first 3 questions before creating

### 3. **CSV File Format**

#### Required Columns:
- `question` - The question text
- `answer` - The correct answer

#### Optional Columns:
- `options` - Multiple choice options (pipe-separated: `A|B|C|D`)
- `correctIndex` - Index of correct option (0-based: 0, 1, 2, 3)

#### Sample CSV Template:
```csv
question,answer,options,correctIndex
What is the full form of HTTP?,HyperText Transfer Protocol,"HyperText Transfer Protocol|HyperText Transmission Protocol|High Transfer Text Protocol|Home Tool Transfer Protocol",0
Which port does HTTPS use by default?,443,"80|443|8080|3000",1
What does SSL stand for?,Secure Sockets Layer,"Secure Server Layer|Secure Sockets Layer|Secure System Link|Secure Software Layer",1
```

**Download Sample Template**: [sample-assessment-template.csv](../../assets/sample-assessment-template.csv)

## How to Create an Assessment

### Step 1: Access Assessment Builder
1. Navigate to **Faculty Space**
2. Click on a module or create a new one
3. Click the **"Assessment"** button in the module editor

### Step 2: Fill Assessment Information
- **Title**: Give your assessment a clear name (e.g., "Cryptography Quiz")
- **Description**: Brief overview of what the assessment covers

### Step 3: Select Game Template
Click on one of the six game templates. The selected template will show a green checkmark badge.

### Step 4: Upload Questions File
1. **Drag & drop** your CSV file into the upload zone, OR
2. **Click** the upload zone to browse and select a file
3. Wait for file processing
4. Review the **Questions Preview** showing the first 3 questions

### Step 5: Create Assessment
Click **"Create Assessment"** button to save your assessment to the module.

## Question Format Guidelines

### For Multiple Choice Questions:
```csv
question,answer,options,correctIndex
What is 2+2?,4,"2|3|4|5",2
```

### For True/False Questions:
```csv
question,answer,options,correctIndex
The sky is blue,True,"True|False",0
```

### For Fill-in-the-Blank:
```csv
question,answer
Complete: The capital of France is ____,Paris
```

## Tips for Best Results

### 📝 Question Writing:
- Keep questions clear and concise
- Avoid ambiguous wording
- Ensure only one correct answer

### 📊 File Preparation:
- Use UTF-8 encoding for special characters
- Wrap text in quotes if it contains commas
- Use pipe `|` to separate multiple choice options
- Test with small files first (5-10 questions)

### 🎮 Template Selection:
- **Quiz** - Best for comprehensive testing
- **Cyber Runner** - Great for quick reviews and engagement
- **Intrusion Intercept** - Ideal for security/defense topics
- **Crypto Crack** - Perfect for cryptography modules
- **Flashcards** - Best for memorization and definitions
- **Matching** - Excellent for terminology and concepts

## File Upload Limits
- **Max File Size**: 5 MB
- **Max Questions**: 100 per assessment (recommended)
- **Supported Characters**: UTF-8 (all languages supported)

## API Integration

### Create Assessment Endpoint
```
POST /api/faculty-modules/:spaceId/modules/:moduleId/assessment
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Cryptography Quiz",
  "description": "Test your knowledge of encryption",
  "gameTemplate": "crypto-crack",
  "questions": [
    {
      "question": "What is AES?",
      "answer": "Advanced Encryption Standard",
      "options": ["Advanced Encryption Standard", "Another Encryption System", ...],
      "correctIndex": 0
    }
  ]
}
```

### Get Assessments Endpoint
```
GET /api/faculty-modules/:spaceId/modules/:moduleId/assessments
Authorization: Bearer <token>
```

## Troubleshooting

### File Won't Upload
- Check file format (.csv, .xlsx, .xls only)
- Ensure file size is under 5 MB
- Verify file isn't corrupted

### Invalid CSV Format Error
- Ensure first row contains: `question,answer`
- Check for proper comma separation
- Wrap text with commas in quotes

### Questions Not Showing
- Verify questions have both question and answer fields
- Check for empty rows in CSV
- Ensure UTF-8 encoding

### Template Not Selecting
- Try refreshing the page
- Clear browser cache
- Check browser console for errors

## Database Schema

### Assessment Structure in MongoDB:
```javascript
{
  title: String,
  description: String,
  gameTemplate: String, // 'quiz', 'cyber-runner', etc.
  questions: [
    {
      question: String,
      answer: String,
      options: [String], // Optional
      correctIndex: Number // Optional
    }
  ],
  createdAt: Date
}
```

## Frontend Files
- **HTML**: `frontend/src/html/faculty-space.html`
- **JavaScript**: `frontend/src/js/assessment-builder.js`
- **CSS**: `frontend/src/css/assessment-builder.css`
- **Sample Template**: `frontend/assets/sample-assessment-template.csv`

## Backend Files
- **Model**: `backend/src/models/FacultyModule.js` (assessments field in modules)
- **Routes**: `backend/src/routes/facultyModules.js`
- **Endpoints**: 
  - POST `/:spaceId/modules/:moduleId/assessment`
  - GET `/:spaceId/modules/:moduleId/assessments`

## Future Enhancements
- [ ] Full Excel (.xlsx) support via SheetJS library
- [ ] Question bank and reusable questions
- [ ] Assessment analytics and student performance tracking
- [ ] Auto-grading and instant feedback
- [ ] Question randomization
- [ ] Time limits per assessment
- [ ] Assessment templates library
- [ ] Image support in questions
- [ ] Rich text formatting

## Support
For issues or questions:
- Check console logs (F12 in browser)
- Verify backend server is running
- Review sample CSV template
- Contact system administrator
