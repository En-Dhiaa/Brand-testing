Logo Color Studio

Technical Implementation, Architecture & Deployment Specification

Document: "03_TECHNICAL_IMPLEMENTATION.md"
Version: 1.0
Project Type: Responsive Web Application / PWA
Primary Language: Arabic
Direction: RTL
Authentication: Public users without accounts + Admin authentication
Logo Source: "/logo"

---

1. PURPOSE OF THIS DOCUMENT

This document defines how Antigravity using Gemini should technically build the complete Logo Color Studio application.

The previous documents define:

01_PROJECT_SPECIFICATION.md
02_UI_UX_DESIGN.md

This document defines:

- Recommended technology stack
- Application architecture
- Frontend architecture
- Backend architecture
- Database
- SVG manipulation
- Logo component coloring
- Gradient system
- Proposal saving
- Proposal locking
- Voting
- Likes
- Comments
- Admin authentication
- Admin dashboard
- Download generation
- PNG/JPG export
- Security
- Performance
- Responsive implementation
- PWA
- Deployment
- Free hosting strategy
- Testing
- Production checklist

The implementation must follow all three documents together.

---

2. RECOMMENDED TECHNOLOGY STACK

Use a modern full-stack TypeScript architecture.

Recommended stack:

Frontend:
Next.js
React
TypeScript

Styling:
Tailwind CSS

UI:
Custom components
Lucide Icons

Backend:
Next.js Server Actions / Route Handlers

Database:
PostgreSQL

ORM:
Prisma

Authentication:
Admin-only authentication

Image/SVG Processing:
SVG manipulation
Sharp where appropriate

Validation:
Zod

Charts:
Recharts or equivalent

Deployment:
Vercel-compatible deployment

Database Hosting:
Supabase PostgreSQL or equivalent free/low-cost PostgreSQL provider

The exact versions should be selected according to the latest stable versions compatible with the project environment.

Do not use obsolete libraries merely because they are familiar.

---

3. WHY NEXT.JS

Next.js is recommended because the application requires:

- Responsive UI
- Public proposal pages
- Dynamic proposal routes
- Admin dashboard
- API endpoints
- Server-side operations
- SEO metadata
- Image handling
- Production deployment
- PWA support
- TypeScript

The architecture should remain simple.

Do not introduce unnecessary microservices.

---

4. LANGUAGE

The codebase should use:

TypeScript

Avoid JavaScript-only implementation unless a specific library requires it.

Use strict TypeScript settings.

---

5. PROJECT STRUCTURE

Recommended structure:

logo-color-studio/
│
├── app/
│   ├── page.tsx
│   ├── customize/
│   │   └── page.tsx
│   ├── proposals/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── results/
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── proposals/
│   │       ├── comments/
│   │       └── settings/
│   │
│   ├── api/
│   │   ├── proposals/
│   │   ├── votes/
│   │   ├── likes/
│   │   ├── comments/
│   │   ├── export/
│   │   └── admin/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── logo/
│   ├── editor/
│   ├── proposals/
│   ├── voting/
│   ├── comments/
│   ├── admin/
│   └── layout/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── logo/
│   ├── export/
│   ├── validation/
│   ├── security/
│   └── utils/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── icons/
│   ├── fonts/
│   └── ...
│
├── logo/
│   ├── original/
│   ├── parts/
│   └── ...
│
├── types/
│
├── hooks/
│
├── config/
│
├── middleware.ts
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── README.md

The actual structure may be simplified if unnecessary.

Do not create hundreds of unnecessary files.

---

6. IMPORTANT LOGO ASSET RULE

The project contains the official logo inside:

/logo

This folder is a critical source of truth.

Before implementing the editor:

1. Inspect every file in "/logo".
2. Identify the main logo.
3. Identify separate logo parts.
4. Inspect SVG IDs.
5. Inspect SVG groups.
6. Inspect fill attributes.
7. Inspect stroke attributes.
8. Determine which components can safely be recolored.

Do not manually recreate the logo.

Do not use a placeholder logo.

Do not download a replacement logo.

---

7. SVG ARCHITECTURE

The application should preserve the SVG as SVG for editing.

The preferred data model is:

Original SVG
      ↓
Parse SVG
      ↓
Identify editable parts
      ↓
Create editable representation
      ↓
Apply user colors
      ↓
Render preview
      ↓
Export

---

8. LOGO PART IDENTIFICATION

Each editable logo part should have a stable identifier.

Example:

logo-main
logo-text
logo-symbol
logo-frame
logo-detail-1
logo-detail-2

If the supplied SVG already contains meaningful IDs, preserve them.

If not, create a mapping configuration.

Example:

type LogoPart = {
  id: string;
  name: string;
  selector: string;
  defaultColor?: string;
};

---

9. LOGO CONFIGURATION

Create a centralized configuration.

Example:

const logoParts = [
  {
    id: "symbol",
    name: "الرمز",
    selector: "#symbol",
    defaultColor: "#000000",
  },
  {
    id: "text",
    name: "النص",
    selector: "#text",
    defaultColor: "#000000",
  },
];

The actual IDs must be determined from the real SVG.

Do not assume these example IDs exist.

---

10. LOGO PARTS MUST BE DYNAMIC

Do not hardcode the assumption that the logo contains exactly two or three parts.

The implementation should support:

1 part
2 parts
3 parts
4 parts
5+ parts

based on the actual logo assets.

---

11. ORIGINAL LOGO STATE

Store the original state as immutable source data.

Example conceptual structure:

type LogoState = {
  background: BackgroundConfig;
  parts: Record<string, PartColorConfig>;
};

The original state should always be recoverable.

---

12. USER CUSTOMIZATION STATE

During editing:

Editor State
├── selectedPart
├── partColors
├── gradients
├── background
├── previewScale
└── history

