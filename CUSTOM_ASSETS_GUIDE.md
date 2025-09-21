# 🎨 Custom Assets Setup Guide

## 📁 Asset Directory Structure
```
public/
├── assets/
│   ├── images/
│   │   ├── logo/
│   │   │   ├── logo.png (main logo)
│   │   │   ├── logo-white.png (white version for dark backgrounds)
│   │   │   └── logo-icon.png (icon only version)
│   │   ├── banner/
│   │   │   ├── hero-banner.jpg (main hero banner)
│   │   │   ├── hero-banner-mobile.jpg (mobile version)
│   │   │   └── category-banners/
│   │   │       ├── bracelets-banner.jpg
│   │   │       ├── necklaces-banner.jpg
│   │   │       ├── rings-banner.jpg
│   │   │       └── pendants-banner.jpg
│   │   └── products/
│   │       ├── sacred-chakra-bracelet/
│   │       │   ├── 1.jpg
│   │       │   ├── 2.jpg
│   │       │   └── 3.jpg
│   │       ├── om-symbol-pendant/
│   │       │   ├── 1.jpg
│   │       │   ├── 2.jpg
│   │       │   └── 3.jpg
│   │       └── ... (other products)
```

## 🖼️ Image Specifications

### Logo Files
- **logo.png**: Main logo (200x60px, PNG with transparency)
- **logo-white.png**: White version for dark backgrounds (200x60px, PNG)
- **logo-icon.png**: Icon only version (60x60px, PNG with transparency)

### Banner Images
- **hero-banner.jpg**: Main hero section (1920x1080px, JPG)
- **hero-banner-mobile.jpg**: Mobile hero section (768x1024px, JPG)
- **Category banners**: (800x600px, JPG)

### Product Images
- **Product folders**: Create a folder for each product
- **Image files**: 800x800px, JPG format
- **Naming**: 1.jpg, 2.jpg, 3.jpg (for multiple angles)

## 🚀 How to Add Your Assets

1. **Replace the placeholder images** in the directories above with your actual images
2. **Update the image paths** in the components (already prepared for you)
3. **Test the application** to ensure everything displays correctly

## 📝 What's Already Set Up

✅ Asset directory structure created
✅ Components updated to use custom assets
✅ Fallback images configured
✅ Responsive image handling
✅ SEO-friendly alt text structure

## 🎯 Next Steps

1. Add your logo files to `public/assets/images/logo/`
2. Add your banner images to `public/assets/images/banner/`
3. Add your product images to `public/assets/images/products/`
4. Run `npm run dev` to see your custom assets in action!

## 💡 Pro Tips

- Use high-quality images for best results
- Optimize images for web (compress without losing quality)
- Use consistent naming conventions
- Test on both desktop and mobile devices
