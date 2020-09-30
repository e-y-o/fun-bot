<div align="center">
  <h1>Fun Bot</h1>
  <p>
    <img src="./assets/file.png">
  </p>
</div>

## About
Fun Bot is a Discord bot that pulls content from social media platforms and sends them to a Discord channel as an embedded message.

### Platforms
Current:
- Reddit
- Twitter
- Youtube playback

Future:
- More Twitter functions
- More efficient rate limiting/caching?
- Better looking YouTube commands

## Configuration
This bot requires multiple API tokens, stored in a config.json file in the main directory. View sample\_config.json for an example.

## N.B.
Dependencies should all be included in packages.js, however ffmpeg also requires its binaries be installed on the machine hosting the bot.