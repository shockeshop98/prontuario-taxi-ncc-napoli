"""Keep the HTML, service worker and version manifest on one build ID."""

from pathlib import Path
import hashlib
import json
import re


ROOT = Path(__file__).resolve().parents[1]
html_path = ROOT / "index.html"
worker_path = ROOT / "sw.js"
version_path = ROOT / "version.json"
html = html_path.read_text()
worker = worker_path.read_text()
version = json.loads(version_path.read_text())

docs_match = re.search(r"const DOCS = new Set\(\[(.*?)\]\);", worker, re.S)
if not docs_match:
    raise SystemExit("Missing service worker document list")
doc_paths = re.findall(r"'([^']+)'", docs_match.group(1))
if len(doc_paths) != len(set(doc_paths)) or not doc_paths:
    raise SystemExit("Invalid service worker document list")
doc_hashes = {
    path: hashlib.sha256((ROOT / path).read_bytes()).hexdigest()
    for path in doc_paths
}
data_line = next((line for line in html.splitlines() if line.startswith("const DATA=")), None)
if data_line is None:
    raise SystemExit("Missing embedded source catalog")
sources = json.loads(data_line[len("const DATA="):].removesuffix(";"))["sources"]
if {source["url"] for source in sources} != set(doc_paths):
    raise SystemExit("Document list and source catalog differ")
source_meta = {
    path: {"bytes": (ROOT / path).stat().st_size, "sha256": doc_hashes[path]}
    for path in doc_paths
}
html, meta_count = re.subn(
    r"^const SOURCE_META = .*;$",
    "const SOURCE_META = " + json.dumps(source_meta, ensure_ascii=False, sort_keys=True) + ";",
    html,
    flags=re.M,
)
if meta_count != 1:
    raise SystemExit("Expected exactly one SOURCE_META map")
worker, hashes_count = re.subn(
    r"^const DOC_HASHES = .*;$",
    "const DOC_HASHES = " + json.dumps(doc_hashes, ensure_ascii=False, sort_keys=True) + ";",
    worker,
    flags=re.M,
)
if hashes_count != 1:
    raise SystemExit("Expected exactly one DOC_HASHES map")

html, html_count = re.subn(r"BUILD_ID='[a-f0-9]{64}'", "BUILD_ID='__BUILD_ID__'", html)
worker, worker_count = re.subn(r"BUILD_ID = '[a-f0-9]{64}'", "BUILD_ID = '__BUILD_ID__'", worker)
if html_count != 1 or worker_count != 1:
    raise SystemExit("Expected exactly one build ID in each script")
if f'RELEASE="{version["version"]}"' not in html:
    raise SystemExit("Update version.json and RELEASE in index.html together")

core_match = re.search(r"const CORE = \[(.*?)\];", worker, re.S)
if not core_match:
    raise SystemExit("Missing service worker core list")
core_paths = re.findall(r"'([^']+)'", core_match.group(1))
asset_paths = sorted(path for path in core_paths if path.startswith("assets/"))
asset_hashes = "".join(
    f"{path}:{hashlib.sha256((ROOT / path).read_bytes()).hexdigest()}\n"
    for path in asset_paths
)
build = hashlib.sha256(
    (html + "\n" + worker + "\n" + (ROOT / "manifest.webmanifest").read_text() + "\n" + asset_hashes).encode()
).hexdigest()
html_path.write_text(html.replace("__BUILD_ID__", build))
worker_path.write_text(worker.replace("__BUILD_ID__", build))
version["build_id"] = build
version_path.write_text(json.dumps(version, ensure_ascii=False, indent=2) + "\n")
print(build)
