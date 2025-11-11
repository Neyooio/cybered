# 🎮 Header Check - Unity Game Development Guide

## Complete Setup with CyberEd Website Integration

---

## 📦 **Unity Project Setup**

### 1. Create New Unity Project
- **Unity Version**: 2021.3 LTS or newer
- **Template**: 2D Core
- **Project Name**: HeaderCheck

### 2. Required Packages
- **TextMeshPro** (Window → TextMeshPro → Import TMP Essentials)
- **Newtonsoft Json** (Package Manager → Add by name: `com.unity.nuget.newtonsoft-json`)

---

## 📁 **Project Structure**

```
Assets/
├── Scenes/
│   └── GameScene.unity
├── Scripts/
│   ├── GameManager.cs
│   ├── EmailData.cs
│   ├── HeaderElement.cs
│   ├── UIManager.cs
│   └── APIManager.cs
├── Prefabs/
│   └── HeaderElementPrefab.prefab
├── Resources/
│   └── EmailDatabase.json
└── Sprites/
    ├── background.png
    ├── header-panel.png
    └── button-sprites.png
```

---

## 🎨 **UI Canvas Setup**

### Hierarchy Structure:
```
Canvas (Screen Space - Overlay)
├── Background
├── TitlePanel
│   ├── TitleText ("Header Check")
│   └── LevelText ("Level: Easy")
├── EmailPanel
│   ├── EmailHeader
│   ├── HeaderScrollView
│   │   └── Content
│   │       └── (HeaderElements spawn here)
│   └── SubmitButton
├── FeedbackPanel (hidden by default)
│   ├── ResultText
│   ├── XPText
│   └── NextButton
├── ScorePanel (top right)
│   ├── ScoreText
│   └── TimerText
└── PauseButton
```

---

## 📜 **C# Scripts**

### **1. EmailData.cs**
```csharp
using System;
using System.Collections.Generic;

[Serializable]
public class EmailHeaderData
{
    public string id;
    public string difficulty; // "easy", "medium", "hard"
    public bool isPhishing;
    public List<HeaderField> fields;
    public List<string> redFlags; // List of field IDs that are suspicious
    public string explanation;
}

[Serializable]
public class HeaderField
{
    public string id;
    public string label;
    public string value;
    public bool isSuspicious;
}

[Serializable]
public class EmailDatabase
{
    public List<EmailHeaderData> emails;
}
```

### **2. APIManager.cs**
```csharp
using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

public class APIManager : MonoBehaviour
{
    private static APIManager _instance;
    public static APIManager Instance
    {
        get
        {
            if (_instance == null)
            {
                GameObject go = new GameObject("APIManager");
                _instance = go.AddComponent<APIManager>();
                DontDestroyOnLoad(go);
            }
            return _instance;
        }
    }

    // Get from URL parameters when game loads
    private string apiBaseUrl = "http://localhost:4000/api";
    private string authToken = "";

    void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);
            return;
        }
        _instance = this;
        DontDestroyOnLoad(gameObject);

        // Parse URL parameters
        ParseURLParameters();
    }

    void ParseURLParameters()
    {
        // Get parameters from URL (passed from website)
        string url = Application.absoluteURL;
        
        if (!string.IsNullOrEmpty(url))
        {
            // Extract token parameter
            if (url.Contains("token="))
            {
                int tokenStart = url.IndexOf("token=") + 6;
                int tokenEnd = url.IndexOf("&", tokenStart);
                if (tokenEnd == -1) tokenEnd = url.Length;
                authToken = url.Substring(tokenStart, tokenEnd - tokenStart);
            }

            // Extract API URL parameter
            if (url.Contains("api="))
            {
                int apiStart = url.IndexOf("api=") + 4;
                int apiEnd = url.IndexOf("&", apiStart);
                if (apiEnd == -1) apiEnd = url.Length;
                apiBaseUrl = UnityWebRequest.UnEscapeURL(url.Substring(apiStart, apiEnd - apiStart));
            }
        }

        Debug.Log($"API URL: {apiBaseUrl}");
        Debug.Log($"Auth Token: {(string.IsNullOrEmpty(authToken) ? "None" : "Set")}");
    }

    public IEnumerator SubmitChallengeCompletion(string challengeId, int score, int maxScore, 
                                                   float timeSpent, int correct, int total,
                                                   Action<bool, string, ChallengeResult> callback)
    {
        if (string.IsNullOrEmpty(authToken))
        {
            callback?.Invoke(false, "No authentication token", null);
            yield break;
        }

        string url = $"{apiBaseUrl}/challenges/complete";

        // Create JSON payload
        var payload = new
        {
            challengeId = challengeId,
            score = score,
            maxScore = maxScore,
            timeSpent = timeSpent,
            correct = correct,
            total = total
        };

        string jsonPayload = JsonUtility.ToJson(payload);

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonPayload);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                string responseText = request.downloadHandler.text;
                Debug.Log($"API Response: {responseText}");

                try
                {
                    APIResponse response = JsonUtility.FromJson<APIResponse>(responseText);
                    callback?.Invoke(response.success, "Success", response.result);
                }
                catch (Exception e)
                {
                    Debug.LogError($"JSON Parse Error: {e.Message}");
                    callback?.Invoke(false, "Failed to parse response", null);
                }
            }
            else
            {
                Debug.LogError($"API Error: {request.error}");
                callback?.Invoke(false, request.error, null);
            }
        }
    }

    [Serializable]
    private class APIResponse
    {
        public bool success;
        public ChallengeResult result;
    }
}

[Serializable]
public class ChallengeResult
{
    public int xpEarned;
    public int totalXP;
    public int oldLevel;
    public int newLevel;
    public bool leveledUp;
    public int percentage;
    public bool challengeCompleted;
}
```

