# ScrumHub

ScrumHub is a full-stack project management application built for teams that use the Scrum methodology.

The application allows users to manage projects, sprints, tasks, backlog items, test cases and bugs. Different roles have different permissions depending on their responsibilities in the project.

## Main Features

* User registration and login
* JWT authentication
* Role-based access control
* Project management
* Sprint management
* Product backlog
* Epic and task management
* Task comments
* Test case management
* Bug reporting
* Different dashboards depending on the user role

### User Roles

* Product Owner
* Scrum Master
* Developer
* Software Tester
* Guest

Each role has different permissions and access to different parts of the application.

## Technologies

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* Spring Security
* JWT
* REST API
* Maven

### Frontend

* React
* JavaScript
* HTML
* CSS

### Database

* SQL
* JPA / Hibernate

## Project Structure

```text
ScrumHub
├── backend
└── frontend
```

The backend is divided into different layers:

```text
controller
service
repository
model
```

The frontend contains the React components, pages and services used to communicate with the backend.

## Authentication

Authentication is implemented using Spring Security and JWT.

Passwords are stored using BCrypt hashing and access to the application is controlled using user roles.

## How it works

A Product Owner can manage the product backlog and epics.

A Scrum Master can create projects, manage sprints and assign tasks.

Developers can work with their assigned tasks and update their progress.

Software Testers can create and execute test cases and report bugs.

Guests have read-only access to project information.

## Running the project

Clone the repository:

```bash
git clone https://github.com/EdisonZyberaj/ScrumHub.git
```

### Backend

Go to the backend folder and run:

```bash
mvn spring-boot:run
```

### Frontend

Go to the frontend folder and install the dependencies:

```bash
npm install
```

Then start the application:

```bash
npm start
```

## Project Structure

The application follows a layered backend architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

The frontend communicates with the backend through REST APIs.

## Purpose

The main purpose of this project was to build a complete full-stack application while applying concepts such as:

* Spring Boot
* REST APIs
* JPA and Hibernate
* Spring Security
* JWT authentication
* React
* Database relationships
* Role-based authorization
* Scrum project management

## Repository

https://github.com/EdisonZyberaj/ScrumHub
