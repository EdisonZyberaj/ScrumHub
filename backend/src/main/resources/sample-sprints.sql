-- Insert sample sprint data
-- First, let's check which projects exist
-- From the ProjectManager we know there are 5 projects with IDs 1-5

-- Sprint for project 1 (active sprint)
INSERT INTO sprints (name, goal, start_date, end_date, status, project_id, created_at, updated_at)
VALUES 
('Sprint 15', 'Complete payment integration and user profile features', '2025-01-08', '2025-01-22', 'ACTIVE', 1, NOW(), NOW()),
('Sprint 14', 'Implement notification system and performance optimization', '2024-12-25', '2025-01-07', 'COMPLETED', 1, NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day'),
('Sprint 16', 'Security enhancements and API documentation', '2025-01-23', '2025-02-06', 'PLANNED', 1, NOW(), NOW());

-- Sprints for project 2
INSERT INTO sprints (name, goal, start_date, end_date, status, project_id, created_at, updated_at)
VALUES 
('Sprint 8', 'Mobile responsive design and cross-browser testing', '2025-01-06', '2025-01-20', 'ACTIVE', 2, NOW() - INTERVAL '2 days', NOW()),
('Sprint 7', 'User authentication and authorization system', '2024-12-23', '2025-01-05', 'COMPLETED', 2, NOW() - INTERVAL '17 days', NOW() - INTERVAL '3 days');

-- Sprints for project 3
INSERT INTO sprints (name, goal, start_date, end_date, status, project_id, created_at, updated_at)
VALUES 
('Sprint 12', 'Database optimization and performance tuning', '2025-01-09', '2025-01-23', 'ACTIVE', 3, NOW() - INTERVAL '1 day', NOW()),
('Sprint 13', 'Advanced reporting and analytics features', '2025-01-24', '2025-02-07', 'PLANNED', 3, NOW(), NOW());

-- Sprints for project 4
INSERT INTO sprints (name, goal, start_date, end_date, status, project_id, created_at, updated_at)
VALUES 
('Sprint 5', 'Integration testing and deployment pipeline', '2025-01-01', '2025-01-15', 'ACTIVE', 4, NOW() - INTERVAL '8 days', NOW()),
('Sprint 4', 'Core functionality development', '2024-12-18', '2024-12-31', 'COMPLETED', 4, NOW() - INTERVAL '22 days', NOW() - INTERVAL '8 days');

-- Sprints for project 5
INSERT INTO sprints (name, goal, start_date, end_date, status, project_id, created_at, updated_at)
VALUES 
('Sprint 3', 'UI/UX improvements and user feedback integration', '2025-01-07', '2025-01-21', 'ACTIVE', 5, NOW() - INTERVAL '2 days', NOW()),
('Sprint 2', 'Basic functionality and MVP development', '2024-12-20', '2025-01-06', 'COMPLETED', 5, NOW() - INTERVAL '20 days', NOW() - INTERVAL '3 days'),
('Sprint 4', 'Performance optimization and scalability testing', '2025-01-22', '2025-02-05', 'PLANNED', 5, NOW(), NOW());