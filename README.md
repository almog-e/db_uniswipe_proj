# UniSwipe App – User Manual / README

## Purpose
UniSwipe is a full-stack web application designed to help students explore and discover institutions and programs in USA, in an interactive and personalized way.  
Its main goal is to simplify the decision-making process for high-school students choosing institution programs, but anyone interested in programs can benefit.  

The app uses a **Tinder-style interface** for swiping through institutions according to user preferences. Users can indicate interest by liking intitutions, and the app dynamically displays programs based on the selected order of preference. This makes discovering institutions and programs easy, comfortable and fun.

---

## Key Features

- **User Registration and Login**
  - Register a new account with full name, email, and scores (SAT,ACT and GPA)
  - Login with email and password
- **Discover institutions**
  - Swipe through institutions interactively
  - Programs are displayed according to your selected preference order
  - Shows institution info, programs, and key details
- **My Likes / Favorites**
  - Save institutions you are interested in
  - View and manage all liked intitutions
- **Preferences**
  - Set preferred state, degree type, field/program and minimun ROI.
  - Adjust recommendation order for institutions discovery
- **Analytics**
  - Overview of institutions and programs patterns
  - Compare institutions and programs based on selected criteria (e.g., addmission rate, salary, ROI...)
- **Navigation**
  - Move between sections:
    - Discover (swipe institutions)
    - My Likes (favorites)
    - Analytics (institutions insights)
    - Preferences (set and adjust filters)

---

## Setup

You will need **Node.js** and **MySQL** installed locally.

## Getting Started

Open 2 terminals, one for frontend and the other for backend:

### Frontend (Client)
Run the following commands:

    npm install
    npm run dev

Runs on http://localhost:5173

### Backend (Server)
Run the following commands:

    cd server
    npm install

Create a .env file in the server directory:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=myreactapp

Then navigate to dataBase/scripts/ and run:

    npm run init-db
    npm run dev

## Running Everything

Just open two terminals and run npm run dev in each (remember to 'cd server' for the backend)






