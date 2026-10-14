# Ludo Buddy

A colorful, pass-and-play take on the classic cross-shaped board game — roll the dice, race your four coins around the board, and get them all home before everyone else.

Ludo Buddy is a browser version of traditional Ludo for 2 to 4 players sharing one screen. Each player controls four coins that start locked in their colored home base, and the goal is to roll them out, march them all the way around the shared track, up your own private home stretch, and into the center before your rivals do. Along the way you can send opponents' coins back to their base by landing on them, and the board keeps track of turns, captures, and finishes automatically — you just click the dice and click your coins.

## How to Play

1. **Rename players (optional).** Each of the four colored home corners has an editable nickname label (it starts as "Player 1", "Player 2", etc.). Click directly on a name and type to personalize it — press **Enter** or click elsewhere to confirm. Names are capped at 10 characters.
2. **Take turns.** Play always starts with Player 1 (red). The active player's home corner gently pulses to show whose turn it is, and the 3D dice in the center of the board changes color to match the current player.
3. **Roll the dice.** Click the dice cube in the middle of the board to roll it. It spins through a short animation and lands on a number from 1 to 6.
4. **Move a coin.** After rolling, any coin you're allowed to move will glow and pulse. Click one of the glowing coins to move it forward by the number you rolled. If nothing on the board is eligible to move, the game tells you so and automatically passes the turn to the next player after a moment.
5. **Get a coin out.** A coin sitting in your home base can only enter the board when you roll exactly a **6**.
6. **Race to the finish.** Keep rolling and moving until all four of your coins complete the full lap and reach your home triangle. The game then ranks players 1st, 2nd, and 3rd as they finish, and continues until every player has finished all four coins.

## Rules

- **The board:** Coins travel around a long shared track that loops past all four home bases, then peel off into a short private "home stretch" of colored squares that only that player's coins can use, before reaching the finish.
- **Exact count to finish:** You must land exactly on the final home square — if your roll would overshoot it, that coin simply isn't offered as a valid move for that roll.
- **Rolling a 6:** Besides being required to bring a coin out of home, rolling a 6 also earns you an extra roll — your turn doesn't pass to the next player.
- **Capturing:** Land a coin on a square occupied by an opponent's coin (or coins) and you send it/them all the way back to their home base to start over. Capturing an opponent also earns you an extra roll, on top of moving forward.
- **Safe squares:** Certain squares — marked with a small star — are safe zones where coins of any color can sit together without being captured. Every player's starting square is one of these safe squares, so a freshly-entered coin can't be captured immediately. The private home-stretch squares near the finish are also automatically safe, since only that player's own coins can ever be there.
- **Stacking coins:** More than one of your own coins can occupy the same square at once — the square shows a small number for how many coins are stacked there. Note that stacking does *not* protect you from capture on a normal (non-safe) square; an opponent landing there still sends every coin on that square home, no matter how many are stacked.
- **Shared squares:** If coins from different players end up on the same safe square, that square displays a small pie-style ring colored proportionally to show whose coins are present.
- **No valid move:** If the number you rolled can't be used by any coin (for example, you rolled a 5 but have no coins on the board and none can leave home), the roll is wasted and the turn passes automatically.
- **Bonus rolls stack:** Rolling a 6, capturing a coin, and completing a coin (getting it all the way home) each grant you another roll before your turn ends — so a single turn can sometimes chain into several rolls and moves in a row.
- **Finishing a coin:** When one of your four coins completes the full journey, its home slot fills in with a checkmark. Getting a coin all the way home also grants an extra roll.
- **Winning and ranking:** The moment a player gets all four coins home, they're awarded a rank — 1st, 2nd, or 3rd (shown as a ribbon badge across their home corner). Play keeps going for the remaining players until everyone has finished; the game only fully ends ("ALL DONE") once all four players have completed all their coins, at which point the dice can no longer be rolled.

## Controls

- **Roll:** Click the 3D dice cube in the center of the board.
- **Move a coin:** Click a highlighted/glowing coin — either one already on the track or one waiting in your home base.
- **Edit a nickname:** Click the name text under a player's home base and type; Enter or clicking away confirms the new name.
- Clicking a coin that isn't currently playable, isn't yours, or has no valid move for the current roll pops up a short message explaining why, so you always know what went wrong.

## Saving, Resuming & Sharing

- **Automatic save:** Your game progress (whose turn it is, every coin's position, and current rankings) is saved to your browser automatically after every move — no manual saving needed.
- **Resume on reload:** If you reopen Ludo Buddy while a saved game exists, it asks "We found a saved data on your system. Do you want to load and start playing from last saved progress?" Choose **Yes** to pick up exactly where you left off, or **No** to start fresh.
- **Share Progress:** Click the paper-plane icon in the top bar at any time to copy a link that encodes the exact current board state to your clipboard. Send that link to continue the same match on another device or browser, or to hand the game off to someone else.
  - Hold **Shift** while clicking Share Progress to also bake your custom player nicknames into the link, so they carry over when the link is opened.

## Visual Effects

- The dice rolls with a realistic 3D tumbling animation before settling on its result.
- Coins slide smoothly across the board as they move, rather than jumping instantly, so it's easy to follow which coin went where.
- Landing on a coin and sending it home, finishing a coin, and winning the game all trigger a burst of colorful confetti in the players' colors.
- The active player's home base has a subtle glowing pulse, and any coin you're allowed to move pulses and glows in your color so it's obvious what's clickable.
- If your system is set to reduce motion, the coin-sliding animation is automatically skipped.
- The board and dice scale down neatly for tablet and mobile-sized screens.

## Customization

The gear/settings icon in the top bar opens **Settings**, where you can:

- Switch between **Light** and **Dark** theme.
- Choose an **accent color** from several swatches to change the app's UI highlight color (this affects buttons and interface chrome — the four player colors on the board itself stay fixed red, green, yellow, and blue so coins are always easy to tell apart).

Your theme and accent choices are remembered automatically the next time you open the app.

## Tips

- Getting your first coin out requires a 6, so early turns can feel slow if you're not rolling one — but every 6 also gives you another roll immediately, so a lucky roll can snowball into getting multiple coins out in the same turn.
- Sitting on a star-marked safe square (including your own starting square) is the only way to be completely protected from capture — everywhere else, even a stack of your own coins can be wiped out in one hit.
- Since capturing an opponent earns you a bonus roll, an aggressive move that also lands a hit is almost always worth taking over a purely defensive one.
- You need an exact roll to bring a coin home, so as a coin nears the finish, watch out for rolls that are too high — that coin simply won't be selectable until you roll the right number, so move a different coin instead.
- The match isn't over the instant someone finishes all four coins — 1st, 2nd, and 3rd place are awarded as players complete, but the remaining player(s) keep playing until everyone has finished.
- If you want to save a snapshot of an interesting moment (or just keep a backup), use Share Progress to copy a link — opening that link later reloads the board exactly as it was, coin-for-coin.
