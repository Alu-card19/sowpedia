# 📋 Competition Day Checklist

## ✅ Pre-Competition (1 Week Before)

- [ ] **Database Setup**
  - [ ] Run SQL to create `spelling_words` table
  - [ ] Verify table appears in Supabase dashboard
  - [ ] Check RLS policies are active
  - [ ] Verify indexes created

- [ ] **Import Words**
  - [ ] Prepare word list (see SPELLING_WORDS_SAMPLE.csv)
  - [ ] Login to admin panel: `/admin`
  - [ ] Go to Spelling Words tab
  - [ ] Upload CSV file
  - [ ] Verify X words imported successfully
  - [ ] Check all 6 sections have words
  - [ ] Verify difficulties are mixed

- [ ] **Test Features**
  - [ ] Test spelling round page loads: `/spelling-round`
  - [ ] Test admin login works
  - [ ] Test section dropdown shows all 6 sections
  - [ ] Test difficulty filter works
  - [ ] Test search box filters words
  - [ ] Test word selection highlights
  - [ ] Test word reveal animation
  - [ ] Test keyboard shortcuts (Space, C, X, Esc)
  - [ ] Test 🔊 Hear Word button (audio plays)
  - [ ] Test ✅ CORRECT animation (confetti appears)
  - [ ] Test ❌ WRONG animation (shake and red flash)
  - [ ] Test Next Word button works
  - [ ] Test toggle between Host and Audience view

- [ ] **Projector Setup**
  - [ ] Connect computer to projector
  - [ ] Test spelling round displays on projector
  - [ ] Verify text is readable from audience distance
  - [ ] Test animations play smoothly
  - [ ] Check sponsor logos load (if any)
  - [ ] Test audio volume on speakers
  - [ ] Verify colors are accurate on projection

- [ ] **Backup Plan**
  - [ ] Print word list to physical copy
  - [ ] Have alternate device ready
  - [ ] Test internet connection
  - [ ] Have contestant list prepared
  - [ ] Know section names by heart

---

## ✅ Day Before Competition

- [ ] **System Check**
  - [ ] Test computer startup
  - [ ] Verify internet connection stable
  - [ ] Check Supabase dashboard loads
  - [ ] Verify words are still in database
  - [ ] Test spelling round page one more time

- [ ] **Documentation Review**
  - [ ] Read SPELLING_ROUND_QUICK_START.md
  - [ ] Familiarize with keyboard shortcuts
  - [ ] Review troubleshooting section
  - [ ] Note password: `sow2025`

- [ ] **Hardware Preparation**
  - [ ] Charge laptop fully
  - [ ] Test projector connection
  - [ ] Check speaker volume works
  - [ ] Have backup mouse/keyboard ready
  - [ ] Test all cables are secure

---

## ✅ 30 Minutes Before Competition

- [ ] **Final System Test**
  - [ ] Open `/admin` and login
  - [ ] Verify all words still loaded
  - [ ] Go to `/spelling-round`
  - [ ] Test selecting a word
  - [ ] Test reveal animation
  - [ ] Test audio (🔊 button)
  - [ ] Test animations (C and X buttons)
  - [ ] Check projector display

- [ ] **Prepare Controls**
  - [ ] Close unnecessary browser tabs
  - [ ] Maximize spelling round window
  - [ ] Hide taskbar if possible
  - [ ] Set brightness to comfortable level

- [ ] **Verify Connectivity**
  - [ ] Check internet ping (should be <100ms)
  - [ ] Test database connection
  - [ ] Verify sponsor logos loading
  - [ ] Check scoreboard syncing

---

## ✅ 5 Minutes Before Competition

- [ ] **Go Live**
  - [ ] Navigate to `/spelling-round` in browser
  - [ ] Verify page loads completely
  - [ ] Click Audience View to see projection
  - [ ] Verify audience view shows: empty state with school logo
  - [ ] Toggle back to Host View
  - [ ] Verify left panel visible (word list)
  - [ ] Verify right panel visible (scoreboard)

- [ ] **Audio Test**
  - [ ] Select a test word
  - [ ] Click 🔊 Hear Word
  - [ ] Verify audio plays on speakers
  - [ ] Adjust volume if needed

- [ ] **Final Ready**
  - [ ] Have contestant list ready
  - [ ] Clear browser history/cookies
  - [ ] Disable notifications
  - [ ] Set phone to silent
  - [ ] Remove distractions

---

