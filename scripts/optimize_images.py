from PIL import Image
import os, json

SRC = '/home/z/my-project/scripts'
DEST = '/home/z/my-project/public/images/library'

IMAGE_MAP = {
    '2.jpg': ('exterior/library-building-front.jpg', 'Junaid Zaidi Library building exterior with red brick architecture, central entrance with a clock, and campus grounds'),
    '3.jpg': ('exterior/library-building-wide.jpg', 'Junaid Zaidi Library exterior showing the full brick facade, large windows, and clock tower'),
    '6.jpg': ('facilities/conference-event.jpg', 'Library conference room used for events and academic gatherings'),
    '7.jpg': ('interior/awards-display.jpg', 'Library lobby display cabinets showcasing awards, plaques, and medals'),
    '8.jpg': ('interior/circulation-desk.jpg', 'Library circulation desk area with security gates and service counter'),
    '9.jpg': ('interior/reading-corner.jpg', 'Library reading corner with bookshelves and seating area'),
    '12.jpg': ('interior/social-sciences-section.jpg', 'Social Sciences and Psychology bookshelves with QR codes for digital catalog access'),
    '13.jpg': ('interior/main-reading-hall.jpg', 'Spacious library interior with students studying at tables among rows of bookshelves'),
    '14.jpg': ('interior/service-desk-computers.jpg', 'Library service desk area with computer stations and bookshelves'),
    '15.jpg': ('interior/china-studies-corner.jpg', 'China Studies Corner featuring specialized bookshelves, red lanterns, and study areas'),
    '17.jpg': ('facilities/hec-digital-kiosk.jpg', 'HEC Digital Resources kiosk with touchscreen access at the library service desk'),
    '18.jpg': ('facilities/self-service-kiosk.jpg', 'Self-service drop box machine with touchscreen interface'),
    '19.jpg': ('interior/student-reading.jpg', 'Student reading a book near wooden library shelves'),
}

def optimize(img_path, max_w=1920, q=80):
    im = Image.open(img_path)
    if im.mode != "RGB":
        im = im.convert("RGB")
    if im.width > max_w:
        ratio = max_w / im.width
        new_h = int(im.height * ratio)
        im = im.resize((max_w, new_h), Image.Resampling.LANCZOS)
    return im, q

def process():
    alts = {}
    for src, (rel, alt) in IMAGE_MAP.items():
        sp = os.path.join(SRC, src)
        dp = os.path.join(DEST, rel)
        if not os.path.exists(sp):
            print(f"SKIP: {src}"); continue
        os.makedirs(os.path.dirname(dp), exist_ok=True)
        im, q = optimize(sp)
        im.save(dp, "JPEG", quality=q, optimize=True)
        kb = os.path.getsize(dp) / 1024
        print(f"OK: {src} -> {rel} ({im.width}x{im.height}, {kb:.0f}KB)")
        alts[rel] = alt
    mp = os.path.join(DEST, "alt-text.json")
    with open(mp, "w") as f:
        json.dump(alts, f, indent=2)
    print(f"Manifest: {mp}")

if __name__ == "__main__":
    process()
