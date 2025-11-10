# Battle Quiz Template

## HTML to Add Before `</div>` (lesson-actions closing)

```html
          <!-- Battle Quiz Trigger Button -->
          <button class="battle-trigger-btn" onclick="battleQuiz.openOverlay()" style="margin-top: 1.5rem;">
            <span style="font-size: 1.125rem;">⚔️</span> Start Battle Quiz
          </button>

          <!-- Full Screen Battle Quiz Overlay -->
          <div class="battle-overlay" id="battleOverlay">
            <div class="battle-container" id="battleContainer">
              <!-- Battle content will be loaded here by JavaScript -->
            </div>
          </div>
```

## CSS Link to Add in `<head>`

```html
  <link rel="stylesheet" href="../../../css/battle-quiz.css">
```

## JavaScript to Add Before `</body>`

```html
  <script src="../../../js/battle-quiz.js"></script>
```

## Body Attributes Required

```html
<body class="site-background" data-module="MODULE_NAME" data-lesson="LESSON_NUMBER">
```

Replace MODULE_NAME with: cryptography, malware-defense, network-defense, web-security
Replace LESSON_NUMBER with: 1, 2, 3, or 4
