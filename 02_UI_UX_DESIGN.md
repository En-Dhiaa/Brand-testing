Logo Color Studio

UI/UX Design System & User Experience Specification

Version: 1.0
Document: "02_UI_UX_DESIGN.md"
Product: Logo Color Studio
Primary Language: Arabic
Direction: RTL
Design Approach: Mobile First / App-Like / Modern / Professional
Target Devices: Smartphones, Tablets, Laptops, Desktops, Large Screens

---

1. IMPORTANT PROJECT ASSET INSTRUCTION

Logo Assets Location

The project already contains the official logo assets.

All logo files and logo components are located inside:

/logo

Antigravity and Gemini MUST inspect this folder before implementing the logo editor.

Do NOT:

- Create a fake logo.
- Generate a replacement logo.
- Use placeholder logo graphics.
- Download another logo from the Internet.
- Redesign the logo.
- Replace the existing logo with an icon.
- Assume that the logo is a single flat SVG if separate components already exist.

The existing files inside the "logo" folder are the source assets for the project.

The implementation must inspect:

/logo

and identify:

- Main SVG file.
- Individual logo parts.
- Supporting SVG assets.
- Any existing variations.
- Any existing logo metadata if available.

If the folder contains already-separated logo components, use those components directly.

If the logo is provided as both a complete SVG and separate component files, the complete SVG should be used for the primary visual reference while the individual components should be used for editable color control where appropriate.

The UI must be designed around the actual dimensions, proportions, number of parts, and visual structure of the supplied logo.

---

2. CORE UX PRINCIPLE

The application must feel like a professional mobile application rather than a traditional website.

The user should immediately understand:

«خصص ألوان الشعار، شاهد النتيجة، ثم شارك اقتراحك.»

The interface must be:

- Simple
- Elegant
- Visual
- Fast
- Responsive
- Arabic-first
- Touch-friendly
- Professional
- Modern
- Minimal but functional

Do not overload the interface with technical controls.

Advanced options should remain available without dominating the primary experience.

---

3. DESIGN DIRECTION

The visual language should combine:

- Modern SaaS applications
- Professional design tools
- Mobile applications
- Brand identity platforms

The interface should use:

- Clean cards
- Soft borders
- Moderate corner radius
- Subtle shadows
- Clear typography
- Strong spacing
- Professional icons
- Smooth micro-interactions

Avoid:

- Excessive gradients in the application UI
- Excessive shadows
- Too many colors
- Decorative clutter
- Huge text
- Excessive animations
- Old-fashioned form layouts
- Generic Bootstrap-looking interfaces

The logo itself is the visual focus.

The application UI must support the logo rather than compete with it.

---

4. MOBILE-FIRST REQUIREMENT

The application must be designed for smartphones first.

Do not design desktop screens and simply shrink them for mobile.

The mobile layout must be intentionally designed.

Primary mobile priorities:

1. Logo visibility
2. Easy color selection
3. Easy component selection
4. Easy preview
5. Easy save/submit
6. Easy download
7. Easy navigation

The interface must work comfortably with one hand where practical.

---

5. APP-LIKE EXPERIENCE

The website should visually behave like an installed application.

Use:

- Full-height layouts
- App-style navigation
- Sticky controls
- Bottom sheets
- Mobile dialogs
- Smooth transitions
- Clear back navigation
- Touch-friendly buttons
- Safe-area support

The experience should resemble a polished application such as:

- Design tools
- Creative editors
- Modern productivity apps

It should not resemble a traditional corporate website.

---

6. APPLICATION SHELL

The application shell consists of:

┌─────────────────────────────┐
│ App Header                  │
├─────────────────────────────┤
│                             │
│                             │
│       Page Content          │
│                             │
│                             │
├─────────────────────────────┤
│ Bottom Navigation           │
└─────────────────────────────┘

On mobile, the bottom navigation should be used when appropriate.

On desktop, navigation can move to the header/sidebar depending on screen width.

---

7. PRIMARY NAVIGATION

Recommended public navigation:

الرئيسية
تخصيص
الاقتراحات
النتائج

Possible icons:

Home
Palette
LayoutGrid
BarChart3

The navigation should remain simple.

Do not create navigation items for every small feature.

---

8. MOBILE BOTTOM NAVIGATION

On smartphones:

┌─────────────────────────────────────┐
│ 🏠     🎨       🖼️       📊        │
│ الرئيسية تخصيص   الاقتراحات النتائج │
└─────────────────────────────────────┘

Use a professional icon library rather than emoji.

Icons must be visually consistent.

The active page should have:

- Strong visual emphasis
- Icon state
- Text label
- Clear active indicator

The bottom navigation must respect mobile safe areas.

---

9. HEADER

The header should be minimal.

Possible structure:

[Menu/Back]     Logo Color Studio     [Theme]

On the homepage:

[App Logo]      Logo Color Studio      [Theme]

On editor pages:

[Back]          تخصيص الشعار           [Help]

The header must not consume excessive vertical space.

---

10. TYPOGRAPHY

The interface must use a high-quality Arabic font.

Preferred options:

1. Tajawal
2. IBM Plex Sans Arabic
3. Cairo
4. Noto Sans Arabic

