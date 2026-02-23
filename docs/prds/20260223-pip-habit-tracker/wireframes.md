# Pip Habit Tracker - Wireframes & Conceptual Design

## Design Rationale
In keeping with Pip's "Whimsical Gothic Tech" and "PixelGrim" aesthetic, the habit tracker leans heavily into the terminal/retro-gaming vibe. 
- **The "Vitality" System**: Instead of generic points, users accumulate "Vitality" (positive habits) or inflict "Drain" (negative habits).
- **Date Range & History**: Adheres to the user's preference for historical backfilling and standard ranges (7, 30, 90 days).
- **Responsive Layout**: The dashboard uses a CSS Grid/Flex layout that collapses gracefully from a multi-column desktop view to a stacked mobile view.

---

## Concept 1: The Main Dashboard (Today's View)

This is the primary view users see when interacting with the habit tracker. It integrates with the existing system but adds a dedicated tracked items section.

### Desktop Layout
```text
+-----------------------------------------------------------------------------+
|  [Pip Logo]   /capture   /vault   /habits                     [User] [⚙️] |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [VITALITY: 84 / 100] [||||||||||||||||||......]   CURRENT STREAK: 12 Days  |
|                                                                             |
|  +-----------------------------------+  +--------------------------------+  |
|  | TODAY'S RITUALS (Thu, Feb 23) [<] [>]|  MASCOT STATUS               |  |
|  |-----------------------------------|  |                                |  |
|  | [+] Daily Walk           [x] (+1) |  |        (\__/)                  |  |
|  | [-] Junk Food            [ ] (-1) |  |        (o^.^)    *glowing*     |  |
|  | [+] Reading              [x] (+1) |  |        z(_(")(")                 |  |
|  | [+] Meditation           [ ] (+1) |  |                                |  |
|  |                                   |  | "Your spirit burns bright."    |  |
|  | [ + Add New Ritual ]              |  +--------------------------------+  |
|  +-----------------------------------+                                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Mobile Layout
```text
+-------------------------+
| [=] Pip         [User]  |
+-------------------------+
| VITALITY: 84            |
| [||||||||||||.....]     |
| Streak: 12 Days         |
+-------------------------+
| TODAY (Feb 23)  [<] [>] |
+-------------------------+
| [+] Walk        [x] (+1)|
| [-] Junk Food   [ ] (-1)|
| [+] Reading     [x] (+1)|
| [+] Meditation  [ ] (+1)|
| [ + Add Ritual ]        |
+-------------------------+
| (\__/)                  |
| (o^.^)                  |
| "Spirit burns bright"   |
+-------------------------+
```

---

## Concept 2: Add / Edit Habit Modal (The "New Ritual")

When a user clicks "Add New Ritual" or edits an existing one.

```text
+-----------------------------------------------------+
| INSCRIBE NEW RITUAL                             [X] |
+-----------------------------------------------------+
|                                                     |
| Name:                                               |
| [ e.g., Read 10 Pages...........................]   |
|                                                     |
| Nature of Ritual:                                   |
| (O) Light (Increase/Positive)                       |
| ( ) Void  (Decrease/Negative)                       |
|                                                     |
| Impact:                                             |
| [x] Standard (+1 / -1)                              |
|                                                     |
| [ CANCEL ]                           [ INSCRIBE ]   |
+-----------------------------------------------------+
```

---

## Concept 3: Trends & Oracles (Data Correlation)

A dedicated section for users to view standard date ranges (7, 30, 90 days) and explore how their habits interact.

```text
+-----------------------------------------------------------------------------+
|  ORACLE OF TRENDS                                                           |
+-----------------------------------------------------------------------------+
|  Range: [ Past 7 Days ] [ Past 30 Days ] [ Past 90 Days ]                   |
|                                                                             |
|  Compare: [ [+] Daily Walk (v) ]  with  [ [-] Junk Food (v) ]               |
|                                                                             |
|  [ VITALITY CHARGING ] (Overlay Graph)                                      |
|    |                                                                        |
|  W |    *               *                       <-- Walk (Positive)         |
|  A |   / \             / \                                                  |
|  L |  /   *-----------*   \       *                                         |
|  K | *                     \     / \                                        |
|    |                        \   /   *                                       |
|  --+-------------------------*-*--------------------------------            |
|    |                          *                                             |
|  J | *---------*                           *    <-- Junk Food (Negative)    |
|  U |            \                         /                                 |
|  N |             *-----------*-----------*                                  |
|  K |                                                                        |
|    +--------------------------------------------------------------------    |
|      1   2   3   4   5   6   7   8   9   10  (Days)                         |
|                                                                             |
|  Insight: When [Daily Walk] is missed, [Junk Food] occurrences rise by 40%. |
+-----------------------------------------------------------------------------+
```
