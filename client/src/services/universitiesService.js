import { request } from './api';

export async function getUniversities(mode = '1', userId = null) {
    const url = userId
        ? `/api/institutions?mode=${mode}&userId=${userId}`
        : `/api/institutions?mode=${mode}`;
    return request(url);
}

export async function getUniversity(id, userId = null) {
    const url = userId
        ? `/api/institutions/${encodeURIComponent(id)}?userId=${userId}`
        : `/api/institutions/${encodeURIComponent(id)}`;
    return request(url);
}
