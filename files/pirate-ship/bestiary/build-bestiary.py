"""Build bestiary.json from ENTRIES.md.

ENTRIES.md is the source of truth (a human-readable table per tradition). This script turns every
ten-column row into one JSON object so the engine and the journal can read the same data. Run from
anywhere:

    python build-bestiary.py

It rejects duplicate ids and unknown provenance labels (the journal's eight, JOURNAL.md §1), and
prints the row count per section so the Counts table in ENTRIES.md can be checked against it.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "ENTRIES.md"
OUT = HERE / "bestiary.json"

LABELS = {
    "Historical", "Time Anomaly", "Prehistoric", "Mythological", "Fantasy",
    "Science Fiction", "Original Fiction", "Unknown",
}
FIELDS = ["id", "name", "class", "provenance", "period_or_tradition", "home",
          "faction", "role", "status", "source"]
HEADER = "| id | name | class | provenance | period / tradition | home | faction | role | status | source |"


def split_row(line: str):
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    return cells


def parse_labels(cell: str):
    # "Mythological (open: Time Anomaly)" -> labels ["Mythological"], note kept in provenance_note
    note = ""
    m = re.search(r"\((.*)\)", cell)
    if m:
        note = m.group(1).strip()
        cell = cell[: m.start()].strip()
    labels = [l.strip() for l in cell.split(";") if l.strip()]
    return labels, note


def parse_status(cell: str):
    s = cell.replace("*", "")
    if s.startswith("Rex"):
        return "Rex"
    if s.startswith("open"):
        return "open"
    return "proposed"


def main() -> int:
    entries = []
    counts = {}
    section = None
    ids = set()
    errors = []
    for line in SRC.read_text(encoding="utf-8").splitlines():
        if line.startswith("## "):
            section = line[3:].strip()
            continue
        if not line.startswith("|") or line.strip() == HEADER or set(line.strip()) <= {"|", "-", " "}:
            continue
        cells = split_row(line)
        if len(cells) != len(FIELDS) or section is None or section.startswith("Counts") or section.startswith("Log"):
            continue
        row = dict(zip(FIELDS, cells))
        if row["id"] in ids:
            errors.append(f"duplicate id {row['id']}")
            continue
        ids.add(row["id"])
        labels, note = parse_labels(row["provenance"])
        bad = [l for l in labels if l not in LABELS]
        if bad:
            errors.append(f"{row['id']}: unknown label(s) {bad}")
        plan_role = row["class"]
        status_mark = parse_status(row["status"])
        entries.append({
            "id": row["id"],
            "name": row["name"],
            "kind": "creature",
            "section": section,
            "class": plan_role,
            "provenance": labels,
            "provenance_note": note,
            "period_or_tradition": row["period_or_tradition"],
            "home": row["home"],
            "faction": row["faction"] if row["faction"] != "-" else None,
            "role": row["role"],
            "status": status_mark,
            "status_detail": row["status"].replace("**", ""),
            "source": row["source"],
        })
        counts[section] = counts.get(section, 0) + 1
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    OUT.write_text(json.dumps({
        "_about": "Built from ENTRIES.md by build-bestiary.py; edit the table, not this file. "
                  "Every entry is proposed unless status is 'Rex'. Labels are JOURNAL.md's eight.",
        "entries": entries,
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for s, n in counts.items():
        print(f"{n:4d}  {s}")
    print(f"{len(entries):4d}  total -> {OUT.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
