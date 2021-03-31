INSERT INTO users (name, email, password)
VALUES
('Greg Edwards', 'doesnanyonestilluse@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ken Andrews', 'heckyeah@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Mystery Name', 'mysteryman@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES
(1, 'Casa Blanca', 'description', 'thumburl.jpeg', 'coverurl.jpeg', 100, 2, 2, 2, 'Canada', '18 Fake Street', 'Toronto', 'ON', 'M1M1M1'),
(2, 'The Inn', 'description', 'thumburl.jpeg', 'coverurl.jpeg', 200, 1, 1, 1, 'USA', '13 Fake Street', 'Salt Lake City', 'UT', '23459'),
(3, 'McMansion', 'description', 'thumburl.jpeg', 'coverurl.jpeg', 150, 4, 3, 4, 'Canada', '12 Real Avenue', 'Fredericton', 'NB', 'H0H0H0');

INSERT INTO reservations (property_id, guest_id, start_date, end_date)
VALUES
(1, 1, '2020-10-12', '2020-10-25'),
(2, 2, '2020-10-12', '2020-10-25'),
(3, 3, '2020-10-12', '2020-10-25');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating)
VALUES
(1, 1, 1, 5),
(2, 3, 2, 5),
(2, 2, 3, 5);