# SOW Spelling Bee - Complete Project Overview

## Project at a Glance

**SOW Spelling Bee** is a full-stack Next.js web application designed to manage and display a competitive spelling bee championship. It combines a public leaderboard interface with an admin dashboard for real-time competition management.

| Aspect | Details |
|--------|---------|
| **Framework** | Next.js 14.2.35 (React 18) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4.1 + CSS Modules |
| **Backend** | Supabase (PostgreSQL + Storage + Realtime) |
| **Deployment** | Vercel |
| **Status** | Active development |

---

## Architecture Overview

### High-Level Flow

```
PUBLIC SITE (Next.js Frontend)
├── Home Page (page.tsx)
│   ├── Hero Section
│   ├── Section Tabs (Little Sprouts → Grand Legends)
│   ├── Contestant Grid (displays scores, photos, videos)
│   ├── Live Leaderboard (top scores)
│   └── Sponsor Bar
└── Real-time Updates (Supabase channels)

ADMIN DASHBOARD (/admin)
├── Password Authentication
├── Contestants Tab
│   ├── Add/Edit/Delete contestants
│   ├── Upload profile pictures
│   ├── Add YouTube links
│   └── Update scores & positions
├── Sponsors Tab
│   ├── Add/Edit/Delete sponsors
│   └── Upload sponsor logos
└── Live Score Board
    ├── Real-time score editing
    ├── Position auto-calculation
    └── Instant public site reflection

API LAYER
├── POST /api/contestants
├── PATCH /api/scores
└── POST /api/sponsors

DATABASE (Supabase)
├── sections (read-only)
├── contestants (CRUD)
├── sponsors (CRUD)
└── Storage: contestant-pictures, sponsor-logos
```

---

## Directory Structure & File Organization

```
sow-spelling-bee/
├── src/
│   ├── app/
│   │   ├── page.tsx                 ✓ Public home page with leaderboard
│   │   ├── layout.tsx               ✓ Root layout
│   │   ├── globals.css              ✓ Global styles
│   │   ├── favicon.ico              ✓ Site icon
│   │   │
│   │   ├── admin/
│   │   │   ├── page.tsx             ✓ Admin dashboard
│   │   │   └── page.module.css      ✓ Admin styles
│   │   │
│   │   ├── api/
│   │   │   ├── contestants/
│   │   │   │   └── route.ts         ✓ POST: Create contestant
│   │   │   ├── scores/
│   │   │   │   └── route.ts         ✓ PATCH: Update score
│   │   │   └── sponsors/
│   │   │       └── route.ts         ✓ POST: Create sponsor
│   │   │
│   │   └── fonts/
│   │       ├── GeistVF.woff         ✓ Body font
│   │       └── GeistMonoVF.woff     ✓ Mono font
│   │
│   ├── components/
│   │   ├── HeroSection.tsx          ✓ Competition header
│   │   ├── SectionTabs.tsx          ✓ Section navigation
│   │   ├── ContestantGrid.tsx       ✓ Main contestant display
│   │   ├── ContestantCard.tsx       ✓ Individual card
│   │   ├── LiveLeaderboard.tsx      ✓ Top scores leaderboard
│   │   ├── SponsorBar.tsx           ✓ Sponsor logos
│   │   ├── VideoModal.tsx           ✓ YouTube video player
│   │   ├── AdminPasswordModal.tsx   ✓ Login
│   │   ├── AdminTabs.tsx            ✓ Tab navigation
│   │   ├── ContestantsTab.tsx       ✓ Contestant management
│   │   ├── SponsorsTab.tsx          ✓ Sponsor management
│   │   ├── LiveScoreBoard.tsx       ✓ Score editing
│   │   ├── ImageUploadModal.tsx     ✓ File upload component
│   │   └── *.module.css             ✓ Component styles
│   │
│   └── lib/
│       ├── supabase.ts              ✓ Supabase client setup
│       └── types.ts                 ✓ TypeScript types
│
├── public/
│   └── logo.jpeg                    ✓ App logo
│
├── Configuration Files
│   ├── package.json                 ✓ Dependencies & scripts
│   ├── next.config.mjs              ✓ Next.js configuration
│   ├── tailwind.config.ts           ✓ Tailwind settings
│   ├── tsconfig.json                ✓ TypeScript config
│   ├── postcss.config.mjs           ✓ PostCSS settings
│   ├── .eslintrc.json               ✓ ESLint rules
│   ├── vercel.json                  ✓ Vercel deployment config
│   └── .env.local                   ✓ Environment variables
│
└── Documentation
    ├── PROJECT_SUMMARY.md           ✓ Feature overview
    ├── README.md                    ✓ Setup instructions
    ├── IMAGE_UPLOAD_GUIDE.md        ✓ File upload details
    └── SUPABASE_SETUP.sql           ✓ Database schema
```

