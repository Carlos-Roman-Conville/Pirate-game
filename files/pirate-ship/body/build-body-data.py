#!/usr/bin/env python3
"""Body and world data build (body-and-world keeper, 2026-10-29).

Two data roots (Toolchain/realism/MIGRATION.md, phase 2 and 3):

  body/data/*.json        the game's adapters: `id` plus the game's own columns (faces, STATS and COMBAT links,
                          period treatments, availability, places), and the tables that never left the game.
  LIBRARY                 the realism package's scientific data library: the universal columns, keyed by `id`.

This script

1. joins the two on `id` (a split table gets its library columns and its game columns side by side, in the column
   order body/data/_layout.json records from before the split) and fills the few library cells that the engine's own
   data/substances.json and data/reactions.json hold, so a number has one home;
2. renders every table into the docs between `<!-- table:<file>.<key> -->` and `<!-- /table -->` markers
   (body/*.md, world/*.md, science/*.md), so a doc never disagrees with its data. A marker may name a library table,
   `<!-- table:library/physiology.pal -->`; a table that moved whole to the library is rewritten to that name;
3. writes body/data.js (`window.BODY_DATA = {...}`) for body/dashboard.html, which opens from the file system with
   no server (a static page cannot fetch JSON over file://): the joined tables under their old names, so the
   dashboard shows the numbers the engine reads (no page reads the raw library files, so they are not copied in).

Run from anywhere:  python files/pirate-ship/body/build-body-data.py
Never edit a rendered table by hand; edit the JSON and rerun.
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
LIBRARY = Path("E:/AI Programs/Toolchain/realism/data/library")
ENGINE = LIBRARY.parent
DOCS = list(HERE.glob("*.md")) + list((HERE.parent / "world").glob("*.md")) + list((HERE.parent / "science").glob("*.md")) + [HERE.parent / "SOURCES.md"]
MARK = {"rex": "**Rex**", "proposed": "proposed", "open": "**open**", "outside": "proposed (outside AI)", "science": "science", "history": "history", "model": "model", "fiction": "fiction"}


def read(p):
    with Path(p).open(encoding="utf-8") as f:
        return json.load(f)


def load():
    """The game's adapters, by file stem (`_layout.json` is read by load_layout)."""
    return {p.stem: read(p) for p in sorted(DATA.glob("*.json")) if not p.stem.startswith("_")}


def load_library():
    return {p.stem: read(p) for p in sorted(LIBRARY.glob("*.json"))}


def load_layout():
    p = DATA / "_layout.json"
    return read(p) if p.exists() else {"columns": {}, "row_order": {}}


def is_table(k, v):
    return not k.startswith("_") and isinstance(v, dict) and "rows" in v and "columns" in v


def cell(v):
    if v is None:
        return "open"
    if isinstance(v, bool):
        return "yes" if v else "no"
    if isinstance(v, float):
        return f"{v:.6g}"  # keeps 0.00058 as written; never rounds a rate to 0.001
    if isinstance(v, list):
        return ", ".join(cell(x) for x in v)
    if isinstance(v, dict):
        return "; ".join(f"{k} {cell(x)}" for k, x in v.items())
    s = str(v)
    return s.replace("|", "\\|").replace("\n", " ")


# ---------------------------------------------------------------- the engine's own rows

def _terms(items):
    return " + ".join((f"{i['coefficient']:g} " if i["coefficient"] != 1 else "") + i["substance"] for i in items)


def _formula_terms(items, formulas):
    return " + ".join((f"{i['coefficient']:g} " if i["coefficient"] != 1 else "") + formulas.get(i["substance"], i["substance"]) for i in items)


ENGINE_OWNED = {
    ("chemistry", "substances"): ("substances.json", "substances", {
        "Formula": lambda e, f: e["formula"],
        "Molar mass": lambda e, f: None if e["molarMass"] is None else round(e["molarMass"] * 1000, 6),  # kg/mol -> g/mol
    }),
    ("chemistry", "reactions"): ("reactions.json", "reactions", {
        "Reactants": lambda e, f: _formula_terms(e["reactants"], f),
        "Products": lambda e, f: _formula_terms(e["products"], f),
        "Conditions": lambda e, f: "; ".join(f"minimum temperature {v} C" if k == "minimumTemperatureC" else f"{k} {cell(v)}"
                                             for k, v in e["conditions"].items() if k != "note"),
        "Rate (placeholder)": lambda e, f: e["rate"]["kind"],
        "Heat": lambda e, f: None if e["heat"] is None else f"{e['heat'] / 1000:g} kJ/mol",
    }),
}


