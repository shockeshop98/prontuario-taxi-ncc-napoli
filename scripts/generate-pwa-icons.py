"""Generate dependency-free PNG icons for the static PWA."""

from pathlib import Path
import struct
import zlib


OUT = Path(__file__).resolve().parents[1] / "assets"


def in_round_rect(x, y, left, top, right, bottom, radius):
    cx = min(max(x, left + radius), right - radius)
    cy = min(max(y, top + radius), bottom - radius)
    return (x - cx) ** 2 + (y - cy) ** 2 <= radius**2


def in_segment(x, y, ax, ay, bx, by, width):
    dx, dy = bx - ax, by - ay
    t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
    return (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2 <= (width / 2) ** 2


def pixel(x, y):
    # Coordinates are normalized to a 512-unit square. The letters stay inside
    # the safe area used by launchers that crop maskable icons.
    navy = (20, 45, 66)
    teal = (32, 145, 151)
    white = (255, 255, 255)
    if not in_round_rect(x, y, 84, 84, 428, 428, 66):
        return navy
    if (in_segment(x, y, 149, 348, 363, 348, 12)
            or in_segment(x, y, 160, 164, 352, 164, 12)):
        return teal
    strokes = (
        (165, 210, 245, 210, 22),  # T top
        (205, 210, 205, 306, 22),  # T stem
        (276, 210, 276, 306, 20),  # N left
        (276, 210, 347, 306, 19),  # N diagonal
        (347, 210, 347, 306, 20),  # N right
    )
    if any(in_segment(x, y, *stroke) for stroke in strokes):
        return white
    return (24, 89, 99)


def chunk(kind, data):
    payload = kind + data
    return struct.pack(">I", len(data)) + payload + struct.pack(">I", zlib.crc32(payload))


def write_icon(size):
    rows = []
    for j in range(size):
        row = bytearray(b"\0")
        for i in range(size):
            x = (i + 0.5) * 512 / size
            y = (j + 0.5) * 512 / size
            row.extend(pixel(x, y))
        rows.append(row)
    data = b"\x89PNG\r\n\x1a\n"
    data += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
    data += chunk(b"IDAT", zlib.compress(b"".join(rows), 9))
    data += chunk(b"IEND", b"")
    (OUT / f"icon-{size}.png").write_bytes(data)


for icon_size in (192, 512):
    write_icon(icon_size)
