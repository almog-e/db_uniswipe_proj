# UniSwipe App – Software Documentation

    Software Name: UniSwipe App
    Version: 1.0.0
    Date: 17/01/2026
    Developers: Almog Eziony and Shilat Gahary


## 1. Introduction
UniSwipe is a full-stack web application designed to help students explore and discover university programs and institutions.  
It uses a **React + Vite frontend**, a **Node + Express backend**, and **MySQL** as the database.  

The app provides a **swipe-style interface** for browsing institutions and programs, and can prioritizing results based on user preferences.  
Authentication is implemented using **JWT tokens**, and the frontend communicates with the backend via REST API calls using the Fetch API.

---


## 2. System Overview

### Tech Stack
- Frontend: **React + Vite**  
- Backend: **Node.js + Express**  
- Database: **MySQL**  
- Authentication: **JWT (JSON Web Token)**  
- API calls: **Fetch API**  

---

## 3. Architectural Design

UniSwipe follows an **MVC-style architecture**:

- **Model:** MySQL database tables
- **View:** React components (UI, pages, and navigation)  
- **Controller:** Node/Express routes (API endpoints handling requests and interacting with the database)

[React Frontend] <--fetch--> [Node.js API] <--SQL--> [MySQL Database]

<!-- ### High-Level Diagram -->

<!-- project files struture? -->

---

### Authentication Flow

1. User registers/logs in with email/password  
2. Server validates credentials  
3. Server returns **JWT token**  
4. Frontend stores *jwt-token* in local storage, deletes it when logging out

---

### Frontend Implementation

 Fetch API 
 Swipe-style swiping displays institutions according to user selection 
 Most relevant programs are shown at the top in each institution view  

---

### Backend Implementation

- Node + Express handles services and routing
- Services validate requests and query database models  
- Passwords hashed using bcrypt  
- JWT tokens issued for authentication  
- API endpoints exposed to frontend  

---

## 4. Setup and Running

### Running Locally

**1. Backend (Server):**
    - Create a .env file in the server directory with the database info
    - Navigate to server directory
    - Run the following commands in the terminal:

        npm install
       
        npm run init-db          # first time only, in dataBase/scripts/ directory
       
        npm run dev

**2. Frontend (Client):**
    - Run the following commands in the terminal:

        npm install
        
        npm run dev

**3. App runs locally:**

    Frontend: http://localhost:5173

    Backend: http://localhost:3001

---

## 5. Database Design

Using MySQL software

### Database Schema

**Tables and Relationships:**


1. **users**
- `user_id` (PK)  
- `name`  
- `email` (unique)  
- `password_hash`  
- `gpa`  
- `sat_score`  
- `act_score`


2. **user_preferences**
- `pref_id` (PK)  
- `user_id` (FK -> users.user_id)  
- `preferred_region`  
- `preferred_degree_type`  
- `preferred_field_category`  
- `min_roi`  


3. **states**
- `state_code` (PK)  
- `state_name`  


4. **institutions**
- `uni_id` (PK)  
- `name`  
- `state` (FK -> states.state_code)  
- `city`  
- `zip`  
- `public_private`  
- `admission_rate`  
- `site_url`  
- `logo_url`  


5. **programs**
- `cip_code` (PK)  
- `name`  


6. **institutions_programs**
- `uni_prog_id` (PK)  
- `uni_id` (FK -> institutions.uni_id)  
- `cip_code` (FK -> programs.cip_code)  
- `degree_type`  
- UNIQUE constraint: `(uni_id, cip_code)`


7. **admissions**
- `admission_id` (PK)  
- `uni_id` (FK -> institutions.uni_id)  
- `sat_avg`  
- `act_avg`  


8. **program_outcomes**
- `outcome_id` (PK)  
- `uni_prog_id` (FK -> institutions_programs.uni_prog_id)  
- `earn_1year`  
- `earn_2years`  
- `roi_score`



**Relationships Overview:**
- `institutions_programs` links `institutions` <--> `programs` (many-to-many)  
- `institutions` <--> `states` (many-to-one)  
- `admissions` links `institutions` <--> test score averages  
- `program_outcomes` links `institutions_programs` <--> earnings and ROI  
- `users` <--> `user_preferences` (one-to-one)  



### Schema ERD:

<img width="7298" height="5554" alt="ERD" src="https://github.com/user-attachments/assets/fb71f251-7cb2-4d60-85bf-7a1935b1c509" />



