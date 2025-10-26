# Floor Plan Images

This folder contains floor plan images for indoor navigation.

## How to Add Floor Plans

### Step 1: Convert PDF to Images

React Native cannot display PDF files directly. You need to convert your PDF floor plans to PNG or JPG images.

**Methods to convert:**

1. **Adobe Acrobat / Adobe Reader:**
   - Open your floor plan PDF
   - Go to File > Export To > Image > PNG or JPEG
   - Save each floor as a separate image

2. **Preview (Mac):**
   - Open PDF in Preview
   - File > Export
   - Format: PNG
   - Save

3. **Online Tools:**
   - Visit: https://pdf2png.com or https://www.ilovepdf.com/pdf_to_jpg
   - Upload your PDF
   - Download converted images

4. **Command Line (if you have ImageMagick installed):**
   ```bash
   convert -density 300 floor-plan.pdf -quality 100 floor-plan.png
   ```

### Step 2: Name Your Files

Use a clear naming convention:
- `nh-basement.png` - Nedderman Hall Basement
- `nh-floor1.png` - Nedderman Hall First Floor
- `nh-floor2.png` - Nedderman Hall Second Floor
- `erb-basement.png` - Engineering Research Building Basement
- etc.

### Step 3: Add to Your Project

1. **Save images here** in `assets/images/floor-plans/`

2. **Update marker.ts** to reference the image:
   ```typescript
   floors: [
     {
       level: 'B',
       name: 'Basement',
       mapImage: require('../../images/floor-plans/nh-basement.png'),
       rooms: [
         // ... room data
       ]
     }
   ]
   ```

3. **Adjust room coordinates** (x, y percentages):
   - Open the floor plan image in an image editor
   - Note the image dimensions
   - Calculate where each room is as a percentage
   - Example: If room is at pixel 500 on a 1000px wide image, x = 50

### Step 4: Optimize Images

For better performance:
- Resize large images to reasonable dimensions (1024-2048px wide is usually enough)
- Use PNG for better quality or JPG for smaller file size
- Optimize with tools like TinyPNG or ImageOptim

## Current Floor Plans

Add your converted floor plans here and list them below:

- [ ] Nedderman Hall - Basement
- [ ] Nedderman Hall - First Floor
- [ ] Nedderman Hall - Second Floor
- [ ] Engineering Research Building - Basement
- [ ] ...add more as needed

## Tips

- Keep original aspect ratio when resizing
- Higher DPI (300) produces better quality for zooming
- Test on device to ensure legibility at various zoom levels

