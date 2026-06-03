# CCTA Refactor TODO List

## Overview
Clean refactor of the Coin Collection Tracker App (CCTA) - keep same features, reorganize code, fix issues, improve Docker support.

## Tasks

### Phase 1: Analysis & Planning (COMPLETED)
- [x] Analyze current codebase structure
- [x] Identify issues and areas for improvement
- [x] Document current state

### Phase 2: TODO Document (IN PROGRESS)
- [x] Create detailed task breakdown

### Phase 3: Backend Refactor
- [ ] Clean up duplicate prisma folder (src/ is unused)
- [ ] Review and fix backend routes/controllers
- [ ] Ensure Prisma schema is properly set up
- [ ] Test backend builds correctly

### Phase 4: Frontend Refactor
- [ ] Review frontend structure
- [ ] Ensure all dependencies are correct
- [ ] Fix any build issues

### Phase 5: Docker Fixes
- [ ] Review docker-compose.yml for issues
- [ ] Ensure proper healthchecks
- [ ] Fix volume mounts
- [ ] Test full Docker stack runs

### Phase 6: Testing & Integration
- [ ] End-to-end testing
- [ ] Verify all features work
- [ ] Final cleanup

### Phase 7: GitHub Checkpoints
- [x] Initial commit (TODO.md) - pushed: YES
- [ ] Backend refactor commit - pushed: NO (blocked - auth needed)
- [ ] Frontend refactor commit - pushed: NO
- [ ] Docker fixes commit - pushed: NO
- [ ] Final commit - pushed: NO

## Notes
- User credentials: testuser / testpass123
- App runs at http://localhost
- Uses PostgreSQL + Express + React stack
- Translation: ESV, uses Blue Psalter Hymnal, Trinity Psalter Hymnal