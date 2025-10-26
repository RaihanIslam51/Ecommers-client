# Banner Management System

## Overview
Dynamic banner management system for the BDMart e-commerce platform. Allows admins to create, edit, and delete banners for the Left and Right banner sections on the homepage.

**Images are automatically uploaded to ImgBB and hosted permanently.**

## Features

### Admin Dashboard
- ✅ Create new banners with images, text, and CTAs
- ✅ **Automatic image upload to ImgBB** (API Key: f2682b8754781338badc3f21b66dfce2)
- ✅ Edit existing banners
- ✅ Delete banners with confirmation
- ✅ Toggle banner active/inactive status
- ✅ Separate Left and Right banner positions
- ✅ Display order control
- ✅ Real-time preview
- ✅ Filter by position (All/Left/Right)
- ✅ Banner statistics display
- ✅ Upload progress indicator

### Banner Fields
- **Title** (Required) - Main heading
- **Subtitle** (Optional) - Secondary text
- **Description** (Optional) - Detailed description
- **Image** (Required) - Banner image
- **Button Text** (Optional) - CTA button label
- **Button Link** (Optional) - CTA button URL
- **Position** (Required) - Left or Right
- **Order** (Optional) - Display sequence
- **Active Status** - Show/hide on website

## API Endpoints

### GET /banners
Fetch all banners
```json
Response: {
  "success": true,
  "banners": [...]
}
```

### GET /banners/:position
Fetch banners by position (left/right), only active ones
```json
Response: {
  "success": true,
  "banners": [...]
}
```

### POST /banners
Create a new banner
```json
Request Body: {
  "title": "Special Offer",
  "subtitle": "Up to 50% Off",
  "description": "Limited time only",
  "image": "image-url",
  "buttonText": "Shop Now",
  "buttonLink": "/store",
  "position": "left",
  "isActive": true,
  "order": 0
}
```

### PUT /banners/:id
Update an existing banner
```json
Request Body: {
  "title": "Updated Title",
  ...
}
```

### DELETE /banners/:id
Delete a banner
```json
Response: {
  "success": true,
  "message": "Banner deleted successfully"
}
```

## Usage

### Accessing Banner Management
1. Go to Dashboard
2. Click on "Banners" in the sidebar (under E-Commerce section)
3. You'll see the banner management interface

### Creating a Banner
1. Click "Add New Banner" button
2. Select position (Left or Right)
3. Upload an image (will be automatically uploaded to ImgBB)
   - Wait for upload to complete (loading spinner will show)
   - Image URL will be saved in database
4. Fill in banner details (title is required)
5. Optionally add button text and link
6. Set display order
7. Check "Active" to show on website
8. Click "Create Banner"

### Image Upload Process
- Images are automatically uploaded to ImgBB cloud hosting
- No need to manually host images
- Direct URL is stored in database
- Images persist permanently on ImgBB
- Maximum file size: 10MB
- Supported formats: PNG, JPG, GIF

### Editing a Banner
1. Find the banner in the list
2. Click "Edit" button
3. Modify the fields
4. Click "Update Banner"

### Deleting a Banner
1. Find the banner in the list
2. Click "Delete" button
3. Confirm deletion in the popup

### Toggle Active Status
1. Find the banner in the list
2. Click "Activate" or "Deactivate" button
3. Banner visibility updates immediately

## Integration with Frontend

### Automatic Display on Homepage
Banners added in the admin dashboard automatically appear on the homepage:

**Left Banners:**
- Location: `client/src/app/Home/Banner/Components/RightBanner.jsx/LeftBanner.jsx`
- Fetches from: `GET /banners/position/left`
- Shows: First active left banner
- Falls back to default banner if none found

**Right Banners:**
- Location: `client/src/app/Home/Banner/Components/RightBanner.jsx/RightBanner.jsx`
- Fetches from: `GET /banners/position/right`
- Shows: First active right banner
- Falls back to default banner if none found

### How It Works
1. Admin adds a banner in dashboard (`/dashboard/banners`)
2. Banner is saved to database with position (left/right)
3. Homepage components automatically fetch and display active banners
4. If no banner exists, default fallback banner is shown
5. Loading state shown during fetch

### Banner Component Usage
```jsx
// Left Banner - automatically fetches from database
<LeftBanner />

// Right Banner - automatically fetches from database
<RightBanner />
```

### API Integration
```javascript
// LeftBanner.jsx
const response = await axiosInstance.get('/banners/position/left');
const leftBanner = response.data.banners[0]; // First active banner

// RightBanner.jsx
const response = await axiosInstance.get('/banners/position/right');
const rightBanner = response.data.banners[0]; // First active banner
```

## Database Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  subtitle: String,
  description: String,
  image: String (required),
  buttonText: String,
  buttonLink: String,
  position: String ('left' | 'right'),
  isActive: Boolean,
  order: Number,
  createdAt: ISO String,
  updatedAt: ISO String
}
```

## Tips
- Use high-quality images for better visual appeal
- Keep titles short and impactful
- Use order field to control which banner appears first
- Inactive banners won't show on the website but remain in the database
- Left banners typically appear on the homepage left section
- Right banners appear in the right section or carousel
- **Images are hosted on ImgBB** - no need for manual hosting
- Upload progress is shown during image upload
- Only JPG, PNG, and GIF formats supported (max 10MB)

## ImgBB Integration
- **API Key**: f2682b8754781338badc3f21b66dfce2
- **Upload URL**: https://api.imgbb.com/1/upload
- **Storage**: Permanent cloud storage
- **Max Size**: 10MB per image
- **Automatic**: Upload happens when you select an image
- **URL Storage**: Direct image URL saved to database

## Future Enhancements
- Multiple image upload
- Image cropping/editing
- Banner scheduling (start/end dates)
- Click tracking and analytics
- A/B testing support
- Responsive image variants
- Banner templates
- Batch operations
