from PIL import Image

# Color: #1b161c (dark purple/black)
color = (27, 22, 28)

# Create spine image (typical dimensions)
spine = Image.new('RGB', (200, 800), color=color)
spine.save('/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/UniverseInANutshell/Spine.png')

# Create back cover image (typical dimensions)
back_cover = Image.new('RGB', (600, 800), color=color)
back_cover.save('/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/UniverseInANutshell/BackCover.png')

print("Created spine and back cover images with color #1b161c")