The editor state should remain client-side until the user submits the proposal.

---

13. DO NOT TRUST CLIENT DATA

When the proposal is submitted, validate all incoming data on the server.

Never assume that the client sent valid colors.

Validate:

- Proposal data
- Part IDs
- HEX colors
- Gradient values
- Background values
- SVG references
- Metadata

---

14. COLOR VALIDATION

Only accept valid colors.

Examples:

#000000
#FFFFFF
#2E7D32
#AABBCC

Optionally:

#RRGGBBAA

if alpha is supported.

Reject malformed values.

---

15. GRADIENT DATA MODEL

A gradient should be represented structurally.

Example:

type GradientConfig = {
  enabled: boolean;
  type: "linear" | "radial";
  colors: {
    color: string;
    position: number;
  }[];
  angle?: number;
};

Do not save arbitrary executable CSS supplied by users.

---

16. BACKGROUND DATA MODEL

Example:

type BackgroundConfig = {
  type: "transparent" | "solid" | "gradient";
  color?: string;
  gradient?: GradientConfig;
};

Validate each field.

---

17. PROPOSAL DATA MODEL

A proposal should contain enough information to reproduce the design.

Example:

type ProposalDesign = {
  logoVersion: string;
  parts: Record<string, {
    color?: string;
    gradient?: GradientConfig;
  }>;
  background: BackgroundConfig;
};

Do not rely only on a generated PNG.

The structured configuration should remain the source representation.

---

18. DATABASE

Use PostgreSQL.

Recommended hosted options include:

- Supabase PostgreSQL
- Neon PostgreSQL
- Another reliable PostgreSQL provider

The selected provider must support the production deployment environment.

---

19. DATABASE PRINCIPLES

The database should store:

- Proposals
- Proposal design configuration
- Votes
- Likes
- Comments
- Admin users
- Sessions
- Optional palettes
- Analytics

Do not store huge generated images directly inside PostgreSQL unless there is a strong reason.

---

20. PROPOSAL TABLE

Conceptual schema:

model Proposal {
  id            String   @id @default(cuid())
  publicId      String   @unique
  design        Json
  previewUrl    String?
  pngUrl        String?
  jpgUrl        String?
  status        ProposalStatus
  likesCount    Int      @default(0)
  votesCount    Int      @default(0)
  commentsCount Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  votes         Vote[]
  likes         Like[]
  comments      Comment[]

  @@index([status])
  @@index([createdAt])
  @@index([votesCount])
  @@index([likesCount])
}

This is a conceptual example.

Adapt it to the actual implementation.

---

21. PROPOSAL STATUS

Recommended:

DRAFT
PUBLISHED
HIDDEN
DELETED

Public users should only see:

PUBLISHED

unless an administrator explicitly exposes another state.

---

22. IMPORTANT LOCKING RULE

Once a proposal is submitted:

PUBLISHED

the public user cannot edit it.

The design data must become immutable from the public interface.

There must be:

- No edit button
- No public update endpoint
- No client-side modification endpoint
- No editable public proposal URL

---

23. DATABASE IMMUTABILITY

The backend must enforce proposal locking.

Do not rely only on hiding the edit button.

A malicious user could call the API directly.

Therefore:

Public proposal
       ↓
No update operation

After creation, public proposal design data must not be updated.

Only authorized administrators may modify administrative fields.

---

24. ADMIN MODIFICATION

Administrators may be allowed to:

- Hide proposal
- Restore proposal
- Delete proposal
- Moderate comments
- Correct administrative metadata

Changing actual design colors should be restricted unless explicitly required.

If admin design editing is later implemented, it must be logged.

---

25. PUBLIC USER IDENTIFICATION

Users do not need accounts.

However, voting and likes need abuse protection.

Use a combination of:

- Anonymous session ID
- Secure cookie
- IP-derived protection where legally appropriate
- Rate limiting
- Server validation

Do not expose raw IP addresses publicly.

---

26. LIKE MODEL

Example:

model Like {
  id         String   @id @default(cuid())
  proposalId String
  visitorId  String
  createdAt  DateTime @default(now())

  proposal Proposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)

  @@unique([proposalId, visitorId])
}

This prevents one visitor from repeatedly liking the same proposal through normal requests.

---

27. VOTE MODEL

Example:

model Vote {
  id         String   @id @default(cuid())
  proposalId String
  voterId    String
  createdAt  DateTime @default(now())

  proposal Proposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)

  @@unique([proposalId, voterId])
}

The exact voting rule should be configurable.

---

28. VOTING RULE

The system must prevent obvious duplicate voting.

A visitor should not be able to repeatedly submit votes simply by refreshing the page.

Use a secure anonymous visitor identifier.

Do not rely exclusively on frontend localStorage.

---

29. COMMENT MODEL

Example:

model Comment {
  id         String   @id @default(cuid())
  proposalId String
  visitorId  String
  content    String
  status     CommentStatus
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  proposal Proposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)

  @@index([proposalId])
  @@index([status])
}

---

30. COMMENT STATUS

Recommended:

PENDING
APPROVED
HIDDEN
DELETED

If comments are intended to appear immediately, use:

APPROVED

by default with moderation tools available to the administrator.

---

31. COMMENT SECURITY

Sanitize comment text.

Never render user comments as raw HTML.

Comments should be treated as plain text.

Prevent:

- XSS
- HTML injection
- Script injection

---

32. COMMENT LENGTH

Set a reasonable maximum.

Example:

1–500 characters

The exact value can be configurable.

---

33. ADMIN USER

Example:

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

Never store plain-text passwords.

---

34. PASSWORD SECURITY

Passwords must be hashed using a strong password hashing algorithm.

Recommended:

- Argon2id
- bcrypt if Argon2 is not practical

