# UniSwipe App: A swipe-style institutions Platform to find the best match

<p align="center">
<img width="400" height="400" alt="logo" src="https://github.com/user-attachments/assets/6153d1d8-b9d8-4d12-a5ff-359a14431d3c" />
</p>

## Purpose
UniSwipe is a full-stack web application designed to help students explore and discover institutions and programs in USA, in an interactive and personalized way.  
Its main goal is to simplify the decision-making process for high-school students choosing institution programs, but anyone interested in programs can benefit.  

The app uses a swipe-style interface for swiping through institutions based on user preferences. Users can indicate interest by liking institutions, and the app dynamically displays programs according to the selected order of preference. When viewing an institution’s information, the programs it offers are displayed, with the most relevant programs shown at the top. This makes discovering institutions and programs easy, comfortable, and fun.

---

## Key Features

- ### **User Registration and Login**
  - Register a new account with full name, email, and scores (SAT,ACT and GPA)
  - Login with email and password


    <img width="373" height="258" alt="image" src="https://github.com/user-attachments/assets/c790820c-6e24-493b-a77f-a4307894a546" />
    
    <img width="315" height="258" alt="image" src="https://github.com/user-attachments/assets/057485b5-e55a-4a68-8e08-0d568ea21f7f" />


- ### **Discover institutions**
  - Swipe through institutions interactively
  - Programs are displayed according to your selected preference order
  - Shows institution info, programs, and key details


    <img width="184" height="247" alt="image" src="https://github.com/user-attachments/assets/8103ba41-3eb5-4fcd-9c00-c0ba25b92c75" />
    
    <img width="528" height="237" alt="image" src="https://github.com/user-attachments/assets/4dd52e59-5b27-47ba-94ab-a24841d11276" />

    <img width="420" height="397" alt="image" src="https://github.com/user-attachments/assets/9c25e44b-b483-4d0a-956b-da088b8e908f" />


- ### **My Likes**
  - Save institutions you are interested in
  - View and manage all liked intitutions

 
    <img width="443" height="272" alt="image" src="https://github.com/user-attachments/assets/38333c02-2db9-4a62-a311-49b9e881758a" />


- ### **My Matches**
  - Save institutions you are interested in and have relevant programs based on your SAT/ACT scores
  - View and manage all matched intitutions

 
    <img width="428" height="236" alt="image" src="https://github.com/user-attachments/assets/ad2817eb-40d1-41ba-9b4c-b3c2d439248e" />


- ### **Analytics**
  - Overview of institutions and programs patterns
  - Compare institutions and programs based on selected criteria (e.g., addmission rate, salary, ROI...)


    <img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/d7c40959-7b11-460d-b62d-ecc46e783fe5" />

 
- ### **Preferences**
  - Set preferred state, degree type, field/program and minimun ROI
  - Adjust recommendation order for institutions discovery


    <img width="442" height="305" alt="image" src="https://github.com/user-attachments/assets/09436081-3483-4146-b368-44ab0184c7ba" />


- ### **API/Docs**
  - Documents all available API calls for the UniSwipe backend
  - Focus on Home page and Analytics page
  - Shows endpoints, queries and tests


    <img width="500" height="142" alt="image" src="https://github.com/user-attachments/assets/6674f091-2574-4713-8260-f8b92202d8f2" />

    <img width="736" height="168" alt="image" src="https://github.com/user-attachments/assets/55c77bba-0336-4f62-93c9-4e812316a941" />

    <img width="609" height="132" alt="image" src="https://github.com/user-attachments/assets/d9b73b16-b088-4c28-a992-24542863574b" />



- ### **Navigation**
  - Move between sections:
    - Discover (swipe institutions)
    - My Likes (favorites)
    - My Matches (institutions with relevat programs)
    - Analytics (institutions insights)
    - Preferences (set and adjust filters)
    - API/Docs (see endpoints and queries)


      <img width="1284" height="105" alt="image" src="https://github.com/user-attachments/assets/ba646c8f-ad55-426b-9b9a-ea27fc7ce03f" />


---

## Setup

You will need **Node.js** and **MySQL** installed locally.

**If any command doesn't work - try open terminals in CMD as administrator.**

### Getting Started:

**Only required the first time — no need if the app has run before on this computer.**

Open 2 terminals, one for frontend and the other for backend:

### Frontend (Client)
Run the following commands:

    npm install
    npm start

Runs on http://localhost:5173

### Backend (Server)
Run the following commands:

    cd server
    npm install

Runs on http://localhost:3001

Create a .env file in the server directory and fill the following lines with your data info:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=myreactapp

Also, remember to update the databse name in the sctipts (where there's USE database_name;)

Then navigate to dataBase/scripts/ and run:

    npm run init-db          # only if the database does not already exist
    npm start

### Running Everything:

Just open two terminals (CMD as administrator) and run **npm start** in each (remember to 'cd server' for the backend).






