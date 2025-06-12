-- Insert sample data

-- Insert sample colleges
INSERT INTO colleges (name, location) VALUES
('Rajasthan Technical University', 'admin@techuni.edu', 'San Francisco, CA'),
('BITS Pilani', 'admin@bizcollege.edu', 'New York, NY'),
('Engineering Institute', 'admin@enginst.edu', 'Austin, TX');

-- Insert sample admin users (password is 'admin123' hashed)
INSERT INTO users (email, password, name, role, college_id) VALUES
('admin@techuni.edu', '$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1', 'Tech Admin', 'admin', 1),
('admin@bizcollege.edu', '$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1', 'Business Admin', 'admin', 2);

-- Insert sample student users (password is 'student123' hashed)
INSERT INTO users (email, password, name, role, college_id) VALUES
('john@student.com', '$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1', 'John Doe', 'student', 1),
('jane@student.com', '$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1', 'Jane Smith', 'student', 1),
('bob@student.com', '$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1', 'Bob Johnson', 'student', 2);

-- Insert sample jobs
INSERT INTO jobs (title, description, location, company_name, type, deadline, salary_range, requirements, college_id, posted_by) VALUES
('Software Developer Intern', 'Join our development team for a 3-month internship program. Work on real projects and gain valuable experience.', 'Udaipur, Rajasthan', 'AppPerfect Corp', 'internship', '2025-10-15', '20-25K/month', 'Basic programming knowledge, willingness to learn', 3, 3),
('Marketing Assistant', 'Help with digital marketing campaigns and social media management.', 'Jaipur, Rajasthan', 'Brand Co', 'full-time', '2025-02-20', '10-15 LPA', 'Marketing coursework, social media experience', 3, 3),
('Data Analyst Trainee', 'Learn data analysis techniques and work with real datasets.', 'Bangalore, Karnataka', 'Analytics Pro', 'part-time', '2025-06-25', '20-30K/month', 'Statistics background, Excel proficiency', 3, 3);
