const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = email => {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1;
  `, [email])
    .then(res => res.rows[0])
    .catch(null);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = id => {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1;
  `, [id])
    .then(res => res.rows[0])
    .catch(null);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  user => {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch(null);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guestID The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guestID, limit = 10) => {
  return pool.query(`
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guestID, limit])
    .then(res => res.rows)
    .catch(err => console.error(err));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * list of options: city, owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // if WHERE statement already in query, function appends AND. If not, begins new WHERE statement
  const checkWhereExists =  () => {
    queryString.search('WHERE') ? queryString += `AND ` : queryString += `WHERE `;
  };

  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(rating) as average_rating
  FROM properties
  JOIN property_reviews ON property_id = properties.id
  `;
  // if statements add WHERE query depending on if argument is called or not
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    checkWhereExists();
    queryParams.push(`${options.owner_id}`);
    queryString += `owner_id = $${queryParams.length} `;
  }
  if (options.minimum_price_per_night) {
    checkWhereExists();
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `cost_per_night >= $${queryParams.length} `;
  }
  if (options.maximum_price_per_night) {
    checkWhereExists();
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `cost_per_night <= $${queryParams.length} `;
  }
  // must be grouped by property id
  queryString += `
  GROUP BY properties.id
  `;
  // filter by average rating if exists
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(rating) >= $${queryParams.length} `;
  }
  
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * OBJECT.VALUES ARRAY: 1 title, 2 description, 3 number_of_bedrooms, 4 number_of_bathrooms, 5 parking_spaces, 6 cost_per_night, 7 thumbnail_photo_url, 8 cover_photo_url, 9 street, 10 country, 11 city, 12 province, 13 post_code, 14 owner_id
 */
const addProperty = property => {
  return pool.query(`
  INSERT INTO properties (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `, Object.values(property))
    .then(res => console.log(res.rows[0]))
    .catch(err => console.error(err));
};
exports.addProperty = addProperty;