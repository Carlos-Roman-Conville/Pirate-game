// Rules help inside the game: the rules as played here, in plain words, from files/pirate-ship/RULES.md. Name the variant
// each option picks and say where sources differ. Placeholder text for the placeholder game; replace it.

export function Rules({ onBack }: { onBack: () => void }) {
  return (
    <div className="pirate-ship-rules">
      <h1>How to play Pirate Ship</h1>
      <p>Two players take turns placing a piece on an empty point.</p>
      <p>The first to fill a line of three (across, up and down, or corner to corner) wins. If the board fills with no
        line, the game is a draw.</p>
      <h2>Playing here</h2>
      <p>The points you may play are ringed. Undo takes back your last move and the computer's reply. With reduced motion
        set on your device, pieces fade in instead of moving.</p>
      <button onClick={onBack}>Back</button>
    </div>
  )
}
