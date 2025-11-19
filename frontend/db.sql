-- Table for Web Development
CREATE TABLE web_dev (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  school VARCHAR(100),
  whatsappNo VARCHAR(20),
  birthday DATE,
  schoolLogo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Game Development
CREATE TABLE game_dev (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  school VARCHAR(100),
  whatsappNo VARCHAR(20),
  birthday DATE,
  schoolLogo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Algorithm Competition
CREATE TABLE algorithm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  school VARCHAR(100),
  whatsappNo VARCHAR(20),
  birthday DATE,
  schoolLogo VARCHAR(255),
  hackerRankID VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Poster Design
CREATE TABLE poster_design (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  school VARCHAR(100),
  whatsappNo VARCHAR(20),
  birthday DATE,
  schoolLogo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Manipulation Arts
CREATE TABLE manipulation_art (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  school VARCHAR(100),
  whatsappNo VARCHAR(20),
  birthday DATE,
  schoolLogo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for eSport Team Members
CREATE TABLE esport (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teamName VARCHAR(100),
  school VARCHAR(100),
  schoolLogo VARCHAR(255),
  playerIndex INT,
  fullName VARCHAR(100),
  codm_id VARCHAR(100),
  birthday DATE,
  whatsappNo VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email, teamName) -- avoid duplicates within team
);

-- Table for Quiz Teams
CREATE TABLE quiz (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school VARCHAR(100),
  schoolLogo VARCHAR(255),
  memberIndex INT,
  fullName VARCHAR(100),
  birthday DATE,
  email VARCHAR(100),
  whatsappNo VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email, school) -- avoid duplicates within school
);




-- Web Development submissions (with GitHub and live URL)
CREATE TABLE IF NOT EXISTS web_dev_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school VARCHAR(255),
  fullName VARCHAR(255), 
  email VARCHAR(255) UNIQUE,
  whatsappNo VARCHAR(20), 
  github_link TEXT,
  live_url TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game Development submissions (Google Drive link)
CREATE TABLE IF NOT EXISTS game_dev_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school VARCHAR(255),
  fullName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  whatsappNo VARCHAR(20),
  google_drive_link TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pixora - Poster Design submissions
CREATE TABLE IF NOT EXISTS poster_design_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school VARCHAR(255),
  fullName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  whatsappNo VARCHAR(20),
  google_drive_link TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pixora - Manipulation Arts submissions
CREATE TABLE IF NOT EXISTS manipulation_arts_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school VARCHAR(255),
  fullName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  whatsappNo VARCHAR(20),
  google_drive_link TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
