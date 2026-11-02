import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
    vus: 5,
    duration: '30s',
};

export default function loginInvalid () {

    const identifier = __ENV.VALID_IDENTIFIER;
    const password = "invalid-password";
    const url = 'http://localhost:5000/api/v1/auth/login';

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const payload = JSON.stringify({ identifier, password });

    const invalidResponse = http.post(url, payload, params);

    check(invalidResponse, {
        'invalid credentials are rejected': (r) => r.status >= 400 && r.status < 500,
        'invalid login response time below 1000ms': (r) => r.timings.duration < 1000,
    });

    sleep(1);
}