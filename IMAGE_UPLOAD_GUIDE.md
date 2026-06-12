# Contestant Image Upload Guide

## Overview

The Spelling Bee application now has a complete image management system for contestant pictures. This guide explains how to use and maintain the image upload feature.

## Features

### 1. **Image Upload Modal** (`ImageUploadModal.tsx`)
A dedicated modal component for uploading contestant pictures with:
- Image preview before upload
- File validation (format and size)
- Progress tracking (0-100%)
- Ability to remove existing images
- Beautiful UI matching the app theme

### 2. **Integration in Admin Panel**
The image upload feature is integrated directly into the Contestants Tab with:
- Quick access button (📷) in the contestant actions column
- Inline picture thumbnail display
- One-click access to the upload modal

### 3. **Database Support**
- `picture_url` field in the `contestants` table stores image URLs
- Supabase Storage bucket `contestant-pictures` for image files
- RLS policies configured for public read and admin upload

## How to Upload a Picture

### Via Admin Panel

1. Navigate to **Admin Panel** → **Contestants Tab**
2. Find the contestant in the table
3. Click the **📷 (camera)** button in the Actions column
4. In the modal that opens:
   - Click **"Select Image"** to choose a file from your device
   - A preview will appear once selected
   - File size limit: 5MB
   - Supported formats: JPEG, PNG, WebP, GIF, etc.
5. Click **"Upload"** to proceed
   - Progress bar shows upload status (0-100%)
   - Once complete, the modal closes automatically

### Editing/Removing Pictures

- **Change Picture**: Click 📷 again and select a new image
- **Remove Picture**: Click 📷, then click **"Remove Current"** to delete the existing image

## Technical Details

### File Upload Flow

1. **Client-side Validation**
   - File type check (image/* only)
   - File size validation (max 5MB)
   - Preview generation using FileReader API

2. **Upload to Supabase Storage**
   - File naming: `{contestantId}-{timestamp}.{ext}`
   - Bucket: `contestant-pictures`
   - Upsert enabled (replaces existing file if contestant already has one)

3. **URL Generation**
   - Public URL generated automatically
   - Stored in `contestants.picture_url`

4. **Database Update**
   - API endpoint: `PUT /api/contestants`
   - Updates contestant record with new `picture_url`
   - Requires admin password authentication

### API Endpoint

**Endpoint**: `PUT /api/contestants`

**Headers**:
```
Content-Type: application/json
x-admin-password: [your-admin-password]
```

**Request Body**:
```json
{
  "id": "contestant-id",
  "picture_url": "https://..."
}
```

**Response**:
```json
{
  "id": "...",
  "name": "...",
  "picture_url": "https://...",
  ...
}
```

## File Structure

```
src/components/
├── ImageUploadModal.tsx           # Main modal component
├── ImageUploadModal.module.css    # Modal styling
└── ContestantsTab.tsx             # Updated to include modal
```

## Security

- File uploads restricted to authenticated admins via `x-admin-password` header
- File type validation on client and server side
- File size limits enforced (5MB max)
- Supabase RLS policies restrict public uploads
- Storage bucket has dedicated policies for contestant pictures

## Styling

The image upload feature uses the app's existing color scheme:
- **Primary**: Cyan (#00e5ff)
- **Secondary**: Gold (#FFD700)
- **Dark Background**: #0f1535

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "File size must be less than 5MB" | Choose a smaller image file |
| "Please select an image file" | Ensure the file is an image (JPEG, PNG, etc.) |
| "Failed to upload image" | Check internet connection and try again |
| "Failed to update contestant" | Verify admin password in `.env.local` |

## Performance Considerations

- Images are optimized by Supabase CDN
- Lazy loading not required (images display on demand in admin panel)
- Thumbnails use CSS `object-fit: cover` for consistent sizing
- Progress tracking updates every ~30ms during upload

## Customization

### Changing Max File Size

Edit `ImageUploadModal.tsx`, line ~40:
```typescript
if (selectedFile.size > 5 * 1024 * 1024) { // Change this value
```

### Changing Storage Bucket

Edit `ImageUploadModal.tsx`, line ~63 and `ContestantsTab.tsx`:
```typescript
.from('contestant-pictures') // Change bucket name here
```

### Changing Upload Path

Edit `ImageUploadModal.tsx`, line ~61:
```typescript
const fileName = `${contestant.id}-${Date.now()}.${file.name.split('.').pop()}`
```

## Troubleshooting

### Images not displaying
1. Check Supabase bucket permissions (should be public)
2. Verify `picture_url` is stored correctly in database
3. Check browser console for CORS errors

### Upload fails silently
1. Check network tab in browser DevTools
2. Verify admin password is correct
3. Check Supabase API key in `.env.local`

### Storage quota issues
- Monitor image file sizes
- Consider implementing image compression
- Archive old images periodically

## Future Enhancements

Potential improvements:
- Image cropping tool before upload
- Automatic image optimization/compression
- Batch upload multiple images
- Image gallery view
- Auto-resize images to optimal dimensions
- Drag-and-drop support
