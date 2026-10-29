"""Builds skill-tree.html from skill-tree.json and skill-tree.template.html (same folder).

    python files/pirate-ship/economy/build-skill-tree.py

The JSON is the source; edit it, rerun this, open skill-tree.html in a browser. No server needed.
"""
import json
import pathlib

here = pathlib.Path(__file__).parent
data = json.loads((here / "skill-tree.json").read_text(encoding="utf-8"))
template = (here / "skill-tree.template.html").read_text(encoding="utf-8")
payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
(here / "skill-tree.html").write_text(template.replace("__DATA__", payload), encoding="utf-8")
items = sum(len(s["items"]) for g in data["groups"] for s in g["skills"])
print(f"skill-tree.html: {sum(len(g['skills']) for g in data['groups'])} skills, {items} placements")
