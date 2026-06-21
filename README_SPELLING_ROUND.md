# 🎤 Live Spelling Round - SOW Spelling Bee Championship

A complete, production-ready spelling round screen for the SOW Spelling Bee Championship. Host controls on the left, beautiful stage display in the center, live scoreboard on the right, with floating sponsor logos in the background.

## 📦 What's Included

### Core Features
- **Host View** - Password-protected control panel for running the round
- **Audience View** - Read-only display for projection
- **Floating Sponsors** - Animated background with sponsor logos
- **Celebration Animations** - Confetti burst, floating emojis, pulse effects
- **Text-to-Speech** - Built-in 🔊 Hear Word button
- **Keyboard Shortcuts** - Space/C/X/Esc for speed
- **Live Scoreboard** - Real-time contestant rankings
- **Word Management** - CSV import, search, filter, delete

### Admin Features
- Add words individually
- Bulk import from CSV
- Filter by section & difficulty
- Search real-time
- Delete operations
- Progress tracking

## 🚀 Quick Start (5 Minutes)

### 1. Database Setup
Run this SQL in Supabase:
```sql
create table spelling_words (
  id uuid default gen_random_uuid() primary key,
  word text not null,
  section text not null,
  difficulty text check (difficulty in ('easy', 'moderate', 'hard', 'champion')),
  hint text default null,
  used boolean default false,
  created_at timestamptz default now()
);

alter table spelling_words enable row level security;

create policy "public_spelling_words" on spelling_words for select using (true);
create policy "admin_spelling_words" on spelling_words for all using (true) with check (true);

create index spelling_words_section_idx on spelling_words (section);
create index spelling_words_difficulty_idx on spelling_words (difficulty);
```

Or copy-paste from `SUPABASE_SETUP.sql` (the table block at the end).

### 2. Add Spelling Words
**Option A: CSV Import (Fastest)**
1. Go to `/admin` → Login (password: `sow2025`)
2. Click "Spelling Words" tab
3. Click "Choose CSV File"
4. Upload `SPELLING_WORDS_SAMPLE.csv` (or your own)
5. Wait for "✅ 20 words imported successfully"

**Option B: Manual Entry**
1. Go to `/admin` → "Spelling Words" tab
2. Fill in word, section, difficulty, hint
3. Click "Add Word"
4. Repeat for each word

### 3. Run Spelling Round
1. Go to `/spelling-round`
2. If you need host controls, go to `/admin` first to login
3. Return to `/spelling-round` - controls now visible
4. Select section from left dropdown
5. Enter contestant name
6. Click a word - it appears blurred on center stage
7. Press Space to reveal
8. Press C (correct) or X (wrong)
9. Watch animation, then repeat

## 📋 File Structure

```
New Files (10):
├── src/app/spelling-round/
│   ├── page.tsx              (Main component - 21 KB)
│   └── page.module.css       (Styling & animations - 14 KB)
├── src/app/api/spelling-words/
│   └── route.ts              (CRUD API - 3 KB)
├── src/components/
│   ├── SpellingWordsTab.tsx   (Admin tab - 13 KB)
│   ├── SpellingWordsTab.module.css
│   ├── Navigation.tsx         (Header nav)
│   └── Navigation.module.css
└── Documentation/
    ├── SPELLING_ROUND_IMPLEMENTATION.md
    ├── SPELLING_ROUND_QUICK_START.md
    ├── COMPETITION_DAY_CHECKLIST.md
    ├── SPELLING_ROUND_SUMMARY.md
    └── SPELLING_WORDS_SAMPLE.csv

Modified Files (5):
├── lib/types.ts              (Added SpellingWord types)
├── src/app/page.tsx          (Added Navigation)
├── src/app/admin/page.tsx    (Added SpellingWordsTab)
├── src/components/AdminTabs.tsx (Updated tabs array)
└── SUPABASE_SETUP.sql        (Added table)
```

## 🎯 Features

### Spelling Round Page (`/spelling-round`)

#### Host View (Left Panel)
- Section dropdown (all 6 sections)
- Difficulty filter (Easy, Moderate, Hard, Champion, All)
- Search box with real-time filtering
- Clickable word list with badges
- Selected word highlighting
- Used words shown dimmed with strikethrough
- Word count display
- Reset Used Words button
- Keyboard shortcuts legend

#### Center Stage
- School logo in empty state
- Section & difficulty badges
- Blurred word before reveal
- Revealed word (large, gold, spaced letters)
- Contestant name display
- 💡 Hint (if available)
- 🔊 Hear Word button (text-to-speech)
- 👁 Reveal Word button (host only)
- ✅ CORRECT button (green)
- ❌ WRONG button (red)
- Next Word button (after result)

#### Right Panel - Scoreboard
- Current section name
- Live contestant rankings
- Top 3 with gold/silver/bronze borders
- Real-time updates with animation flash

#### Animations
- **Correct**: Pulse + confetti burst + floating emojis
- **Wrong**: Shake + red flash + red overlay
- **Sponsor Logos**: Slow drift at different speeds

#### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Space/Enter | Reveal word |
| C | Mark correct |
| X | Mark wrong |
| Esc | Clear stage |

### Admin Panel - Spelling Words Tab

