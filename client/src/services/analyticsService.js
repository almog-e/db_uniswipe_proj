import { request } from './api';

export async function getHighestAdmissionRate(limit = 10) {
    return request(`/api/analytics/programs/highestAdmissionRate/${limit}`);
}

export async function getHighestRoi(limit = 10) {
    return request(`/api/analytics/insititutions/HighestRoi/${limit}`);
}

export async function getAvgRoiByState(limit = 50) {
    return request(`/api/analytics/states/programs/avgRoi/${limit}`);
}

export async function getHighestEarningsGrowth(limit = 10) {
    return request(`/api/analytics/programs/highestAvgEarn/${limit}`);
}

export async function getHighestSalary(limit = 10) {
    return request(`/api/analytics/programs/highestSalary/${limit}`);
}

export async function getLowestRoi(limit = 10) {
    return request(`/api/analytics/programs/lowestRoi/${limit}`);
}

export async function getLowestSalary(limit = 10) {
    return request(`/api/analytics/programs/lowestSalary/${limit}`);
}

export async function getTopStateInstitution(limit = 50) {
    return request(`/api/analytics/states/intitutions/highestRoi/${limit}`);
}

export async function getTopProgramInstitution(limit = 50) {
    return request(`/api/analytics/programs/intitutions/highestRoi/${limit}`);
}

// Generic function to call any analytics endpoint
export async function getAnalyticsData(endpoint, limit = 10) {
    return request(`/api/analytics${endpoint}/${limit}`);
}