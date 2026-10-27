using Archive.Engine.Core;

namespace Archive.Engine.Tests.Core;

public sealed class CoreTests
{
    [Fact]
    public void Streams_are_independent_of_creation_order()
    {
        var a = new Rng(42);
        var dice = a.Stream("Dice");
        var first = Enumerable.Range(0, 10).Select(_ => dice.Next(1000)).ToList();

        var b = new Rng(42);
        b.Stream("Shuffle").Next(50); // another consumer used first
        var dice2 = b.Stream("Dice");
        Assert.Equal(first, Enumerable.Range(0, 10).Select(_ => dice2.Next(1000)).ToList());
    }

    [Fact]
    public void Clones_continue_where_the_original_was()
    {
        var rng = new Rng(7);
        var s = rng.Stream("S");
        s.Next(10);
        var copy = rng.Clone();
        Assert.Equal(rng.Stream("S").Next(1000), copy.Stream("S").Next(1000));
        Assert.Equal(rng.Stream("S").Next(1000), copy.Stream("S").Next(1000));
    }

    [Fact]
    public void Dice_roll_every_face()
    {
        var d = new Rng(3).Stream("Dice");
        var faces = Enumerable.Range(0, 600).Select(_ => d.Die(6)).ToHashSet();
        Assert.Equal([1, 2, 3, 4, 5, 6], faces.Order());
    }

    sealed record Ping(int N) : IGameEvent;

    [Fact]
    public void The_event_log_reads_back_from_a_point()
    {
        var log = new EventLog();
        log.Add(new Ping(0));
        var mark = log.Count;
        log.AddRange([new Ping(1), new Ping(2)]);
        Assert.Equal([new Ping(1), new Ping(2)], log.Since(mark).Cast<Ping>());
        Assert.Empty(log.Since(log.Count));
    }
}