### **3. GameManager.cs**
```csharp
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("Game Settings")]
    public int totalRounds = 5;
    public float timePerRound = 60f;

    [Header("References")]
    public UIManager uiManager;
    public Transform headerElementParent;
    public GameObject headerElementPrefab;

    private EmailDatabase emailDatabase;
    private List<EmailHeaderData> currentEmails;
    private EmailHeaderData currentEmail;
    private int currentRound = 0;
    private int score = 0;
    private float timeRemaining;
    private HashSet<string> flaggedElements = new HashSet<string>();

    private const string CHALLENGE_ID = "header-check";

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
    }

    void Start()
    {
        LoadEmailDatabase();
        StartNewGame();
    }

    void LoadEmailDatabase()
    {
        TextAsset jsonFile = Resources.Load<TextAsset>("EmailDatabase");
        if (jsonFile != null)
        {
            emailDatabase = JsonUtility.FromJson<EmailDatabase>(jsonFile.text);
            Debug.Log($"Loaded {emailDatabase.emails.Count} emails");
        }
        else
        {
            Debug.LogError("EmailDatabase.json not found in Resources folder!");
        }
    }

    public void StartNewGame()
    {
        currentRound = 0;
        score = 0;
        SelectRandomEmails();
        LoadNextRound();
    }

    void SelectRandomEmails()
    {
        // Select random emails for this game session
        currentEmails = emailDatabase.emails
            .OrderBy(x => Random.value)
            .Take(totalRounds)
            .ToList();
    }

    void LoadNextRound()
    {
        if (currentRound >= totalRounds)
        {
            EndGame();
            return;
        }

        currentEmail = currentEmails[currentRound];
        flaggedElements.Clear();
        timeRemaining = timePerRound;

        DisplayEmail(currentEmail);
        uiManager.UpdateRoundInfo(currentRound + 1, totalRounds);
        uiManager.UpdateScore(score);
        StartCoroutine(TimerCoroutine());
    }

    void DisplayEmail(EmailHeaderData email)
    {
        // Clear existing header elements
        foreach (Transform child in headerElementParent)
        {
            Destroy(child.gameObject);
        }

        // Create header elements
        foreach (var field in email.fields)
        {
            GameObject element = Instantiate(headerElementPrefab, headerElementParent);
            HeaderElement headerElement = element.GetComponent<HeaderElement>();
            headerElement.Initialize(field);
        }
    }

    IEnumerator TimerCoroutine()
    {
        while (timeRemaining > 0)
        {
            timeRemaining -= Time.deltaTime;
            uiManager.UpdateTimer(timeRemaining);
            yield return null;
        }

        // Time's up - submit automatically
        SubmitJudgment();
    }

    public void ToggleFlagElement(string fieldId)
    {
        if (flaggedElements.Contains(fieldId))
        {
            flaggedElements.Remove(fieldId);
        }
        else
        {
            flaggedElements.Add(fieldId);
        }
    }

    public void SubmitJudgment()
    {
        StopAllCoroutines();

        // Check if player's flags match the red flags
        bool isCorrect = CheckJudgment();
        int roundScore = CalculateRoundScore(isCorrect);

        score += roundScore;
        uiManager.ShowFeedback(isCorrect, roundScore, currentEmail.explanation);

        currentRound++;
    }

    bool CheckJudgment()
    {
        // Get actual red flags
        HashSet<string> actualRedFlags = new HashSet<string>(currentEmail.redFlags);

        // Perfect match required
        return flaggedElements.SetEquals(actualRedFlags);
    }

    int CalculateRoundScore(bool correct)
    {
        if (!correct) return 0;

        // Bonus for time remaining
        int baseScore = 100;
        int timeBonus = Mathf.RoundToInt(timeRemaining * 2);
        return baseScore + timeBonus;
    }

    public void NextRound()
    {
        LoadNextRound();
    }

    void EndGame()
    {
        int maxScore = totalRounds * 100; // Base score per round
        int correctAnswers = score > 0 ? currentRound : 0;

        // Submit to API
        StartCoroutine(APIManager.Instance.SubmitChallengeCompletion(
            CHALLENGE_ID,
            score,
            maxScore,
            Time.timeSinceLevelLoad,
            correctAnswers,
            totalRounds,
            (success, message, result) =>
            {
                if (success && result != null)
                {
                    uiManager.ShowGameEnd(score, maxScore, result);
                }
                else
                {
                    Debug.LogWarning($"Failed to submit score: {message}");
                    uiManager.ShowGameEnd(score, maxScore, null);
                }
            }
        ));
    }
}
```

