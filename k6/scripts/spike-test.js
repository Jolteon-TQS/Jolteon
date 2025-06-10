import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 20 },  // ramp-up
        { duration: '20s', target: 1000 },  // spike
        { duration: '10s', target: 10 },  // ramp-down
    ],
};

export default function () {
    http.get('http://backend:8080/api/bikes');
    sleep(0.5);
}