Never:

password = "admin123"

inside production code.

---

35. ADMIN AUTHENTICATION

Admin authentication must be server-side.

The frontend should never store:

- Admin password
- Password hash
- Secret keys

in public JavaScript.

---

36. ADMIN SESSION

Use secure session cookies.

Recommended cookie characteristics:

HttpOnly
Secure in production
SameSite=Lax or Strict
Short/appropriate expiration

Do not store admin authentication tokens in localStorage if avoidable.

---

37. ADMIN ROUTE PROTECTION

All admin routes must be protected server-side.

Example:

/admin/dashboard
/admin/proposals
/admin/comments
/admin/settings

Unauthorized users should be redirected to:

/admin/login

---

38. ADMIN LOGIN RATE LIMIT

Protect the admin login endpoint.

Implement:

- Rate limiting
- Failed attempt protection
- Secure cookies
- Generic error messages

Do not reveal whether an email exists.

---

39. CSRF PROTECTION

Use framework-supported protections and secure same-origin mechanisms for state-changing operations.

Do not create unsafe unrestricted POST endpoints.

---

40. API ARCHITECTURE

Recommended public operations:

POST /api/proposals
GET  /api/proposals
GET  /api/proposals/:id

POST /api/proposals/:id/like
POST /api/proposals/:id/vote

GET  /api/proposals/:id/comments
POST /api/proposals/:id/comments

GET /api/results

Admin:

POST /api/admin/login
POST /api/admin/logout

GET /api/admin/proposals
PATCH /api/admin/proposals/:id
DELETE /api/admin/proposals/:id

GET /api/admin/comments
PATCH /api/admin/comments/:id
DELETE /api/admin/comments/:id

Use the actual framework conventions where appropriate.

---

41. SERVER ACTIONS VS API ROUTES

Use Server Actions where they simplify secure internal mutations.

Use Route Handlers when:

- External requests are needed
- A public API endpoint is appropriate
- File export/download requires a route
- A client-side interaction needs a clear endpoint

Do not create APIs unnecessarily.

---

42. PROPOSAL CREATION FLOW

When the user submits:

Editor
↓
Validate client state
↓
Send structured design to server
↓
Validate server-side
↓
Check logo version
↓
Sanitize data
↓
Generate public ID
↓
Store proposal
↓
Generate preview/export if needed
↓
Return proposal ID
↓
Redirect to proposal page

---

43. LOGO VERSIONING

The logo should have a version.

Example:

logoVersion = "2026-01"

When the logo assets change in the future, old proposals should still be reproducible.

Do not silently render old proposals using a completely different logo.

---

44. PROPOSAL REPRODUCTION

A proposal should be reproducible using:

logoVersion
+
part colors
+
gradients
+
background

This is more reliable than storing only one image.

---

45. PREVIEW GENERATION

Generate preview images only where useful.

The browser can render the SVG immediately.

Server-generated images can be used for:

- Gallery thumbnails
- Social sharing
- Download
- Open Graph metadata

---

46. PNG EXPORT

PNG should be generated from the final customized SVG.

Requirements:

- Preserve logo proportions
- Preserve colors
- Preserve gradients
- Support transparent background
- High enough resolution
- No accidental UI elements

Suggested default export:

2048 × 2048

or another suitable square dimension based on the actual logo.

Do not crop the logo.

---

47. JPG EXPORT

JPG does not support transparency.

Therefore, when exporting JPG:

- Use the selected background.
- If transparent background is selected, use a default white background or require the user to select one.
- Make the behavior clear.

Recommended message:

«صيغة JPG تحتاج إلى خلفية.»

---

48. EXPORT QUALITY

The exported image must match the preview as closely as possible.

Verify:

- Colors
- Gradient
- Position
- Scale
- Background
- Aspect ratio

---

49. DOWNLOAD BUTTONS

Provide:

تحميل PNG
تحميل JPG

Use appropriate download filenames.

Example:

logo-proposal-LC1024.png
logo-proposal-LC1024.jpg

---

50. SVG DOWNLOAD

Optional future feature:

تحميل SVG

Do not expose the raw master SVG if doing so could reveal protected project assets.

If SVG export is enabled, generate it from the user's design configuration.

---

51. DOWNLOAD SECURITY

Do not allow users to request arbitrary server files.

Downloads must be generated or served only from approved assets.

Validate proposal IDs.

---

52. IMAGE STORAGE

If generated previews are stored:

Use object storage rather than the database.

Potential services:

- Supabase Storage
- Cloudinary
- Vercel Blob
- Other compatible object storage

Choose one based on deployment compatibility and free limits.

---

53. FREE HOSTING

The application should be deployable on a free tier for at least the intended initial year, subject to the provider's current free-tier terms.

Recommended architecture:

Frontend / Backend
        ↓
Vercel
        ↓
PostgreSQL
        ↓
Supabase / Neon
        ↓
Storage
        ↓
Supabase Storage / compatible service

The project must not depend on a developer's local computer.

---

54. IMPORTANT HOSTING REQUIREMENT

"Free for one year" means:

- Use a provider with a currently available free tier suitable for the project.
- Configure the project for that free tier.
- Do not purchase a paid plan automatically.
- Do not claim guaranteed one-year availability if provider terms can change.

The deployment documentation must clearly identify the provider and its current free-tier limitations at deployment time.

---

55. DOMAIN

The project should support:

your-domain.com

if a domain is available.

If no custom domain is provided, use the deployment provider's free domain.

The application must work correctly either way.

---

56. ENVIRONMENT VARIABLES

Sensitive configuration must use environment variables.

Example:

DATABASE_URL=
DIRECT_URL=

ADMIN_SESSION_SECRET=

NEXT_PUBLIC_APP_URL=

