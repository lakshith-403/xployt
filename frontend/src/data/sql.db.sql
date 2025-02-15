-- Create the database
CREATE DATABASE IF NOT EXISTS xployt;
USE xployt;

-- Users table to store all user types
CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('Client', 'ProjectLead', 'Hacker', 'Validator', 'Admin') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Profiles table (specific to clients, project leads, hackers, and validators)
CREATE TABLE UserProfiles (
    profileId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL UNIQUE,
    username VARCHAR(15),
    firstName VARCHAR(15),
    lastName VARCHAR(15),
    phone VARCHAR(20),
    companyName VARCHAR(255),
    dob DATE,
    linkedIn VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

-- Validators table for additional information
CREATE TABLE ValidatorInfo (
    validatorId INT PRIMARY KEY,
    skills TEXT,
    experience TEXT,
    cvLink VARCHAR(255),
    approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (validatorId) REFERENCES Users(userId)
);

-- Validator Certifications
CREATE TABLE ValidatorCertifications (
    validatorId INT NOT NULL,
    certificationName VARCHAR(50),
    link VARCHAR(255),
    PRIMARY KEY (validatorId, certificationName),
    FOREIGN KEY (validatorId) REFERENCES ValidatorInfo(validatorId)
);

-- Projects table
CREATE TABLE Projects (
    projectId INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    leadId INT,
    title VARCHAR(255),
    description TEXT,
    paymentAmount DECIMAL(10, 2),
    visibility ENUM('Public', 'Private') DEFAULT 'Private',
    state ENUM('Pending', 'Active', 'Completed', 'Unconfigured') DEFAULT 'Pending',
    startDate DATE,
    endDate DATE,
    technicalStack TEXT,
    pendingReports INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clientId) REFERENCES Users(userId),
    FOREIGN KEY (leadId) REFERENCES Users(userId)
);

-- Project Scope table
CREATE TABLE ProjectScope (
    scopeId INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    scopeItem TEXT,
    description TEXT,
    FOREIGN KEY (projectId) REFERENCES Projects(projectId)
);

-- Validators assigned to projects
CREATE TABLE ProjectValidators (
    projectValidatorId INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    validatorId INT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES Projects(projectId),
    FOREIGN KEY (validatorId) REFERENCES ValidatorInfo(validatorId)
);

-- Hackers assigned to projects
CREATE TABLE ProjectHackers (
    projectHackerId INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    hackerId INT NOT NULL,
    assignedValidatorId INT,
    joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES Projects(projectId),
    FOREIGN KEY (hackerId) REFERENCES Users(userId),
    FOREIGN KEY (assignedValidatorId) REFERENCES ValidatorInfo(validatorId)
);

CREATE TABLE Invitations (
    HackerID  INT NOT NULL,
    ProjectID INT NOT NULL,
    InvitedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (HackerID, ProjectID),
    FOREIGN KEY (ProjectID) REFERENCES Projects (ProjectID),
    FOREIGN KEY (HackerID) REFERENCES Users (UserID)
);

-- Bug Reports table
CREATE TABLE BugReports (
    reportId INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    hackerId INT NOT NULL,
    validatorId INT,
    severity ENUM('Low', 'Medium', 'High', 'Critical', 'Informational'),
    vulnerabilityType ENUM(
        'SQL Injection', 
        'Cross-Site Scripting', 
        'Broken Authentication', 
        'Sensitive Data Exposure', 
        'Security Misconfiguration', 
        'Insecure Deserialization', 
        'Using Components with Known Vulnerabilities', 
        'Insufficient Logging & Monitoring', 
        'Other'
    ),
    description TEXT,
    impact TEXT,
    status ENUM('Pending', 'Validated', 'Rejected', 'More Info') DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES Projects(projectId),
    FOREIGN KEY (hackerId) REFERENCES Users(userId),
    FOREIGN KEY (validatorId) REFERENCES ValidatorInfo(validatorId)
);

-- Steps to Reproduce for Bug Reports
CREATE TABLE BugReproduceSteps (
    stepId INT AUTO_INCREMENT PRIMARY KEY,
    reportId INT NOT NULL,
    stepNumber INT NOT NULL,
    stepDescription TEXT,
    attachment VARCHAR(255),
    FOREIGN KEY (reportId) REFERENCES BugReports(reportId)
);

-- Payments table
CREATE TABLE Payments (
    paymentId INT AUTO_INCREMENT PRIMARY KEY,
    reportId INT,
    hackerId INT,
    amount DECIMAL(10, 2),
    paymentStatus ENUM('Pending', 'Completed') DEFAULT 'Pending',
    paidAt TIMESTAMP NULL,
    FOREIGN KEY (reportId) REFERENCES BugReports(reportId),
    FOREIGN KEY (hackerId) REFERENCES Users(userId)
);

-- Complaints table
CREATE TABLE Complaints (
    complaintId INT AUTO_INCREMENT PRIMARY KEY,
    filedBy INT NOT NULL,
    projectId INT,
    description TEXT,
    status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (filedBy) REFERENCES Users(userId),
    FOREIGN KEY (projectId) REFERENCES Projects(projectId)
);

-- Ratings table
CREATE TABLE Ratings (
    ratingId INT AUTO_INCREMENT PRIMARY KEY,
    ratedBy INT NOT NULL,
    ratedUserId INT,
    projectId INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ratedBy) REFERENCES Users(userId),
    FOREIGN KEY (ratedUserId) REFERENCES Users(userId),
    FOREIGN KEY (projectId) REFERENCES Projects(projectId)
);

-- Chat Rooms
CREATE TABLE ChatRooms (
    chatRoomId INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT,
    type ENUM('Main', 'ProjectLead-Client', 'Validator-Hacker'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES Projects(projectId)
);

-- Chat Messages
CREATE TABLE ChatMessages (
    messageId INT AUTO_INCREMENT PRIMARY KEY,
    chatRoomId INT NOT NULL,
    senderId INT NOT NULL,
    userRole ENUM('Client', 'ProjectLead', 'Hacker', 'Validator', 'Admin'),
    message TEXT,
    sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatRoomId) REFERENCES ChatRooms(chatRoomId),
    FOREIGN KEY (senderId) REFERENCES Users(userId)
);

-- Policies table
CREATE TABLE Policies (
    policyId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
