INSERT INTO charging_spot (city, latitude, longitude, capacity) VALUES
  ('New York', 40.7128, -74.0060, 10),
  ('Los Angeles', 34.0522, -118.2437, 8),
  ('London', 51.5074, -0.1278, 12),
  ('Paris', 48.8566, 2.3522, 6),
  ('Tokyo', 35.6895, 139.6917, 15);

INSERT INTO bike (autonomy, is_available, latitude, longitude, city, charging_spot_id) VALUES
  (120, true, 40.7128, -74.0060, 'New York', 1),
  (80, false, 34.0522, -118.2437, 'Los Angeles', 2),
  (150, true, 51.5074, -0.1278, 'London', 3),
  (50, true, 48.8566, 2.3522, 'Paris', 5),
  (110, false, 35.6895, 139.6917, 'Tokyo', 4);

INSERT INTO normal_user (username, email, balance) VALUES
('andredora', 'andre@dora.com', 1000),
('pedrosalgado', 'pedro@sal.com', 50);

INSERT INTO city_admin (username, email, city) VALUES
('antonio', 'antonio@ua.pt', 'Aveiro'),
('marianavivagua', 'mariana@be.pt', 'Aveiro');

INSERT INTO cultural_landmark (name, description, latitude, longitude, city) VALUES
('Costa Nova', 'Famous for its colorful striped houses and beautiful beach.', 40.6200, -8.7667, 'Aveiro'),
('Ria de Aveiro', 'A picturesque lagoon with canals and traditional boats.', 40.6400, -8.6500, 'Aveiro'),
('Museu de Aveiro', 'A museum showcasing the history and culture of Aveiro.', 40.6400, -8.6500, 'Aveiro'),
('Igreja de São Domingos', 'A historic church known for its stunning architecture.', 40.6400, -8.6500, 'Aveiro');

INSERT INTO bike_renting (
  bike_id, user_id, start_spot_id, time
) VALUES (
  1, 1, 1, NOW()
);
