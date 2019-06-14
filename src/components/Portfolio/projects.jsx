import React from "react"
import wc1 from "./Images/wc1.jpg"
import wc2 from "./Images/wc2.png"
import foos1 from "./Images/foos1.jpg"
import foos2 from "./Images/foos2.png"
import foos3 from "./Images/foos3.jpg"
import fishing from "./Images/fishing.png"
// import foos4 from "./Images/foos4.jpg"
// import seaholm from "./Images/seaholm.png"
// import seaholm2 from "./Images/seaholm2.png"
// import umbel1 from "./Images/umbel1.png"
// import umbel2 from "./Images/umbel2.png"
// import hn1 from "./Images/hn1.png"
// import hn2 from "./Images/hn2.png"
// import ga1 from "./Images/ga1.png"
import lucha1 from "./Images/lucha1.gif"
import lucha2 from "./Images/lucha2.jpg"
// import lucha3 from "./Images/lucha3.jpg"
import lucha4 from "./Images/lucha4.jpg"
// import ca from "./Images/ca.png"
import newsImage from "./Images/News.png"
import dogs from "./Images/dogs.png"
import dogBreeds from "./Images/dog-breeds.png"
import Day8 from "components/Sketches/sketches/Day8"
import WDVPMap from "components/Articles/WDVP/WDVPMap"

