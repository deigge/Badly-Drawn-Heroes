<h1 align="center">Badly Drawn Hero</h1>
<p align="center">
  <img src="./img/normal_enemy/sprites/enemy_idle_frame_2.png" width="400">
</p>

A small browser game built with JavaScript and HTML5 Canvas.

## Goal

Choose a map and fight your way through a sequence of levels:

- **Normal levels**: Fight one or two randomly selected enemies.
- **Boss levels**: Face off against a stronger boss enemy.
- **Recovery levels**: A breather with no enemies, where you can heal up.

Defeat all enemies on your chosen map to complete it successfully. If your character dies beforehand, the game is over. You earn points for completed attacks and levels; at the end, your score is compared to the saved high score and updated if needed.

## Controls

**Map selection:**

| Action              | Key         |
| ------------------- | ----------- |
| Move selection up   | Arrow key ↑ |
| Move selection down | Arrow key ↓ |
| Confirm map         | Enter       |

**During combat:** Choose an action via the buttons:

| Action           | Effect                                                |
| ---------------- | ----------------------------------------------------- |
| **Light Attack** | Deals damage to the current enemy                     |
| **Heavy Attack** | Deals significantly more damage                       |
| **Block**        | Reduces the damage taken from the enemy's next attack |
| **Heal**         | Restores health points                                |

After selecting an action, you're shown a template that you must trace with the mouse within a time limit (timer). The more accurately your drawing matches the template, the stronger the effect of the action (damage, healing, or block strength).

In **recovery levels**, you can instead heal via a dedicated button before continuing.

## How actions are scored

When you draw, your drawing is compared to the template: how much of the template did you actually cover, and how much of what you drew fell inside the template? These two values are combined into an overall score, which is mapped to one of four tiers:

| Accuracy       | Effect      |
| -------------- | ----------- |
| Very accurate  | 100% effect |
| Good           | 75% effect  |
| Mediocre       | 50% effect  |
| Inaccurate     | 25% effect  |
| Missed / empty | No effect   |

The tier determines how strong the chosen action turns out to be — for an attack, this means the damage dealt; for blocking, the damage reduction; and for healing, the health restored. For light and heavy attacks, accuracy also contributes to your score.

## Rich media components used

- **Animated sprites**: Characters (player, normal enemies, boss enemies, attacks) are animated via spritesheets. Frames are read from accompanying JSON files and grouped so that different animations (e.g. idle, attack) can be played.
- **Drawing minigame**: Combat actions (attack, block, heal) are triggered via a draw canvas: the player traces a given template within a time limit. How closely the drawing matches the template determines the strength of the effect.
- **Background music**: Each level type (normal, boss, recovery) as well as the victory and defeat scenes play matching music.
- **Sound effects**: Short sounds accompany interactions such as changing selections or confirming choices.
- **Static graphics**: Level backgrounds and victory/defeat screens are displayed as images, matched to the current level type.
- **Loading screen with progress indicator**: Before the game starts, all critical assets (images, spritesheets) are loaded and verified. A progress bar shows loading progress; the game can only be started via a start button once all assets have loaded successfully. If loading fails, an error message is displayed.

## High score

Your high score is stored locally in the browser (`localStorage`) and persists across restarts of the game. After each completed run, the current score is compared to the existing high score; if it's higher, it overwrites the saved value.

## Running the game

**Option 1: Docker (recommended)**

A simple `docker-compose.yml` is provided in the `docker/` folder, running an Apache web server that serves the project.

```bash
cd docker
docker compose up -d
```

The game will then be available at [http://localhost:8080](http://localhost:8080).

For Windows users, the `docker/` folder also contains helper scripts:

| Script        | Purpose                                                   |
| ------------- | --------------------------------------------------------- |
| `start.bat`   | Starts the container and opens the game in your browser   |
| `stop.bat`    | Stops the container                                       |
| `restart.bat` | Restarts the container and opens the game in your browser |
| `status.bat`  | Shows whether the container is running                    |
| `logs.bat`    | Shows live container logs (Ctrl+C to exit)                |

**Option 2: Any local web server**

1. Clone the repository or download the files.
2. Open `index.html` via a local web server (e.g. using the VS Code Live Server extension), since the game fetches assets via `fetch`, which doesn't work reliably over `file://`.

## Technologies

- Vanilla JavaScript
- HTML5 Canvas for rendering
- `localStorage` for high score persistence
- Docker / Apache (`httpd`) for local hosting
