-- DROP TABLE users;

-- CREATE TABLE users
-- (
--     uid VARCHAR PRIMARY KEY UNIQUE,
--     firstname VARCHAR(32) NOT NULL,
--     lastName VARCHAR(32) NOT NULL,
--     email VARCHAR(128) NOT NULL UNIQUE,
--     username VARCHAR(64) NOT NULL UNIQUE,
--     organization VARCHAR(128),
--     admin BOOLEAN DEFAULT false NOT NULL,
--     hash VARCHAR NOT NULL,
--     salt VARCHAR NOT NULL
-- );

-- UPDATE users
-- SET admin = TRUE
-- WHERE username = 'Emamoz';

SELECT *
FROM users;