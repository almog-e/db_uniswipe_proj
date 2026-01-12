import { request } from './api';

export async function getUniversities() {
    return request('/api/institutions');
}

export async function getUniversity(id) {
    return request(`/api/institutions/${encodeURIComponent(id)}`);
}