---

## Data Model & Database Schema

### Core Entities

#### 1. Sections (Competition Divisions)
```typescript
{
  id: string (UUID)
  name: string
  order_index: number
  created_at: timestamp
}
```
**Examples:** Little Sprouts, Rising Explorers, Builders League, Champions Circle, Elite Masters, Grand Legends

#### 2. Contestants
```typescript
{
  id: string (UUID)
  name: string
  section: string              // References section name
  youtube_url?: string | null
  picture_url?: string | null  // Supabase storage URL
  score: number
  position: number             // Rank within section
  created_at: timestamp
}
```

#### 3. Sponsors
```typescript
{
  id: string (UUID)
  name: string
  logo_url?: string | null     // Supabase storage URL
  order_index: number
  created_at: timestamp
}
```

### Storage Buckets
- **contestant-pictures**: Public bucket for profile images
- **sponsor-logos**: Public bucket for sponsor logos

### Row Level Security (RLS)
- ✓ Public read access on all tables
- ✓ Admin-only write/update/delete
- ✓ Storage policies enforce bucket-specific access

---

## Key Features & Functionality

### Public Site (`/`)

| Feature | Component | Functionality |
|---------|-----------|--------------|
| **Hero Section** | `HeroSection.tsx` | Competition branding & intro |
| **Section Tabs** | `SectionTabs.tsx` | Filter contestants by division |
| **Contestant Grid** | `ContestantGrid.tsx` | Display all contestants in section |
| **Contestant Cards** | `ContestantCard.tsx` | Name, score, position, photo, video link |
| **Live Leaderboard** | `LiveLeaderboard.tsx` | Top 3 contestants with flash animation |
| **Sponsor Bar** | `SponsorBar.tsx` | Display sponsor logos |
| **Video Modal** | `VideoModal.tsx` | Watch YouTube videos |
| **Real-time Updates** | Supabase realtime | Live score changes with animations |

### Admin Dashboard (`/admin`)

| Feature | Component | Functionality |
|---------|-----------|--------------|
| **Password Auth** | `AdminPasswordModal.tsx` | Session-based login |
| **Tab Navigation** | `AdminTabs.tsx` | Switch between sections |
| **Contestants Tab** | `ContestantsTab.tsx` | Full CRUD + bulk operations |
| **Sponsors Tab** | `SponsorsTab.tsx` | Add/edit/delete sponsors |
| **Live Score Board** | `LiveScoreBoard.tsx` | Real-time score editing |
| **Image Upload** | `ImageUploadModal.tsx` | File upload to Supabase |

---

## API Endpoints

### POST `/api/contestants`
Create a new contestant
```json
{
  "name": "string",
  "section": "string",
  "picture_url": "string (optional)",
  "youtube_url": "string (optional)"
}
```

### PATCH `/api/scores`
Update contestant score and position
```json
{
  "contestantId": "string",
  "score": "number",
  "position": "number"
}
```

### POST `/api/sponsors`
Create a new sponsor
```json
{
  "name": "string",
  "logo_url": "string (optional)",
  "order_index": "number"
}
```

---

## Environment Configuration

### Required Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_service_key  # Optional for server operations
```

---

## Technology Stack Details

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.2.35 | React framework, SSR/SSG |
| **React** | 18 | UI library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS |
| **Supabase** | 2.108.1 | PostgreSQL backend + Storage + Realtime |
| **PostCSS** | 8 | CSS processing |
| **ESLint** | 8 | Code linting |

---

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Real-time Features

### Supabase Realtime Channel: `contestants-updates`
- **Listens for:** UPDATE events on contestants table
- **Triggers:** 600ms flash animation on score changes
- **Updates:** `localStorage.lastScoreUpdate` for "LIVE" badge
- **Reconnection:** Automatic on connection loss

### Implementation Location
- Subscribe: Components that need live updates
- Flash animation: CSS/component state management
- Badge: Components checking `localStorage.lastScoreUpdate`

---

## Security Architecture

### Current Implementation
- ✓ Session-based admin authentication (browser storage)
- ✓ Row Level Security on database tables
- ✓ Public read access for competitor data
- ✓ Admin-only write operations
- ✓ Storage bucket policies

### Security Considerations
- ⚠️ Admin password verified client-side (should be server-side for production)
- ⚠️ No backend authentication/authorization layer
- ⚠️ Password reset mechanism missing
- ⚠️ Session not persisted across browser restarts

---

## Styling & Design System

### Color Scheme
- **Primary Background:** `#090d26` (Navy)
- **Accent Color:** `#FFD700` (Gold)
- **Text:** Light colors on dark background

