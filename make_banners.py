import math, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = r"C:\Users\Admin\Desktop\Virava Chemicals\client\public\img\slides"
os.makedirs(OUT, exist_ok=True)

W, H = 1920, 900
BLACK_FONT = r"C:\Windows\Fonts\ariblk.ttf"
BOLD_FONT = r"C:\Windows\Fonts\arialbd.ttf"

# manufacturer, wordmark, tagline, motif-rotation-deg, filename
SLIDES = [
    ("Godrej Industries Limited", "GODREJ", "OLEO CHEMICALS", 0, "godrej.jpg"),
    ("HPL Additives Limited", "HPL", "RUBBER & POLYMER ADDITIVES", 22, "hpl.jpg"),
    ("Oriental Carbon & Chemicals", "OCCL", "INSOLUBLE SULPHUR", 44, "occl.jpg"),
    ("The Standard Chemicals Co.", "STANDARD", "SPECIALTY CHEMICALS", 66, "standard.jpg"),
]

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

def gradient(w, h, c1, c2):
    base = Image.new("RGB", (w, h), c1)
    top = Image.new("RGB", (w, h), c2)
    mask = Image.new("L", (w, h))
    md = mask.load()
    for y in range(h):
        for x in range(0, w, 4):
            v = int(255 * ((x/w)*0.6 + (y/h)*0.4))
            for dx in range(4):
                if x+dx < w:
                    md[x+dx, y] = v
    base.paste(top, (0, 0), mask)
    return base

def molecule(rot_deg, size=620):
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    cx = cy = size//2
    R = size*0.26
    rot = math.radians(rot_deg)
    ring = [(cx + R*math.cos(rot + k*math.pi/3), cy + R*math.sin(rot + k*math.pi/3)) for k in range(6)]
    branches = []
    for k in [0, 2, 4]:
        a = rot + k*math.pi/3
        branches.append((k, cx + (R+size*0.16)*math.cos(a), cy + (R+size*0.16)*math.sin(a)))
    # bonds
    for k in range(6):
        d.line([ring[k], ring[(k+1)%6]], fill=(255,255,255,70), width=5)
    for k, bx, by in branches:
        d.line([ring[k], (bx, by)], fill=(255,255,255,70), width=5)
    # atoms
    def atom(x, y, r, fill, outline):
        d.ellipse([x-r, y-r, x+r, y+r], fill=fill, outline=outline, width=5)
    for k, bx, by in branches:
        atom(bx, by, 15, (20,20,20,255), (255,255,255,150))
    for i, (x, y) in enumerate(ring):
        atom(x, y, 22, (20,20,20,255), (255,255,255,150))
    # accent (red) atom
    ax, ay = ring[0]
    d.ellipse([ax-25, ay-25, ax+25, ay+25], fill=(216,31,38,255))
    return img

def red_glow(w, h):
    g = Image.new("RGBA", (w, h), (0,0,0,0))
    gd = ImageDraw.Draw(g)
    gd.ellipse([w-720, -260, w+140, 480], fill=(216,31,38,120))
    return g.filter(ImageFilter.GaussianBlur(160))

def dot_pattern(w, h):
    p = Image.new("RGBA", (w, h), (0,0,0,0))
    pd = ImageDraw.Draw(p)
    for y in range(0, h, 34):
        for x in range(0, w, 34):
            pd.ellipse([x, y, x+2, y+2], fill=(255,255,255,14))
    return p

for name, mark, tag, rot, fn in SLIDES:
    img = gradient(W, H, (10,10,10), (34,34,34)).convert("RGBA")
    img.alpha_composite(dot_pattern(W, H))
    img.alpha_composite(red_glow(W, H))
    # molecule on right
    mol = molecule(rot, 720)
    img.alpha_composite(mol, (W-760, (H-720)//2))
    # faint big wordmark bottom-right (composited so alpha is respected)
    try:
        wm_font = ImageFont.truetype(BLACK_FONT, 260)
    except Exception:
        wm_font = ImageFont.load_default()
    txt = Image.new("RGBA", (W, H), (0,0,0,0))
    td = ImageDraw.Draw(txt)
    bbox = td.textbbox((0,0), mark, font=wm_font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    td.text((W-tw-60, H-th-140), mark, font=wm_font, fill=(255,255,255,24))
    img.alpha_composite(txt)
    # red accent bar (left)
    ImageDraw.Draw(img).rectangle([0, 0, 10, H], fill=(216,31,38,255))
    img.convert("RGB").save(os.path.join(OUT, fn), quality=88)
    print("saved", fn)

print("done")
