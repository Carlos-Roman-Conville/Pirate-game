namespace Archive.Engine.Core;

/// <summary>One throw: each die's face (1..Sides; for two-sided pieces 1 = blank, 2 = marked) and what it counts as.</summary>
public sealed record Throw(int[] Faces, int Value);

/// <summary>
/// A kind of throw (d6, Ur's tetrahedral dice, Senet's throw sticks, Pachisi's cowries) and its probability table, so
/// the AI's expectiminimax averages over exact odds without touching the game's live stream. Every die is drawn from
/// a named <see cref="Rng"/> stream, so a throw replays from the seed, and a test forces faces with
/// <c>Rng.ForceDice(stream, faces…)</c> using the same 1-based faces as <see cref="Throw.Faces"/>.
/// Two-sided pieces are taken as fair (half the time each side); a game that weights them (real cowries aren't fair)
/// records that as a D-row and builds its own table with <see cref="Custom"/>.
/// Board kit (_template/board-kit, TRADITIONAL_GAMES.md §5.1), after Ur's UrDice and Senet's SeSticks; copied into the
/// game when it was stamped and the game's own from then on.
/// </summary>
public sealed class Dice
{
    public string Name { get; }
    public int Count { get; }
    public int Sides { get; }
    readonly Func<int[], int> _value;

    /// <summary>Each value the throw can count as, with its chance, values ascending; chances sum to 1.</summary>
    public IReadOnlyList<(int Value, double P)> Odds { get; }

    Dice(string name, int count, int sides, Func<int[], int> value, IReadOnlyList<(int, double)>? odds = null)
    {
        if (count < 1 || sides < 2) throw new ArgumentException("at least one die of two sides");
        Name = name;
        Count = count;
        Sides = sides;
        _value = value;
        Odds = odds ?? Enumerate();
    }

    /// <summary><paramref name="count"/> six-sided dice counting their sum (or any other sides).</summary>
    public static Dice D6(int count = 1, int sides = 6) => new($"{count}d{sides}", count, sides, f => f.Sum());

    /// <summary>Two-sided pieces counting the marked sides up, 0..count (Ur's four tetrahedra: 1, 4, 6, 4, 1 in 16).</summary>
    public static Dice Binary(int count) => new($"{count} binary", count, 2, Marked);

    /// <summary>Throw sticks: the marked sides up, except none up counts <paramref name="blankValue"/> (Senet: 5 or 6).</summary>
    public static Dice Sticks(int count, int blankValue) =>
        new($"{count} sticks", count, 2, f => Marked(f) is var n && n == 0 ? blankValue : n);

    /// <summary>Cowrie shells: the number with mouths up mapped to a move by the game's table (Pachisi).</summary>
    public static Dice Cowries(int count, Func<int, int> valueOfMouthsUp) =>
        new($"{count} cowries", count, 2, f => valueOfMouthsUp(Marked(f)));

    /// <summary>Any throw with a hand-made table (weighted pieces, a rule that rerolls): the faces still come from the stream.</summary>
    public static Dice Custom(string name, int count, int sides, Func<int[], int> value, IReadOnlyList<(int Value, double P)> odds)
    {
        if (Math.Abs(odds.Sum(o => o.P) - 1) > 1e-9) throw new ArgumentException("chances must sum to 1");
        return new(name, count, sides, value, odds);
    }

    static int Marked(int[] faces) => faces.Count(f => f == 2);

    /// <summary>Throws from the stream: one draw per die, in order.</summary>
    public Throw Roll(Rng.RngStream stream)
    {
        var faces = new int[Count];
        for (var i = 0; i < Count; i++) faces[i] = stream.Die(Sides);
        return new Throw(faces, _value(faces));
    }

    /// <summary>What these faces count as (for a forced or shown throw).</summary>
    public int ValueOf(int[] faces) => _value(faces);

    /// <summary>The chance of a value; 0 when the throw can't make it.</summary>
    public double P(int value)
    {
        foreach (var (v, p) in Odds) if (v == value) return p;
        return 0;
    }

    /// <summary>Every face combination, equally likely, folded into values.</summary>
    List<(int, double)> Enumerate()
    {
        var total = Math.Pow(Sides, Count);
        if (total > 1_000_000) throw new ArgumentException("too many combinations to enumerate; pass a table to Custom");
        var counts = new SortedDictionary<int, long>();
        var faces = Enumerable.Repeat(1, Count).ToArray();
        while (true)
        {
            var v = _value(faces);
            counts[v] = counts.GetValueOrDefault(v) + 1;
            var i = 0;
            while (i < Count && faces[i] == Sides) faces[i++] = 1;
            if (i == Count) break;
            faces[i]++;
        }
        return counts.Select(kv => (kv.Key, kv.Value / total)).ToList();
    }
}
