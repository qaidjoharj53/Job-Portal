-- Insert sample data

-- Insert sample colleges
INSERT INTO colleges (name, location) VALUES
('Rajasthan Technical University', 'Kota, Rajasthan'),
('BITS Pilani', 'Pilani, Rajasthan'),
('IIT Madras', 'Chennai, Tamil Nadu'),
('University of California, Berkeley', 'Berkeley, CA'),
('Massachusetts Institute of Technology', 'Cambridge, MA'),
('Stanford University', 'Stanford, CA');

-- Insert sample users
INSERT INTO users (email, password, name, role, college_id) VALUES
('jayesh@rtu.edu', '#password', 'Jayesh', 'admin', 1);
('vaibhav@gmail.com', '#password', 'Vaibhav', 'student', 1),

-- Insert sample jobs
INSERT INTO jobs (title, description, location, company_name, type, deadline, salary_range, requirements, college_id, posted_by) VALUES
('Software Developer Intern', 'Join our development team for a 3-month internship program. Work on real projects and gain valuable experience.', 'Udaipur, Rajasthan', 'AppPerfect Corp', 'internship', '2025-10-15', '20-25K/month', 'Basic programming knowledge, willingness to learn', 3, 3),
('Marketing Assistant', 'Help with digital marketing campaigns and social media management.', 'Jaipur, Rajasthan', 'Brand Co', 'full-time', '2025-02-20', '10-15 LPA', 'Marketing coursework, social media experience', 3, 3),
('Data Analyst Trainee', 'Learn data analysis techniques and work with real datasets.', 'Bangalore, Karnataka', 'Analytics Pro', 'part-time', '2025-06-25', '20-30K/month', 'Statistics background, Excel proficiency', 3, 3);
