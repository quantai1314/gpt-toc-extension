"""Build Shigang's editable SVG and extension PNG icons (requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
SCALE = 8
INK = "#123C38"
PAPER = "#F4F6E8"
MINT = "#78BBA5"
AMBER = "#EDBD67"

# One geometry definition supplies both the SVG master and PNG sizes.
shapes = [
    ("rect", (4, 4, 124, 124, 28), INK),
    ("line", (32, 43, 32, 91, 4), MINT),
    ("line", (52, 43, 74, 43, 8), PAPER),
    ("line", (52, 67, 96, 67, 8), PAPER),
    ("line", (52, 91, 79, 91, 8), PAPER),
    ("circle", (32, 43, 5), PAPER),
    ("circle", (32, 67, 5), PAPER),
    ("circle", (32, 91, 5), PAPER),
    ("polygon", ((88, 25), (104, 25), (104, 55), (96, 49), (88, 55)), AMBER),
]

svg_parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="拾纲：目录与书签">']
master = Image.new("RGBA", (128 * SCALE, 128 * SCALE))
draw = ImageDraw.Draw(master)
for kind, coords, color in shapes:
    if kind == "rect":
        x1, y1, x2, y2, radius = coords
        draw.rounded_rectangle(tuple(v * SCALE for v in coords[:4]), radius=radius * SCALE, fill=color)
        svg_parts.append(f'<rect x="{x1}" y="{y1}" width="{x2-x1}" height="{y2-y1}" rx="{radius}" fill="{color}"/>')
    elif kind == "line":
        x1, y1, x2, y2, width = coords
        draw.line((x1*SCALE, y1*SCALE, x2*SCALE, y2*SCALE), fill=color, width=width*SCALE)
        radius = width*SCALE/2
        for x, y in ((x1*SCALE, y1*SCALE), (x2*SCALE, y2*SCALE)):
            draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=color)
        svg_parts.append(f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{color}" stroke-width="{width}" stroke-linecap="round"/>')
    elif kind == "circle":
        x, y, radius = coords
        draw.ellipse(((x-radius)*SCALE, (y-radius)*SCALE, (x+radius)*SCALE, (y+radius)*SCALE), fill=color)
        svg_parts.append(f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{color}"/>')
    else:
        draw.polygon([(x*SCALE, y*SCALE) for x, y in coords], fill=color)
        points = " ".join(f"{x},{y}" for x, y in coords)
        svg_parts.append(f'<polygon points="{points}" fill="{color}"/>')
svg_parts.append('</svg>')
(ROOT / "icons" / "shigang.svg").write_text("\n".join(svg_parts) + "\n", encoding="utf-8")
for size in (16, 32, 48, 64, 128, 512):
    icon = master.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(ROOT / "icons" / f"shigang-{size}.png")
    if size <= 128:
        icon.save(ROOT / "landing_page" / "assets" / f"shigang-{size}.png")
print("Built Shigang SVG master and PNG icons: 16, 32, 48, 64, 128, 512")
