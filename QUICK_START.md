# Quick Start: Adding a New Site

This framework makes it trivial to add support for new streaming sites that use the same structure as Aniworld.to and S.to.

## 3-Minute Setup for New Sites

### Step 1: Identify Site Structure (2 minutes)

Visit the site and check if it follows this pattern:

```
https://DOMAIN.COM/CONTENT_TYPE/stream/TITLE/staffel-SEASON/episode-NUMBER
```

Examples:
- ✅ `https://example.to/anime/stream/naruto/staffel-1/episode-1`
- ✅ `https://example.to/serie/stream/friends/staffel-1/episode-1`
- ❌ `https://example.com/watch/123456` (different structure)

### Step 2: Create Your Files (1 minute)

Create three files with your site name:

```
YourSiteName/
├── YourSiteConfig.json
├── YourSiteScript.js
└── YourSiteIcon.png
```

### Step 3: Configuration (30 seconds)

**YourSiteConfig.json:**
```json
{
  "name": "YourSite",
  "description": "Description of your site",
  "platformUrl": "https://yoursite.com",
  "scriptUrl": "./YourSiteScript.js",
  "iconUrl": "./YourSiteIcon.png",
  "id": "yoursite-unique-id-here",
  "allowUrls": ["yoursite.com"]
}
```

### Step 4: Script Configuration (30 seconds)

**YourSiteScript.js:**

Copy either `AniworldScript.js` or `StoScript.js` completely, then change ONLY these 3 lines at the top:

```javascript
const PLATFORM = "YourSite";              // Change this
const BASE_URL = "https://yoursite.com";  // Change this
const CONTENT_TYPE = "serie";             // Change this (anime/serie/film/etc)
```

That's it! The entire rest of the script remains the same.

## Real-World Examples

### Example 1: Aniworld.to (Anime)
```javascript
const PLATFORM = "Aniworld";
const BASE_URL = "https://aniworld.to";
const CONTENT_TYPE = "anime";
```

### Example 2: S.to (TV Series)
```javascript
const PLATFORM = "S.to";
const BASE_URL = "https://s.to";
const CONTENT_TYPE = "serie";
```

### Example 3: Hypothetical Film.to (Movies)
```javascript
const PLATFORM = "Film.to";
const BASE_URL = "https://film.to";
const CONTENT_TYPE = "film";
```

## Quick Test Checklist

After creating your plugin, test these features:

- [ ] Plugin loads without errors in GrayJay
- [ ] Search returns results
- [ ] Clicking a search result opens the series page
- [ ] Episodes are listed
- [ ] Clicking an episode opens episode details

## Common Adjustments

### If episodes don't load:
Check the HTML selectors in `getEpisodesFromSeason()`. The site might use:
- `table.seasonEpisodesList` ← most common
- `div.episodes-list`
- `ul.episode-list`

### If series info doesn't load:
Check the HTML selectors in `getSeriesInfo()`. The site might use:
- `.series-title h1` ← most common
- `h1.title`
- `.show-title`

### If search doesn't work:
Check the search URL pattern. Most use:
- `/search?q=QUERY` ← most common
- `/suche?q=QUERY`
- `/s?q=QUERY`

## Debugging Tips

Add logging to see what's happening:

```javascript
function getSeriesInfo(titlePath) {
  try {
    log("Fetching series info for: " + titlePath);  // Add this
    const dom = fetchHTML(`/${CONTENT_TYPE}/stream/${titlePath}`);
    // ... rest of code
```

## Framework Detection

To check if a site uses this framework, look for these signs:

1. **URL Structure:** `/TYPE/stream/TITLE/staffel-N/episode-N`
2. **German Language:** Page is in German (staffel = season)
3. **Multiple Hosters:** Shows multiple video hosters (VOE, Vidoza, etc.)
4. **Language Options:** German/English/Japanese audio/subtitle options
5. **Similar Layout:** Similar to aniworld.to or s.to

## Need Help?

1. Check the HAR file examples in `.research/` folder
2. Compare your site's HTML with aniworld.to
3. Look at the console logs in GrayJay developer tools
4. Test with simple search queries first

## Performance Notes

- First load fetches up to 10-20 seasons (configurable)
- Each season makes 1 HTTP request
- Search makes 1 HTTP request
- Home page makes 1 HTTP request

## What This Framework Provides

✅ **Out of the box:**
- Search
- Browse series/channels
- Episode listing
- Multi-season support
- Multiple language support
- Multiple hoster support
- Error handling
- Logging

❌ **Not included:**
- Actual video playback (requires hoster-specific code)
- User authentication
- Comments
- Ratings/views
- Recommendations

## Contributing Your Plugin

If you create a plugin for a new site, consider:
1. Testing it thoroughly
2. Creating an icon (192x192 PNG)
3. Writing a brief description
4. Sharing it with the community

---

**Remember:** The beauty of this framework is that you only change 3 lines for a new site! 🎉
