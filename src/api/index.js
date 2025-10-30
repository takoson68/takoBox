import { request } from './httpClient.js';

export function fetchDemoProfile(id = 1) {
  return request({
    url: `https://jsonplaceholder.typicode.com/users/${id}`,
    method: 'GET',
    withAuth: false,
  });
}

export function fetchMenu() {
  return request({
    url: '/api/menu',
  });
}
