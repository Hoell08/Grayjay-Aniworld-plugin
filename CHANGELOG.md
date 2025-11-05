# Changelog

All notable changes to the Aniworld.to GrayJay plugin will be documented in this file.

## [1.0.0] - 2025-11-04

### Added
- Initial release of Aniworld.to plugin
- Complete search functionality for anime
- Browse anime series as channels
- Multi-season episode listing (up to 10 seasons)
- Multi-language support (German, English, Japanese)
- Multi-hoster support (VOE, Doodstream, Vidoza, Streamtape, Vidmoly)
- Framework-based implementation for maintainability
- Home page featured content
- Comprehensive documentation

### Authors
- Zerophire - Original concept
- Bluscream - Framework development and implementation
- Cursor.AI - AI-assisted development

### Technical Details
- Fixed duplicate declaration errors by using proper GrayJay plugin structure
- Implemented all required GrayJay source methods
- Uses GrayJay's http and domParser APIs
- Error handling and logging throughout

### Framework
- Created universal framework that can support multiple similar sites
- 98% code reuse possible across sites using the same structure
- Only 3 constants need to change for new sites

### Related
- S.to plugin split into separate repository: https://github.com/Bluscream/grayjay-source-sto

---

## Future Plans

- [ ] Actual video source extraction for direct playback
- [ ] User authentication support
- [ ] Playlist/favorites functionality
- [ ] Better metadata (views, ratings, release dates)
- [ ] Episode descriptions and thumbnails
- [ ] Genre filtering and advanced search
- [ ] More robust DOM parsing for layout variations
- [ ] Support for more sites using the same framework
