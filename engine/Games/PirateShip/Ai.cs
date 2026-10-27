using Archive.Engine.Core;

namespace Archive.Engine.Games.PirateShip;

public enum PsLevel { Easy, Medium, Hard }

/// <summary>
/// The computer opponent: a decider built on the board kit's <see cref="Negamax{TPos,TAction}"/>. Levels differ in
/// search depth, node budget and, at easy, a share of deliberate random moves drawn from a stream seeded by the game
/// seed and the position, so a replay repeats them. Never clock-based: the same position always gets the same answer.
/// A dice game uses <see cref="Expectiminimax{TPos,TAction}"/> instead, at even depths (ISSUES I-082).
/// </summary>
public sealed class PsAi(PsLevel level = PsLevel.Medium) : IPsDecider
{
    public PsLevel Level { get; } = level;
    Negamax<PsPos, PsAction>? _search;
    PsRules? _rules;

    (int Depth, long Budget, int MistakePercent) Settings => Level switch
    {
        PsLevel.Easy => (2, 5_000, 10),
        PsLevel.Medium => (4, 50_000, 0),
        _ => (9, 500_000, 0),
    };

    public int Choose(PsGame game, PsDecision d)
    {
        if (d.Options.Count == 1) return 0;
        // A small table (16 bits): the conformance suite runs many games in parallel, each with its own AI.
        if (!ReferenceEquals(_rules, game.Rules)) { _rules = game.Rules; _search = new Negamax<PsPos, PsAction>(game.Rules, ttBits: 16); }
        var (depth, budget, mistakes) = Settings;

        var noise = SearchNoise.For(game.Rng.Seed, game.Rules.Hash(game.Pos), PsGame.AiStream);
        if (mistakes > 0 && noise.Next(100) < mistakes) return noise.Next(d.Options.Count);

        var best = _search!.Best(game.Pos, depth, budget, game.Seen).Best;
        var i = d.Points.ToList().IndexOf(best.To);
        return i < 0 ? 0 : i;
    }
}
