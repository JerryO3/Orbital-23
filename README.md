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

