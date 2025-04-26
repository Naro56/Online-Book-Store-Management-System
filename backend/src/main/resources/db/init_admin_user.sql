-- Initialize admin user
-- Password is 'admin123' (bcrypt encoded)
INSERT INTO users (username, email, password, full_name, address, phone_number, active, enabled, created_at, updated_at, roles)
VALUES ('admin', 'admin@bookstore.com', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi', 'Admin User', '123 Admin Street', '1234567890', 1, 1, NOW(), NOW(), 'ROLE_ADMIN');

-- Get the user ID
SET @admin_id = LAST_INSERT_ID();

-- Get the admin role ID
SET @admin_role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN');

-- Get the user role ID
SET @user_role_id = (SELECT id FROM roles WHERE name = 'ROLE_USER');

-- Assign roles to admin user
INSERT INTO user_roles (user_id, role_id) VALUES (@admin_id, @admin_role_id);
INSERT INTO user_roles (user_id, role_id) VALUES (@admin_id, @user_role_id);
