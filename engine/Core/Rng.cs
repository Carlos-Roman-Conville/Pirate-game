namespace Archive.Engine.Core;

/// <summary>
/// Named, independent random streams (the same design as games/card-classics and ygo-progression). Each stream's seed
/// comes from the game seed and the stream's name, so streams are created on first use in any order, and adding a
/// consumer never changes another's sequence: a game replays exactly from its seed and the players' moves.
/// Modules name their own streams (as constants in their own namespace); nothing here is game-specific.
/// </summary>
public sealed class Rng
{
    readonly int _seed;
    readonly Dictionary<string, StreamState> _streams;

    internal sealed class StreamState(int seed)
    {
        public int Seed { get; } = seed;
        public int Position { get; set; }
        /// <summary>Values handed out before the stream's own (tests only; see <see cref="Rng.ForceDice"/>).</summary>
        public Queue<int> Forced { get; } = new();
    }

    public int Seed => _seed;

    public Rng(int seed) : this(seed, new Dictionary<string, StreamState>(StringComparer.Ordinal)) { }

    Rng(int seed, Dictionary<string, StreamState> streams)
    {
        _seed = seed;
        _streams = streams;
    }

    /// <summary>Stable across processes and platforms (FNV-1a over the UTF-8 name, mixed with the seed).</summary>
    public static int CombineSeed(int seed, string streamName)
    {
        unchecked
        {
            var h = 2166136261u;
            foreach (var b in System.Text.Encoding.UTF8.GetBytes(streamName))
            {
                h ^= b;
                h *= 16777619u;
            }
            h ^= (uint)seed;
            h *= 16777619u;
            h ^= h >> 15;
            return (int)h;
        }
    }

    public RngStream Stream(string name)
    {
        if (string.IsNullOrEmpty(name)) throw new ArgumentException("stream name required", nameof(name));
        if (!_streams.TryGetValue(name, out var state))
            _streams[name] = state = new StreamState(CombineSeed(_seed, name));
        return new RngStream(state);
    }

    /// <summary>
    /// For tests: the next die rolls from a stream will be these faces (1..sides), in order, before the stream goes
    /// back to its own sequence. Forced rolls don't advance the stream.
    /// </summary>
    public void ForceDice(string name, params int[] faces)
    {
        var state = StateOf(name);
        foreach (var f in faces) state.Forced.Enqueue(f - 1);
    }

    /// <summary>How many forced values a stream still holds (tests check they were all used).</summary>
    public int ForcedLeft(string name) => StateOf(name).Forced.Count;

    StreamState StateOf(string name)
    {
        Stream(name);
        return _streams[name];
    }

    /// <summary>An independent copy (for AI look-ahead): same streams, same positions.</summary>
    public Rng Clone()
    {
        var copy = new Dictionary<string, StreamState>(StringComparer.Ordinal);
        foreach (var (k, v) in _streams)
        {
            var c = new StreamState(v.Seed) { Position = v.Position };
            foreach (var f in v.Forced) c.Forced.Enqueue(f);
            copy[k] = c;
        }
        return new Rng(_seed, copy);
    }

    public readonly struct RngStream
    {
        readonly StreamState _state;

        internal RngStream(StreamState state) => _state = state;

        /// <summary>A value in [0, upperExclusive).</summary>
        public int Next(int upperExclusive)
        {
            if (upperExclusive <= 0)
                throw new ArgumentOutOfRangeException(nameof(upperExclusive));
            if (_state.Forced.TryDequeue(out var forced))
            {
                if (forced < 0 || forced >= upperExclusive) throw new InvalidOperationException($"forced value {forced + 1} doesn't fit 1..{upperExclusive}");
                return forced;
            }
            return (int)(NextUInt31() % (uint)upperExclusive);
        }

        /// <summary>A die roll: 1..sides.</summary>
        public int Die(int sides) => Next(sides) + 1;

        public void Shuffle<T>(IList<T> list)
        {
            for (var i = list.Count - 1; i > 0; i--)
            {
                var j = Next(i + 1);
                (list[i], list[j]) = (list[j], list[i]);
            }
        }

        /// <summary>Counter-based: hash(seed + position · golden ratio) with the lowbias32 mixer.</summary>
        uint NextUInt31()
        {
            var pos = _state.Position++;
            unchecked
            {
                var x = (uint)_state.Seed + (uint)pos * 0x9E3779B9u;
                x ^= x >> 16;
                x *= 0x7feb352du;
                x ^= x >> 15;
                x *= 0x846ca68bu;
                x ^= x >> 16;
                return x & 0x7FFFFFFF;
            }
        }
    }
}