### Typography
- **Headings:** Bebas Neue
- **Body:** Geist font family
- **Mono:** GeistMonoVF

### CSS Architecture
- **Component Scoped CSS Modules** for component-specific styles
- **Tailwind CSS** for responsive utilities
- **Global CSS** in `globals.css` for base styles

---

---

## WORK OPPORTUNITIES & AREAS FOR ENHANCEMENT

### 🔴 Critical (Security & Core Functionality)

1. **Server-Side Admin Authentication**
   - Move password validation to API route
   - Implement JWT or session tokens
   - Remove client-side password verification
   - **Files to modify:** `src/app/api/auth/route.ts` (new), `src/components/AdminPasswordModal.tsx`
   - **Impact:** Production security requirement

2. **Error Handling & Validation**
   - Add try-catch blocks to all API routes
   - Validate input data (sanitize strings, check types)
   - Return proper HTTP status codes
   - **Files to modify:** All `src/app/api/**/*.ts` routes
   - **Impact:** Prevents data corruption and invalid states

3. **Database Constraints**
   - Add NOT NULL constraints on required fields
   - Add UNIQUE constraints where needed
   - Add CHECK constraints for valid values
   - **Files to modify:** `SUPABASE_SETUP.sql`
   - **Impact:** Data integrity at database level

---

### 🟡 High Priority (Performance & UX)

4. **Loading States & Skeletons**
   - Add skeleton screens during data loading
   - Show loading spinners for async operations
   - Implement optimistic UI updates
   - **Files to modify:** Component files that fetch data
   - **Impact:** Better perceived performance

5. **Error Boundaries**
   - Create error boundary component
   - Catch React errors gracefully
   - Display user-friendly error messages
   - **Files to modify:** `src/components/ErrorBoundary.tsx` (new), `src/app/layout.tsx`
   - **Impact:** App doesn't crash on component errors

6. **Image Optimization**
   - Use Next.js Image component for contestant photos
   - Add image compression
   - Implement lazy loading
   - **Files to modify:** `src/components/ContestantCard.tsx`, `src/components/SponsorBar.tsx`
   - **Impact:** Faster page loads, better SEO

7. **Search & Filter Enhancement**
   - Add search by contestant name
   - Add sponsor search
   - Implement advanced filters (score ranges, etc.)
   - **Files to modify:** Admin component files, add new search components
   - **Impact:** Better admin experience

---

### 🟡 High Priority (Features)

8. **Bulk Import/Export**
   - CSV upload for contestant data
   - Export leaderboard as CSV/JSON
   - Batch score updates
   - **Files to modify:** Admin tab components, new API routes
   - **Impact:** Faster data entry for events

9. **Edit Contestant/Sponsor**
   - Currently only supports create and delete
   - Add update functionality
   - Pre-fill forms with existing data
   - **Files to modify:** `src/app/api/contestants/route.ts`, admin components
   - **Impact:** Manage typos and corrections without deletion

10. **Undo/Redo System**
    - Track changes to scores
    - Allow reverting last action
    - Show change history
    - **Files to modify:** API routes, state management
    - **Impact:** Prevent accidental data loss

---

### 🟠 Medium Priority (Quality)

11. **Sorting Options**
    - Sort contestants by score (ascending/descending)
    - Sort by name (A-Z)
    - Sort by position
    - **Files to modify:** Frontend components with sorting logic
    - **Impact:** Better data exploration

12. **Test Coverage**
    - Add unit tests for API routes
    - Add component tests
    - Add integration tests
    - **Files to modify:** Create `__tests__` directories, setup Jest/Vitest
    - **Impact:** Catch bugs early

13. **Type Safety Improvements**
    - Add stricter TypeScript config
    - Use `as const` for constants
    - Create branded types for IDs
    - **Files to modify:** All `.ts` and `.tsx` files, `tsconfig.json`
    - **Impact:** Fewer runtime errors

14. **Accessibility (WCAG)**
    - Add ARIA labels to interactive elements
    - Ensure proper heading hierarchy
    - Add keyboard navigation
    - Test with screen readers
    - **Files to modify:** All component files
    - **Impact:** Inclusive for all users

---

### 🔵 Nice to Have (Future Enhancement)

