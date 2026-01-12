const KEY = "uni_matches_v1";

export function getMatches() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
        return [];
    }
}

export function addMatch(university) {
    const current = getMatches();
    if (current.some((u) => u.id === university.id)) return current;

    const updated = [university, ...current];
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
}

export function removeMatch(universityId) {
    const current = getMatches();
    const updated = current.filter((u) => u.id !== universityId);
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
}

export function clearMatches() {
    localStorage.removeItem(KEY);
}
