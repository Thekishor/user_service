import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
    vus: 10,
    duration: '30s',
};

export default function () {
    const url = 'http://localhost:5000/api/v1/auth/login';

     const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const payload = JSON.stringify({
        identifier: '9840042981',
        password: 'Kishor@22'
    });

    const response = http.post(url, payload, params);

    if (response.status !== 200) {
      console.log(
       `Status: ${response.status}, Body: ${response.body}`
       );
    }

    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time below 1000ms': (r) => r.timings.duration < 1000,
        'response is JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
    });

    const invalidResponse = http.post(url, JSON.stringify({
        identifier: '9840042981',
        password: 'invalid-password',
    }), params);

    check(invalidResponse, {
        'invalid credentials are rejected': (r) => r.status >= 400 && r.status < 500,
        'invalid login response time below 1000ms': (r) => r.timings.duration < 1000,
    });

    sleep(1);
}