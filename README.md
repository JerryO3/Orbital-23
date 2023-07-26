<h1>Schedule Manager</h1>

Never able to find time to meet? Always forgetting that one appointment you made weeks ago and double-booking yourself? Schedule Manager got your back. 

A project motivated by the busy and constantly evolving schedules of NUS students, Jin Yuan and I have worked hard to come up with a potential solution to pesky scheduling mishaps.

Let us do the scheduling for you, try it out here: 

**WebApp Link: https://schedule-manager-94579.web.app/**

**Telegram Bot: Not hosted yet**

 

<h3>Video and Poster:</h3>
Video Link: https://www.canva.com/design/DAFpfJ28t48/6f2CvhmWti73C8qKj65guQ/watch?utm_content=DAFpfJ28t48&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink

Poster Link: https://www.canva.com/design/DAFm159xVd4/yzqrdpvg55S_8EnVufGHtw/edit?utm_content=DAFm159xVd4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

 

**User Stories:**
"During the semester, with so many projects and deadlines, it can be hard to keep track of all the different deliverables for each project.
It would be handy to see ahead of time which submissions and deliverables clash and more easily plan group meetings around everyone's schedules."

"With so many academic and CCA projects, it can be a big headache if there is a need to inform different groups of people that you are no longer
free or already booked on those dates. It would be great if I could automate this by messaging all my groups at once"

 

**Completed Core Features as of Milestone 3:**
1. Project creation and Editing with the ability to add project members via email
![Collab1](https://github.com/JerryO3/Orbital-23/assets/122331089/215ca1f2-8689-48ea-8a0a-2d0f7a4407a9)

2. Event Creation with the ability to toggle membership of project members

3. Updating Event name, start date and time, end date and time, and membership after previous event creation
![Collab2](https://github.com/JerryO3/Orbital-23/assets/122331089/f68d2514-be49-427f-81ea-55af6bb8843c)

4. Improved dashboard showing user calendar, projects (& project progress) and blockouts on the same screen (optimized for mobile as well)
![Glance](https://github.com/JerryO3/Orbital-23/assets/122331089/51b12e9e-fb12-4088-8d04-afbf8a8ced11)

5. Responsive Calendar with realtime updates, and clickable events

6. Event Conflict Detection for all selected event members during the event creation and updating phase
![Conflict](https://github.com/JerryO3/Orbital-23/assets/122331089/f8de649c-d917-4a89-9fc7-bab29a378f62)

7. Timeslot suggestion for team leads to easily propose event timings that where selected team members are free
![Suggest](https://github.com/JerryO3/Orbital-23/assets/122331089/98420cb3-7951-4a4a-9870-94680856cb81)

8. Set up blockouts that represent a length of time within which busy periods (single or recurring) can be prescribed (e.g. If Semester 1 is the blockout, then individual classes can be set as recurring periods within Semester 1) 
![Blockout](https://github.com/JerryO3/Orbital-23/assets/122331089/f3a7211f-1fbd-43e1-9806-76c13dee73f1)

**To be implemented by splashdown:**
1. Telegram bot interface for personal use that can show upcoming events and create new events within existing projects

2. Telegram bot interface for project teams that can be used to view events within the project tied to the bot instance

**Dropped Features (Potentially implemented in future)**
1. Reminders via telegram bot

2. Expanded Telegram Bot Functionality (similar to webapp)

3. Linking to Google Calendar

 

**Testing:**
Functions were grouped into pure functions and React Components, and unit testing was done for both pure functions (edge-case inputs) and components (input fields and interactivity). A total of 27 tests were written. 

**Pure Functions Unit Testing**

<p>1. About 20% code coverage for pure functions. </p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/0b7e821e-215f-49d1-b670-83b29276f80f)

<p> 2. Edge-case inputs were discussed and used to test several potential edge-cases for each pure function that takes in arguments that are exported </p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/fc8f65d1-1715-46f5-8b1e-c5d98cf7290f)

3. Pure function testing was further limited to functions that did not have sufficient input validation

**Component Unit Testing**

<p>1. About 20% code coverage for components. </p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/0fee1711-ea46-4819-8867-beec5680dc8a)

2. Testing was limited to the login, register, settings and dashboard pages, with minimal testing of nested react components due to issues with mocking data

3. Testing was done with a focus on identifying uncaught errors that were unnoticed in pure function unit testing (i.e. invalid login credentials)

**User Testing**

<p>1. Google Form link is attached at the bottom of the home page for users to provide feedback: https://forms.gle/VcJ2aqPUm1octQ8C9 </p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/cd125419-11b0-43e2-a187-ece60a79669d)

2. Currently collected feedback from 5 users, and will continue to collect feedback as the website is deployed (Feel free to write feedback there as well!)

3. Feedback are stored in a google spreadsheet for ease of reference to the various bug reports and feedbacks 

 

<h3>Technologies Used:</h3>
We used the FERN stack, and used Tailwindcss to aid with styling. In addition, libraries such as recharts, luxon and react-big-calendar were used for graphs, time representation and the calendar display respectively. The telegram bot was built using Telegraf, so that the jsx code used for the webapp could be reused for the telegram bot.

**Storage and Hosting:**

Firebase Realtime Database and Hosting under the blaze pay-as-you-use plan

**Web Framework:**

Expressjs

**Front-end Framework:**

Reactjs and Telegraf (for telegram bot)

**Package Manager:**

Nodejs

**Testing:**

Jest

**Database Structure:**
![image](https://github.com/JerryO3/Orbital-23/assets/122331089/faa7175f-3aa7-473b-a644-db7b9a61f4b2)

To minimize tree-depth, we opted to split the database into 6 "branches" from the database root:

<p>1. blockouts: containing start and end date, name and associated userid</p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/212a1b53-780a-4a14-bba0-f8b21c956187)

<p>2. events: containing start and end datetime, members object [key: userid, value: boolean (something like fingerprint hashtable)], name and projectid</p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/09fcb603-730b-4640-be58-e9291715a6d2)

<p>3. membership: Most critically, the next level within this branch is userid, and this branch contains all events, projects, periods, blockouts that are associated with the user. This allows for the collaborative functionality for projects and events, as well as being a one-stop-shop for calendar data and conflict detection</p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/483951ed-6d57-4f4c-9819-81f66f804f4c)

<p>4. periods: containing start and end datetime, userid, name and blockoutid</p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/d6586470-04d6-4343-a972-cc131f5274f4)

