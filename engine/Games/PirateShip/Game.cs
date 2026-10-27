using Archive.Engine.Core;

namespace Archive.Engine.Games.PirateShip;

/// <summary>
/// Pirate Ship: the rules engine. A game is its seed, its options and the deciders' answers; it is deterministic and
/// replayed from those on every request (games/CARD_GAMEDEV.md section 4, lobby/TRADITIONAL_GAMES.md §5.2), so there is
/// no save format and every bug reproduces from three values. The rules themselves are pure functions in
/// <see cref="PsRules"/>; this class runs turns, asks deciders, logs events and says what a player may see.
/// The placeholder plays three in a row so a fresh stamp builds, tests and runs end to end; replace it.
/// </summary>
public sealed class PsGame
{
    // Random stream names: constants so a stream is never misspelled into a second one. Dice games throw from DiceStream.
    public const string DiceStream = "Dice";
    public const string AiStream = "Ai";

    readonly IPsDecider[] _deciders;

    public PsOptions Options { get; }
    public PsRules Rules { get; }
    public Rng Rng { get; }
    public EventLog Log { get; } = new();
    public PsPos Pos { get; private set; }
    public int Turn { get; private set; }
    public PsResult? Result { get; private set; }
    /// <summary>Hashes of the positions this game has been in (repetition rules, the AI's draw check).</summary>
    public HashSet<ulong> Seen { get; } = [];
    /// <summary>The decision a human has to answer before the game can go on; null when the game is not waiting.</summary>
    public PsDecision? Waiting { get; private set; }

    public PsGame(PsOptions options, int seed, IPsDecider[] deciders)
    {
        if (deciders.Length != 2) throw new ArgumentException("two seats");
        Options = options;
        Rules = new PsRules(options);
        Rng = new Rng(seed);
        _deciders = deciders;
        Pos = Rules.Start;
        Seen.Add(Rules.Hash(Pos));
        Log.Add(new PsGameStarted(seed, Pos.ToMove));
    }

    /// <summary>Plays until the game ends or a human must answer (<see cref="Waiting"/> is then set).</summary>
    public void RunUntilInput()
    {
        Waiting = null;
        try
        {
            while (Result is null) PlayTurn();
        }
        catch (PsNeedInput need)
        {
            Waiting = need.Decision;
        }
    }

    void PlayTurn()
    {
        var actions = Rules.Actions(Pos);
        var options = actions.Select(a => Rules.Board.Names[a.To]).ToList();
        var pick = Ask(new PsDecision(Pos.ToMove, PsAsk.Place, "Place a piece", options, actions.Select(a => (int)a.To).ToList()));
        var a = actions[pick];
        var mover = Pos.ToMove;
        Pos = Rules.Apply(Pos, a);
        Turn++;
        Seen.Add(Rules.Hash(Pos));
        Log.Add(new PsPlaced(mover, a.To, Rules.Board.Names[a.To]));

        switch (Rules.Outcome(Pos))
        {
            case SearchOutcome.Loss: End(mover, "three in a row", Rules.LineOf(Pos, mover)); break;   // RULING D2
            case SearchOutcome.Draw: End(null, "the board is full", null); break;                     // RULING D3
        }
    }

    /// <summary>Asks the deciding player; the answer is an index into the options. Every choice in the game goes through here.</summary>
    public int Ask(PsDecision d)
    {
        var pick = _deciders[d.Player].Choose(this, d);
        if (pick < 0 || pick >= d.Options.Count) throw new InvalidOperationException($"answer {pick} doesn't fit {d}");
        return pick;
    }

    void End(int? winner, string reason, int[]? line)
    {
        if (Result is not null) return;
        Result = new PsResult(winner, reason);
        Log.Add(new PsGameEnded(winner, reason, line));
    }

    /// <summary>
    /// The state as <paramref name="viewer"/> may see it (null: a spectator). Hidden information (Liar's Dice hands)
    /// is left out here and nowhere else; this placeholder has none. The board's geometry rides along so the screen
    /// draws whatever board the rules build.
    /// </summary>
    public object View(int? viewer = null) => new
    {
        turn = Turn,
        toMove = Pos.ToMove,
        cells = Enumerable.Range(0, Rules.Board.Count)
            .Select(p => (Pos.Mask0 >> p & 1) != 0 ? 0 : (Pos.Mask1 >> p & 1) != 0 ? 1 : -1).ToArray(),
        board = new
        {
            width = Rules.Board.Width,
            height = Rules.Board.Height,
            points = Rules.Board.Coords.Select((c, i) => new { x = c.X, y = c.Y, name = Rules.Board.Names[i] }),
            edges = Rules.Board.Edges.Select(e => new[] { e.A, e.B }),
        },
    };
}