def load_engine():
    """{(domain, table): ({id: engine row}, formulas by substance id)} for the tables the engine files own columns of."""
    out = {}
    for key, (fname, arr, _) in ENGINE_OWNED.items():
        p = ENGINE / fname
        if p.exists():
            out[key] = {e["id"]: e for e in read(p)[arr]}
    subs = out.get(("chemistry", "substances"), {})
    formulas = {i: e["formula"] for i, e in subs.items()}
    return out, formulas


# ---------------------------------------------------------------- the join

def join_table(dom, tab, lib_doc, game_doc, layout, engine, formulas, problems, whole=True):
    """One table as it was before the split: library columns, then the game's, by `id`, in the layout's order.

    whole=False keeps only the columns the library holds (a `library/` marker on a split table)."""
    ltab, atab = lib_doc[tab], game_doc.get(tab)
    lcols = ltab["columns"]
    hist = lib_doc.get(tab + "_history")
    hrows = {r[0]: r for r in hist["rows"]} if hist else {}
    arows = {r[0]: r for r in atab["rows"]} if atab else {}
    owned = ENGINE_OWNED.get((dom, tab))
    prefix = f"{dom}.{tab}."
    recs = []
    for lrow in ltab["rows"]:
        rec = dict(zip(lcols, lrow))
        rid = rec["id"]
        rec["Id"] = rid[len(prefix):] if rid.startswith(prefix) else rid  # the original Id, without the collision prefix
        if atab and whole:
            arow = arows.get(rid)
            if arow is None:
                problems.append(f"{dom}.{tab}: library row {rid!r} has no game row")
            else:
                rec.update(zip(atab["columns"], arow))
        if hist:
            raw = rid[len(prefix):] if rid.startswith(prefix) else rid
            h = hrows.get(f"{dom}.{tab}_history.{raw}")
            if h is None:
                problems.append(f"{dom}.{tab}_history: no row for {rid!r}")
            else:
                rec.update({c: v for c, v in zip(hist["columns"], h) if c not in ("id", "source")})
        if owned and (dom, tab) in engine and rid in engine[(dom, tab)]:
            for c, fn in owned[2].items():
                if rec.get(c) is None:
                    rec[c] = fn(engine[(dom, tab)][rid], formulas)
        recs.append(rec)
    if atab and whole:
        known = {r["id"] for r in recs}
        for rid in arows:
            if rid not in known:
                problems.append(f"{dom}.{tab}: game row {rid!r} has no library row")
    want = layout["columns"].get(f"{dom}.{tab}")
    if want:
        cols = [c for c in want if all(c in r for r in recs)] if not whole else list(want)
        if whole:
            for c in cols:
                if any(c not in r for r in recs):
                    problems.append(f"{dom}.{tab}: layout column {c!r} is in neither root")
    else:
        cols = list(lcols) + [c for c in (atab["columns"] if atab and whole else []) if c not in lcols]
    meta = {k: v for k, v in ltab.items() if k not in ("columns", "rows")}
    return {**meta, "columns": cols, "rows": [[r.get(c) for c in cols] for r in recs]}


def join_rows(dom, tab, ltab, atab, layout):
    """A table whose rows are split between the roots (sources: science and reference in the library, the rest here)."""
    rows = ltab["rows"] + atab["rows"]
    order = {k: i for i, k in enumerate(layout["row_order"].get(f"{dom}.{tab}", []))}
    rows.sort(key=lambda r: order.get(r[0], len(order)))
    return {**{k: v for k, v in ltab.items() if k not in ("columns", "rows")}, "columns": ltab["columns"], "rows": rows}


def join(game, lib, layout, problems):
    """The game's tables with the library's merged in, under their old names: what the docs and the dashboard read."""
    engine, formulas = load_engine()
    out = {f: dict(t) for f, t in game.items()}
    moved = set()  # (file, table) that live only in the library
    for dom, ldoc in lib.items():
        doc = out.setdefault(dom, {"_about": ldoc.get("_about", "")})
        for tab, ltab in ldoc.items():
            if not is_table(tab, ltab) or tab.endswith("_history"):
                continue
            atab = game.get(dom, {}).get(tab)
            if atab is not None and atab["columns"] == ltab["columns"]:
                doc[tab] = join_rows(dom, tab, ltab, atab, layout)
            else:
                doc[tab] = join_table(dom, tab, ldoc, game.get(dom, {}), layout, engine, formulas, problems)
                if atab is None:
                    moved.add((dom, tab))
    return out, moved


# ---------------------------------------------------------------- docs

