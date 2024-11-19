USE xployt;

-- Insert Users
INSERT INTO Users (email, passwordHash, name, role)
VALUES 
    ('client1@example.com', 'hashedpassword1', 'Client One', 'Client'),
    ('client2@example.com', 'hashedpassword2', 'Client Two', 'Client'),
    ('lead1@example.com', 'hashedpassword3', 'Lead One', 'ProjectLead'),
    ('hacker1@example.com', 'hashedpassword4', 'Hacker One', 'Hacker'),
    ('validator1@example.com', 'hashedpassword5', 'Validator One', 'Validator'),
    ('admin1@example.com', 'hashedpassword6', 'Admin One', 'Admin');

-- Insert User Profiles
INSERT INTO UserProfiles (userId, username, firstName, lastName, phone, companyName, dob, linkedIn)
VALUES 
    (1, 'client1', 'Client', 'One', '1234567890', 'Company A', NULL, NULL),
    (2, 'client2', 'Client', 'Two', '9876543210', 'Company B', NULL, NULL),
    (3, 'lead1', 'Lead', 'One', '1122334455', NULL, NULL, NULL),
    (4, 'hacker1', 'Hacker', 'One', '2233445566', NULL, NULL, NULL),
    (5, 'validator1', 'Validator', 'One', '3344556677', NULL, '2000-05-12', 'https://linkedin.com/in/validatorone');

-- Insert Validator Info
INSERT INTO ValidatorInfo (validatorId, skills, experience, cvLink, approved)
VALUES 
    (5, 'Web Security, Network Security', '5 years in cybersecurity', 'https://example.com/cv-validator1', TRUE);

-- Insert Validator Certifications
INSERT INTO ValidatorCertifications (validatorId, certificationName, link)
VALUES 
    (5, 'Certified Ethical Hacker', 'https://example.com/ceh'),
    (5, 'OSCP', 'https://example.com/oscp');

-- Insert Projects
INSERT INTO Projects (clientId, leadId, title, description, paymentAmount, visibility, status, startDate, endDate, technicalStack, pendingReports)
VALUES 
    (1, 3, 'Project Alpha', 'Alpha project description', 5000.00, 'Private', 'Active', '2024-01-01', '2024-12-31', 'React, Node.js', 0),
    (2, 3, 'Project Beta', 'Beta project description', 7000.00, 'Public', 'Pending', '2024-02-01', '2024-11-30', 'Python, Django', 0);

-- Insert Project Scope
INSERT INTO ProjectScope (projectId, scopeItem, description)
VALUES 
    (1, 'Feature A', 'Testing feature A for security vulnerabilities'),
    (1, 'Feature B', 'Ensuring secure data handling in feature B'),
    (2, 'API Security', 'Validating secure endpoints for the API');

-- Assign Validators to Projects
INSERT INTO ProjectValidators (projectId, validatorId)
VALUES 
    (1, 5),
    (2, 5);

-- Assign Hackers to Projects
INSERT INTO ProjectHackers (projectId, hackerId, assignedValidatorId, status)
VALUES 
    (1, 4, 5, 'Accepted'),
    (2, 4, 5, 'Invited');

-- Insert Bug Reports
INSERT INTO BugReports (projectId, hackerId, validatorId, severity, vulnerabilityType, description, impact, status)
VALUES 
    (1, 4, 5, 'Critical', 'SQL Injection', 'SQLi found in login form', 'Potential unauthorized access to database', 'Validated'),
    (1, 4, 5, 'Medium', 'Cross-Site Scripting', 'XSS in comments section', 'User session hijacking possible', 'Pending');

-- Insert Steps to Reproduce
INSERT INTO BugReproduceSteps (reportId, stepNumber, stepDescription, attachment)
VALUES 
    (1, 1, 'Navigate to login form and input malicious SQL payload', 'https://example.com/screenshot1'),
    (1, 2, 'Observe unauthorized access granted', 'https://example.com/screenshot2'),
    (2, 1, 'Enter malicious script in comment box', 'https://example.com/screenshot3');

-- Insert Payments
INSERT INTO Payments (reportId, hackerId, amount, paymentStatus)
VALUES 
    (1, 4, 1000.00, 'Completed'),
    (2, 4, 500.00, 'Pending');

-- Insert Complaints
INSERT INTO Complaints (filedBy, projectId, description, status)
VALUES 
    (1, 1, 'Validator delayed in report validation', 'Pending'),
    (4, 1, 'Client not responding to hacker queries', 'Resolved');

-- Insert Ratings
INSERT INTO Ratings (ratedBy, ratedUserId, projectId, rating, comments)
VALUES 
    (1, 4, 1, 5, 'Excellent work identifying vulnerabilities'),
    (5, 4, 1, 4, 'Good submission, but could be more detailed');

-- Insert Chat Rooms
INSERT INTO ChatRooms (projectId, type)
VALUES 
    (1, 'Main'),
    (2, 'Main');

-- Insert Chat Messages
INSERT INTO ChatMessages (chatRoomId, senderId, userRole, message)
VALUES 
    (1, 1, 'Client', 'Please proceed with the testing on Feature A.'),
    (1, 4, 'Hacker', 'Noted, will start testing right away.');

-- Insert Policies
INSERT INTO Policies (title, content)
VALUES 
    ('Bug Submission Guidelines', 'All bugs must be reproducible and include detailed descriptions.'),
    ('Payment Policy', 'Payments will be processed within 30 days of bug validation.');
