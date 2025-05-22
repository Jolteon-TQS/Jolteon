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