def render(table):
    cols = table["columns"]
    lines = []
    head = f"*{table.get('title','')}* ({table.get('kind','model')}; confidence {table.get('conf','medium')}; source: {table.get('source','')})"
    lines.append(head)
    lines.append("")
    lines.append("| " + " | ".join(cols) + " |")
    lines.append("|" + "---|" * len(cols))
    for row in table["rows"]:
        if isinstance(row, dict):
            row = [row.get(c) for c in table.get("keys", cols)]
        r = [cell(x) for x in row]
        if r and r[-1] in MARK and cols[-1].lower() == "mark":
            r[-1] = MARK[r[-1]]
        lines.append("| " + " | ".join(r) + " |")
    return "\n".join(lines)


PAT = re.compile(r"<!-- table:(library/)?([a-z_]+)\.([a-z_]+) -->\n.*?(<!-- /table -->)", re.S)


def render_docs(data, lib, game, moved, layout, problems):
    changed = 0
    engine, formulas = load_engine()
    for doc in DOCS:
        text = doc.read_text(encoding="utf-8")

        def sub(m):
            is_lib, f, k = m.group(1), m.group(2), m.group(3)
            if is_lib:
                if f not in lib or k not in lib[f]:
                    print(f"  {doc.name}: no library table {f}.{k}", file=sys.stderr)
                    return m.group(0)
                t = lib[f][k] if k.endswith("_history") else join_table(f, k, lib[f], game.get(f, {}), layout, engine, formulas, problems, whole=False)
                marker = f"<!-- table:library/{f}.{k} -->"
            else:
                if f not in data or k not in data[f]:
                    print(f"  {doc.name}: no table {f}.{k}", file=sys.stderr)
                    return m.group(0)
                t = data[f][k]
                marker = f"<!-- table:library/{f}.{k} -->" if (f, k) in moved else f"<!-- table:{f}.{k} -->"
            return f"{marker}\n{render(t)}\n{m.group(4)}"

        new = PAT.sub(sub, text)
        if new != text:
            doc.write_text(new, encoding="utf-8")
            changed += 1
    return changed


VALID_KIND = {"science", "history", "model", "fiction", "reference"}
VALID_CONF = {"high", "medium", "low"}


def validate(data, lib=None):
    """Structural checks so a table never renders with a missing cell or an unknown mark. Returns a problem count."""
    bad = 0
    for f, tables in list(data.items()) + [(f"library/{d}", t) for d, t in (lib or {}).items()]:
        for k, t in tables.items():
            if k.startswith("_") or not isinstance(t, dict) or "rows" not in t:
                continue
            n = len(t["columns"])
            if t.get("kind") not in VALID_KIND or t.get("conf") not in VALID_CONF:
                print(f"  {f}.{k}: kind/conf not in the allowed sets", file=sys.stderr); bad += 1
            mi = next((i for i, c in enumerate(t["columns"]) if c.lower() == "mark"), -1)
            ids = set()
            for r in t["rows"]:
                if len(r) != n:
                    print(f"  {f}.{k}: row {str(r[0])[:40]!r} has {len(r)} cells, expected {n}", file=sys.stderr); bad += 1
                if mi >= 0 and not any(str(r[mi]).lower().startswith(w) for w in ("rex", "proposed", "open", "history", "model", "science", "searched")):
                    print(f"  {f}.{k}: row {str(r[0])[:40]!r} mark {r[mi]!r} not rex/proposed/open/history/model/science/searched", file=sys.stderr); bad += 1
                if f.startswith("library/"):
                    if t["columns"][0] not in ("id", "Key") or r[0] in ids:
                        print(f"  {f}.{k}: id column missing or id {r[0]!r} repeats", file=sys.stderr); bad += 1
                    ids.add(r[0])
    return bad


def write_js(data, lib):
    js = ("// Generated by build-body-data.py from body/data/*.json (the game) and the realism library. "
          "Do not edit.\nwindow.BODY_DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    (HERE / "data.js").write_text(js, encoding="utf-8")


if __name__ == "__main__":
    game = load()
    lib = load_library() if LIBRARY.exists() else {}
    if not lib:
        print(f"  library not found at {LIBRARY}", file=sys.stderr)
    layout = load_layout()
    join_problems = [] if lib else [f"library missing or empty at {LIBRARY}"]
    data, moved = join(game, lib, layout, join_problems)
    n = render_docs(data, lib, game, moved, layout, join_problems)
    for p in join_problems:
        print(f"  {p}", file=sys.stderr)
    problems = validate(game, lib) + len(join_problems)
    write_js(data, lib)
    print(f"{len(game)} data files + {len(lib)} library files; {n} docs re-rendered; data.js written; {problems} validation problems")
