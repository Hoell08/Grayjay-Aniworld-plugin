// AniworldScript.js
const baseUrl = "https://aniworld.to";

// Enums
const Hoster = { Unknown: "Unknown", VOE: "VOE", Doodstream: "Doodstream", Vidoza: "Vidoza", Streamtape: "Streamtape" };
const Language = { Unknown: "Unknown", German: "German", English: "English", Japanese: "Japanese" };

// Hilfsfunktionen
function toRelativePath(text) {
    text = text.toLowerCase();
    const replacements = [':', ',', '(', ')', '~', '.', '&', '\'', '+', '!', 'ü', 'ä', 'ö'];
    let result = '';
    let lastWasDash = false;
    for (let c of text) {
        if (replacements.includes(c)) continue;
        if (c === ' ') {
            if (!lastWasDash) { result += '-'; lastWasDash = true; }
            continue;
        }
        if (c === 'ß') { result += 'ss'; lastWasDash = false; continue; }
        result += c;
        lastWasDash = false;
    }
    return result;
}

function toMediaLanguage(text) {
    if (!text || text.length < 15) return { audio: Language.Unknown, subtitle: null };
    const languageData = text.slice(11, -4).split('-').filter(Boolean);
    if (languageData.length === 1) return { audio: toLanguage(languageData[0]), subtitle: null };
    if (languageData.length === 2) return { audio: toLanguage(languageData[0]), subtitle: toLanguage(languageData[1]) };
    return { audio: Language.Unknown, subtitle: null };
}

function toHoster(text) {
    text = text.toLowerCase();
    switch(text) {
        case "voe": return Hoster.VOE;
        case "doodstream": return Hoster.Doodstream;
        case "vidoza": return Hoster.Vidoza;
        case "streamtape": return Hoster.Streamtape;
        default: return Hoster.Unknown;
    }
}

function toLanguage(text) {
    text = text.toLowerCase();
    switch(text) {
        case "german": return Language.German;
        case "english": return Language.English;
        case "japanese": return Language.Japanese;
        default: return Language.Unknown;
    }
}

// HTML-Fetcher
async function fetchHTML(path) {
    const resp = await fetch(baseUrl + path);
    if (!resp.ok) throw new Error(`HTTP request failed: ${resp.status}`);
    const text = await resp.text();
    return new DOMParser().parseFromString(text, "text/html");
}

// Search
async function search(query) {
    const root = await fetchHTML(`/search?q=${encodeURIComponent(query)}`);
    const results = [];
    root.querySelectorAll('li > a').forEach(a => {
        const url = a.getAttribute('href');
        const em = a.querySelector('em')?.textContent;
        results.push({
            title: em,
            url: baseUrl + url
        });
    });
    return results;
}

// Get Series info
async function getSeries(title) {
    const root = await fetchHTML(`/anime/stream/${toRelativePath(title)}`);
    if (root.querySelector(".messageAlert.danger")) throw new Error("Series not found");

    return {
        title: root.querySelector(".series-title h1")?.textContent.trim(),
        description: root.querySelector("p.seri_des")?.getAttribute("data-full-description"),
        bannerUrl: baseUrl + root.querySelector(".seriesCoverBox img")?.getAttribute("data-src"),
        // Optional: genres, actors, year etc. können hier ergänzt werden
    };
}

// Get Episodes
async function getEpisodes(title, season) {
    const root = await fetchHTML(`/anime/stream/${toRelativePath(title)}/staffel-${season}`);
    if (!root) throw new Error("Season not found");

    const episodes = [];
    root.querySelectorAll("table.seasonEpisodesList tbody tr").forEach(tr => {
        episodes.push({
            number: parseInt(tr.querySelector("td a")?.textContent.trim()),
            title: tr.querySelector("td:nth-child(2) strong")?.textContent.trim(),
            hosters: Array.from(tr.querySelectorAll("td:nth-child(3) i")).map(i => toHoster(i.getAttribute("title"))),
            languages: Array.from(tr.querySelectorAll("td:nth-child(4) img")).map(img => toMediaLanguage(img.getAttribute("src")))
        });
    });
    return episodes;
}

// Get Streams
async function getStreams(title, season, number) {
    const root = await fetchHTML(`/anime/stream/${toRelativePath(title)}/staffel-${season}/episode-${number}`);
    if (!root.querySelector("ul.row li")) throw new Error("Episode not found");

    const languageMapping = {};
    root.querySelectorAll("div.changeLanguageBox img").forEach(img => {
        const key = parseInt(img.getAttribute("data-lang-key"));
        languageMapping[key] = toMediaLanguage(img.getAttribute("src"));
    });

    const streams = [];
    root.querySelectorAll("ul.row li").forEach(li => {
        const langKey = parseInt(li.getAttribute("data-lang-key"));
        streams.push({
            videoUrl: baseUrl + li.querySelector("a.watchEpisode")?.getAttribute("href"),
            hoster: li.querySelector("h4")?.textContent.trim(),
            language: languageMapping[langKey] || { audio: Language.Unknown, subtitle: null }
        });
    });
    return streams;
}
