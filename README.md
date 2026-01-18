# UniSwipe App: A Tinder-Inspired institutions Platform to find the best match

<img width="70" height="70" alt="logo" src="https://github.com/user-attachments/assets/6153d1d8-b9d8-4d12-a5ff-359a14431d3c" />


## Purpose
UniSwipe is a full-stack web application designed to help students explore and discover institutions and programs in USA, in an interactive and personalized way.  
Its main goal is to simplify the decision-making process for high-school students choosing institution programs, but anyone interested in programs can benefit.  

The app uses a Tinder-style interface for swiping through institutions based on user preferences. Users can indicate interest by liking institutions, and the app dynamically displays programs according to the selected order of preference. When viewing an institution’s information, the programs it offers are displayed, with the most relevant programs shown at the top. This makes discovering institutions and programs easy, comfortable, and fun.

---

## Key Features

- **User Registration and Login**
  - Register a new account with full name, email, and scores (SAT,ACT and GPA)
  - Login with email and password

<img width="363" height="241" alt="image" src="https://github.com/user-attachments/assets/c790820c-6e24-493b-a77f-a4307894a546" />
<img width="315" height="258" alt="image" src="https://github.com/user-attachments/assets/057485b5-e55a-4a68-8e08-0d568ea21f7f" />


- **Discover institutions**
  - Swipe through institutions interactively
  - Programs are displayed according to your selected preference order
  - Shows institution info, programs, and key details

<img width="1038" height="533" alt="image" src="https://github.com/user-attachments/assets/7240e2c9-bd63-434c-a26a-a8a72516e43e" />
<img width="528" height="237" alt="image" src="https://github.com/user-attachments/assets/4dd52e59-5b27-47ba-94ab-a24841d11276" />
<img width="840" height="793" alt="image" src="https://github.com/user-attachments/assets/9c25e44b-b483-4d0a-956b-da088b8e908f" />

- **My Likes / Favorites**
  - Save institutions you are interested in
  - View and manage all liked intitutions
 
<img width="887" height="454" alt="image" src="https://github.com/user-attachments/assets/38333c02-2db9-4a62-a311-49b9e881758a" />

- **Preferences**
  - Set preferred state, degree type, field/program and minimun ROI
  - Adjust recommendation order for institutions discovery

<img width="885" height="610" alt="image" src="https://github.com/user-attachments/assets/09436081-3483-4146-b368-44ab0184c7ba" />

- **Analytics**
  - Overview of institutions and programs patterns
  - Compare institutions and programs based on selected criteria (e.g., addmission rate, salary, ROI...)

<img width="837" height="837" alt="image" src="https://github.com/user-attachments/assets/d7c40959-7b11-460d-b62d-ecc46e783fe5" />

- **Navigation**
  - Move between sections:
    - Discover (swipe institutions)
    - My Likes (favorites)
    - Analytics (institutions insights)
    - Preferences (set and adjust filters)

<img width="1024" height="114" alt="image" src="https://github.com/user-attachments/assets/651761d8-9d15-4fd0-b019-61847ee63b04" />

---

## Setup

You will need **Node.js** and **MySQL** installed locally.

### Getting Started

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

### Running Everything

Just open two terminals and run *npm run dev* in each (remember to 'cd server' for the backend).