### **4. UIManager.cs**
```csharp
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    [Header("UI Panels")]
    public GameObject emailPanel;
    public GameObject feedbackPanel;
    public GameObject gameEndPanel;

    [Header("Email Panel")]
    public TextMeshProUGUI roundText;
    public TextMeshProUGUI scoreText;
    public TextMeshProUGUI timerText;
    public Button submitButton;

    [Header("Feedback Panel")]
    public TextMeshProUGUI resultText;
    public TextMeshProUGUI explanationText;
    public TextMeshProUGUI roundScoreText;
    public Button nextButton;

    [Header("Game End Panel")]
    public TextMeshProUGUI finalScoreText;
    public TextMeshProUGUI xpEarnedText;
    public TextMeshProUGUI levelInfoText;
    public Button playAgainButton;
    public Button exitButton;

    void Start()
    {
        submitButton.onClick.AddListener(() => GameManager.Instance.SubmitJudgment());
        nextButton.onClick.AddListener(() => 
        {
            feedbackPanel.SetActive(false);
            emailPanel.SetActive(true);
            GameManager.Instance.NextRound();
        });
        playAgainButton.onClick.AddListener(() => 
        {
            gameEndPanel.SetActive(false);
            emailPanel.SetActive(true);
            GameManager.Instance.StartNewGame();
        });

        feedbackPanel.SetActive(false);
        gameEndPanel.SetActive(false);
    }

    public void UpdateRoundInfo(int current, int total)
    {
        roundText.text = $"Round {current}/{total}";
    }

    public void UpdateScore(int score)
    {
        scoreText.text = $"Score: {score}";
    }

    public void UpdateTimer(float timeRemaining)
    {
        int seconds = Mathf.CeilToInt(timeRemaining);
        timerText.text = $"Time: {seconds}s";

        // Change color when running out of time
        if (seconds <= 10)
        {
            timerText.color = Color.red;
        }
        else
        {
            timerText.color = Color.white;
        }
    }

    public void ShowFeedback(bool correct, int roundScore, string explanation)
    {
        emailPanel.SetActive(false);
        feedbackPanel.SetActive(true);

        resultText.text = correct ? "✓ CORRECT!" : "✗ INCORRECT";
        resultText.color = correct ? Color.green : Color.red;
        roundScoreText.text = $"+{roundScore} points";
        explanationText.text = explanation;
    }

    public void ShowGameEnd(int finalScore, int maxScore, ChallengeResult result)
    {
        emailPanel.SetActive(false);
        feedbackPanel.SetActive(false);
        gameEndPanel.SetActive(true);

        int percentage = Mathf.RoundToInt((float)finalScore / maxScore * 100);
        finalScoreText.text = $"Final Score: {finalScore}/{maxScore} ({percentage}%)";

        if (result != null)
        {
            xpEarnedText.text = $"+{result.xpEarned} XP Earned!";
            
            if (result.leveledUp)
            {
                levelInfoText.text = $"🎉 LEVEL UP! {result.oldLevel} → {result.newLevel}";
                levelInfoText.color = Color.yellow;
            }
            else
            {
                levelInfoText.text = $"Level {result.newLevel} | Total XP: {result.totalXP}";
                levelInfoText.color = Color.white;
            }
        }
        else
        {
            xpEarnedText.text = "Unable to connect to server";
            levelInfoText.text = "Play again to try syncing";
        }
    }
}
```

