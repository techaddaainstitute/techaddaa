-- =============================================
-- Insert Mock Courses from AuthContext.js
-- =============================================
-- This script inserts all mockCourses data into the Supabase courses table
-- Using consistent UUID mapping for course IDs to match the frontend

-- Clear existing sample courses first (optional)
-- DELETE FROM public.courses WHERE title IN ('React.js Fundamentals', 'Advanced JavaScript', 'Python for Data Science', 'UI/UX Design Principles');

-- Insert all mockCourses with proper UUID mapping
INSERT INTO public.courses (id, title, description, price, duration, level, category, image_url) VALUES

-- Course ID 30 -> UUID: 550e8400-e29b-41d4-a716-44665544001e
('550e8400-e29b-41d4-a716-44665544001e', 'Robotics for Age (14+)', 'Learn advanced robotics with hardware and coding.', 19800.00, '5 Months', 'advanced', 'robotics', 'https://plus.unsplash.com/premium_photo-1682123676241-d4c275c6ce7d?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 2 -> UUID: 550e8400-e29b-41d4-a716-446655440002
('550e8400-e29b-41d4-a716-446655440002', 'Website Development Advance Diploma', 'Advanced website development with modern frameworks and tools.', 7800.00, '5 Months', 'advanced', 'web', 'https://plus.unsplash.com/premium_photo-1678566153919-86c4ba4216f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 3 -> UUID: 550e8400-e29b-41d4-a716-446655440003
('550e8400-e29b-41d4-a716-446655440003', 'Digital Marketing Diploma', 'Master SEO, social media marketing, and digital strategies.', 11800.00, '5 Months', 'intermediate', 'marketing', 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40'),

-- Course ID 1 -> UUID: 550e8400-e29b-41d4-a716-446655440001
('550e8400-e29b-41d4-a716-446655440001', 'Website Development Diploma', 'Learn the fundamentals of website development with HTML, CSS, and JavaScript.', 4800.00, '3 Months', 'beginner', 'web', 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe'),

-- Course ID 4 -> UUID: 550e8400-e29b-41d4-a716-446655440004
('550e8400-e29b-41d4-a716-446655440004', 'Computer Basic', 'Get started with basic computer knowledge and essential applications.', 3000.00, '3 Months', 'beginner', 'computer', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'),

-- Course ID 5 -> UUID: 550e8400-e29b-41d4-a716-446655440005
('550e8400-e29b-41d4-a716-446655440005', 'Computer Advance', 'Advance your computer skills with operating systems and office automation.', 4000.00, '6 Months', 'intermediate', 'computer', 'https://images.unsplash.com/photo-1518770660439-4636190af475'),

-- Course ID 6 -> UUID: 550e8400-e29b-41d4-a716-446655440006
('550e8400-e29b-41d4-a716-446655440006', 'Computer Master', 'Comprehensive mastery of computer operations and applications.', 6000.00, '12 Months', 'advanced', 'computer', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c'),

-- Course ID 7 -> UUID: 550e8400-e29b-41d4-a716-446655440007
('550e8400-e29b-41d4-a716-446655440007', 'Graphic Design', 'Learn to design with modern tools and creative skills.', 4800.00, '3 Months', 'intermediate', 'design', 'https://plus.unsplash.com/premium_photo-1661392835897-f81669fcc69b?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 8 -> UUID: 550e8400-e29b-41d4-a716-446655440008
('550e8400-e29b-41d4-a716-446655440008', 'Java Core', 'Learn the fundamentals of Java programming language.', 4800.00, '3 Months', 'beginner', 'programming', 'https://images.unsplash.com/photo-1649451844931-57e22fc82de3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 9 -> UUID: 550e8400-e29b-41d4-a716-446655440009
('550e8400-e29b-41d4-a716-446655440009', 'Python Core', 'Learn the core concepts of Python programming for beginners.', 4800.00, '3 Months', 'beginner', 'programming', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 10 -> UUID: 550e8400-e29b-41d4-a716-44665544000a
('550e8400-e29b-41d4-a716-44665544000a', 'C Language', 'Understand the basics of programming with the C language.', 4800.00, '3 Months', 'beginner', 'programming', 'https://images.unsplash.com/photo-1518770660439-4636190af475'),

-- Course ID 11 -> UUID: 550e8400-e29b-41d4-a716-44665544000b
('550e8400-e29b-41d4-a716-44665544000b', 'C++ Core', 'Learn object-oriented programming concepts with C++.', 4800.00, '3 Months', 'intermediate', 'programming', 'https://plus.unsplash.com/premium_photo-1678566153919-86c4ba4216f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 12 -> UUID: 550e8400-e29b-41d4-a716-44665544000c
('550e8400-e29b-41d4-a716-44665544000c', 'MySQL', 'Learn relational databases and SQL queries with MySQL.', 4800.00, '3 Months', 'intermediate', 'database', 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f'),

-- Course ID 13 -> UUID: 550e8400-e29b-41d4-a716-44665544000d
('550e8400-e29b-41d4-a716-44665544000d', 'PHP', 'Master PHP programming for dynamic website development.', 4800.00, '3 Months', 'intermediate', 'web', 'https://images.unsplash.com/photo-1599507593548-0187ac4043c6?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 14 -> UUID: 550e8400-e29b-41d4-a716-44665544000e
('550e8400-e29b-41d4-a716-44665544000e', 'Data Structure & Algo - C & C++', 'Learn essential data structures and algorithms using C/C++.', 5800.00, '4 Months', 'advanced', 'programming', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd'),

-- Course ID 15 -> UUID: 550e8400-e29b-41d4-a716-44665544000f
('550e8400-e29b-41d4-a716-44665544000f', 'Data Structure & Algo - Java', 'Understand data structures and algorithms using Java.', 5800.00, '4 Months', 'advanced', 'programming', 'https://images.unsplash.com/photo-1740908900846-4bbd4f22c975?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 16 -> UUID: 550e8400-e29b-41d4-a716-446655440010
('550e8400-e29b-41d4-a716-446655440010', 'Django Python', 'Build powerful web applications with Django and Python.', 5800.00, '4 Months', 'advanced', 'web', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 17 -> UUID: 550e8400-e29b-41d4-a716-446655440011
('550e8400-e29b-41d4-a716-446655440011', 'Spring Boot Java', 'Learn backend development with Java Spring Boot framework.', 5800.00, '4 Months', 'advanced', 'web', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'),

-- Course ID 18 -> UUID: 550e8400-e29b-41d4-a716-446655440012
('550e8400-e29b-41d4-a716-446655440012', 'Java Advance', 'Deep dive into advanced Java concepts and frameworks.', 5800.00, '4 Months', 'advanced', 'programming', 'https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 19 -> UUID: 550e8400-e29b-41d4-a716-446655440013
('550e8400-e29b-41d4-a716-446655440013', 'Python Advance', 'Master advanced Python features for real-world projects.', 5800.00, '4 Months', 'advanced', 'programming', 'https://images.unsplash.com/photo-1690683790356-c1edb75e3df7?q=80&w=1809&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 20 -> UUID: 550e8400-e29b-41d4-a716-446655440014
('550e8400-e29b-41d4-a716-446655440014', 'C++ Advance', 'Advanced concepts in C++ for efficient programming.', 5800.00, '4 Months', 'advanced', 'programming', 'https://images.unsplash.com/photo-1565687981296-535f09db714e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 21 -> UUID: 550e8400-e29b-41d4-a716-446655440015
('550e8400-e29b-41d4-a716-446655440015', 'Data Science', 'Analyze and visualize data using modern tools.', 9800.00, '6 Months', 'advanced', 'data', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb'),

-- Course ID 22 -> UUID: 550e8400-e29b-41d4-a716-446655440016
('550e8400-e29b-41d4-a716-446655440016', 'Tally Basic', 'Learn accounting fundamentals with Tally software.', 6000.00, '3 Months', 'beginner', 'finance', 'https://plus.unsplash.com/premium_photo-1671461774955-7aab3ab41b90?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 23 -> UUID: 550e8400-e29b-41d4-a716-446655440017
('550e8400-e29b-41d4-a716-446655440017', 'Tally Advance + GST', 'Advanced Tally skills with GST compliance.', 6800.00, '4 Months', 'advanced', 'finance', 'https://images.unsplash.com/photo-1612622826776-cd8b6da23632?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 24 -> UUID: 550e8400-e29b-41d4-a716-446655440018
('550e8400-e29b-41d4-a716-446655440018', 'Excel Basic', 'Get started with Excel for data entry and calculations.', 2000.00, '2 Months', 'beginner', 'productivity', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f'),

-- Course ID 25 -> UUID: 550e8400-e29b-41d4-a716-446655440019
('550e8400-e29b-41d4-a716-446655440019', 'Excel Advance', 'Master advanced Excel features for data analysis.', 3200.00, '3 Months', 'advanced', 'productivity', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'),

-- Course ID 26 -> UUID: 550e8400-e29b-41d4-a716-44665544001a
('550e8400-e29b-41d4-a716-44665544001a', 'Scratch Programming', 'Learn block-based programming using Scratch, designed for kids.', 6800.00, '3 Months', 'beginner', 'kids', 'https://images.unsplash.com/photo-1568585219057-9206080e6c74?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 27 -> UUID: 550e8400-e29b-41d4-a716-44665544001b
('550e8400-e29b-41d4-a716-44665544001b', 'AutoCAD', 'Learn 2D and 3D design using AutoCAD software.', 6800.00, '3 Months', 'intermediate', 'design', 'https://images.unsplash.com/photo-1694604173127-a9b29699df5d?q=80&w=1043&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 28 -> UUID: 550e8400-e29b-41d4-a716-44665544001c
('550e8400-e29b-41d4-a716-44665544001c', 'Computer Hardware', 'Understand computer hardware, assembly, and troubleshooting.', 7800.00, '3 Months', 'intermediate', 'hardware', 'https://images.unsplash.com/photo-1555617778-02518510b9fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 29 -> UUID: 550e8400-e29b-41d4-a716-44665544001d
('550e8400-e29b-41d4-a716-44665544001d', 'Robotics for Age (8-14)', 'Introduce young minds to robotics and STEM concepts.', 11800.00, '3 Months', 'beginner', 'robotics', 'https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

-- Course ID 31 -> UUID: 550e8400-e29b-41d4-a716-44665544001f
('550e8400-e29b-41d4-a716-44665544001f', 'CCC', 'Course on Computer Concepts – a basic government-certified IT course.', 8000.00, '5 Months', 'beginner', 'computer', 'https://images.unsplash.com/photo-1547658719-da2b51169166'),

-- Course ID 32 -> UUID: 550e8400-e29b-41d4-a716-446655440020
('550e8400-e29b-41d4-a716-446655440020', 'O-Level', 'Government recognized IT certification with in-depth computer concepts.', 12000.00, '12 Months', 'advanced', 'computer', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c')

ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Notes:
-- =============================================
-- 1. UUIDs are mapped consistently with the courseIdToUUID function in AuthContext.js
-- 2. Using onlinePrice as the default price (offlinePrice is higher)
-- 3. Level mapping: 
--    - Basic/Core courses -> 'beginner'
--    - Advance/intermediate courses -> 'intermediate' 
--    - Advanced/Master courses -> 'advanced'
-- 4. Categories mapped from mockCourses category field
-- 5. ON CONFLICT DO NOTHING prevents duplicate inserts
-- =============================================