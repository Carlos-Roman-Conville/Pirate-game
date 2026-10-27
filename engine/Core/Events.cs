namespace Archive.Engine.Core;

/// <summary>
/// Something that happened in a game, for the client to animate and for replays. Each module defines its own event
/// records (in its own namespace) implementing this; the server sends them as { type, data } by record name.
/// </summary>
public interface IGameEvent;

/// <summary>
/// An append-only record of a game's events, numbered from 0. Engines add to it as they resolve moves; callers read
/// the events since a point (the server sends each move's new events as one frame).
/// </summary>
public sealed class EventLog
{
    readonly List<IGameEvent> _events = [];

    public int Count => _events.Count;
    public IReadOnlyList<IGameEvent> All => _events;

    public void Add(IGameEvent e) => _events.Add(e);

    public void AddRange(IEnumerable<IGameEvent> events) => _events.AddRange(events);

    /// <summary>The events from index <paramref name="start"/> on (for "what happened since the last frame").</summary>
    public IReadOnlyList<IGameEvent> Since(int start) =>
        start >= _events.Count ? [] : _events.GetRange(start, _events.Count - start);
}
