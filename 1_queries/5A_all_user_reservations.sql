SELECT users.id, properties.title, cost_per_night, start_date, avg(rating) as average_rating
FROM users
JOIN properties ON owner_id = users.id
JOIN reservations ON reservations.guest_id = users.id
JOIN property_reviews ON property_reviews.property_id = properties.id
GROUP BY users.id, properties.title, cost_per_night, start_date, end_date
HAVING now() < end_date
ORDER BY start_date;