The final implementation should choose one primary font and use it consistently.

Recommended typography hierarchy:

Display
32–40px

H1
28–32px

H2
22–26px

H3
18–20px

Body
15–17px

Small
12–14px

These values should remain responsive.

Do not use extremely small Arabic text.

---

11. FONT WEIGHTS

Recommended:

Regular
400

Medium
500

SemiBold
600

Bold
700

Avoid excessive use of 700/800 weights.

Use weight to create hierarchy rather than relying only on size.

---

12. COLOR SYSTEM

The application UI should use a neutral interface palette.

The actual logo colors must remain independent from the application's interface colors.

Do not automatically use the participant's selected logo color as the entire application theme.

Suggested UI philosophy:

Background
Neutral

Surface
White / dark neutral

Primary
Professional accent

Text
High contrast

Muted
Neutral gray

Border
Subtle neutral

The exact UI color tokens can be implemented as CSS variables.

---

13. LOGO AS VISUAL CENTER

The logo must receive the highest visual priority.

On the editor screen:

             ┌───────────────┐
             │               │
             │     LOGO      │
             │    PREVIEW    │
             │               │
             └───────────────┘

Controls should not visually overpower the logo.

The logo preview should have enough empty space around it.

---

14. LOGO PREVIEW CONTAINER

The preview area should support:

- Transparent background
- Solid background
- Gradient background
- Light background
- Dark background

Use a subtle preview surface.

For transparency, a checkerboard pattern may be used.

Example:

┌──────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░ │
│ ░       LOGO           ░ │
│ ░                      ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────┘

The checkerboard should remain subtle.

---

15. HOMEPAGE UX

The homepage should be short and focused.

Recommended structure:

Header

Hero
    Title
    Description
    Start button
    Explore button

Live/Featured Logo

How it Works

Current Participation Statistics

Featured Proposals

Final CTA

Footer

---

16. HOMEPAGE HERO

Suggested Arabic copy:

Title

«ساعدنا في اختيار ألوان الهوية»

Description

«خصص ألوان الشعار بالطريقة التي تراها مناسبة، ثم شارك اقتراحك مع الآخرين.»

Primary CTA:

«ابدأ التخصيص»

Secondary CTA:

«استكشف الاقتراحات»

The title should be visually strong but not excessively large on mobile.

---

17. HERO LOGO

The logo should be displayed inside the hero.

It should have a subtle entrance animation.

Do not use excessive animation.

Potential effect:

Opacity 0 → 1
Scale 0.96 → 1

Duration should be short and smooth.

---

18. HOW IT WORKS

Display three or four steps:

01
خصص

اختر ألوان الشعار

02
عاين

شاهد النتيجة مباشرة

03
احفظ

اعتمد اقتراحك

04
شارك

صوّت وشارك اقتراحات الآخرين

Use icons and short text.

---

19. STATISTICS PREVIEW

The homepage can display:

1,248
اقتراح

3,842
تصويت

5,127
إعجاب

The numbers should be retrieved dynamically.

Do not use hardcoded fake statistics in production.

During development, mock data may be used temporarily.

---

20. EDITOR SCREEN

The editor is the most important UI screen.

Mobile layout:

┌─────────────────────────────┐
│ ←   تخصيص الشعار      ⋮   │
├─────────────────────────────┤
│                             │
│       LOGO PREVIEW          │
│                             │
│                             │
├─────────────────────────────┤
│  المكونات                   │
│                             │
│ [الرمز] [النص] [الإطار]    │
│                             │
├─────────────────────────────┤
│ اللون                       │
│                             │
│ [Color Picker]              │
│                             │
│ [الألوان الجاهزة]          │
│                             │
├─────────────────────────────┤
│ الخلفية                    │
│                             │
├─────────────────────────────┤
│ التدرج                     │
│                             │
├─────────────────────────────┤
│        معاينة وحفظ          │
└─────────────────────────────┘

The exact arrangement may be optimized during implementation.

---

21. MOBILE EDITOR TOOLBAR

The editor should have quick actions.

Suggested:

↶ تراجع
↷ إعادة
↺ إعادة ضبط

Use icon buttons with labels where space allows.

On small screens, use tooltips or accessible labels.

---

22. COMPONENT SELECTOR

The component selector allows the user to choose which part of the logo to customize.

Use visual cards.

Example:

┌──────────┐
│  Preview │
│   Part   │
├──────────┤
│ الرمز    │
└──────────┘

If the number of parts is large, use horizontal scrolling on mobile.

Example:

[الرمز] [النص] [الإطار] [الجزء 4] →

Do not create a huge vertical list if it unnecessarily increases scrolling.

---

23. SELECTED COMPONENT STATE

The selected component must have a clear visual state.

Use:

- Border
- Background
- Small check indicator
- Accent color

Do not rely only on color.

Example:

[ ✓ الرمز ]

---

24. LOGO PART HIGHLIGHT

When the user selects a component, highlight the corresponding SVG part.

Possible effect:

- Temporary outline
- Subtle glow
- Scale 1.02
- Border around selected region where technically possible

The effect must not modify the actual saved design.

