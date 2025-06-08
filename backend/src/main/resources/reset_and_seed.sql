-- 1. Truncate all tables and reset identities (PK sequences)
TRUNCATE 
    review,
    cultural_landmark,
    city_admin,
    normal_user,
    bike,
    charging_spot
RESTART IDENTITY CASCADE;

-- 2. Insert seed data into charging_spot
INSERT INTO charging_spot (city, latitude, longitude, capacity) VALUES
  ('New York', 40.7128, -74.0060, 10),
  ('Los Angeles', 34.0522, -118.2437, 8),
  ('London', 51.5074, -0.1278, 12),
  ('Paris', 48.8566, 2.3522, 6),
  ('Tokyo', 35.6895, 139.6917, 15),
  ('Aveiro', 40.6400, -8.6500, 60);

-- 3. Insert seed data into bike
INSERT INTO bike (autonomy, is_available, latitude, longitude, city, charging_spot_id) VALUES
  (120, true, 40.7128, -74.0060, 'New York', 1),
  (80, true, 34.0522, -118.2437, 'Los Angeles', 2),
  (150, true, 51.5074, -0.1278, 'London', 3),
  (50, true, 48.8566, 2.3522, 'Paris', 5),
  (110, true, 35.6895, 139.6917, 'Tokyo', 4),

  -- Aveiro station bikes
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (90, true, 40.6400, -8.6500, 'Aveiro', 6),
  (110, true, 40.6400, -8.6500, 'Aveiro', 6),
  (120, true, 40.6400, -8.6500, 'Aveiro', 6),
  (90, true, 40.6400, -8.6500, 'Aveiro', 6),
  (80, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (70, true, 40.6400, -8.6500, 'Aveiro', 6),
  (50, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (120, true, 40.6400, -8.6500, 'Aveiro', 6),
  (110, true, 40.6400, -8.6500, 'Aveiro', 6),
  (120, true, 40.6400, -8.6500, 'Aveiro', 6),
  (90, true, 40.6400, -8.6500, 'Aveiro', 6),
  (80, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (80, true, 40.6400, -8.6500, 'Aveiro', 6),
  (70, true, 40.6400, -8.6500, 'Aveiro', 6),
  (70, true, 40.6400, -8.6500, 'Aveiro', 6),
  (60, true, 40.6400, -8.6500, 'Aveiro', 6),
  (70, true, 40.6400, -8.6500, 'Aveiro', 6),
  (50, true, 40.6400, -8.6500, 'Aveiro', 6),
  (60, true, 40.6400, -8.6500, 'Aveiro', 6),
  (50, true, 40.6400, -8.6500, 'Aveiro', 6),
  (60, true, 40.6400, -8.6500, 'Aveiro', 6),
  (70, true, 40.6400, -8.6500, 'Aveiro', 6),
  (80, true, 40.6400, -8.6500, 'Aveiro', 6),
  (90, true, 40.6400, -8.6500, 'Aveiro', 6),
  (100, true, 40.6400, -8.6500, 'Aveiro', 6),
  (110, true, 40.6400, -8.6500, 'Aveiro', 6);

-- 4. Insert seed data into normal_user
INSERT INTO normal_user (username, email, balance) VALUES
  ('andredora', 'andre@dora.com', 1000),
  ('pedrosalgado', 'pedro@sal.com', 50),
  ('carloscosta', 'carlos@costa.com', 150),
  ('saraalmeida', 'sara@almeida.com', 600),
  ('paulasantos', 'paula@santos.com', 800),
  ('luismontenegro', 'luis@montenegro.com', 300),
  ('carlaoliveira', 'carla@oliveira.com', 450),
  ('joaopedro', 'joao@pedro.com', 350),
  ('raquelvinagre', 'raquel@vinagre.com', 100),
  ('diogufernandes', 'diogu@fernandes.com', 1200);

-- 5. Insert seed data into city_admin
INSERT INTO city_admin (username, email, city) VALUES
  ('antonio', 'antonio@ua.pt', 'Aveiro'),
  ('marianavivagua', 'mariana@be.pt', 'Aveiro');

-- 6. Insert seed data into cultural_landmark
INSERT INTO cultural_landmark (name, description, latitude, longitude, city) VALUES
  ('Costa Nova', 'Famous for its colorful striped houses and beautiful beach.', 40.6178, -8.7525, 'Aveiro'),
  ('Ria de Aveiro', 'A picturesque lagoon with canals and traditional boats.', 40.6412, -8.6528, 'Aveiro'),
  ('Museu de Aveiro', 'A museum showcasing the history and culture of Aveiro.', 40.6210, -8.6500, 'Aveiro'),
  ('Igreja de São Domingos', 'A historic church known for its stunning architecture.', 40.6400, -8.6500, 'Aveiro'),
  ('Rachelz House', 'Big very rich house with cute cat very cutie patotie', 10.6400, -80.3500, 'New York');

-- 7. Insert seed data into review
INSERT INTO review (user_id, cultural_landmark_id, stars, description) VALUES
  (1, 1, 5, 'Amazing place! The colorful houses are stunning.'),
  (1, 2, 4, 'Beautiful lagoon with a lot of history.'),
  (2, 1, 3, 'Nice place, but a bit crowded.'),
  (2, 3, 5, 'Loved the museum! Very informative.'),
  (1, 4, 4, 'The church is breathtaking. A must-visit in Aveiro.'),
  (2, 5, 5, 'Rachelz House is a hidden gem! The cat is adorable.');