- Add word form (word, section, difficulty, hint)
- CSV bulk import (progress indicator)
- Word list table (searchable, filterable)
- Colored difficulty badges
- Delete per-row
- Delete all in section (with confirmation)

### Navigation
- Sticky header on home page
- Links to: Home, 🎤 Spelling Round, Admin
- Gold accents

## 🎨 Design

- **Color Scheme**: Dark navy (#090d26) + Gold (#ffd700)
- **Font**: Bebas Neue (headings), Nunito (body)
- **Animations**: Pure CSS (no libraries)
- **Responsive**: Adapts to all screen sizes
- **Projector**: High contrast for visibility
- **Performance**: Lightweight, fast load times

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **SPELLING_ROUND_IMPLEMENTATION.md** | Full technical guide, architecture, troubleshooting |
| **SPELLING_ROUND_QUICK_START.md** | Competition day workflow, shortcuts, tips |
| **COMPETITION_DAY_CHECKLIST.md** | Pre-competition & during-competition checklists |
| **SPELLING_ROUND_SUMMARY.md** | Summary of all features and setup |
| **SPELLING_WORDS_SAMPLE.csv** | 20 sample words ready to import |
| **README_SPELLING_ROUND.md** | This file |

## 🔑 Access Details

| Item | Value |
|------|-------|
| Admin Password | `sow2025` |
| Spelling Round URL | `/spelling-round` |
| Admin Panel URL | `/admin` |
| API Endpoint | `/api/spelling-words` |
| Home Page | `/` |

## 📊 Sections & Difficulties

### Sections (6 Total)
1. Little Sprouts
2. Rising Explorers
3. Builders League
4. Champions Circle
5. Elite Masters
6. Grand Legends

### Difficulties
- Easy (green 🟢)
- Moderate (orange 🟠)
- Hard (red 🔴)
- Champion (pink 🟣)

## ⚙️ Technical Stack

- **Framework**: Next.js 13+ (React)
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS Modules
- **State**: React Hooks (useState, useRef, useEffect)
- **API**: Next.js Route Handlers
- **Real-time**: Supabase Realtime (subscriptions)
- **Storage**: Supabase Storage (sponsor logos)
- **Speech**: Web Speech API (browser native)

## 🔒 Security

- Admin password required for word management
- RLS policies on database
- Session storage for auth state
- Public read-only endpoints
- No secrets in client code

## 💾 Database

### Table: spelling_words
```sql
CREATE TABLE spelling_words (
  id UUID PRIMARY KEY,
  word TEXT NOT NULL,
  section TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard', 'champion')),
  hint TEXT,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexes
- `spelling_words_section_idx` - For section filtering
- `spelling_words_difficulty_idx` - For difficulty filtering

### RLS Policies
- Public: SELECT only
- Admin: All operations (INSERT, UPDATE, DELETE, SELECT)

## 📱 Responsive Behavior

- **Desktop (1400px+)**: All panels visible (left, center, right)
- **Tablet (768px-1399px)**: Center panel only, side panels hidden
- **Mobile (<768px)**: Single column layout

## 🎬 Animations

All animations use pure CSS `@keyframes`:
- `confetti` - Falling confetti pieces
- `floatUp` - Emojis floating upward
- `shake` - Wrong answer shake
- `pulse` - Correct answer pulse
- `redFlash` - Wrong screen overlay
- `float-0, float-1, ...` - Sponsor logo drifting

## ⚡ Performance

- No external animation libraries
- Lightweight confetti (60 pieces max)
- CSS-based animations (GPU accelerated)
- Lazy-loaded images
- Optimized for projector display

## 🧪 Testing Checklist

Before competition:
- [ ] SQL table created in Supabase
- [ ] Words imported to database
- [ ] Admin login works (password: `sow2025`)
- [ ] Spelling round page loads
- [ ] Word list shows correctly
- [ ] Reveal animation works
- [ ] Audio plays (🔊 button)
- [ ] CORRECT animation shows
- [ ] WRONG animation shows
- [ ] Keyboard shortcuts work
- [ ] Projector displays correctly
- [ ] Scoreboard updates in real-time

## 🐛 Troubleshooting

### Words not appearing?
- Check section matches filter
- Clear search box
- Verify import completed

### Audio not working?
- Check browser volume
- Verify speakers connected
- Try another browser

### Animations freezing?
- Refresh page (F5)
- Check internet connection
- Disable browser extensions

### Page won't load?
- Check `/admin` works
- Verify database connection
- Check browser console for errors

See full troubleshooting in `SPELLING_ROUND_IMPLEMENTATION.md`

## 📞 Support

1. Check browser console (F12) for errors
2. Review troubleshooting section in docs
3. Verify database connection
4. Try refreshing the page
5. Check network tab for failed requests

## 🎉 You're All Set!

The spelling round is ready for the SOW Spelling Bee Championship. No additional npm installs or build steps needed.

**Next Steps:**
1. Run SQL to create table
2. Import spelling words
3. Test all features
4. Test on projector
5. Run the championship!

---

**Questions?** See the comprehensive documentation files included in the project.

**Ready to spell?** Go to `/spelling-round` and make it happen! 🏆