---

25. COLOR PICKER

The color picker should be touch-friendly.

It should contain:

Current Color
Color Area
Hue Slider
HEX Input
Optional RGB/HSL

The most important input is the visual picker.

HEX should be available for users who know exact colors.

---

26. PREDEFINED COLORS

Display predefined colors in a grid.

Example:

● ● ● ●
● ● ● ●
● ● ● ●

Each color should have:

- Accessible label
- Tooltip/name where practical
- HEX value optionally shown

Avoid extremely small color swatches.

---

27. COLOR PALETTE GROUPS

Display palette categories as cards.

Example:

Professional
● ● ● ● ●

Modern
● ● ● ● ●

Elegant
● ● ● ● ●

Selecting a palette should show a clear preview before applying it where practical.

---

28. CUSTOM COLOR

The custom color option should be visually distinct:

«لون مخصص»

The user can open the full color picker.

The interface should support direct HEX entry.

Example:

HEX
[ #2E7D32 ]

---

29. GRADIENT UI

Gradient editing should not overwhelm the user.

Recommended structure:

التدرج

[ تشغيل التدرج ]

نوع التدرج
○ خطي
○ دائري

اللون الأول
● #2E7D32

اللون الثاني
● #A5D6A7

زاوية التدرج
45°

If additional color stops are supported, provide:

«إضافة لون»

rather than showing advanced controls immediately.

---

30. BACKGROUND CONTROL

The background section should have clear options:

الخلفية

○ شفافة
○ لون ثابت
○ تدرج

If JPG export is selected, the system should make it clear that JPG requires a background.

---

31. LIVE PREVIEW

The preview should update immediately.

Avoid page reloads.

Avoid long loading states for simple color changes.

The user should perceive the editor as real-time.

---

32. PREVIEW ZOOM

A useful optional feature is zoom control.

Controls:

−
100%
+

On mobile, pinch-to-zoom can be supported if technically appropriate.

Zoom should affect only the preview area, not the entire application.

---

33. FULLSCREEN PREVIEW

Provide an optional:

«عرض الشعار»

button.

It opens a larger preview.

On mobile, the preview can occupy the entire screen.

Actions may include:

- Close
- Zoom
- Download
- Share

---

34. DESKTOP EDITOR

Desktop should use a larger workspace.

Suggested layout:

┌──────────────────────────────────────────────────┐
│ Header                                           │
├──────────────────────────────────────────────────┤
│                                                  │
│        ┌───────────────────────┐                 │
│        │                       │  Components     │
│        │                       │                 │
│        │        LOGO           │  Colors         │
│        │                       │                 │
│        │                       │  Gradient       │
│        └───────────────────────┘                 │
│                                                  │
├──────────────────────────────────────────────────┤
│ Undo     Redo     Reset          Save Proposal   │
└──────────────────────────────────────────────────┘

The exact arrangement can be refined during implementation.

---

35. STICKY ACTION BAR

The most important action should remain accessible.

Mobile:

┌──────────────────────────────────┐
│     معاينة       حفظ الاقتراح    │
└──────────────────────────────────┘

Desktop:

[Undo] [Redo] [Reset]        [Save Proposal]

The save action must be visually dominant.

---

36. FINAL PREVIEW SCREEN

Before submission, show a clean final preview.

The page should intentionally remove unnecessary editor controls.

Structure:

← العودة للتعديل

اقتراحك النهائي

        LOGO

الألوان المستخدمة
● #...
● #...
● #...

الخلفية
#FFFFFF

[ تحميل PNG ]
[ تحميل JPG ]

[ اعتماد الاقتراح ]

---

37. FINAL SUBMISSION CONFIRMATION

When the user selects:

«اعتماد الاقتراح»

display a confirmation dialog.

Suggested text:

«بعد اعتماد الاقتراح لن تتمكن من تعديل ألوانه أو حذفه. هل تريد المتابعة؟»

Buttons:

«اعتماد الاقتراح»

«العودة للتعديل»

This is a critical confirmation.

---

38. SUCCESS SCREEN

After successful submission:

✓

تم حفظ اقتراحك

رقم الاقتراح
#LC-1024

[ مشاركة ]
[ تحميل PNG ]
[ تحميل JPG ]

[ استكشف الاقتراحات ]

Use a subtle success animation.

---

39. LOCKED PROPOSAL STATE

When a user views their submitted proposal:

Show:

«🔒 اقتراح معتمد»

and:

«لا يمكن تعديل هذا الاقتراح بعد اعتماده.»

Do not display an edit button.

The download and share actions remain available.

---

40. GALLERY DESIGN

The proposal gallery should use cards.

Desktop:

┌──────────┐ ┌──────────┐ ┌──────────┐
│  LOGO    │ │  LOGO    │ │  LOGO    │
│          │ │          │ │          │
├──────────┤ ├──────────┤ ├──────────┤
│ ❤️ 120   │ │ ❤️ 98    │ │ ❤️ 84    │
│ 🗳️ 87    │ │ 🗳️ 71    │ │ 🗳️ 60    │
└──────────┘ └──────────┘ └──────────┘

Use real icons.

Do not use emoji in the final interface.

---

41. PROPOSAL CARD

Each card should contain:

1. Logo preview
2. Proposal ID
3. Likes
4. Votes
5. Comments
6. View button

Optional:

- Creation date
- Color chips

The card should have a clear clickable area.

---

42. PROPOSAL CARD ACTIONS

Primary:

«مشاهدة الاقتراح»

Secondary actions:

- Like
- Vote
- Share

Avoid putting too many full buttons inside every card.

Use icon buttons where appropriate.

---

43. PROPOSAL DETAILS

The proposal details page should focus on the logo.

Structure:

Header

Large Logo Preview

Proposal #LC-1024

[ ❤️ إعجاب ] [ 🗳️ تصويت ]

الألوان المستخدمة

Color Chips

[ تحميل PNG ]
[ تحميل JPG ]

[ مشاركة ]

التعليقات

---

44. COLOR INFORMATION

Color information should be displayed visually.

Example:

الرمز الرئيسي

●
#2E7D32

For multiple colors:

● #2E7D32
● #C9A227
● #FFFFFF

HEX can be copied with a button.

Example:

«نسخ»

After copying:

«تم نسخ اللون»

---

45. LIKE BUTTON

The like button should provide immediate visual feedback.

States:

♡ أعجبني

and:

♥ أعجبني

The actual icon should come from the selected icon library.

The interaction should feel responsive while the server confirms the action.

---

46. VOTE BUTTON

Voting should be visually distinct from likes.

Suggested icon:

- Vote
- Check Circle
- Thumbs Up depending on design

Text:

«تصويت»

After voting:

«تم التصويت»

The system should not make the vote visually identical to a like.

---

47. COMMENTS UI

Comments should appear below the proposal.

Structure:

التعليقات

[ اكتب تعليقك... ]

[ نشر ]

────────────────

مستخدم
منذ 5 دقائق

تعليق المستخدم هنا.

The input should remain simple.

---

48. COMMENT MODERATION MESSAGE

If comments are moderated before appearing, show:

«قد يخضع تعليقك للمراجعة قبل ظهوره.»

Only display this if moderation is actually implemented.

---

49. SHARE UI

On mobile, use the native share sheet where supported.

Fallback:

مشاركة الاقتراح

[ نسخ الرابط ]
[ QR Code ]

The interface should be simple.

---

50. QR CODE MODAL

The QR modal should contain:

مشاركة الاقتراح

        QR

امسح الكود لفتح الاقتراح

[ تحميل QR ]
[ نسخ الرابط ]

The QR should have enough whitespace around it for reliable scanning.

---

51. RESULTS PAGE

The results page should be visually data-driven.

Structure:

نتائج المشاركة

┌──────────┐ ┌──────────┐
│ 1,248    │ │ 3,842    │
│ اقتراح   │ │ تصويت    │
└──────────┘ └──────────┘

┌──────────┐ ┌──────────┐
│ 5,127    │ │ 864      │
│ إعجاب    │ │ تعليق    │
└──────────┘ └──────────┘

Then:

- Most voted
- Most liked
- Most selected colors
- Color distribution

---

52. DATA VISUALIZATION

Charts should be:

- Simple
- Responsive
- Accessible
- Easy to understand

Avoid excessive chart types.

Recommended:

- Bar chart
- Donut chart
- Horizontal ranking visualization
- Color swatch statistics

The colors in charts should not compromise readability.

---

53. ADMIN LOGIN

The administrator login should use a professional minimal layout.

Logo

تسجيل دخول المدير

البريد الإلكتروني

[                 ]

كلمة المرور

[                 ]

[ تسجيل الدخول ]

No public registration.

No admin link should be prominently displayed to normal visitors.

---

54. ADMIN DASHBOARD

The admin dashboard should use a professional SaaS-style interface.

Desktop:

┌────────────┬──────────────────────────────┐
│ Sidebar    │ Dashboard                    │
│            │                              │
│ الرئيسية   │ Statistics                   │
│ الاقتراحات │ Charts                       │
│ التعليقات  │ Recent Proposals              │
│ النتائج    │ Recent Comments               │
│ الإعدادات  │                              │
└────────────┴──────────────────────────────┘

Mobile:

Use a drawer or bottom navigation depending on the final implementation.

---

55. ADMIN STATISTICS CARDS

Cards:

إجمالي الاقتراحات
1,248

التصويتات
3,842

الإعجابات
5,127

التعليقات
864

Use large numbers with small labels.

---

56. ADMIN PROPOSAL TABLE

Desktop can use a table:

ID
التاريخ
الحالة
الإعجابات
التصويتات
التعليقات
الإجراءات

On mobile, convert rows into cards.

Never force a wide table into a tiny mobile viewport.

---

57. ADMIN PROPOSAL ACTIONS

Actions:

- View
- Hide
- Delete
- Restore where applicable

Destructive actions should be visually separated.

---

58. ADMIN COMMENT MANAGEMENT

Comments should appear in a manageable list.

Each item:

Comment
Proposal
Date
Status

[View]
[Hide]
[Delete]

The administrator should be able to moderate quickly.

---

59. ADMIN COLOR ANALYTICS

Display:

الألوان الأكثر اختيارًا

██████████ #2E7D32
███████    #C9A227
█████      #FFFFFF

Use actual charts rather than ASCII in the final application.

---

60. RESPONSIVE BREAKPOINT PHILOSOPHY

Do not design based on a single phone size.

The layout must adapt continuously.

General categories:

Small Mobile
Mobile
Tablet
Laptop
Desktop
Large Desktop

Exact breakpoints should follow the selected CSS framework's recommended responsive system where possible.

---

61. SMALL MOBILE

For very small screens:

- One-column layout
- Full-width controls
- Horizontal component scrolling
- Compact header
- Sticky bottom actions
- Minimal secondary information

Never allow important buttons to overflow horizontally.

---

62. STANDARD MOBILE

Use:

- Comfortable spacing
- Large logo preview
- Bottom action bar
- Bottom sheets
- 1-column proposal cards

---

63. TABLET

Use:

- Larger preview
- Two-column editor where appropriate
- Two-column gallery
- More spacious controls

---

64. DESKTOP

Use:

- Two-column or three-column workspace
- Persistent controls
- Multi-column gallery
- Dashboard sidebar

---

65. LARGE DESKTOP

Do not stretch content across the entire monitor.

Use a maximum content width.

Example conceptual approach:

             ┌───────────────────────┐
             │      Application      │
             │       Content         │
             └───────────────────────┘

Maintain comfortable reading and interaction widths.

---

66. SPACING SYSTEM

Use a consistent spacing scale.

Recommended base:

4
8
12
16
20
24
32
40
48
64

Do not randomly use different margins throughout the application.

---

67. BORDER RADIUS

Use a consistent radius system.

Example:

Small
8px

Medium
12px

Large
16px

Extra Large
20–24px

Cards should generally use medium or large radius.

Buttons should remain comfortable and modern.

---

68. BUTTON SYSTEM

Primary:

«حفظ الاقتراح»

Secondary:

«استكشف الاقتراحات»

Tertiary:

«إلغاء»

Danger:

«حذف»

Buttons should have:

- Clear text
- Icon where useful
- Hover state
- Active state
- Disabled state
- Loading state

---

69. PRIMARY ACTION COLOR

The primary UI action should use one consistent application accent.

Do not dynamically change the primary button color based on the user's selected logo color.

This prevents the UI from becoming visually unstable.

---

70. INPUT DESIGN

Inputs should be:

- Large enough for touch
- Clearly labeled
- Accessible
- RTL-aware

Example:

اسم الاقتراح (اختياري)

[                         ]

If no proposal name is required, avoid adding unnecessary input fields.

---

71. MODALS

Modals should be used for:

- Confirmation
- QR
- Fullscreen preview
- Advanced color controls

On mobile, modals can become bottom sheets.

Avoid nested modals.

---

72. BOTTOM SHEETS

Bottom sheets are recommended for mobile controls such as:

- Color picker
- Gradient settings
- Component options
- Share options

Example:

────────────────────────────
تخصيص اللون

● ● ● ● ●

[اختيار لون مخصص]

HEX
[ #2E7D32 ]

             تم
────────────────────────────

---

73. TOAST NOTIFICATIONS

Use lightweight toast messages for:

- Copy
- Like
- Save
- Download
- Vote

Example:

«تم نسخ الرابط»

Toasts should not block the interface.

---

74. LOADING UI

Use skeletons for:

- Gallery
- Statistics
- Proposal cards

Use progress indicators for:

- Exporting logo
- Submitting proposal
- Uploading admin assets if supported

---

75. ERROR UI

Errors should be understandable.

Example:

«حدث خطأ أثناء حفظ الاقتراح. حاول مرة أخرى.»

Action:

«إعادة المحاولة»

Do not expose stack traces.

---

76. EMPTY GALLERY

Suggested:

«لا توجد اقتراحات حتى الآن.»

Supporting:

«كن أول من يشارك في اختيار ألوان الهوية.»

Button:

«ابدأ التخصيص»

---

77. EMPTY COMMENTS

Suggested:

«لا توجد تعليقات حتى الآن.»

Supporting:

«كن أول من يشارك رأيه.»

---

78. ACCESSIBILITY

All controls must be accessible.

Requirements:

- Semantic HTML
- Keyboard navigation
- Focus indicators
- ARIA labels where needed
- Accessible dialogs
- Accessible color controls
- Sufficient text contrast

Never make an icon-only button without an accessible label.

---

79. COLOR ACCESSIBILITY

Because the application itself is about colors, users must still be able to use it without relying only on color.

For example, selected components should have:

- Border
- Check icon
- Text
- Focus state

not only a different color.

---

80. MOTION

Animations must respect:

prefers-reduced-motion

Users who disable animations should receive a reduced-motion experience.

Avoid animations that are:

- Long
- Distracting
- Continuous
- Unnecessary

---

81. TOUCH TARGETS

Interactive controls should be sufficiently large for touch.

Avoid tiny color buttons.

Color swatches should be easy to tap.

Icon buttons should have adequate touch areas even if the visible icon is small.

---

82. DARK MODE

Dark mode should use carefully selected neutral surfaces.

Example structure:

Dark Background
Dark Surface
Elevated Surface
Primary Text
Secondary Text
Border
Accent

The logo preview must remain visually accurate.

Do not invert logo colors automatically.

---

83. LIGHT MODE

Light mode should be the default unless the user previously selected dark mode.

Use:

- White/near-white surfaces
- Neutral borders
- High contrast text
- Soft shadows

---

84. THEME SWITCHING

Theme toggle can be located in:

- Header
- Settings
- Menu

The user's theme preference can be stored locally.

---

85. APP ICON AND BRANDING

The PWA should have:

- App icon
- Favicon
- Maskable icon where appropriate
- Apple touch icon where applicable

The icon should be derived from the official project branding, not an unrelated placeholder.

---

86. SPLASH / INSTALL EXPERIENCE

If PWA installation is implemented, the application should provide a polished launch experience.

Do not use an excessively long splash screen.

---

87. FOOTER

The public footer should remain minimal.

Potential content:

Logo Color Studio

شارك في اختيار الهوية البصرية

© 2026

Additional legal links:

- Privacy
- Terms

Only include pages that actually exist.

---

88. NO EXCESSIVE CONTENT

The interface must not overwhelm users with paragraphs.

Use:

- Short instructions
- Visual labels
- Tooltips
- Expandable advanced options

The user should be able to begin customization within seconds.

---

89. USER FLOW — FIRST VISIT

The ideal first visit:

Open website
↓
Understand purpose
↓
Tap "ابدأ التخصيص"
↓
See logo
↓
Select component
↓
Choose color
↓
See result
↓
Customize more
↓
Preview
↓
Submit

Do not force a tutorial unless usability testing shows it is necessary.

---

90. USER FLOW — RETURNING VISITOR

Returning visitors can:

Open website
↓
Explore proposals
↓
Open proposal
↓
Like
↓
Vote
↓
Comment

or:

Open website
↓
Customize
↓
Submit another proposal

---

91. SHARE FLOW

Proposal
↓
Share
↓
Native Share / Copy Link / QR
↓
Recipient opens proposal

The shared page must work without login.

---

92. DOWNLOAD FLOW

Preview
↓
Download
↓
Select PNG / JPG
↓
Generate
↓
Download

The user should not be required to submit a proposal before downloading a temporary design unless the product owner specifically chooses this rule.

---

93. PRE-SUBMISSION DOWNLOAD

The application should allow users to download their customized design before submission.

This encourages experimentation.

The downloaded file should not automatically create a proposal.

---

94. POST-SUBMISSION DOWNLOAD

The submitted proposal must remain downloadable.

The user can download:

- PNG
- JPG

from the proposal page.

---

95. Proposal Ownership UX

Because public users do not have accounts, do not display misleading language such as:

«My Account»

Instead use:

«اقتراحي»

only where the application can reliably identify the submitted proposal during the current session.

The public proposal remains accessible through its shareable link.

---

96. ADMIN RESPONSIVE UX

The admin interface must also be responsive.

Mobile admin:

- Drawer navigation
- Cards instead of wide tables
- Sticky actions
- Compact statistics

Desktop admin:

- Sidebar
- Tables
- Charts
- Multi-column layouts

---

97. ADMIN DANGER ACTIONS

Delete actions should use a danger visual style.

Example:

«حذف الاقتراح»

Before deletion:

«هل أنت متأكد من حذف هذا الاقتراح؟ لا يمكن التراجع عن هذا الإجراء إذا كان الحذف نهائيًا.»

If soft deletion is used, explain that the proposal will be hidden rather than permanently destroyed.

---

98. ADMIN SEARCH

The admin proposal page should include:

[ بحث عن رقم الاقتراح... ]

Filters:

- Status
- Date
- Votes
- Likes
- Comments

Search should be fast and server-backed for large datasets.

---

99. ADMIN FILTERS ON MOBILE

On mobile, filters should open in a bottom sheet.

Example:

الفلاتر

الحالة
○ الكل
○ منشور
○ مخفي

الترتيب
○ الأحدث
○ الأكثر تصويتًا
○ الأكثر إعجابًا

[ تطبيق ]

---

100. ADMIN DASHBOARD VISUAL STYLE

The admin dashboard should remain visually consistent with the public application but can have a more information-dense layout.

It should feel like a professional management system.

---

101. DESIGN SYSTEM COMPONENTS

Create reusable UI components.

Potential components:

AppHeader
BottomNavigation
Button
IconButton
Card
Modal
BottomSheet
Toast
ColorSwatch
ColorPicker
PaletteCard
LogoPreview
LogoComponentSelector
GradientEditor
ProposalCard
ProposalStats
CommentCard
VoteButton
LikeButton
ShareButton
QRCodeModal
StatisticsCard
ChartCard
AdminSidebar
AdminTable
EmptyState
LoadingState
ErrorState

Do not duplicate UI implementations unnecessarily.

---

102. DESIGN TOKENS

The UI should use centralized tokens for:

- Colors
- Spacing
- Radius
- Typography
- Shadows
- Transitions

This makes future branding changes easier.

---

103. ICON LIBRARY

Use one professional icon library consistently.

Recommended options include:

- Lucide
- Phosphor

Choose one.

Do not mix several unrelated icon libraries unless technically necessary.

---

104. ICON DIRECTION

RTL does not mean every icon should be mirrored.

Only directional icons should change direction.

Examples:

- Back
- Forward
- Arrow
- Navigation

Icons such as:

- Heart
- Palette
- Download
- Settings

remain visually consistent.

---

105. MICROINTERACTIONS

Recommended:

Color Selection

Small smooth transition.

Like

Subtle scale feedback.

Vote

Check confirmation.

Save

Progress → success.

Copy

Toast.

Download

Progress indication.

Animations must remain subtle.

---

106. DESIGN STATES

Every interactive component must consider:

Default
Hover
Focus
Active
Selected
Disabled
Loading
Error
Success

On mobile, hover is not relevant but focus and active states remain important.

---

107. BUTTON LOADING

When saving:

جاري حفظ الاقتراح...

Disable duplicate submission while the request is in progress.

This prevents accidental multiple proposals.

---

108. SUBMISSION PROTECTION UX

When the user taps submit:

1. Disable submit button.
2. Show loading.
3. Submit to server.
4. Wait for confirmation.
5. Display success.
6. Redirect to proposal page.

Never create duplicate proposals because the user tapped twice.

---

109. GALLERY PAGINATION

Do not load hundreds or thousands of proposals at once.

Use:

- Pagination
- Infinite scrolling
- Load More

The preferred approach can be selected during implementation.

Mobile should not suffer from large initial downloads.

---

110. IMAGE OPTIMIZATION

Proposal previews should be optimized.

The application should avoid generating huge images unnecessarily.

Where possible:

- SVG remains the primary source.
- Preview raster images are generated at suitable dimensions.
- Lazy loading is used.
- Appropriate caching is enabled.

---

111. SEO AND SOCIAL PREVIEW

Public proposal pages should have useful metadata.

When shared, the preview should ideally show:

Logo Color Studio
اقتراح #LC-1024

and an appropriate logo preview.

---

112. LANGUAGE

All primary public UI text must be Arabic.

Examples:

الرئيسية
تخصيص الشعار
الاقتراحات
النتائج
حفظ الاقتراح
تحميل PNG
تحميل JPG
إعجاب
تصويت
تعليق
مشاركة

Avoid unnecessary English text in the user-facing interface.

Technical identifiers can remain English internally.

---

113. ARABIC TEXT QUALITY

Arabic text must be natural and professional.

Avoid literal machine-translated phrases.

Use clear Modern Standard Arabic.

The interface should avoid overly formal or complicated wording.

---

114. RTL FORMS

Inputs should support Arabic RTL.

HEX fields can use LTR direction because HEX values are technical strings.

Example:

HEX
[ #2E7D32 ]

The HEX value should use a suitable LTR input direction.

---

115. COLOR HEX INPUT

The HEX input should:

- Accept valid HEX
- Reject invalid values
- Support "#RRGGBB"
- Optionally support alpha "#RRGGBBAA"
- Show validation feedback

Example:

✓ #2E7D32

Invalid:

لون غير صالح

---

116. RESPONSIVE COLOR PICKER

On desktop:

Color picker can appear in a side panel.

On mobile:

Color picker should preferably appear in a bottom sheet or full-width panel.

The user should not have to interact with tiny controls.

---

117. PROPOSAL PREVIEW BACKGROUND

The preview background must clearly show the actual selected background.

If the background is transparent, use the checkerboard preview.

If the user selects white, the preview container should still have a subtle border so the logo remains distinguishable.

---

118. LOGO CONTRAST WARNING

If technically possible, the application can provide a subtle warning when a logo color has poor contrast against the selected background.

Example:

«قد يكون التباين بين هذا اللون والخلفية منخفضًا.»

This should be informational, not a blocking restriction, unless the project owner later requires strict accessibility rules.

---

119. ORIGINAL COLORS

Provide a quick option:

«الألوان الأصلية»

This restores the original logo configuration.

It must not delete the user's entire draft history unnecessarily.

---

120. PALETTE PREVIEW

Before applying a palette, show its colors.

Example:

احترافي

● ● ● ●

[ تطبيق ]

This lets the user understand the result before applying it.

---

121. RECENT COLORS

A useful editor feature:

«الألوان المستخدمة مؤخرًا»

Display recently selected colors during the current editing session.

This improves experimentation.

Recent colors can be stored locally.

---

122. FAVORITE PALETTES

Optional future feature:

Allow users to save favorite palettes locally.

This does not require public accounts.

---

123. DESIGN HISTORY

Undo/Redo should provide enough history for normal editing sessions.

Do not expose a complicated timeline unless needed.

---

124. FINAL EDITOR ACTIONS

The primary actions should be:

معاينة
حفظ الاقتراح

Secondary:

تحميل
إعادة ضبط

The user should always know what the next step is.

---

125. VISUAL HIERARCHY

The hierarchy should be:

1. Logo
2. Current customization
3. Primary action
4. Secondary controls
5. Statistics/details
6. Supporting content

Never let statistics dominate the editor.

---

126. BRAND NEUTRALITY

The interface should remain neutral enough to evaluate logo colors fairly.

The application should not visually favor a particular logo color.

Do not:

- Give one palette more visual prominence because of its color.
- Place one color first without reason.
- Use one candidate color as the permanent primary theme.

The UI's own accent should remain independent.

---

127. RESULTS NEUTRALITY

The results interface should present:

- Votes
- Likes
- Counts
- Percentages

in a clear factual manner.

Do not automatically label a proposal:

«الأفضل»

unless this is explicitly configured by the administrator.

Prefer:

«الأكثر تصويتًا»

«الأكثر إعجابًا»

---

128. USER TRUST

The interface must clearly communicate when an action is final.

Especially:

«اعتماد الاقتراح»

The user should never accidentally submit an irreversible proposal.

---

129. FINAL DESIGN QUALITY

The final UI must meet the visual quality expected from a modern professional web application.

It should have:

- Consistent spacing
- Consistent typography
- Professional icons
- Responsive layouts
- High-quality SVG rendering
- Smooth transitions
- Clear states
- Strong mobile UX
- Clean desktop UX

---

130. DO NOT USE PLACEHOLDERS IN FINAL UI

During development, placeholders are acceptable temporarily.

Before final production build:

- Replace placeholder text.
- Replace fake statistics.
- Replace fake logos.
- Replace generic icons.
- Remove debug controls.
- Remove developer labels.
- Remove test data unless intentionally retained.

The actual logo from:

/logo

must be used.

---

131. DESIGN QA CHECKLIST

Before considering the UI complete, verify:

Logo

- [ ] Actual logo from "/logo" is used.
- [ ] All logo parts are visible correctly.
- [ ] Logo proportions are preserved.
- [ ] Colors can be changed.
- [ ] Gradients render correctly.

Mobile

- [ ] Works on small smartphone.
- [ ] Works on standard smartphone.
- [ ] No horizontal overflow.
- [ ] Buttons are touch-friendly.
- [ ] Bottom navigation works.
- [ ] Editor is comfortable to use.

Tablet

- [ ] Layout adapts correctly.
- [ ] Gallery is readable.
- [ ] Editor controls remain accessible.

Desktop

- [ ] Editor uses available space.
- [ ] Gallery is balanced.
- [ ] Admin dashboard is usable.

Typography

- [ ] Arabic font loads correctly.
- [ ] Text is readable.
- [ ] RTL is correct.

Interaction

- [ ] Undo works.
- [ ] Redo works.
- [ ] Reset works.
- [ ] Color picker works.
- [ ] Gradient controls work.
- [ ] Preview updates instantly.

Proposal

- [ ] Final confirmation is clear.
- [ ] Submission loading state works.
- [ ] Success state works.
- [ ] Submitted proposal shows locked state.
- [ ] No public edit button exists after submission.

Download

- [ ] PNG works.
- [ ] JPG works.
- [ ] JPG includes background.
- [ ] Export matches preview.
- [ ] Mobile download works where supported.

Gallery

- [ ] Cards are responsive.
- [ ] Likes display correctly.
- [ ] Votes display correctly.
- [ ] Comments display correctly.

Admin

- [ ] Login screen works.
- [ ] Dashboard is responsive.
- [ ] Proposal management works.
- [ ] Comment management works.
- [ ] Statistics are readable.

---

132. FINAL UI/UX OBJECTIVE

The final application should give the user the following feeling:

«"This is a real professional design application."»

The first screen should be visually attractive without being complicated.

The editor should be easy enough for a normal smartphone user.

The logo should remain the central visual element.

The user should be able to create a proposal in a few simple steps.

The entire interface should feel coherent from:

Homepage
→ Editor
→ Preview
→ Submission
→ Gallery
→ Proposal
→ Results

The administrator should experience a separate, professional management interface.

---

133. FINAL INSTRUCTION TO ANTIGRAVITY + GEMINI

Before writing the UI implementation:

1. Inspect the complete project structure.
2. Inspect the "/logo" directory.
3. Identify every logo asset.
4. Identify the actual SVG structure.
5. Determine whether logo parts are already separated.
6. Preserve the original logo files.
7. Do not redesign the logo.
8. Do not replace it with placeholders.
9. Build the UI around the actual logo proportions.
10. Ensure every editable logo part can be represented correctly.
11. Implement the interface Mobile First.
12. Verify RTL behavior.
13. Verify all responsive layouts.
14. Verify touch interaction.
15. Verify desktop layouts.
16. Verify accessibility.
17. Verify loading, empty, success, and error states.
18. Verify that the final UI does not contain fake production data.
19. Keep the application visually polished and production-oriented.
20. Follow this document together with "01_PROJECT_SPECIFICATION.md".

The "/logo" folder is an existing project asset directory and must be treated as a critical source of truth for the visual identity.

Do not invent a different logo.

---

END OF UI/UX DESIGN SPECIFICATION

The next document should define the complete technical implementation, architecture, database, SVG processing, proposal locking, voting, likes, comments, admin authentication, security, testing, export generation, and production deployment.