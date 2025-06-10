import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const rentSuccessRate = new Rate('rent_success_rate');
export const bikeAlreadyRentedRate = new Rate('bike_already_rented_rate');
export const bikeNotAvailableRate = new Rate('bike_not_available_rate');
export const constraintViolationRate = new Rate('constraint_violation_rate');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 5 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_reqs: ['count>10'],
    rent_success_rate: ['rate>0.98'],
    bike_already_rented_rate: ['rate<0.50'],
    bike_not_available_rate: ['rate<0.10'],
    constraint_violation_rate: ['rate<0.01'],
  }
};

const BASE_URL = 'http://backend:8080';

export default function () {
  // 1. Get available bikes
  const bikeRes = http.get(`${BASE_URL}/api/bikes`);
  check(bikeRes, { 'bike list OK': (r) => r.status === 200 });
  const bikes = bikeRes.json();
  if (!bikes.length) return;

  const bike = bikes[Math.floor(Math.random() * bikes.length)];
  // random user id between 1 and 10
  const userID = Math.floor(Math.random() * 10) + 1;
  // random bike id between 6 and 55 (inclusive)
  const bikeID = Math.floor(Math.random() * 50) + 6;

  const startPayload = JSON.stringify({
    user: { id: userID },
    bike: { id: bikeID },
    startSpot: { id: 6 }, // Test with the Aveiro station, with a capacity of 50 bikes
    time: new Date().toISOString()
  });

  // 2. Create rental
  const rentRes = http.post(`${BASE_URL}/api/rentings`, startPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(rentRes, { 'rent OK': (r) => r.status === 200 || r.body.includes("User already has an active bike renting") || r.body.includes("Bike is not available for renting") });
  check(rentRes, { 'bike-already-rented': (r) => r.status === 500 && r.body.includes("User already has an active bike renting") });
  check(rentRes, { 'bike-not-available': (r) => r.status === 500 && r.body.includes("Bike is not available for renting") });
  check(rentRes, { 'constraint-violation': (r) => r.status === 400 && r.body.includes("already has an active bike renting") });
  
  const isSuccessfulRent =
    rentRes.status === 200 ||
    rentRes.body.includes("User already has an active bike renting") ||
    rentRes.body.includes("Bike is not available for renting");
  rentSuccessRate.add(isSuccessfulRent);

  const isBikeAlreadyRented =
    rentRes.status === 500 && rentRes.body.includes("User already has an active bike renting");
  bikeAlreadyRentedRate.add(isBikeAlreadyRented);

  const isBikeNotAvailable =
    rentRes.status === 500 && rentRes.body.includes("Bike is not available for renting");
  bikeNotAvailableRate.add(isBikeNotAvailable); 

  const isConstraintViolation =
    rentRes.status === 400 && rentRes.body.includes("already has an active bike renting");
  constraintViolationRate.add(isConstraintViolation);
  
  

  // Allow 200 (success) or 500 (valid constraint violation)
  if (
    rentRes.status !== 200 &&
    !(rentRes.status === 500 && rentRes.body.includes("User already has an active bike renting")) &&
    !(rentRes.status === 400 && rentRes.body.includes("already has an active bike renting")) &&
    !(rentRes.status === 500 && rentRes.body.includes("Bike is not available for renting"))
  ) {
    console.error(`Unexpected rent error: ${rentRes.status} - ${rentRes.body}`);
    return;
  }

  if (rentRes.status !== 200) {
    console.warn(`Expected rent rejection for user ${userID}: ${rentRes.status}`);
    return;
  }

  const rentingId = rentRes.json().id;
  if (!rentingId) {
    console.warn(`Missing renting ID after successful rent for user ${userID}`);
    return;
  }

  console.log(`User ${userID} rented bike ${bike.id} with renting ID ${rentingId}`);

  sleep(1);

  // 3. End rental
  const endRes = http.put(
    `${BASE_URL}/api/rentings/${rentingId}/end?endSpotId=6` // Ending at the same station
  );
  check(endRes, { 'end OK': (r) => r.status === 200 });
  if (endRes.status !== 200) {
    console.error(`Failed to end rental: ${endRes.status} - ${endRes.body}`);
    return;
  }
  console.log(`User ${userID} ended rental for bike ${bike.id}`);

  sleep(1);
}
