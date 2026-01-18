const LIKES_KEY = "uni_likes_v1";

export function getLikes() {
    try {
        return JSON.parse(localStorage.getItem(LIKES_KEY)) || [];
    } catch {
        return [];
    }
}

export function addLike(university) {
    const current = getLikes();
    if (current.some((u) => u.id === university.id)) return current;
    const updated = [university, ...current];
    localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
    return updated;
}

export function removeLike(universityId) {
    const current = getLikes();
    const updated = current.filter((u) => u.id !== universityId);
    localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
    return updated;
}

export function clearLikes() {
    localStorage.removeItem(LIKES_KEY);
}
