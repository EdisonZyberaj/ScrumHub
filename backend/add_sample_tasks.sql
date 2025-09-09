-- Insert sample sprints for existing projects
INSERT INTO sprints (name, goal, project_id, start_date, end_date, status, created_at, updated_at) VALUES 
('Sprint 1', 'Complete user authentication and basic features', 3, '2025-01-01 00:00:00', '2025-01-14 00:00:00', 'COMPLETED', NOW(), NOW()),
('Sprint 2', 'Implement core functionalities', 3, '2025-01-15 00:00:00', '2025-01-28 00:00:00', 'ACTIVE', NOW(), NOW()),
('Sprint 1', 'Setup IoT dashboard foundation', 4, '2025-01-01 00:00:00', '2025-01-14 00:00:00', 'ACTIVE', NOW(), NOW());

-- Insert sample tasks for E-commerce Platform (project ID 3)
INSERT INTO tasks (title, description, type, priority, status, estimated_hours, logged_hours, due_date, sprint_id, project_id, assignee_id, created_by, acceptance_criteria, created_at, updated_at) VALUES 
('User Registration API', 'Implement REST API endpoints for user registration with validation', 'USER_STORY', 'HIGH', 'DONE', 8, 8, '2025-01-10 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 1' AND project_id = 3), 3, 1, 1, '- API should validate email format\n- Password should meet security requirements\n- Return proper error messages', NOW(), NOW()),

('Login Authentication', 'Implement JWT-based authentication system', 'USER_STORY', 'HIGH', 'DONE', 6, 6, '2025-01-12 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 1' AND project_id = 3), 3, 1, 1, '- Generate JWT tokens\n- Validate credentials\n- Handle token expiration', NOW(), NOW()),

('User Profile Management', 'Create user profile CRUD operations', 'USER_STORY', 'MEDIUM', 'DONE', 4, 4, '2025-01-13 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 1' AND project_id = 3), 3, 6, 1, '- Users can update their profile\n- Profile validation\n- Image upload support', NOW(), NOW()),

('Product Search API', 'Implement search functionality with filters', 'USER_STORY', 'HIGH', 'IN_PROGRESS', 12, 6, '2025-01-25 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 2' AND project_id = 3), 3, 8, 1, '- Search by product name\n- Filter by category\n- Sort results', NOW(), NOW()),

('Product Catalog Frontend', 'Build React components for product browsing', 'USER_STORY', 'HIGH', 'TO_DO', 10, 0, '2025-01-27 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 2' AND project_id = 3), 3, 9, 1, '- Responsive grid layout\n- Product card components\n- Pagination support', NOW(), NOW()),

('Shopping Cart Implementation', 'Add to cart and cart management functionality', 'USER_STORY', 'MEDIUM', 'TO_DO', 8, 0, '2025-01-28 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 2' AND project_id = 3), 3, NULL, 1, '- Add/remove items from cart\n- Update quantities\n- Calculate totals', NOW(), NOW()),

('Fix product image loading', 'Product images not displaying correctly on mobile', 'BUG', 'HIGH', 'READY_FOR_TESTING', 2, 2, '2025-01-20 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 2' AND project_id = 3), 3, 8, 1, '- Images should load on all devices\n- Proper fallback handling\n- Optimize loading performance', NOW(), NOW()),

('Improve search performance', 'Search queries taking too long', 'BUG', 'MEDIUM', 'IN_TESTING', 4, 3, '2025-01-22 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 2' AND project_id = 3), 3, 6, 1, '- Response time under 2 seconds\n- Add search indexing\n- Optimize database queries', NOW(), NOW());

-- Insert sample tasks for IoT Monitoring Dashboard (project ID 4)  
INSERT INTO tasks (title, description, type, priority, status, estimated_hours, logged_hours, due_date, sprint_id, project_id, assignee_id, created_by, acceptance_criteria, created_at, updated_at) VALUES 
('Dashboard Layout Design', 'Create responsive dashboard layout', 'USER_STORY', 'HIGH', 'IN_PROGRESS', 6, 3, '2025-01-12 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 1' AND project_id = 4), 4, 9, 11, '- Responsive design\n- Grid-based layout\n- Mobile-friendly', NOW(), NOW()),

('Device Connection API', 'Implement IoT device connection endpoints', 'USER_STORY', 'HIGH', 'TO_DO', 8, 0, '2025-01-14 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 1' AND project_id = 4), 4, 8, 11, '- Connect to IoT devices\n- Handle device authentication\n- Real-time data streaming', NOW(), NOW()),

('Real-time Data Visualization', 'Create charts and graphs for IoT data', 'USER_STORY', 'MEDIUM', 'TO_DO', 16, 0, '2025-01-15 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 1' AND project_id = 4), 4, NULL, 11, '- Interactive charts\n- Real-time updates\n- Multiple chart types', NOW(), NOW()),

('Device Status Monitoring', 'Monitor and display device health status', 'USER_STORY', 'HIGH', 'READY_FOR_TESTING', 10, 8, '2025-01-13 00:00:00', (SELECT id FROM sprints WHERE name = 'Sprint 1' AND project_id = 4), 4, 6, 11, '- Show online/offline status\n- Health metrics\n- Alert notifications', NOW(), NOW());

-- Update users to be active so they can login
UPDATE users SET active = true WHERE id IN (1, 6, 8, 9, 11, 12);