STORAGE_URL=
STORAGE_KEY=


Never commit secrets.

---

57. ENVIRONMENT FILE

Use:

.env.local

locally.

Provide:

.env.example

without real secrets.

---

58. DATABASE MIGRATIONS

Use Prisma migrations.

Development:

npx prisma migrate dev

Production:

npx prisma migrate deploy

Do not manually edit production database tables unless absolutely necessary.

---

59. DATABASE INDEXES

Indexes should be added for common queries:

- Proposal status
- Creation date
- Votes
- Likes
- Comments
- Proposal public ID

Do not create unnecessary indexes on every field.

---

60. PUBLIC PROPOSAL ID

Do not expose sequential database IDs if avoidable.

Use:

LC-XXXXXX

or a secure random identifier.

Example:

LC-7F29A4

The public ID should be safe to share.

---

61. SLUG / URL

Example:

/proposals/LC-7F29A4

The proposal page must be publicly accessible without login.

---

62. RATE LIMITING

Rate-limit:

- Proposal creation
- Votes
- Likes
- Comments
- Admin login
- Export generation

This protects the application from abuse.

Use a provider-compatible rate-limiting solution.

---

63. SPAM PROTECTION

Because public users do not log in, add lightweight abuse prevention.

Possible measures:

- Rate limiting
- Anonymous visitor cookie
- Honeypot field for comments
- Input validation
- Request throttling

Do not create an annoying CAPTCHA unless abuse requires it.

---

64. PROPOSAL DUPLICATION

A user should be able to submit multiple different proposals.

Do not unnecessarily block multiple proposals from the same visitor.

However, implement rate limits to prevent automated spam.

---

65. ADMIN COMMENT MODERATION

The admin must be able to:

Approve
Hide
Delete

comments.

The UI must clearly show the comment status.

---

66. ADMIN PROPOSAL MODERATION

The admin must be able to:

View
Hide
Delete
Restore

according to the final data policy.

Deleting should be protected by confirmation.

---

67. ADMIN EDITING

The administrator may edit allowed administrative information.

However, public users must never be given access to admin endpoints.

---

68. AUDIT LOG

A future-ready implementation should support an audit log.

Example:

model AdminAction {
  id        String   @id @default(cuid())
  adminId   String
  action    String
  targetId  String?
  metadata  Json?
  createdAt DateTime @default(now())
}

This is recommended for tracking:

- Proposal deletion
- Proposal hiding
- Comment moderation
- Settings changes

---

69. STATISTICS

The results page should calculate:

Total proposals
Total votes
Total likes
Total comments
Most voted proposal
Most liked proposal
Most selected colors

---

70. MOST VOTED

Display the proposal with the highest vote count.

Use factual wording:

«الأكثر تصويتًا»

Do not use subjective wording such as:

«الأفضل»

unless explicitly defined by the project owner.

---

71. MOST LIKED

Display:

«الأكثر إعجابًا»

This is separate from voting.

Do not merge likes and votes into one score unless explicitly required.

---

72. MOST USED COLORS

Analyze the structured proposal data.

For each color:

HEX
Count
Percentage

Display it visually.

---

73. COLOR NORMALIZATION

Colors should be normalized before counting.

For example:

#ffffff
#FFFFFF

should be treated as the same color.

Normalize to uppercase:

#FFFFFF

---

74. GRADIENT ANALYTICS

For gradient colors, count the actual color stops if analytics require color-level statistics.

Do not treat the entire gradient string as a simple color.

---

75. RESULTS CACHING

Results do not need to be recalculated from scratch on every page request if the dataset becomes large.

Use:

- Database aggregation
- Cached results
- Periodic recalculation

Start simple and optimize when necessary.

---

76. PERFORMANCE TARGETS

The application should prioritize:

- Fast initial render
- Small JavaScript bundles
- Optimized fonts
- Optimized SVG
- Lazy-loaded gallery images
- Server-side data fetching where appropriate

Avoid loading the entire editor on the homepage.

---

77. CODE SPLITTING

Load editor-specific libraries only when the editor is opened.

For example:

Homepage
↓
No heavy SVG editor dependency

Editor:

Load editor tools

This improves mobile performance.

---

78. SVG OPTIMIZATION

Optimize SVG without destroying editable component structure.

Do not run an optimization process that removes the IDs required for color editing.

The SVG must remain editable after optimization.

---

79. FONT OPTIMIZATION

Load only the required Arabic font weights.

For example:

400
500
600
700

Do not load ten unnecessary font weights.

Use the framework's optimized font loading where available.

---

80. PWA

The application should be installable as a PWA where supported.

Include:

manifest
service worker
icons
theme metadata

The application should behave like an app after installation.

---

81. PWA REQUIREMENTS

Manifest should contain:

name
short_name
description
start_url
display: standalone
theme_color
background_color
icons

Use the actual application branding.

---

82. OFFLINE BEHAVIOR

The editor should not falsely claim to support complete offline operation unless implemented.

At minimum:

- App shell can potentially cache.
- Public pages can cache where appropriate.
- Submission requires network.

If offline:

«لا يوجد اتصال بالإنترنت.»

Do not lose the user's current draft unnecessarily.

---

83. LOCAL DRAFT

A useful feature is temporary local draft saving.

Save the current unsent customization locally.

Example:

localStorage

or IndexedDB if the data becomes more complex.

This is different from the final proposal.

---

84. IMPORTANT DRAFT RULE

Temporary draft:

Editable
Local
Not public
Not counted
Not voted

Submitted proposal:

Server-side
Public
Locked
Counted

---

85. RESET DRAFT

The editor should allow:

«إعادة ضبط»

This returns the editor to the original logo state.

Ask for confirmation if significant changes may be lost.

---

86. BROWSER COMPATIBILITY

Support modern versions of:

- Chrome
- Edge
- Safari
- Firefox
- Samsung Internet

Prioritize Android Chrome and mobile Safari because smartphones are a primary target.

---

87. MOBILE TESTING

Test at minimum:

360px
375px
390px
412px
430px

Do not assume one mobile width is enough.

---

88. TABLET TESTING

Test:

768px
820px
1024px

where appropriate.

---

89. DESKTOP TESTING

Test:

1280px
1440px
1920px

The content should not become excessively stretched.

---

90. RTL TESTING

Test:

- Navigation
- Cards
- Forms
- Modals
- Bottom sheets
- Tables
- Charts
- Icons
- Directional arrows

Do not assume "direction: rtl" automatically fixes every UI component.

---

91. ACCESSIBILITY

Implement:

- Semantic HTML
- Keyboard navigation
- Focus indicators
- ARIA labels
- Accessible buttons
- Accessible dialogs
- Color-independent states
- Adequate contrast

---

92. SECURITY CHECKLIST

Verify:

- [ ] Passwords hashed
- [ ] Admin routes protected
- [ ] Cookies secure
- [ ] Input validated
- [ ] Comments sanitized
- [ ] Rate limits active
- [ ] No secrets in frontend
- [ ] No raw HTML from users
- [ ] Proposal IDs validated
- [ ] Export endpoints protected from abuse
- [ ] Admin login protected

---

93. SVG SECURITY

Never directly execute or inject untrusted SVG content.

The source logo is trusted.

User customization should modify known properties only:

fill
stroke
gradient configuration
background

Do not accept arbitrary SVG markup from users.

---

94. XSS PROTECTION

Do not use:

dangerouslySetInnerHTML

for user-generated content unless absolutely necessary and properly sanitized.

Comments should be rendered as text.

---

95. SQL INJECTION

Use Prisma parameterized queries.

Never concatenate raw user input into SQL.

---

96. ADMIN ERROR MESSAGES

Do not expose technical details.

Bad:

«Prisma error: P2002...»

Better:

«تعذر تنفيذ العملية. حاول مرة أخرى.»

Technical errors should be logged securely.

---

97. SERVER LOGGING

Log important server errors.

Do not log:

- Passwords
- Session secrets
- Full sensitive tokens

Use structured logging where practical.

---

98. ERROR MONITORING

A production monitoring service can be added later.

The implementation should be structured so that services such as:

- Sentry

can be added without major refactoring.

---

99. BACKUP STRATEGY

The database provider must support an appropriate backup strategy.

At minimum:

- Regular database backups where available.
- Export capability for critical proposal data.
- Documented recovery process.

Do not assume free-tier backups are unlimited.

---

100. DATA EXPORT

Admin should optionally be able to export:

Proposals
Votes
Likes
Comments
Statistics

as CSV.

This is useful for reporting.

---

101. CSV EXPORT

Example:

proposal_id
created_at
votes
likes
comments
status

For color analytics:

color
usage_count
percentage

---

102. PRIVACY

Because users do not need accounts, minimize personal data collection.

Do not request:

- Full name
- Email
- Phone
- Address

unless a future requirement explicitly needs them.

---

103. COOKIE POLICY

Only use cookies required for:

- Anonymous session
- Admin authentication
- Essential application behavior

Avoid unnecessary tracking.

---

104. PUBLIC USER PRIVACY

The public interface should never display:

- IP address
- Device ID
- Internal session ID
- Internal database ID

---

105. ADMIN PRIVACY

Only authorized administrators should see moderation information.

---

106. DEPLOYMENT ARCHITECTURE

Recommended:

                    ┌───────────────┐
                    │   User        │
                    │ Smartphone    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Vercel     │
                    │ Next.js App   │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
       PostgreSQL       Storage          Auth
       Database         Assets           Sessions

The exact services can be adjusted according to availability and free-tier limitations.

---

107. DEPLOYMENT STEPS

General process:

1. Create repository
2. Push project
3. Create PostgreSQL database
4. Configure environment variables
5. Run Prisma migrations
6. Configure storage
7. Deploy application
8. Configure domain
9. Test production
10. Create admin account
11. Verify security
12. Verify downloads
13. Verify mobile UI

---

108. PRODUCTION DATABASE

Do not use the local development database in production.

Production must use a dedicated hosted database.

---

109. ADMIN ACCOUNT CREATION

Create the initial admin securely through:

- Environment variables during setup
- Secure seed process
- One-time setup command

Do not expose an admin registration page publicly.

---

110. ADMIN SEED

If using a seed script, it must:

1. Read credentials from secure environment variables.
2. Hash the password.
3. Create the account if it does not exist.
4. Never print the password.

---

111. DEPLOYMENT DOCUMENTATION

The project must contain a README section explaining:

Local development
Environment variables
Database setup
Migration
Admin setup
Production deployment
Free hosting setup
Domain configuration

---

112. BUILD PROCESS

The production build must pass:

npm run lint
npm run build

without errors.

TypeScript must compile successfully.

---

113. QUALITY GATES

Do not consider the project complete if:

- Build fails.
- Mobile layout breaks.
- Logo parts cannot be recolored.
- Proposal can be modified after submission.
- Duplicate voting is trivial.
- Admin pages are publicly accessible.
- PNG export fails.
- JPG export fails.
- RTL is broken.
- Production environment variables are missing.

---

114. TESTING STRATEGY

Use multiple testing levels.

Unit Tests

Test:

- Color validation
- Gradient validation
- Proposal validation
- Color normalization
- Statistics calculations

Integration Tests

Test:

- Proposal creation
- Vote
- Like
- Comment
- Admin actions
- Export

UI Tests

Test:

- Editor
- Mobile navigation
- Modals
- Forms

---

115. EXAMPLE UNIT TESTS

