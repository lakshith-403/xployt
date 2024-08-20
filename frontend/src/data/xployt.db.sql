-- MySQL dump for Bug Bounty Platform

-- Create the database
CREATE DATABASE IF NOT EXISTS bug_bounty_platform;
USE bug_bounty_platform;

-- Users table to store all user types
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('Client', 'Project Lead', 'Hacker', 'Validator', 'Admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE clients (
    client_id INT PRIMARY KEY,
    username VARCHAR(15), 
    first_name VARCHAR(15),
    last_name VARCHAR(15),
    email VARCHAR(20),
    company_name VARCHAR(255),
    phone VARCHAR(20),
    FOREIGN KEY (client_id) REFERENCES users(user_id)
);

-- Project Leads table
CREATE TABLE project_leads (
    lead_id INT PRIMARY KEY,
    username VARCHAR(15),
    first_name VARCHAR(15),
    last_name VARCHAR(15),
    email VARCHAR(20),
    phone VARCHAR(20), // check
    FOREIGN KEY (lead_id) REFERENCES users(user_id)
);

-- Hackers table
CREATE TABLE hackers (
    hacker_id INT PRIMARY KEY,
    username VARCHAR(15),
    first_name VARCHAR(15),
    last_name VARCHAR(15),
    email VARCHAR(20),
    approved BOOLEAN DEFAULT FALSE,
    experience TEXT,
    interests TEXT,
    FOREIGN KEY (hacker_id) REFERENCES users(user_id)
);

-- Validators table
CREATE TABLE validators (
    validator_id INT PRIMARY KEY,
    username VARCHAR(15),
    first_name VARCHAR(15),
    last_name VARCHAR(15),
    email VARCHAR(20),
    skills TEXT,
    experience TEXT,
    approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (validator_id) REFERENCES users(user_id)
);

-- Admins table
CREATE TABLE admins (
    admin_id INT PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES users(user_id)
);
 
-- Projects table
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    lead_id INT,
    title VARCHAR(255),
    description TEXT,
    scope TEXT,
    payment_amount DECIMAL(10, 2),
    visibility ENUM('Public', 'Private') DEFAULT 'Private',
    status ENUM('Pending', 'Active', 'Completed') DEFAULT 'Pending',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (lead_id) REFERENCES project_leads(lead_id)
);
CREATE TABLE project_scope (
    project_id INT,
    scope_item TEXT,
    description TEXT,
    PRIMARY KEY (project_id, scope_item),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Project Hackers table (many-to-many relationship between projects and hackers)
CREATE TABLE project_hackers (
    project_hacker_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    hacker_id INT,
    assigned_validator_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Invited', 'Accepted', 'Declined') DEFAULT 'Invited', // Check
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (hacker_id) REFERENCES hackers(hacker_id)
);

-- Bug Reports table
CREATE TABLE bug_reports (
    report_id INT,
    version VARCHAR(15),
    project_id INT,
    hacker_id INT,
    validator_id INT,
    severity ENUM('Low', 'Medium', 'High', 'Critical', 'Informational'),
    vulnerability_type ENUM('SQL Injection', 'Cross-Site Scripting', 'Broken Authentication', 'Sensitive Data Exposure', 'Security Misconfiguration', 'Insecure Deserialization', 'Using Components with Known Vulnerabilities', 'Insufficient Logging & Monitoring', 'Other'),
    description TEXT,
    impact TEXT, // Check
    status ENUM('Pending', 'Validated', 'Rejected', 'More Info') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (hacker_id) REFERENCES hackers(hacker_id),
    FOREIGN KEY (validator_id) REFERENCES validators(validator_id),
    PRIMARY KEY (report_id, project_id)
);
CREATE TABLE bug_reproduce_steps (
    report_id INT,
    version VARCHAR(15),
    step_number INT,
    step_description TEXT,
    PRIMARY KEY (report_id, step_number),
    FOREIGN KEY (report_id) REFERENCES bug_reports(report_id)
);

-- Payments table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT,
    hacker_id INT,
    amount DECIMAL(10, 2),
    payment_status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (report_id) REFERENCES bug_reports(report_id),
    FOREIGN KEY (hacker_id) REFERENCES hackers(hacker_id)
);

-- Complaints table
CREATE TABLE complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    filed_by INT,
    project_id INT,
    description TEXT,
    status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (filed_by) REFERENCES users(user_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Ratings table
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    rated_by INT,
    rated_user_id INT,
    project_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rated_by) REFERENCES users(user_id),
    FOREIGN KEY (rated_user_id) REFERENCES users(user_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);
