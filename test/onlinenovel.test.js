const request = require('supertest');
const app = require('../bin/www'); // Path to your app's entry point

afterAll(() => {
    server.close(); // Close the server after all tests
});

describe('Online Novel Routes', () => {
    test('GET /novel/list should return a list of completed novels', async () => {
        const response = await request(app).get('/novel/list').query({ page: 1 });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Assuming the response is an array
    });

    test('GET /novel/recentupdates should return a list of recent updates', async () => {
        const response = await request(app).get('/novel/recentupdates').query({ page: 1 });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /novel/top-list should return a list of top novels', async () => {
        const response = await request(app).get('/novel/top-list').query({ page: 1 });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /novel/novel-details should return novel details', async () => {
        const response = await request(app).get('/novel/novel-details').query({ id: '123' });
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    test('POST /novel/search should return search results', async () => {
        const searchQuery = { keyword: 'example' };
        const response = await request(app).post('/novel/search').send(searchQuery);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});