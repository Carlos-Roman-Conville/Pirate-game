"""Builds the economy data files from the design record.

    python files/pirate-ship/economy/build-economy-data.py

Reads skill-tree.json (skills, bands, placements, chains, occupations) and the cargo tables in GOODS.md (kind,
type, package, spoilage, price per row), and writes data/pirate-ship/economy/{goods,skills,recipes,occupations}.json.
The design files are the source; never edit the output by hand. Every good keeps its GOODS.md row and its mark
(source / proposed / unsourced / estimate), so the engine and the balance lane can tell record from guess.
"""
import json
import pathlib
import re

here = pathlib.Path(__file__).parent
repo = here.parent.parent.parent
out = repo / "data" / "pirate-ship" / "economy"
out.mkdir(parents=True, exist_ok=True)

tree = json.loads((here / "skill-tree.json").read_text(encoding="utf-8"))
goods_md = (here / "GOODS.md").read_text(encoding="utf-8")

# --- the cargo rows of GOODS.md: | # | Good | Kind | Origin → destination | Package | Spoils | Value | Type | Sources |
rows = {}
for line in goods_md.splitlines():
    m = re.match(r"^\| (\d+) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|$", line)
    if m and int(m.group(1)) not in rows:
        n = int(m.group(1))
        rows[n] = {"name": m.group(2), "kind": m.group(3), "route": m.group(4), "package": m.group(5),
                   "spoils": m.group(6), "value": m.group(7), "type": m.group(8), "sources": m.group(9)}
# rows 62-65 (Rex's additions and the later ones) have a shorter table: | # | Good | Kind | Skill | Note |
for line in goods_md.splitlines():
    m = re.match(r"^\| (6[2-5]) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|$", line)
    if m and int(m.group(1)) not in rows:
        rows[int(m.group(1))] = {"name": m.group(2), "kind": m.group(3), "route": "open", "package": "open",
                                 "spoils": "open", "value": "open", "type": "open", "sources": m.group(5)}

def type_of(cell):
    cell = cell.strip()
    if cell.startswith("Open for Rex") or cell == "open":
        return "open", "open"
    kind = cell.split("(")[0].strip().split(",")[0].strip()
    mark = "proposed" if "(proposed" in cell else "source"
    return kind, mark

def slug(s):
    s = re.sub(r"\(.*?\)", "", s).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

bands = {b["key"]: b for b in tree["bands"]}
band_min = {}
for b in tree["bands"]:
    band_min[b["key"]] = int(re.match(r"(\d+)", b["range"]).group(1))

skills, recipes, goods, by_chip = [], [], {}, {}
for g in tree["groups"]:
    for s in g["skills"]:
        skills.append({"id": s["key"], "name": s["name"], "group": g["key"], "inStats": s["existing"],
                       "region": s.get("region", "caribbean"), "learnedBy": s.get("learnedBy", "open"),
                       "covers": s["covers"], "why": s["why"]})
        for it in s["items"]:
            chip = s["key"] + ":" + it["name"]
            gid = slug(it["name"])
            if gid in goods and goods[gid]["row"] != it["good"]:
                gid = gid + "-" + str(it["good"])
            by_chip[chip] = gid
            if it.get("service"):
                continue
            row = rows.get(it["good"], {})
            t, tmark = type_of(row.get("type", "open"))
            mark = "unsourced" if it.get("unsourced") else "source"
            if gid not in goods:
                goods[gid] = {"id": gid, "name": it["name"], "row": it["good"],
                              "kind": "raw" if g["key"] == "gathering" else "manufactured",
                              "type": t, "typeMark": tmark, "basePrice": None,
                              "offMap": bool(it.get("offMap")), "mark": mark, "madeBy": s["key"],
                              "region": it.get("region", "caribbean"), "note": it.get("note", "")}