Test:

#FFFFFF

should be valid.

Test:

#GGGGGG

should be invalid.

Test:

#FFF

should only be accepted if shorthand is intentionally supported.

---

116. PROPOSAL LOCK TEST

Test:

Create proposal
↓
Submit
↓
Attempt public update
↓
Request must fail

This is a critical security test.

---

117. VOTE TEST

Test:

Visitor A
↓
Vote
↓
Vote again
↓
Second vote rejected or ignored

---

118. LIKE TEST

Test:

Visitor A
↓
Like
↓
Like again
↓
Duplicate prevented

---

119. COMMENT TEST

Test:

Normal comment
HTML comment
Script-like comment
Very long comment
Empty comment

The server must safely handle all cases.

---

120. EXPORT TEST

For each export:

Original logo
↓
Apply colors
↓
Apply gradient
↓
Apply background
↓
Export PNG
↓
Export JPG

Compare the output against the preview.

---

121. MOBILE EXPORT TEST

Test downloads from:

- Android Chrome
- Samsung Internet
- iPhone Safari where available

The UI should provide an appropriate fallback if browser download behavior differs.

---

122. DATABASE PERFORMANCE

For the initial application, normal indexed PostgreSQL queries should be sufficient.

If the number of proposals becomes very large, introduce:

- Pagination
- Aggregated statistics
- Caching
- Materialized statistics where useful

Do not prematurely overengineer.

---

123. GALLERY PAGINATION IMPLEMENTATION

Do not fetch all proposals.

Example:

GET /api/proposals?page=1&limit=20

The exact implementation may use cursor pagination for better scalability.

---

124. PROPOSAL SORTING

Allow:

الأحدث
الأكثر تصويتًا
الأكثر إعجابًا

Do not present a subjective "best" sorting option.

---

125. ADMIN SORTING

Admin can sort by:

- Newest
- Oldest
- Most votes
- Most likes
- Most comments

---

126. COLOR PALETTE MANAGEMENT

Predefined palettes should be stored in a configuration or database.

Example:

type Palette = {
  id: string;
  name: string;
  colors: string[];
};

Example:

Professional
Elegant
Modern
Heritage
Minimal

The actual palette names can be customized by the administrator.

---

127. ADMIN PALETTE MANAGEMENT

Optional but recommended.

Admin can:

- Add palette
- Edit palette
- Hide palette
- Delete palette

Do not expose this functionality to public users.

---

128. DEFAULT COLORS

Default colors should be defined centrally.

Example:

Black
White
Deep Green
Gold
Navy
Burgundy
Gray

These are examples only.

The final palette should be determined by the project owner.

---

129. CUSTOM COLOR

Custom colors must not be limited to predefined palettes.

The user should be able to enter any valid HEX color.

---

130. GRADIENT SUPPORT

The editor should support at minimum:

Linear Gradient
Radial Gradient

with:

Color 1
Color 2
Angle

Additional stops may be supported.

---

131. GRADIENT PREVIEW

The logo preview must update immediately when gradient settings change.

---

132. GRADIENT COMPATIBILITY

Ensure gradients work correctly in:

- Browser SVG preview
- PNG export
- JPG export

Do not implement a gradient that only works visually in one environment.

---

133. SVG FILL STRATEGY

Where possible, preserve original SVG structure and modify:

fill
stroke

using controlled selectors.

Do not flatten the SVG before editing.

---

134. SVG STROKE SUPPORT

Some logo parts may use:

stroke

instead of:

fill

The editor must inspect the actual SVG and support both where required.

---

135. CSS VARIABLES

Where practical, use CSS variables for preview colors.

Example:

--logo-part-1: #000000;
--logo-part-2: #FFFFFF;

Do not create uncontrolled global variables for arbitrary user input.

---

136. LOGO PREVIEW COMPONENT

Create a reusable component:

<LogoPreview />

It should accept structured design state.

Conceptually:

<LogoPreview
  design={currentDesign}
  size="large"
/>

---

137. LOGO EXPORT COMPONENT

Export logic should remain separate from visual UI.

Example conceptual modules:

LogoRenderer
LogoExporter
LogoParser
LogoColorMapper

This keeps the architecture maintainable.

---

138. STATE MANAGEMENT

Use React state for local editor state.

If complexity increases, use:

- Zustand

or an equivalent lightweight state manager.

Do not use Redux unless the project genuinely requires it.

---

139. EDITOR HISTORY

Implement undo/redo using immutable design snapshots.

Example:

Initial
↓
Color changed
↓
Gradient changed
↓
Background changed

Undo:

Background removed

Redo:

Background restored

---

140. DRAFT STORAGE

Store unsaved draft locally.

Recommended key:

logo-color-studio:draft

Do not store sensitive information there.

---

141. DRAFT EXPIRATION

Optionally clear old drafts after a configurable period.

Example:

30 days

The user should not lose a currently active draft during normal use.

---

142. PROPOSAL SUBMISSION IDENTITY

Since there is no login, the system can generate:

visitorId

through a secure cookie.

Do not expose it in the UI.

---

143. SHAREABLE PROPOSAL

Every published proposal should have:

Public URL

Example:

https://domain.com/proposals/LC-7F29A4

---

144. SOCIAL SHARING

Generate Open Graph metadata.

Potential:

og:title
og:description
og:image
og:url

The image should represent the customized logo.

---

145. SEO

Public pages should contain:

- Title
- Description
- Canonical URL
- Open Graph metadata

The application itself should remain Arabic-first.

---

146. ROBOTS

Do not accidentally expose admin pages to search engines.

Admin routes should use appropriate indexing restrictions.

---

147. ADMIN SEO

Admin pages should not be indexed.

---

148. ACCESS CONTROL

The system must distinguish:

PUBLIC
ADMIN

There is no public user account role.

---

149. ADMIN MIDDLEWARE

Use middleware where appropriate to protect:

/admin/*

Do not rely only on page-level redirects.

---

150. SERVER AUTHORIZATION

Every sensitive admin operation must verify the authenticated admin server-side.

Never trust:

role = "admin"

from the browser.

---

151. PUBLIC API SECURITY

Public endpoints must validate:

- Method
- Body
- ID
- Data types
- Length
- Allowed values

---

152. REQUEST SIZE

Limit request payload sizes.

Users should not be able to submit massive JSON payloads.

---

153. EXPORT ABUSE

Export endpoints can be expensive.

Use rate limits and caching.

Do not regenerate the same export repeatedly if a cached version already exists.

---

154. ADMIN ANALYTICS

Dashboard should show:

Total proposals
Published
Hidden
Deleted
Votes
Likes
Comments

Optional:

Proposals today
Proposals this week
Proposals this month

---

155. ANALYTICS PRIVACY

Do not add third-party analytics unless required.

If analytics are added later, use privacy-conscious configuration.

---

156. DATABASE SEED DATA

Development may contain sample proposals.

Production should not contain fake sample data unless explicitly intended.

---

157. DEMO MODE

If a demo mode is needed, clearly separate it from production.

Never mix demo proposals with real voting statistics.

---

158. ERROR BOUNDARIES

Use application-level error boundaries for unexpected UI errors.

Provide a friendly Arabic error screen.

Example:

«حدث خطأ غير متوقع.»

Button:

«إعادة المحاولة»

---

159. NETWORK ERROR

If the user loses connection:

«تعذر الاتصال بالخادم.»

Button:

«المحاولة مرة أخرى»

Do not erase the editor state.

---

160. SAVE FAILURE

If proposal submission fails:

- Keep current editor state.
- Show error.
- Allow retry.
- Prevent duplicate requests.

---

161. DUPLICATE SUBMISSION PROTECTION

Generate an idempotency mechanism for proposal creation where practical.

This protects against:

- Double taps
- Network retries
- Browser resubmission

---

162. DATA CONSISTENCY

When a vote is created:

Vote row
+
votesCount

must remain consistent.

Use transactions where appropriate.

The same applies to:

- Likes
- Comments

---

163. TRANSACTION EXAMPLE

For a vote:

BEGIN
Create vote
Update proposal vote count
COMMIT

If the operation fails:

ROLLBACK

---

164. COUNTER STRATEGY

For a small/medium application, denormalized counters are acceptable:

votesCount
likesCount
commentsCount

Keep them synchronized through transactions.

---

165. DELETING COMMENTS

When a comment is deleted, update:

commentsCount

accordingly.

---

166. HIDING COMMENTS

A hidden comment should normally not count as a visible public comment if the results page is intended to represent public content.

Define this behavior consistently.

---

167. PROPOSAL DELETION

Prefer soft deletion where practical.

This allows:

- Recovery
- Audit
- Statistics integrity

Hard deletion should be reserved for cases where data must be permanently removed.

---

168. ADMIN CONFIRMATION

For destructive actions:

Delete proposal?
Delete comment?

Require explicit confirmation.

---

169. ADMIN SESSION EXPIRATION

Admin sessions should expire appropriately.

Provide:

«تسجيل الخروج»

in the admin interface.

---

170. LOGOUT

Logout must invalidate the server session.

Do not merely remove a frontend variable.

---

171. ADMIN PASSWORD RESET

Initial version may omit public password reset.

If required later, implement a secure email-based reset system.

Never implement password reset through insecure URL parameters containing the password.

---

172. CONFIGURABLE APPLICATION SETTINGS

Future-ready settings can include:

Voting enabled
Comments enabled
Likes enabled
Public proposals enabled
Download enabled
PNG enabled
JPG enabled

---

173. ADMIN SETTINGS PAGE

Recommended:

General
Participation
Comments
Voting
Downloads
Branding

Only expose settings that actually affect implementation.

---

174. PUBLIC MAINTENANCE MODE

Optional:

The administrator can temporarily enable maintenance mode.

Public visitors see:

«الموقع تحت الصيانة حاليًا.»

Admin remains accessible.

---

175. FINAL DEPLOYMENT CHECK

Before deployment:

[ ] npm install
[ ] Environment variables configured
[ ] Database created
[ ] Prisma migration completed
[ ] Admin account created
[ ] Logo assets uploaded
[ ] Logo parts verified
[ ] PNG export tested
[ ] JPG export tested
[ ] Voting tested
[ ] Likes tested
[ ] Comments tested
[ ] Admin login tested
[ ] Mobile tested
[ ] Desktop tested
[ ] RTL tested
[ ] Production build successful

---

176. PRODUCTION CHECKLIST

Frontend

[ ] Arabic RTL
[ ] Responsive
[ ] Mobile-first
[ ] PWA
[ ] Accessible
[ ] Fast

Logo

[ ] Real SVG
[ ] Real logo parts
[ ] Color mapping
[ ] Gradient
[ ] Background
[ ] Preview

Database

[ ] PostgreSQL
[ ] Migrations
[ ] Indexes
[ ] Backups

Security

[ ] Admin auth
[ ] Password hashing
[ ] Rate limits
[ ] Validation
[ ] XSS protection
[ ] Secure cookies

Participation

[ ] Proposals
[ ] Likes
[ ] Votes
[ ] Comments
[ ] Share

Downloads

[ ] PNG
[ ] JPG
[ ] Correct dimensions
[ ] Correct colors

---

177. FINAL ARCHITECTURE

The final application should conceptually operate as:

                         LOGO COLOR STUDIO
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
         PUBLIC UI           EDITOR             ADMIN
             │                  │                  │
             │                  ▼                  ▼
             │             Logo Engine        Admin Auth
             │                  │                  │
             ▼                  ▼                  ▼
        Proposals          Design State       Dashboard
             │                  │                  │
             └──────────────┬───┴──────────────────┘
                            ▼
                       Backend Layer
                            │
                 ┌──────────┼──────────┐
                 ▼          ▼          ▼
             Database     Storage    Security
                 │
                 ▼
             PostgreSQL

---

178. IMPLEMENTATION ORDER

Antigravity should implement the project in the following order.

Phase 1 — Foundation

1. Initialize Next.js
2. Configure TypeScript
3. Configure Tailwind
4. Configure RTL
5. Configure fonts
6. Create base design system

Phase 2 — Logo

1. Inspect /logo
2. Identify SVG parts
3. Build LogoRenderer
4. Build LogoEditor
5. Implement color mapping
6. Implement gradients
7. Implement background

Phase 3 — Public Interface

1. Homepage
2. Editor
3. Preview
4. Proposal submission
5. Gallery
6. Proposal details
7. Results

Phase 4 — Database

1. Prisma
2. PostgreSQL
3. Proposal model
4. Like model
5. Vote model
6. Comment model
7. Admin model

Phase 5 — Participation

1. Like
2. Vote
3. Comments
4. Share
5. Statistics

Phase 6 — Export

1. PNG
2. JPG
3. Social preview
4. Download

Phase 7 — Admin

1. Admin login
2. Dashboard
3. Proposal moderation
4. Comment moderation
5. Statistics
6. Settings

Phase 8 — Security

1. Rate limiting
2. Validation
3. Authorization
4. Secure cookies
5. Input sanitization
6. Export protection

Phase 9 — PWA

1. Manifest
2. Icons
3. Service worker
4. Install behavior

Phase 10 — Production

1. Build
2. Test
3. Deploy
4. Configure database
5. Configure storage
6. Create admin
7. Verify domain
8. Production QA

---

179. IMPORTANT DEVELOPMENT RULE

Do not attempt to implement everything as one giant component.

Use reusable components and services.

For example:

LogoPreview
LogoPartSelector
ColorPicker
GradientEditor
ProposalCard
VoteButton
LikeButton
CommentList
AdminTable

Each component should have a clear responsibility.

---

180. IMPORTANT SVG RULE

Do not rasterize the logo during editing.

The editing pipeline should remain:

SVG
↓
Modify
↓
SVG Preview

Rasterization should happen only when needed for:

PNG
JPG
Preview Image
Social Image

---

181. IMPORTANT MOBILE RULE

The mobile experience is not an afterthought.

Before considering the project complete, test the editor primarily on:

Android smartphone

with a screen around:

360–430px

The entire customization workflow must be comfortable without zooming the browser.

---

182. IMPORTANT USER EXPERIENCE RULE

The user should never need technical knowledge.

The application should not ask the user to understand:

- SVG
- CSS
- HEX
- RGB
- Gradients

unless they intentionally open advanced controls.

For normal users, use:

«اختر اللون»

instead of technical terminology.

Advanced users may access:

«HEX»

---

183. IMPORTANT ADMIN RULE

The administrator is the only authenticated user type in version 1.

Do not build unnecessary public registration.

The public experience must remain:

Open
Customize
Preview
Submit
Vote
Like
Comment
Share

without account creation.

---

184. FINAL ACCEPTANCE CRITERIA

The project is considered successfully implemented only when a normal visitor can:

1. Open the site on a smartphone.
2. Understand its purpose.
3. Start customizing.
4. Select a logo part.
5. Change its color.
6. Apply predefined colors.
7. Choose a custom HEX color.
8. Apply a gradient.
9. Change the background.
10. Preview the logo.
11. Download PNG.
12. Download JPG.
13. Submit the proposal.
14. Receive a proposal ID.
15. View the submitted proposal.
16. Share the proposal.
17. Like other proposals.
18. Vote on proposals.
19. Comment.
20. View results.

The administrator must be able to:

1. Log in securely.
2. Open dashboard.
3. View proposals.
4. Moderate proposals.
5. View comments.
6. Moderate comments.
7. View statistics.
8. Manage relevant settings.
9. Export data where implemented.
10. Log out securely.

---

185. FINAL INSTRUCTION TO ANTIGRAVITY USING GEMINI

You are building a real production-oriented application, not a visual mockup.

Before implementation:

READ:
01_PROJECT_SPECIFICATION.md
02_UI_UX_DESIGN.md
03_TECHNICAL_IMPLEMENTATION.md

Then:

INSPECT:
project structure
/logo
SVG assets
SVG parts
existing configuration

Then:

PLAN:
architecture
database
editor
SVG engine
responsive UI
admin
security
deployment

Then implement incrementally.

Do not skip the "/logo" inspection.

Do not replace the supplied logo.

Do not create fake logo components.

Do not create fake production statistics.

Do not expose admin functions publicly.

Do not allow public modification of submitted proposals.

Do not store passwords in plain text.

Do not put secrets in frontend code.

Do not sacrifice mobile usability for desktop design.

Do not use unnecessarily complicated technologies.

Do not introduce dependencies unless they provide clear value.

---

186. FINAL QUALITY PRINCIPLE

The finished application should feel like a polished professional product:

Professional
        +
Arabic-first
        +
Mobile-first
        +
Fast
        +
Secure
        +
Visually focused
        +
Easy to use
        +
Production-ready

The logo is the centerpiece.

The customization experience is the core feature.

The public voting and proposal gallery create participation.

The administrator dashboard provides control and moderation.

The architecture should remain maintainable so that additional features can be added later without rebuilding the entire application.

---

END OF 03_TECHNICAL_IMPLEMENTATION.md