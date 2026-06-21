# Spelling Round - Quick Start Guide for Competition Day

## Getting Started

### 1. Access Spelling Round
- **URL:** `http://localhost:3000/spelling-round` (or your deployed domain)
- **Host View:** Requires admin login first at `/admin`
- **Audience View:** Public, no login needed

### 2. Login as Host
1. Go to Admin panel: `/admin`
2. Enter password: `sow2025`
3. Verify you see "Spelling Words" tab with words loaded
4. Go back to `/spelling-round` - you'll now have host controls

### 3. Toggle Views
- **👁 Audience View** button (top right) - Hide host controls, show what audience sees
- **🎛 Host View** button (top right) - Show host controls

---

## Running a Spelling Round

### Before Round Starts

1. **Select Section**
   - Use the Section dropdown (left panel)
   - Shows all 6 sections

2. **Filter by Difficulty (Optional)**
   - Use the Difficulty dropdown
   - "All" shows every word
   - Or pick: Easy, Moderate, Hard, Champion

3. **Type Contestant Name**
   - Type in "Contestant spelling this word:" field
   - Shows on stage for audience
   - Clear and retype for next contestant

### During Round

1. **Select a Word**
   - Click any word from the list
   - Selected word highlighted in gold on stage (blurred)

2. **Play Audio (Optional)**
   - Click 🔊 **Hear Word** button
   - Reads word aloud to audience
   - Both host and audience see this button

3. **Reveal the Word**
   - Click 👁 **Reveal Word** button
   - Blur removed, word now visible in gold
   - Audience sees the same revealed word

4. **Add Hint (If Available)**
   - Hint displays automatically if one exists
   - Example: "💡 Hint: not certain about something"

5. **Mark Result**
   - ✅ **CORRECT** - Green button
     - Triggers celebration (confetti, emojis, pulse)
     - Contestant name flashes in gold
     - Word auto-clears after 3 seconds
   
   - ❌ **WRONG** - Red button
     - Triggers shake animation
     - Word flashes red
     - Red overlay across screen
     - Ready for next word immediately

### After Each Word
- Click **Next Word** button (or press Escape)
- Stage clears, ready for new contestant/word

---

## Keyboard Shortcuts (Faster!)

Use these to speed up the round:

| Key | Action |
|-----|--------|
| **Space** or **Enter** | Reveal word (when selected) |
| **C** | Mark CORRECT (when revealed) |
| **X** | Mark WRONG (when revealed) |
| **Esc** | Clear stage / deselect word |

### Example Workflow Using Keyboard
1. Click word in list (or use arrow keys to select)
2. Press **Space** to reveal
3. Press **C** or **X** for result
4. Animation plays, then press **Esc** or **Space** again

---

## Advanced Features

### Reset Used Words
- Click "Reset Used Words" button (bottom of left panel)
- Clears strikethrough effect on all words used in session
- Useful if you want to reuse words

### Search Words
- Type in "Search words..." box
- Real-time filter as you type
- Click ✕ to clear search

### Already Used Words
- Strikethrough + dimmed appearance
- Can still select and use again
- Helps track which ones you've asked

### Live Scoreboard (Right Panel)
- Shows current section scores
- Top 3 highlighted in gold/silver/bronze
- Updates automatically as scores change

---

## Projector Display Tips

### What Audience Sees
- Center stage with word (blurred then revealed)
- Contestant name
- Hint (if available)
- Hear Word and Result buttons
- Floating sponsor logos in background
- School logo and title if no word selected

### What Host Sees
- Everything audience sees
- Plus left panel with word controls
- Plus right panel with scores
- Toggle to Audience View to verify projection

### Floating Sponsors
- Set automatically, no control needed
- Drift slowly at different speeds
- Subtle opacity (0.12) - not distracting
- If no sponsors loaded, shows plain dark background

---

## Troubleshooting During Competition

### Word Not Appearing in List?
1. Check section filter matches word's section
2. Check difficulty filter includes word's difficulty
3. Check search box is empty or matches word
4. Verify word was imported to database

### Audio Not Playing?
1. Check browser volume is on
2. Try clicking 🔊 **Hear Word** again
3. Ensure speakers are connected
4. Test on different browser tab first

### Animations Not Showing?
1. Try pressing F5 to refresh page
2. Check browser is not in low-power mode
3. Disable Chrome extensions if they conflict
4. Try different browser (Chrome/Firefox recommended)

### Host View Not Showing?
1. Verify you're logged into admin panel first
2. Refresh page after admin login
3. Check browser dev tools (F12) for errors
4. Verify session storage not cleared

### Scoreboard Not Updating?
1. Confirm scores are being entered in admin panel
2. Check "Live Board" tab in admin is active
3. Refresh page to resync
4. Check internet connection

---

## Best Practices

1. **Pre-Round Test**
   - Test spelling round 5 minutes before starting
   - Verify words are loaded
   - Test audio on projector
   - Check animations on big screen

2. **During Round**
   - Have contestant name ready before clicking word
   - Use keyboard shortcuts for speed
   - Keep host view full screen for comfort
   - Audience view visible on projector

3. **Between Rounds**
   - Click "Reset Used Words" to start fresh
   - Switch to different section if needed
   - Check scoreboard is updating correctly

4. **Backup Plan**
   - Have word list printed just in case
   - Know the section names (Little Sprouts, etc.)
   - Have audio ready on phone if Web Speech fails

---

## Common Workflows

### Quick Round (5 words, 1 section)
1. Select section from dropdown
2. Type contestant name
3. Click word → Space → C/X → Esc → Repeat

### Multiple Sections (Relay style)
1. Change section dropdown
2. New words auto-populate
3. Continue with new contestants
4. Scoreboard shows current section

### Reviewing Results
1. Click Audience View toggle
2. Verify what projection shows
3. Click Host View toggle to continue
4. Check right panel for updated scores

---

## During/After Competition

### How to Save Results
- All word selections are tracked in browser session
- Scores are saved in Supabase automatically
- View results in Admin Panel → Live Board
- Export if needed via Supabase dashboard

### Exporting Word Statistics
- Spelling words table includes: word, section, difficulty, hint, used
- Can query in Supabase for analysis
- Track which words were used in each round

---

## Questions? Issues?

1. **Check Browser Console** (F12)
   - Click Console tab
   - Look for red error messages
   - Screenshot and share if issues persist

2. **Verify Database**
   - Go to Supabase dashboard
   - Check spelling_words table has entries
   - Verify section names match exactly

3. **Test Connection**
   - Try refreshing the page
   - Go to `/admin` and check word count
   - Go back to `/spelling-round`

---

**You're ready! Good luck with the championship!** 🎉