export const projects = [
    {
      category: "Development & Data Visualization",
      projects: [
      {
        title: "Illegal Foreign Fishing",
        description: <div>
          <p>
            A weekend exploration of fishing in foreign waters - most of the work was analyzing a 7 million row dataset!
          </p>
          <p>
            Each circle is a unique profile of a country that illegally fishes in other, often poorer, countries’ waters. Data collected by Global Fishing Watch which used AIS tracking devices, among other data sources, to monitor commercial fishing activity and larger boats.
          </p>
        </div>,
        tools: ["SVG", "D3.js", "Python"],
        images: [fishing],
        link: "/fishing",
      },
      {
        title: "What makes a Good Country?",
        description: <div>
          <p>
            A brief dive into combining many metrics to decide what makes a country <b>Good</b>. There are three distinct visualizations here, exploring:
          </p>
          <ol>
            <li>What countries are similar (below)</li>
            <li>How can we group countries based on 27 metrics</li>
            <li>How countries rank along your own custom Axis of Goodness</li>
          </ol>
        </div>,
        tools: ["SVG", "D3.js", "Three.js"],
        imageStyle: {height: "auto"},
        component: WDVPMap,
        link: "/wdvp",
      },
      {
        title: "Dog Names in NYC",
        description: <div>
          <p>
            I found this great dataset of registered dog names in New York City and had to dig in. Did you know that Yorkies are the most common NYC dog? Or that a dog named Molly is most likely a Lab from Staten Island? Explore for more important dog facts!
          </p>
        </div>,
        tools: ["d3.js", "SVG"],
        images: [dogs],
        imageContentStyle: {backgroundPosition: "top"},
        link: "/dogs",
      },
      {
        title: "Dog Breeds",
        description: <div>
          <p>
            I found another great doggy dataset of breed popularity over time from the American Kennel Club. This chart was an experiment to test out a new kind of tooltip that scrolls a list - check it out and tell me what you think!
          </p>
        </div>,
        tools: ["d3.js", "SVG"],
        images: [dogBreeds],
        imageContentStyle: {backgroundPosition: "bottom"},
        link: "/dog-breeds",
      },
      {
        title: "Sketches",
        description: <div>
          <p>Once code sketch a day, usually dealing with HTML canvas animations and quick generative art.</p>
        </div>,
        tools: ["HTML Canvas", "D3.js"],
        component: Day8,
        link: "/sketches",
      },
      {
        title: "Weather Circle",
        description: <div>
          <p>After Umbel moved into its new office in the old Power Plant, we wanted to make a great first impression with our entrance screens. I wanted to build an interface that keeps visitors and employees informed about the weather, especially useful for planning the best bike ride home.</p>
          <p>I built a standalone web app that pulls current weather data from the <a href="https://developer.forecast.io/">Dark Sky Forecast API</a> and displays today's temperature, precipitation, and sunset forecast. A clock-like layout keeps the interface familiar and easy to understand.</p>
        </div>,
        tools: ["Angular", "D3.js", "Dark Sky Forecast API"],
        images: [wc1,wc2]
      },
      // {
      //   title: "Hacker News Salary Survey Results",
      //   description: <div>
      //     I wanted to better understand results of a job survey, originally presented in <a href="https://docs.google.com/spreadsheets/d/17Mr201gfDoOTe5ONLS6LYJi1wQbtT26srXeSwUjMK0A/edit#gid=0">spreadsheet format</a>. I performed some preprocessing and made a site that displayed the results. Users can view average salary and individual response by country, state, job type, and job level.
      //   </div>,
      //   link: "https://hn-survey-fall-2014.firebaseapp.com/#/home",
      //   tools: ["Angular", "D3.js","SCSS"],
      //   images: [hn1,hn2]
      // },
      // {
      //   title: "Google Analytics Dashboard",
      //   description: <div>
      //     <p>Google Analytics is a wonderful tool, but can be hard to get information quickly. I created a dashboard for our Marketing team that visualizes basic data about a website's users, which is used for sending weekly email updates. I wrote a guide for gaining insight from this dashboard, <a href="https://www.umbel.com/blog/data-visualization/how-learn-about-your-users-google-analytics/">featured</a> on the Umbel blog.</p>
      //     <p>Feel free to log in to see information about your own users!</p>
      //   </div>,
      //   link: "https://ga-dashboard.firebaseapp.com/",
      //   tools: ["Angular", "Google Analytics API","SCSS"],
      //   images: [ga1]
      // },
      // {
      //   title: "Cohort Analysis Visualization",
      //   description: <div>
      //     <p>Often, I get to collaborate with Umbel’s Data Science team. One of these projects was aimed at helping a client understand how different cohorts of their customers behave. I built an interactive web app to securely visualize our findings.</p>
      //     <p>Each category of their product is displayed in a stacked or grouped bar chart, split into month of first purchase.</p>
      //     <p>Feel free to play around with this version, populated with dummy data.</p>
      //   </div>,
      //   link: "https://fake-cohort.firebaseapp.com/",
      //   tools: ["Angular", "Google Analytics API", "SCSS"],
      //   images: [ca]
      // },
    ]
  },
  {
    category: "Design & Development",
    projects: [
      {
        title: "Unbiased News Aggregator",
        description: <div>
          <p>
            There are many issues with how we receive our news (in the United States). I created a news aggregator (largely for personal use) that attempts to solve three core issues.
          </p>
          <ol>
            <li>
              Stories are often biased towards the viewpoint of a political parties.
              <br /><b>Solution:</b> I aggregate stories from the most un-biased, fact-based publishers (based on Ad Fontes Media's <a href="https://www.adfontesmedia.com/" target="_blank">Media Bias Chart</a>).
            </li>
            <li>
              One story has the tendency to flood public attention.
              <br /><b>Solution:</b> I added a filter to hide stories with specific words in their title or description.
            </li>
            <li>
              News stories are overwhelmingly sad and upsetting, which can be compelling to avoid all news.
              <br /><b>Solution:</b> I added a sentiment filter so a reader can only see stories within a specific range -- only happy stories, or only sad stories (but why).
            </li>
          </ol>
        </div>,
        tools: ["Sentiment", "React.js", "RSS parsing"],
        images: [newsImage],
        imageContentStyle: {backgroundPosition: "top"},
        link: "/news",
      },
      // {
      //   title: "Umbel’s marketing website",
      //   description: <div>
      //     <p>In 2013, I worked with a Marketing coworker to completely redesign Umbel’s marketing website. We used a content-first approach, and based the design on how we wanted users to discover our product.</p>
      //     <p>Afterwards, I worked with one Engineering coworker to build the new design within a month. The site was built on a Django/Python backend, and shares data with Umbel’s internal website.</p>
      //   </div>,
      //   link: "https://umbel.com/",
      //   tools: ["Django", "Python", "LESS"],
      //   images: [umbel1, umbel2]
      // },
      // {
      //   title: "Umbel’s product",
      //   description: <div>
      //     <p>Over the past few years, I’ve gone from Umbel’s only front-end designer and developer, to working as part of wonderful Product and Developement teams. In 2015, we completely re-designed and -built our product, and I was thrilled to do a large part of the UX/UI design, then build our design with two other developers. My favorite part of the development was building an extendable, customizeable charting library in a React.js framework.</p>
      //     <p>I did a ton of thinking about how a complex dataset can best be presented so that it doesn’t overwhelm, but empowers.</p>
      //     <p>I will post images when we release the new product to our clients next month.</p>
      //   </div>,
      //   tools: ["React.js","D3.js","SCSS"],
      //   images: []
      // },
      {
        title: "Umbel SXSW Party Photobooth",
        description: <div>
          <p>In 2015, Umbel hosted an official SXSW party (with Spoon!). To incorporate our brand and liven up the VIP section, I build a virtual photobooth that superimposes a luchador mask on guests’ faces.</p>
          <p>I built a C++ app that detects faces from a webcam feed in real-time and renders a mask over anything that looks like a face (based on some training data). The face is broken into sections, and the mask is stretched to fit the different parts of the face, which makes it pretty realistic, even when someone is talking. The user can use a foot pedal to either cycle through the faces or take a picture. If you look closely, you can see people’s concentration as they try to balance and take a picture. Additionally, I built a web app to show the photos in real-time and allow people to share on social media.</p>
        <p>Read more about the construction <a href="https://www.umbel.com/engineering/blog/wrestling-ring">on the Umbel Engineering blog</a>.</p>
        </div>,
        tools: ["C++", "Xcode", "Open Frameworks", "React.js", "Amazon Web Services", "SCSS"],
        images: [lucha4, lucha1, lucha2]
      },
      // {
      //   title: "Umbel Seaholm Officewarming Photobooth",
      //   description: <div>
      //     <p>In 2015, Umbel hosted a small old-timey-themed party to celebrate moving into their new office. I threw together a C++ app that takes in a video feed and renders it in black & white, and displays hats, glasses, bow ties, or mustaches on any people in the frame. The facial detection algorithm was less complicated than the one used for the <b>SXSW Party Photobooth</b>, and therefore a little more performant.</p>
      //     <p>Photos were sent to an Amazon Web Services bucket and displayed in real-time on a web app next to the photobooth.</p>
      //   </div>,
      //   link: "https://umbel-seaholm.firebaseapp.com/",
      //   tools: ["C++", "Xcode", "React.js", "Amazon Web Services", "SCSS"],
      //   images: [seaholm, seaholm2]
      // },
    ]
  },
  {
    category: "Other",
    projects: [
      {
        title: "Foosball Table",
        description: <div>
          <p>From time to time, I find myself being more ambitious than I have time for. In Fall 2015, I started with the idea of scanning coworkers and replacing the players on a foosball field with their 3d-printed heads, and ended up building a whole table from scratch. I used <b>Adobe Illustrator</b> to create a design for the table, and reproduced it in <b>Cinema 4D</b> to get an idea of how it would look when finished. A coworker, who happens to be an amazing woodworker, turned the bed design into a real, wooden table. Along with another coworker, I cut and etched the field out of a sheet of brand-colored acrylic, using a laser cutter.</p>
          <p>All 26 foosball players’ bodies have been 3d printed, with a threaded hole in the top for the heads to screw into. One by one, I am molding 3D scans of coworkers and printing them with screws on the bottom. Sometime in the next month, the players will be installed, along with LED lights around the field that change color when the ball is hit.</p>
        </div>,
        category: "Other",
        tools: ["3D Printer (Ultimaker 2)", "Laser Cutter", "Cinema 4D", "Blender"],
        images: [foos3,foos2,foos1]
      },
    ]
  }
]
