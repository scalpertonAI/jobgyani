-- Sample Interview Questions for JobGyani
-- Run this in Supabase SQL Editor to populate the interview_questions table

-- Clear existing questions (optional - comment out if you want to keep existing ones)
-- DELETE FROM interview_questions;

-- Behavioral Questions
INSERT INTO interview_questions (question, category, difficulty, sample_answer, tips) VALUES
('Tell me about yourself', 'behavioral', 'easy', 'Start with your current role, highlight 2-3 key achievements, mention relevant experience, and explain why you''re interested in this position.',
 ARRAY['Keep it to 2-3 minutes', 'Focus on professional background', 'End with why you want this role', 'Practice your delivery']),

('Describe a time when you faced a challenging situation at work and how you handled it', 'behavioral', 'medium', 'Use the STAR method: Situation (context), Task (what needed to be done), Action (steps you took), Result (positive outcome with metrics if possible).',
 ARRAY['Use STAR method', 'Be specific with examples', 'Include measurable results', 'Show problem-solving skills']),

('Tell me about a time you failed', 'behavioral', 'medium', 'Choose a real but not catastrophic failure, explain what you learned, and how you applied that learning to improve.',
 ARRAY['Be honest but strategic', 'Focus on learning and growth', 'Show self-awareness', 'Demonstrate resilience']),

('Describe a conflict you had with a coworker', 'behavioral', 'hard', 'Focus on professional disagreement, your approach to resolution, and positive outcome. Avoid blaming others.',
 ARRAY['Stay professional', 'Show empathy', 'Highlight communication skills', 'Demonstrate conflict resolution']),

('Why are you leaving your current job?', 'behavioral', 'medium', 'Focus on growth opportunities and what you''re looking for, not what you''re running from. Stay positive about current/past employers.',
 ARRAY['Stay positive', 'Focus on growth', 'Don''t badmouth previous employers', 'Connect to new opportunity']),

-- Technical Questions (Software Engineering)
('Explain the difference between == and === in JavaScript', 'technical', 'easy', '== performs type coercion before comparing, while === compares both value and type without coercion. Always use === for strict equality.',
 ARRAY['Give clear examples', 'Mention type coercion', 'Show when to use each', 'Demonstrate understanding']),

('What is the difference between REST and GraphQL?', 'technical', 'medium', 'REST uses multiple endpoints with fixed data structures, GraphQL uses a single endpoint where clients can request exactly the data they need.',
 ARRAY['Compare both approaches', 'Mention use cases', 'Discuss trade-offs', 'Show practical knowledge']),

('Explain async/await in JavaScript', 'technical', 'medium', 'Async/await is syntactic sugar over Promises that makes asynchronous code look and behave like synchronous code, making it easier to read and debug.',
 ARRAY['Explain with examples', 'Mention error handling', 'Compare with Promises', 'Show practical usage']),

('How would you optimize a slow database query?', 'technical', 'hard', 'Add indexes, analyze query execution plan, optimize JOINs, consider caching, partition large tables, and use EXPLAIN to identify bottlenecks.',
 ARRAY['Mention multiple techniques', 'Show systematic approach', 'Discuss trade-offs', 'Give specific examples']),

-- Problem Solving Questions
('How would you design a parking lot system?', 'problem_solving', 'hard', 'Start by clarifying requirements (size, types of vehicles, payment methods), then discuss data structures, API design, and scaling considerations.',
 ARRAY['Ask clarifying questions', 'Start with requirements', 'Draw diagrams', 'Discuss trade-offs']),

('Estimate how many gas stations are in the United States', 'problem_solving', 'medium', 'Use Fermi estimation: ~330M people, ~250M cars, each fills up weekly, ~10 pumps per station, calculate throughput and work backwards.',
 ARRAY['State assumptions clearly', 'Break down the problem', 'Show logical thinking', 'Arrive at reasonable estimate']),

('How would you test a calculator app?', 'problem_solving', 'easy', 'Test basic operations, edge cases (division by zero, large numbers), UI responsiveness, error handling, and different input methods.',
 ARRAY['Cover functional testing', 'Include edge cases', 'Mention usability', 'Discuss automation']),

-- Leadership Questions
('Describe your leadership style', 'leadership', 'medium', 'Explain your approach (collaborative, coaching, etc.), give examples of how you''ve led teams, and how you adapt to different situations.',
 ARRAY['Be authentic', 'Provide examples', 'Show adaptability', 'Demonstrate results']),

('How do you handle team members who aren''t performing?', 'leadership', 'hard', 'Start with understanding root cause, provide clear feedback and support, set improvement goals, and document progress.',
 ARRAY['Show empathy', 'Mention clear communication', 'Focus on improvement', 'Know when to escalate']),

('Tell me about a time you had to make a difficult decision', 'leadership', 'medium', 'Describe the situation, factors you considered, stakeholders involved, your decision, and the outcome.',
 ARRAY['Use STAR method', 'Show analytical thinking', 'Include stakeholders', 'Discuss outcome']),

-- Culture Fit Questions
('Where do you see yourself in 5 years?', 'culture', 'easy', 'Show ambition aligned with company growth, mention skill development, and how this role fits your career path.',
 ARRAY['Be realistic', 'Align with company', 'Show ambition', 'Stay flexible']),

('What motivates you?', 'culture', 'easy', 'Share genuine motivators that align with the role (problem-solving, impact, learning, collaboration, etc.).',
 ARRAY['Be authentic', 'Connect to role', 'Show passion', 'Mention growth']),

('How do you handle stress and pressure?', 'culture', 'medium', 'Describe healthy coping mechanisms, prioritization skills, and specific examples of performing under pressure.',
 ARRAY['Be honest', 'Show healthy habits', 'Give examples', 'Demonstrate resilience']),

('Why do you want to work here?', 'culture', 'easy', 'Research the company, mention specific aspects that attract you (mission, culture, products, growth), and how you can contribute.',
 ARRAY['Do your research', 'Be specific', 'Show enthusiasm', 'Connect your skills']),

('What are your salary expectations?', 'culture', 'medium', 'Provide a researched range, express flexibility, emphasize fit and growth over just compensation.',
 ARRAY['Research market rates', 'Give a range', 'Stay flexible', 'Focus on total package']);

-- More Advanced Technical Questions
INSERT INTO interview_questions (question, category, difficulty, sample_answer, tips) VALUES
('Explain the SOLID principles', 'technical', 'hard', 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion - five principles for writing maintainable object-oriented code.',
 ARRAY['Explain each principle', 'Give examples', 'Show practical application', 'Mention benefits']),

('What is a closure in JavaScript?', 'technical', 'medium', 'A closure is a function that has access to variables in its outer (enclosing) function''s scope, even after the outer function has returned.',
 ARRAY['Define clearly', 'Show code example', 'Explain use cases', 'Mention scope']),

('Describe the CAP theorem', 'technical', 'hard', 'CAP states that a distributed system can only guarantee two of three: Consistency, Availability, and Partition tolerance. Most systems choose CP or AP.',
 ARRAY['Explain all three', 'Give examples of each', 'Discuss trade-offs', 'Mention real systems']),

('How does HTTPS work?', 'technical', 'medium', 'HTTPS uses TLS/SSL to encrypt data between client and server using asymmetric encryption for handshake and symmetric encryption for data transfer.',
 ARRAY['Explain encryption', 'Mention certificates', 'Describe handshake', 'Discuss security benefits']);
