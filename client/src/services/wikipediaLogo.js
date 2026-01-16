// Fetch the Wikipedia logo for a university name
export async function fetchWikipediaLogo(uniName) {
    if (!uniName) return getLocalPlaceholder(uniName);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(uniName.replace(/ /g, '_'))}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.originalimage && data.originalimage.source) return data.originalimage.source;
        if (data.thumbnail && data.thumbnail.source) return data.thumbnail.source;
    } catch (e) {
        // ignore
    }
    return getLocalPlaceholder(uniName);
}

// Return a local placeholder image path based on university name hash
export function getLocalPlaceholder(uniName) {
    const count = 9; // Number of placeholder images you add (e.g. fake01.png ... fake09.png)
    let hash = 0;
    for (let i = 0; i < uniName.length; i++) hash = (hash * 31 + uniName.charCodeAt(i)) % count;
    const num = String(hash + 1).padStart(2, '0');
    return `/assets/fake-logos/fake${num}.png`;
}
