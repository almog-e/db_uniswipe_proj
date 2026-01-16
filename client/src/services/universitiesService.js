import { request } from './api';

export async function getUniversities(mode = '1', userId = null, offset = 0, limit = 10) {
    let url = `/api/institutions?mode=${mode}&offset=${offset}&limit=${limit}`;
    if (userId) {
        url += `&userId=${userId}`;
    }
    return request(url);
}

export async function getUniversity(id, userId = null) {
    const url = userId
        ? `/api/institutions/${encodeURIComponent(id)}?userId=${userId}`
        : `/api/institutions/${encodeURIComponent(id)}`;
    return request(url);
}
