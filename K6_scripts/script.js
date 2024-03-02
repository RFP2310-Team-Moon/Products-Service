// Local stress test utilizing K6
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '10s', target: 10 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 1000 },
  ],
};

export default function () {
  http.get('http://localhost:3000/api/products/232648/styles');
  sleep(1);
}
