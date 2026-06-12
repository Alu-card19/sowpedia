# SOW Spelling Bee - Project Summary

## Overview
**SOW Spelling Bee** is a modern web application for managing and displaying a spelling bee championship competition. It provides a public-facing leaderboard interface for contestants and sponsors, along with an admin panel for managing competition data in real-time.

**Tech Stack:** Next.js 14 • React 18 • TypeScript • Tailwind CSS • Supabase • Vercel

---

## Key Features

### Public Features
- **Hero Section**: Eye-catching competition branding and introduction
- **Section-Based Leaderboard**: Contestants organized by competition sections (Little Sprouts through Grand Legends)
- **Contestant Grid**: Display of competitors with names, scores, positions, and profile pictures
- **Live Leaderboard**: Real-time ranking updates with flash animations for score changes
- **Video Modal**: Watch contestant performance videos via YouTube links
- **Sponsor Bar**: Display sponsor logos in an organized banner
- **Real-time Updates**: Supabase channel subscriptions for instant score changes on the home page

### Admin Features
- **Password Protection**: Session-based authentication for admin access
- **Contestants Management Tab**:
  - Add/edit/delete contestants
  - Upload profile pictures to Supabase storage
  - Assign YouTube video links
  - Update scores and positions
  - Filter by section
  - Batch operations

- **Sponsors Management Tab**:
  - Add/edit/delete sponsors
  - Upload sponsor logos
  - Manage sponsor display order

- **Live Score Board Tab**:
  - Real-time score editing for competitions
  - Section-based filtering
  - Position auto-calculation
  - Instant reflection on public site

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Public home page (leaderboard)
│   ├── admin/page.tsx           # Admin dashboard
│   ├── api/
│   │   ├── contestants/route.ts # API endpoints for contestants
│   │   ├── scores/route.ts      # API endpoints for score updates
│   │   └── sponsors/route.ts    # API endpoints for sponsors
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── fonts/                   # Geist font files
│
├── components/
│   ├── HeroSection.tsx
│   ├── SectionTabs.tsx          # Navigation between sections
│   ├── ContestantGrid.tsx       # Main contestant display
│   ├── ContestantCard.tsx       # Individual contestant card
│   ├── LiveLeaderboard.tsx      # Top scores leaderboard
│   ├── SponsorBar.tsx           # Sponsor logos display
│   ├── VideoModal.tsx           # YouTube video player modal
│   │
│   ├── AdminPasswordModal.tsx   # Admin login
│   ├── AdminTabs.tsx            # Admin tab navigation
│   ├── ContestantsTab.tsx       # Admin contestant management
│   ├── SponsorsTab.tsx          # Admin sponsor management
│   ├── LiveScoreBoard.tsx       # Admin live score control
│   ├── ImageUploadModal.tsx     # File upload component
│   │
│   └── *.module.css             # Component-scoped styles
│
└── lib/
    ├── supabase.ts              # Supabase client configuration
    └── types.ts                 # TypeScript type definitions

```

---

## Data Models

### Sections
```typescript
{
  id: string (UUID)
  name: string
  order_index: number
  created_at: timestamp
}
```
**Example sections:** Little Sprouts, Rising Explorers, Builders League, Champions Circle, Elite Masters, Grand Legends

### Contestants
```typescript
{
  id: string (UUID)
  name: string
  section: string
  youtube_url?: string | null
  picture_url?: string | null
  score: number
  position: number
  created_at: timestamp
}
```

### Sponsors
```typescript
{
  id: string (UUID)
  name: string
  logo_url?: string | null
  order_index: number
  created_at: timestamp
}
```

---

## Database Schema

### Tables (Supabase PostgreSQL)
1. **sections** - Competition sections/divisions
2. **contestants** - Competitor information and scores
3. **sponsors** - Sponsor details and logos

### Storage Buckets
1. **sponsor-logos** - Public bucket for sponsor images
2. **contestant-pictures** - Public bucket for contestant profile pictures

### Row Level Security (RLS)
- Public read access for all tables
- Admin-only insert/update/delete for storage uploads
- Storage policies enforce bucket-specific access

---

## Key Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.35 | React framework for SSR/SSG |
| React | 18 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.4.1 | Utility-first styling |
| Supabase | 2.108.1 | Backend (PostgreSQL + Auth + Storage) |
| PostCSS | 8 | CSS processing |
| ESLint | 8 | Code linting |

---

## API Endpoints

### `/api/contestants` (POST)
- Create new contestant
- Body: `{ name, section, picture_url?, youtube_url? }`

### `/api/scores` (PATCH)
- Update contestant score and position
- Body: `{ contestantId, score, position }`

### `/api/sponsors` (POST)
- Create new sponsor
- Body: `{ name, logo_url?, order_index }`

---

## Admin Authentication

**Method:** Session-based (client-side storage)
- Admin password required at `/admin` route
- Password verified, session stored in `sessionStorage`
- Session persists during browser session
- No backend authentication required (password verification would need to be added for production)

---

## Real-time Features

**Supabase Realtime Channel:** `contestants-updates`
- Listens for UPDATE events on contestants table
- Triggers visual flash animation (600ms) on score changes
- Updates `localStorage.lastScoreUpdate` for "LIVE" badge display
- Automatic reconnection on connection loss

---

## Styling Approach

- **Component Scoped CSS Modules**: Each component has its own `.module.css` file
- **Tailwind CSS**: Utility classes for responsive design
- **Color Scheme**:
  - Dark background: `#090d26` (navy)
  - Gold accents: `#FFD700`
  - Font: Bebas Neue (headings), Geist (body)

---

## Deployment

- **Platform:** Vercel (Next.js native)
- **Configuration:** `vercel.json` for Vercel settings
- **Environment Variables:** `.env.local` for Supabase keys
- **Build Script:** `next build`
- **Start Script:** `next start`

---

## Development

### Local Setup
```bash
npm install                 # Install dependencies
npm run dev                 # Start dev server (http://localhost:3000)
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run ESLint
```

### Environment Configuration
**Required `.env.local` variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD` (for admin auth)

---

## Security Considerations

1. **Admin Password**: Currently client-side; should be validated server-side in production
2. **RLS Policies**: Enforce public read, admin-only writes
3. **Storage**: Separate public buckets for user-generated content
4. **CORS**: Configured for Vercel deployment
5. **Session**: Browser-based, no persistence after refresh

---

## Future Enhancement Opportunities

- Server-side admin password validation
- User authentication system
- Real-time live updates dashboard
- Contestant statistics and analytics
- Multiple competition support
- Scoring automation
- Judge management system
- Mobile app companion

---

## Contact & Support

Project location: `/Users/User/Desktop/sowpedia/sow-spelling-bee`