### **5. HeaderElement.cs**
```csharp
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class HeaderElement : MonoBehaviour
{
    [Header("UI References")]
    public TextMeshProUGUI labelText;
    public TextMeshProUGUI valueText;
    public Image background;
    public Button flagButton;
    public GameObject flagIndicator;

    [Header("Colors")]
    public Color normalColor = new Color(0.2f, 0.2f, 0.3f);
    public Color flaggedColor = new Color(0.9f, 0.3f, 0.3f);

    private HeaderField fieldData;
    private bool isFlagged = false;

    void Start()
    {
        flagButton.onClick.AddListener(ToggleFlag);
        flagIndicator.SetActive(false);
    }

    public void Initialize(HeaderField field)
    {
        fieldData = field;
        labelText.text = field.label + ":";
        valueText.text = field.value;
        background.color = normalColor;
        isFlagged = false;
        flagIndicator.SetActive(false);
    }

    void ToggleFlag()
    {
        isFlagged = !isFlagged;
        flagIndicator.SetActive(isFlagged);
        background.color = isFlagged ? flaggedColor : normalColor;

        GameManager.Instance.ToggleFlagElement(fieldData.id);
    }
}
```

---

## 📄 **EmailDatabase.json**
Create this file in `Assets/Resources/EmailDatabase.json`:

```json
{
  "emails": [
    {
      "id": "email001",
      "difficulty": "easy",
      "isPhishing": true,
      "fields": [
        {
          "id": "from",
          "label": "From",
          "value": "support@paypa1.com",
          "isSuspicious": true
        },
        {
          "id": "to",
          "label": "To",
          "value": "user@example.com",
          "isSuspicious": false
        },
        {
          "id": "subject",
          "label": "Subject",
          "value": "URGENT: Verify your account immediately!",
          "isSuspicious": true
        },
        {
          "id": "date",
          "label": "Date",
          "value": "Mon, 11 Nov 2025 14:32:15 +0000",
          "isSuspicious": false
        },
        {
          "id": "reply-to",
          "label": "Reply-To",
          "value": "phisher@suspicious-domain.ru",
          "isSuspicious": true
        }
      ],
      "redFlags": ["from", "subject", "reply-to"],
      "explanation": "This email has 3 red flags: misspelled domain (paypa1 instead of paypal), urgent language designed to panic users, and suspicious reply-to address from .ru domain."
    },
    {
      "id": "email002",
      "difficulty": "easy",
      "isPhishing": false,
      "fields": [
        {
          "id": "from",
          "label": "From",
          "value": "notifications@github.com",
          "isSuspicious": false
        },
        {
          "id": "to",
          "label": "To",
          "value": "developer@example.com",
          "isSuspicious": false
        },
        {
          "id": "subject",
          "label": "Subject",
          "value": "[GitHub] New pull request on your repository",
          "isSuspicious": false
        },
        {
          "id": "date",
          "label": "Date",
          "value": "Mon, 11 Nov 2025 09:15:42 +0000",
          "isSuspicious": false
        },
        {
          "id": "spf",
          "label": "SPF",
          "value": "PASS (github.com: domain of github.com designates IP as permitted sender)",
          "isSuspicious": false
        }
      ],
      "redFlags": [],
      "explanation": "This is a legitimate email from GitHub. The sender domain is correct, SPF authentication passed, and there are no urgent or suspicious elements."
    }
  ]
}
```

---

## 🌐 **Integration with Website**

### Update `challenges.js` to pass authentication:
```javascript
function openGame(challengeId) {
  const challenge = challengesIndex.find(c => c.id === challengeId);
  if (!challenge) return;

  const token = localStorage.getItem('authToken');
  const apiBase = localStorage.getItem('apiBase') || 'http://localhost:4000/api';
  
  // Build game URL with parameters
  const gameUrl = new URL(challenge.gameUrl);
  gameUrl.searchParams.set('token', token);
  gameUrl.searchParams.set('api', apiBase);
  gameUrl.searchParams.set('challenge', challengeId);

  // ... rest of openGame function
  gameIframe.src = gameUrl.toString();
}
```

---

## 🚀 **Building for WebGL**

### Build Settings:
1. File → Build Settings
2. Platform: **WebGL**
3. Compression Format: **Brotli** (best compression)
4. Code Optimization: **Shorter Build Time** (for testing) or **Faster Runtime** (production)
5. Click **Build** → Choose output folder

### Hosting the Game:
1. Upload the build folder to your web server
2. Update `challenges.js` with the URL:
```javascript
gameUrl: 'https://yourdomain.com/games/header-check/index.html'
```

---

## ✅ **Testing Checklist**

- [ ] Unity builds without errors
- [ ] Game loads in browser
- [ ] Authentication token is received from URL
- [ ] API calls succeed (check browser console)
- [ ] XP is awarded correctly
- [ ] Level up triggers properly
- [ ] Game restarts correctly
- [ ] Fullscreen works

---

## 🎯 **Next Steps**

1. **Create more email samples** in EmailDatabase.json
2. **Add difficulty progression** (easy → hard)
3. **Add sound effects** for correct/incorrect
4. **Add visual polish** (animations, particles)
5. **Test on mobile devices**

---

**🎮 Your game is now fully integrated with the CyberEd XP system!**