15. **Dark/Light Mode Toggle**
    - Theme switcher component
    - Persist preference in localStorage
    - Respect system preference
    - **Files to modify:** Create theme context, add toggle component
    - **Impact:** Accessibility and user preference

16. **Leaderboard History**
    - Store historical scores
    - Show score progression graphs
    - Compare positions over time
    - **Files to modify:** New database tables, new components
    - **Impact:** Better analytics

17. **Multi-Event Support**
    - Support multiple competitions
    - Event management interface
    - Archive past events
    - **Files to modify:** Add events table, update queries, refactor components
    - **Impact:** Reusable platform

18. **Mobile App**
    - React Native companion app
    - Push notifications for score updates
    - Offline mode
    - **Files to modify:** Create separate React Native project
    - **Impact:** Better mobile experience

19. **Judge Management**
    - Admin accounts for judges
    - Score entry interface
    - Judge scorecard tracking
    - **Files to modify:** New database tables, new API routes, new components
    - **Impact:** Real-time competition management

20. **Analytics Dashboard**
    - Score distribution charts
    - Section performance stats
    - Contestant participation metrics
    - **Files to modify:** New API routes, new visualization components
    - **Impact:** Competition insights

---

## Quick Start for New Work

### Setting Up for Development
```bash
cd c:\Users\User\Desktop\sowpedia\sow-spelling-bee
npm install
npm run dev
# Visit http://localhost:3000
```

### Common Tasks to Start With

**1. Add Edit Functionality** (Medium complexity)
- Read: `src/components/ContestantsTab.tsx`, `src/app/api/contestants/route.ts`
- Create: `src/app/api/contestants/[id]/route.ts` for PATCH/DELETE
- Update: Admin component to show edit form

**2. Implement Search** (Low-Medium complexity)
- Add: Search input in admin tabs
- Update: API routes to support filtering
- Modify: Frontend to call search endpoints

**3. Add Error Boundaries** (Low complexity)
- Create: `src/components/ErrorBoundary.tsx`
- Wrap: Main layout and admin sections
- Test: Break components intentionally

**4. Optimize Images** (Low complexity)
- Import: Next.js Image component
- Replace: `<img>` tags in contestant/sponsor cards
- Test: Performance improvements

---

## File Dependencies Map

```
Public Site Flow:
  page.tsx
  ├── HeroSection.tsx
  ├── SectionTabs.tsx → ContestantGrid.tsx → ContestantCard.tsx
  ├── LiveLeaderboard.tsx
  ├── SponsorBar.tsx → SponsorBar.tsx
  ├── VideoModal.tsx
  └── lib/supabase.ts (realtime subscriptions)

Admin Flow:
  admin/page.tsx
  ├── AdminPasswordModal.tsx
  └── AdminTabs.tsx
      ├── ContestantsTab.tsx → ImageUploadModal.tsx
      ├── SponsorsTab.tsx → ImageUploadModal.tsx
      └── LiveScoreBoard.tsx
      
All use:
  ├── lib/supabase.ts
  ├── lib/types.ts
  └── .env.local (credentials)
```

---

## Next Steps Recommendation

**Start with one of these:**

1. **For Security:** Add server-side admin authentication (#1)
2. **For UX:** Implement search functionality (#7)
3. **For Feature Parity:** Add edit/update functionality (#9)
4. **For Quality:** Add error boundaries (#5)
5. **For Testing:** Set up test infrastructure (#12)

Each can be tackled independently without breaking other systems.

---

## Key Files to Know

| File | Purpose | Priority |
|------|---------|----------|
| `src/lib/supabase.ts` | Backend connection & config | ⭐⭐⭐ |
| `src/lib/types.ts` | All TypeScript types | ⭐⭐⭐ |
| `src/app/page.tsx` | Main public page | ⭐⭐⭐ |
| `src/app/admin/page.tsx` | Admin dashboard | ⭐⭐⭐ |
| `src/app/api/**/*.ts` | API routes | ⭐⭐⭐ |
| `.env.local` | Environment secrets | ⭐⭐⭐ |
| `SUPABASE_SETUP.sql` | Database schema | ⭐⭐ |
| Component files | UI & interactions | ⭐⭐ |
| Config files | Build & framework config | ⭐ |

---

## Questions to Ask Before Starting Work

- What's the priority: security, features, or quality?
- Are there known bugs or pain points?
- What's the timeline for next deployment?
- Do we need backward compatibility?
- Should we add tests as we go?
- Any performance bottlenecks noticed?

---

*Last Updated: June 2026*
*Project Status: Active Development*
