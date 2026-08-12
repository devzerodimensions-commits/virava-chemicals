import os
from PIL import Image, ImageDraw, ImageFont

SL = r"C:\Users\Admin\Desktop\Virava Chemicals\client\public\img\slides"
RAW = os.path.join(SL, "raw")
W, H = 1920, 900
BLACK_FONT = r"C:\Windows\Fonts\ariblk.ttf"

FILES = [("godrej.jpg", "GODREJ"), ("hpl.jpg", "HPL"),
         ("occl.jpg", "OCCL"), ("standard.jpg", "STANDARD")]

def darken(photo):
    ov = Image.new("RGBA", (W, H), (0,0,0,0))
    px = ov.load()
    for x in range(W):
        frac = x / W
        a = 210 - (210-35) * min(frac/0.72, 1.0)   # dark left -> light right
        a = int(max(35, a))
        for y in range(H):
            px[x, y] = (6, 8, 10, a)
    return ov

for fn, mark in FILES:
    p = Image.open(os.path.join(RAW, fn)).convert("RGB")
    # cover-fit to WxH
    ratio = max(W/p.width, H/p.height)
    p = p.resize((int(p.width*ratio), int(p.height*ratio)))
    left = (p.width - W)//2; top = (p.height - H)//2
    p = p.crop((left, top, left+W, top+H)).convert("RGBA")
    # dark gradient overlay (readability)
    p.alpha_composite(darken(p))
    # faint watermark bottom-right
    txt = Image.new("RGBA", (W, H), (0,0,0,0))
    td = ImageDraw.Draw(txt)
    try:
        f = ImageFont.truetype(BLACK_FONT, 200)
    except Exception:
        f = ImageFont.load_default()
    b = td.textbbox((0,0), mark, font=f)
    tw, th = b[2]-b[0], b[3]-b[1]
    td.text((W-tw-60, H-th-120), mark, font=f, fill=(255,255,255,22))
    p.alpha_composite(txt)
    # red accent bar (left)
    ImageDraw.Draw(p).rectangle([0, 0, 9, H], fill=(216,31,38,255))
    p.convert("RGB").save(os.path.join(SL, fn), quality=86)
    print("done", fn)
print("all done")