<p>5. projects: contains project members and project name</p>

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/5c4a436b-aba9-4f21-a8bb-6e3d9fca09b6)

<p>6. users: contains user preferences and information</p>

![Screenshot 2023-07-26 145603](https://github.com/JerryO3/Orbital-23/assets/122331089/9c63e59b-bc21-4d91-970c-d43a1d872e64)

In addition, the use of unique ids for users, events and projects ensures that users can name their projects with non-unique names, and still be able to access their projects/events easily.

<h3>SWE practices:</h3>
GitHub version control proved to be very useful, especially when we wanted to go back to a previous branch before the code broke. However, we did not really understand the importance of describing commits and comments, resulting in minimal description of our commits, and poorly recorded history of changes. 

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/d09756a5-9d6b-42fc-8a21-f657142a1d9c)

However, we understood the importance of branching early on, and took many precautions to ensure that merging did not result in catastrophic results. This helped ensure that the main branch did not break, as new features were always being tested on new branches. Reviewing the pull requests and ensuring that both members understood what the other was adding to the codebase was also crucial.

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/d311aa0f-5fc4-4df9-9fd7-bfa4ac05431d)

Unfortunately, we rarely logged down any issues, as we did not understand the importance of logging issues down as opposed to solving them on the spot. This resulting in minimal issues being opened, and closed.

![image](https://github.com/JerryO3/Orbital-23/assets/122331089/320c7d91-2d61-46ec-a4b6-1c3ebb6923b5)

<h3>Problems Faced:</h3>

Our project was marred with difficulties, the most significant being our approach to detecting clashes and suggesting appropriate timings. It took us quite a few days before we decided to adopt a binary search approach to greedily identify the earliest timing to a seed timing given by the user. This allowed us to come up with a search that takes knlogn time complexity.

Another significant issue faced was regarding testing, as we had difficulties configuring jest. As a result, we were not able to carry out system testing. However, we tried to mitigate that by adopting more stringent unit testing.

Finally, we are still facing issues regarding deploying the telegram bot, which we are currently diagnosing and will attempt to push out by splashdown.

<h3>Proposed Level of Achievement:</h3>
Apollo 11

<h3>Final Thoughts:</h3>
It is a truly challenging endeavour to try to come up with a technical solution to what I feel is a very human problem. When users are lazy to update their calendars, these are the downstream effects that come with forgetting appointments. We had initially hoped to alleviate this issue, but noted that it still boils back down to the discipline of the user at the end of the day. We hope that the introduction of the telegram bot will make it slightly easier for users to update their calendars in real time, but are also skeptical of the impact that this can have, given the plethora of good scheduling applications such as teams and google calendar. All in all, I felt that this was a very good exercise in learning about software and web development, and we will use our takeaways and learning in the different technologies used to our benefit in our future projects.
