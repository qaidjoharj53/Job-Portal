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
('Software Developer Intern', 'Join our development team for a 3-month internship program. 
Work on real projects and gain valuable experience.
Assisting in Software Development: This includes tasks like designing, developing, testing, and deploying software applications.
Coding and Debugging: Writing clean, efficient code, and identifying and fixing bugs in software.
Testing: Ensuring software functions correctly, is reliable, and meets performance requirements.
Collaborating with Teams: Working with senior developers, participating in code reviews and team meetings. ', 'Udaipur, Rajasthan', 'AppPerfect Corp', 'internship', '2025-10-20', '20-25K/month', 'Basic programming knowledge and DSA.
willingness to learn and work in fast-paced environment.', 1, 1),
('Marketing Assistant', 'Help with digital marketing campaigns and social media management.', 'Jaipur, Rajasthan', 'Brand Co', 'full-time', '2025-05-20', '10-15 LPA', 'Marketing coursework, social media experience', 1, 1),
('Data Analyst Trainee', 'Learn data analysis techniques and work with real datasets.', 'Bangalore, Karnataka', 'Analytics Pro', 'part-time', '2025-06-25', '20-30K/month', 'Statistics background, Excel proficiency', 1, 1);
