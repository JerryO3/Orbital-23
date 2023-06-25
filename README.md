# Orbital-23
Schedule Manager Web App

Problem Motivation
Never double book yourself again with Schedule Manager. A handy tool to oversee multiple group projects and deadlines, 
let Schedule Manager help you manage your time better! 

Project Mock-up:
https://www.canva.com/design/DAFkKiufM-s/qXZWgLX5xqwkaHhPGSWzwQ/edit?utm_content=DAFkKiufM-s&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

Core Features (Implemented)
1. Login (w/ backend and input protection)
2. Register (w/ backend and input protection)
3. Reset Password (Partially Implemented: Yet to implement email authentication backend)

Core Features (To be Implemented)
1. Project View
2. Actions
- Create Event
- Set Blockout Timing
- Set Manual Reminders
- Configure Settings
- Go to tele group
3. Implement App Logic
- Clashes
- Blockout
- Tele Bot

User Stories
"During the semester, with so many projects and deadlines, it can be hard to keep track of all the different deliverables for each project.
It would be handy to see ahead of time which submissions and deliverables clash and more easily plan group meetings around everyone's schedules."

"With so many academic and CCA projects, it can be a big headache if there is a need to inform different groups of people that you are no longer
free or already booked on those dates. It would be great if I could automate this by messaging all my groups at once"

Design and Plan
Using the FERN stack, we are implementing the app logic directly in JSX. We intend to implement a circular JSON object as our key data structure, where:
there exists a 1-to-many relation between users and projects (a user can have projects), projects and events (a project can have many events) and events and
attendees (an event can have many users attending it).

This would mean that the unique identifier is userid, and successive layers in the JSON object are projects, events and users, resulting in a 4-layer deep JSON
object.

Features:
![image](https://github.com/jinyuan0425/Orbital-23/assets/108602250/50f5d0df-2a2b-45e3-8681-ad52e55de6bb)
This is the user's dashboard where they will be able to see a calendar of their events, along with the options to view their projects and blockouts.

![image](https://github.com/jinyuan0425/Orbital-23/assets/108602250/5f2dd1d2-3f3d-471a-9def-4fd78b072275)
This is the user's projects page where they will be able to select their existing project or create a new project.
Similarly for blockout, the user will be able to view their blockouts and create new blockouts.

![image](https://github.com/jinyuan0425/Orbital-23/assets/108602250/7e19de80-b8da-445f-a950-45f3a5ddbc8b)
Upon choosing a project, the user will then be able to view the events under this projects that they are involved in, as well as add or remove users under manage members. The user will also be able to delete the project along with all the events within the project.
Similarly for blockouts, the user will be able to view all the periods under the blockout and will be able to delete the blockout along with all the periods under the blockout.

![image](https://github.com/jinyuan0425/Orbital-23/assets/108602250/1dafd8cd-5c66-4830-b89b-d89c98e73d89)
After selecting an event, the user will be able to see details of the event. The user will be able to update these details and also delete the event.
Selecting an event via the calendar will quickly redirect the user to this page as well.

![image](https://github.com/jinyuan0425/Orbital-23/assets/108602250/d1defbc5-950b-4ce8-8bd1-91618832134a)
This is the page for creating a new event. The user will be prompted to input the necessary details needed for the creation of an event. Updating of an event shows a similar page, but with the fields all filled up with the existing data in the database, along with a delete event button.
Similarly for periods, the page mirrors that of create event and update event for create period and update period respectively. There is however a lack of users field for periods.
Selecting a period via the calendar will quickly redirect the user to the update period page for the selected period.



Backend:
For our database, we used the firebase realtime database with the following structure:
- users
  - memberId1
    - username: "John Doe"
    - email: "johndoe@example.com"
    - telegramHandle: "@johndoe"
    - notificationDuration: 15
  - memberId2
    - username: "Jane Smith"
    - email: "janesmith@example.com"
    - telegramHandle: "@janesmith"
    - notificationDuration: 10

- projects
  - projectId1
    - projectName: "Project 1"
    - ownerId: "memberId1"
  - projectId2
    - projectName: "Project 2"
    - ownerId: "memberId2"

- events
  - eventId1
    - eventName: "Event 1"
    - projectId: "projectId1"
    - startDateTime: 1653062400000
    - endDateTime: 1653148799000
  - eventId2
    - eventName: "Event 2"
    - projectId: "projectId2"
    - startDateTime: 1653148800000
    - endDateTime: 1653191999000

- blockouts
  - blockoutId1
    - name: "Blockout 1"
    - startDate: "2023-05-22"
    - endDate: "2023-05-23"
    - userId: "memberId1"

- periods
  - periodId1
    - name: "Period 1"
    - startDateTime: 1653062400000
    - endDateTime: 1653148799000
    - blockoutId: "blockoutId1"
    - userId: "memberId1"
  - periodId2
    - name: "Period 2"
    - startDateTime: 1653148800000
    - endDateTime: 1653191999000
    - blockoutId: "blockoutId1"
    - userId: "memberId2"

- membership
  - memberId1
    - projectId1: true
    - blockoutId1: true
    - eventId1: true
    - periodId1: true
  - memberId2
    - projectId2: true
    - periodId2: true

1. Users: Contains information about the users in your application. Each user is identified by a unique memberId and has fields such as username, email, telegramHandle, and notificationDuration.

2. Projects: Represents the projects in your application. Each project is identified by a unique projectId and has fields like projectName and ownerId, which indicates the memberId of the user who owns the project.

3. Events: Stores information about the events in your application. Each event is identified by a unique eventId and includes fields such as eventName, projectId (identifying the project the event belongs to), startDateTime (the start date and time of the event in milliseconds), and endDateTime (the end date and time of the event in milliseconds).

4. Blockouts: Represents blockout periods, which are time periods when specific users are unavailable. Each blockout is identified by a unique blockoutId and contains fields like name, startDate (in yyyy-mm-dd format), endDate (in yyyy-mm-dd format), and userId (the memberId of the user associated with the blockout).

5. Periods: Stores information about specific time periods defined within blockouts. Each period is identified by a unique periodId and includes fields such as name, startDateTime (the start date and time of the period in milliseconds), endDateTime (the end date and time of the period in milliseconds), blockoutId (identifying the blockout the period belongs to), and userId (the memberId of the user associated with the period).

6. Membership: Tracks the membership or involvement of users in various items such as projects, blockouts, events, and periods. Under the membership node, each memberId has subnodes corresponding to the item type (projectId, blockoutId, eventId, periodId). The value of each subnode is set to true, indicating the user's membership or involvement in that item.

This structure allows us to store and retrieve information related to users, projects, events, blockouts, and periods, and track the membership of users in different items within our application. Each project will contain multiple events and each blockout will contain multiple periods.