# imported-only goods: no recipe here; a European ship's or a far-travelled merchant's cargo
for it in tree.get("imported", {}).get("items", []):
    gid = slug(it["name"])
    by_chip["imported:" + it["name"]] = gid
    row = rows.get(it["good"], {})
    t, tmark = type_of(row.get("type", "open"))
    goods.setdefault(gid, {"id": gid, "name": it["name"], "row": it["good"], "kind": "imported", "type": t, "typeMark": tmark,
                           "basePrice": None, "offMap": True, "mark": "source", "madeBy": None,
                           "knowledge": it.get("knowledge", "common"), "region": it.get("region", "caribbean"),
                           "note": it.get("note", "")})

# the GOODS.md rows, with the sourced detail that belongs to the row, not to every good made from it
row_list = [{"row": n, **r} for n, r in sorted(rows.items())]
for r in row_list:
    r["type"], r["typeMark"] = type_of(r["type"])

for g in tree["groups"]:
    for s in g["skills"]:
        for it in s["items"]:
            chip = s["key"] + ":" + it["name"]
            r = {"id": slug(s["key"] + "-" + it["name"]), "skill": s["key"], "band": it["band"],
                 "minLevel": band_min[it["band"]], "output": None if it.get("service") else by_chip[chip],
                 "service": bool(it.get("service")), "offMap": bool(it.get("offMap")),
                 "inputs": [by_chip[x] for x in ([it["input"]] if it.get("input") else []) + it.get("inputs", [])],
                 "inputsAny": [by_chip[x] for x in it.get("inputAny", [])],
                 "gate": it.get("gate"), "knowledge": it.get("knowledge", "common"),
                 "region": it.get("region", "caribbean"), "note": it.get("note", "")}
            if it.get("service"):
                r["name"] = it["name"]
            recipes.append(r)

name_to_id = {s["name"]: s["id"] for s in skills}
occupations = []
for o in tree["occupations"]["list"]:
    occupations.append({"id": slug(o["name"]), "name": o["name"], "period": o["period"],
                        "skills": [name_to_id.get(n, slug(n)) for n in o["skills"]],
                        "outside": [slug(n) for n in o.get("outside", [])], "note": o.get("note", "")})

about = ("Built by files/pirate-ship/economy/build-economy-data.py from skill-tree.json and GOODS.md. Do not edit by hand. "
         "Marks: source = a period record (GOODS.md Part 4); proposed = this session's placement for Rex; unsourced = Rex's design "
         "addition with no period source; estimate = worked out from sourced inputs (GOODS.md 1j). basePrice is null everywhere: "
         "the balance lane sets it; the sourced price text is beside it. The five per-settlement numbers (stock, consumption per day, "
         "target reserve, production per day, base price) belong to a ports file that does not exist yet (ALIGNMENT §10).")

(out / "goods.json").write_text(json.dumps({"_about": about, "reviewed": tree["status"],
    "rowsNote": "rows = the 65 cargo rows of GOODS.md Part 1 with their sourced kind, route, package, spoilage, price and type; goods = the engine's goods, one per recipe output, each pointing at its row",
    "rows": row_list, "goods": sorted(goods.values(), key=lambda g: (g["row"], g["id"]))}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(out / "skills.json").write_text(json.dumps({"_about": about, "bands": tree["bands"], "rule": tree.get("rule", ""), "regions": tree.get("regions"), "skills": skills}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(out / "recipes.json").write_text(json.dumps({"_about": about, "flags": tree["flags"], "recipes": recipes}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(out / "occupations.json").write_text(json.dumps({"_about": about, "note": tree["occupations"]["note"], "rules": tree["occupations"]["rules"], "occupations": occupations}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# checks
ids = set(goods)
missing = [(r["id"], x) for r in recipes for x in r["inputs"] + r["inputsAny"] if x not in ids]
assert not missing, missing
no_row = sorted({g["row"] for g in goods.values() if g["row"] not in rows})
print(f"rows {len(row_list)}, goods {len(goods)}, skills {len(skills)}, recipes {len(recipes)} ({sum(r['service'] for r in recipes)} services), occupations {len(occupations)}")
print("GOODS.md rows referenced but not parsed:", no_row or "none")
