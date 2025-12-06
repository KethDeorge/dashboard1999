
# How to Organize Your Music // DeskBoard 1999

The Music Player supports 3 distinct categories. Follow the instructions below to organize your files.

## 1. Directory Structure

Go to your project folder: `public/music`.
You should place your MP3 files here.

```
/public
  /music
    test.mp3
    1.1Morning (Clear).mp3
    1.2Morning · Light Rain.mp3
    ... and so on
```

## 2. Updated File List (Light Music)

Please ensure the following files exist in `public/music` for the **LIGHT** radio channel to work correctly:

*   `1.1Morning (Clear).mp3`
*   `1.2Morning · Light Rain.mp3`
*   `1.3Morning · Heavy Rain.mp3`
*   `1.4Dusk (Clear).mp3`
*   `1.5Dusk · Light Rain.mp3`
*   `1.6Nightfall · Mystery.mp3`
*   `1.7Nightfall · Light Rain.mp3`
*   `1.8Nightfall · Heavy Rain.mp3`
*   `1.9Overcast · Light Rain.mp3`
*   `1.10Overcast · Heavy Rain.mp3`
*   `1.11Overcast · Torrential Rain.mp3`
*   `1.12Overcast · Dense Fog.mp3`
*   `1.13Overcast · Light Snow.mp3`

## 3. Other Categories

*   **OST Tracks:** Add files like `ost_1.mp3`, `ost_2.mp3` and update the code if needed.
*   **Personal:** Add `test.mp3`, `fav_1.mp3`.

## 4. Troubleshooting

If you see `HTTP: 404 (MISSING)` in the SysLog terminal (top right corner of config page), checking the spelling of your filenames. They must match exactly, including spaces and dots.