## ✅ During Competition

### Round Setup
- [ ] Select correct section from dropdown
- [ ] Verify difficulty filter is appropriate
- [ ] Prepare first contestant name

### For Each Word
- [ ] Type contestant name (or skip if same)
- [ ] Click a word from the list (or use arrow keys)
- [ ] Press Space to reveal (or click button)
- [ ] Press 🔊 if audience needs to hear
- [ ] Wait for contestant answer
- [ ] Press C or X based on answer (or click button)
- [ ] Watch animation play
- [ ] Press Esc or wait for next prompt

### Between Sections
- [ ] Change section dropdown
- [ ] Verify word list updates
- [ ] Check scoreboard shows new section
- [ ] Continue with next set of contestants

### Monitoring
- [ ] Watch for animation glitches
- [ ] Monitor projector display
- [ ] Listen for audio issues
- [ ] Keep eye on scoreboard updates

---

## ✅ During Competition - Troubleshooting

If something goes wrong:

### Words Not Appearing
- [ ] Check section filter matches word's section
- [ ] Clear search box if it has text
- [ ] Check difficulty filter isn't too restrictive
- [ ] **Backup:** Use printed word list

### Audio Not Playing
- [ ] Check speaker volume
- [ ] Try clicking 🔊 again
- [ ] Check browser volume isn't muted
- [ ] **Backup:** Say the word aloud

### Animations Freezing
- [ ] Press F5 to refresh page
- [ ] Try opening in new tab
- [ ] Disable browser extensions
- [ ] **Backup:** Continue without animation visual

### Page Not Loading
- [ ] Check internet connection
- [ ] Try `/spelling-round` URL again
- [ ] Restart browser
- [ ] **Backup:** Use printed word list

### Projector Goes Black
- [ ] Check HDMI cable connection
- [ ] Wake computer from sleep
- [ ] Verify projector is on
- [ ] **Backup:** Have backup projector source ready

### Scoreboard Not Updating
- [ ] Check Admin panel is updating scores
- [ ] Refresh spelling round page
- [ ] Verify internet connection
- [ ] **Backup:** Manually note scores on paper

---

## ✅ After Competition

- [ ] **Wrap Up**
  - [ ] Close spelling round page gracefully
  - [ ] Note final standings
  - [ ] Take screenshot of live board if needed
  - [ ] Thank participants and audience

- [ ] **Data Preservation**
  - [ ] Export results from admin panel if needed
  - [ ] Backup word list and scores
  - [ ] Take photos/videos (if allowed)
  - [ ] Note any technical issues for improvement

- [ ] **System Shutdown**
  - [ ] Close all applications
  - [ ] Properly shutdown computer
  - [ ] Disconnect projector and cables
  - [ ] Store all equipment safely

---

## 📞 Emergency Contacts

### During Competition
- **Technical Issue:** F12 (Browser console) to check errors
- **Internet Problem:** Check Wi-Fi connection
- **Audio Issue:** Check speaker volume and browser settings
- **Projection Issue:** Check HDMI cable and projector power

### If Page Crashes
1. Close browser tab
2. Open new tab
3. Go to `/spelling-round` again
4. Page should reload fresh

### If Database Disconnects
1. Refresh page (F5)
2. Try `/admin` to verify connection
3. If still down, use backup printed list
4. Continue with alternative method

---

## 🎯 Success Indicators

During competition, you'll know everything is working when:

✅ Words appear in list immediately  
✅ Animations play smoothly on projector  
✅ Audio plays from speakers  
✅ Scoreboard updates in real-time  
✅ Keyboard shortcuts work instantly  
✅ No lag between clicking and result  
✅ Audience can clearly see projected image  
✅ Contestants can hear audio clearly  

---

## 📝 Notes Section

Use this space for notes during competition:

```
Setup issues encountered:
_________________________________
_________________________________

Words that needed clarification:
_________________________________
_________________________________

Technical notes:
_________________________________
_________________________________

Improvements for next time:
_________________________________
_________________________________

Contestants to highlight:
_________________________________
_________________________________
```

---

## 🎉 You're Ready!

Everything is prepared and tested. Trust your setup and enjoy the competition!

**Key reminders:**
- Password: `sow2025`
- Keyboard shortcuts: Space (reveal), C (correct), X (wrong), Esc (clear)
- URL: `/spelling-round`
- Backup: Printed word list

**Good luck with the SOW Spelling Bee Championship!** 📚✨
