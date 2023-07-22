import React from "react";
import Blockout from "../assets/Blockout.jpg";
import Collab1 from "../assets/Collab1.jpg";
import Collab2 from "../assets/Collab2.jpg";
import Conflict from "../assets/Conflict.jpg";
import Glance from "../assets/Glance.jpg";
import Suggest from "../assets/Suggest.jpg";

function Home() { 
  return (
    <div class="h-fit">
      <div class="sm:text-3xl pt-20 flex justify-center">
        ScheduleManager
      </div>
      <div class="sm:text-xl pt-10 px-10 flex justify-center">
        Never able to find time to meet? Always forgetting that one appointment you made weeks ago and double-booking yourself?
      </div>
      <div class="sm:text-xl pt-10 px-10 flex justify-center font-semibold">
        Let us do the scheduling for you!
      </div>
      <div class="sm:text-xl pt-10 px-10">
        <p class="underline pb-4">Key Features:</p>
        <p>1. Join, create, and participate collaboratively in projects using email</p>
        <img class="py-4" src={Collab1}></img>
        <img class="py-4" src={Collab2}></img>
        <p>2. Track project milestones at a glance</p>
        <img class="py-4" src={Glance}></img>
        <p>3. Detect event conflicts early to prevent double-booking</p>
        <img class="py-4" src={Conflict}></img>
        <p>4. Suggest suitable timings for you and your team</p>
        <img class="py-4" src={Suggest}></img>
        <p>5. Prescribe single or recurring block out periods for personal do-not-disturb time</p>
        <img class="py-4" src={Blockout}></img>
        <p>6. Create and manage events directly using telegram through the telegram bot interface </p>
      </div>
      <div class="lg:flex justify-between">
      <div class="sm:text-xl pt-10 px-10">
        <p class="underline pb-4">Software Used:</p>
        <p>1. Firebase Realtime Database and Hosting</p>
        <p>2. Express.js</p>
        <p>3. React.js</p>
        <p>4. Node.js</p>
        <p>5. Tailwindcss</p>
        <p>6. Recharts library</p>
        <p>7. React Big Calendar</p>
        <p>8. Luxon library</p>
      </div>
      <div class="sm:text-xl pt-10 px-10">
        <p class="underline pb-4">Feature Roadmap:</p>
        <p>1. Recurring Events</p>
        <p>2. Syncing with Google Calendar</p>
      </div>
      <div class="sm:text-xl pt-10 px-10">
        <p class="underline pb-4">SWE practices:</p>
        <p>1. Github Version Control</p>
      </div>
      <div class="sm:text-xl pt-10 px-10">
        <p class="underline pb-4">Testing:</p>
        <p>1. Unit Testing (20% code coverage)</p>
        <p>2. User Testing</p>
      </div>
    </div>
    <div class="sm:text-xl py-10 px-10">
        <p class="pb-4 font-semibold">Let us know what you think! Or aid our bug-squashing!</p>
        <a class="underline text-blue-600" href="https://forms.gle/VcJ2aqPUm1octQ8C9">Bug Reporting and Feedback Form (Google Forms)</a>
      </div>
    </div>
  );
}

export default Home;
