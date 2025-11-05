# Universal Streaming Framework Plugin for GrayJay

> **⚠️ NOTICE: This repository is now archived.**  
> **Please use the [S.to-like Framework Generator](https://grayjay-sources.github.io/grayjay-source-sto-like/) to create custom plugins for Aniworld, S.to, or any other compatible German streaming site!**
> 
> The generator provides:
> - ✨ Easy custom plugin creation via web interface
> - 📱 QR code generation for instant mobile setup
> - 🎯 Support for any S.to/Aniworld-compatible site
> - 💾 Downloadable config files
> 
> **[Visit Generator →](https://grayjay-sources.github.io/grayjay-source-sto-like/)**

---

This plugin provides support for **Aniworld.to** - a German anime streaming platform.

For the S.to TV series plugin, see: [grayjay-source-sto](https://github.com/grayjay-sources/grayjay-source-sto)

## Architecture

Both sites share the same HTML structure and URL patterns, differing only in:
1. Base domain (aniworld.to vs s.to)
2. Content type path (`/anime/` vs `/serie/`)

### Common URL Structure

```
/{content-type}/stream/{title-slug}/staffel-{season}/episode-{episode}
```

Examples:
- Aniworld: `https://aniworld.to/anime/stream/one-punch-man/staffel-3/episode-1`
- S.to: `https://s.to/serie/stream/alien-earth/staffel-1/episode-1`

## Features

- ✅ Search functionality
- ✅ Series/Anime browsing as channels
- ✅ Episode listings with season support
- ✅ Multiple language and hoster support
- ✅ Content metadata extraction
- ✅ Home page featured content

## File Structure

```
grayjay-sources-grayjay-source-aniworld/
├── AniworldConfig.json       # Config for Aniworld.to
├── AniworldScript.js         # Script for Aniworld.to
├── AniworldIcon.png          # Icon for Aniworld.to
├── README.md                 # This file
├── QUICK_START.md            # Quick start guide
├── FRAMEWORK_COMPARISON.md   # Framework comparison docs
└── .research/                # Research data (HAR files)
```

## Adding Support for Similar Sites

If you encounter another site using this framework (common with German streaming sites), you can easily add support:

### 1. Create Configuration File

Copy `AniworldConfig.json` or `StoConfig.json` and modify:

```json
{
  "name": "YourSite",
  "description": "Your site description",
  "platformUrl": "https://yoursite.com",
  "scriptUrl": "./YourSiteScript.js",
  "id": "yoursite-unique-id",
  "allowUrls": ["yoursite.com"]
}
```

### 2. Create Script File

Copy either `AniworldScript.js` or `StoScript.js` and change only these constants:

```javascript
const PLATFORM = "YourSite";
const BASE_URL = "https://yoursite.com";
const CONTENT_TYPE = "serie"; // or "anime" or whatever the site uses
```

### 3. Add Icon

Add `YourSiteIcon.png` (recommended: 192x192 PNG)

## Technical Details

### Supported Hosters

- VOE
- Doodstream
- Vidoza
- Streamtape
- Vidmoly

### Supported Languages

- German (Deutsch)
- German Subtitles
- English
- English Subtitles
- Japanese
- Japanese Subtitles

### HTML Selectors Used

The plugin looks for these common elements:
- `.series-title h1` - Series title
- `p.seri_des` - Series description
- `.seriesCoverBox img` - Cover image
- `table.seasonEpisodesList tbody tr` - Episode list
- `ul.row li` - Hoster/stream links
- `div.changeLanguageBox img` - Language options

## Known Limitations

- No video playback support yet (hosters need individual handling)
- No comment support
- Limited metadata (views, ratings not available from HTML)
- Authentication not fully tested

## Development Notes

### Key Differences Between Sites

| Feature | Aniworld.to | S.to |
|---------|-------------|------|
| Content Type | anime | serie |
| Max Seasons Checked | 10 | 20 |
| Language Focus | Japanese/German/English | German/English |

### Error Handling

The script includes try-catch blocks around all major functions to prevent crashes. Errors are logged via `log()` function.

### Future Improvements

- [ ] Add actual video source extraction
- [ ] Support for playlists/favorites
- [ ] User authentication
- [ ] Better thumbnail extraction
- [ ] Metadata like views, ratings, release dates
- [ ] Episode descriptions
- [ ] Genre filtering
- [ ] More robust DOM parsing for layout variations

## Testing

To test the plugin:

1. Load the config file in GrayJay
2. Try searching for a popular series/anime
3. Browse to a series page (channel)
4. View episode list
5. Click on an episode

## Contributing

Feel free to:
- Add support for more sites using this framework
- Improve HTML parsing for edge cases
- Add missing features
- Report bugs

## Related Projects

- [S.to Plugin](https://github.com/Bluscream/grayjay-source-sto) - For German TV series (uses same framework)

## Credits

- **Zerophire** - Original concept
- **Bluscream** - Framework development and implementation  
- **Cursor.AI** - AI-assisted development
- Based on GrayJay plugin architecture

## License

Check the repository for license information.
