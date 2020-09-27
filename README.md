# Cow farm
Web application that implements part of functionalities of information system of cow farm.

## Description
Application is created within subject named Physical implementation of information system at Information engineering department of Faculty of Organizational Sciences in Belgrade. <br/><br/>
Implementation was preceded by a detailed analysis and modeling of information system of specific cow farm.

## Implementation
Functionalities that this appliaction implements are creation and update of both receiving documents for cow and annual financial report.<br/><br/>
**Frontend:** React framework with the "material-ui" library used for GUI designing.<br/><br/>
**Backend:** Web API implemented using Node JS with Express library. <br/>Technique for *load balancing* is simulated within this project. Specifically, request-id of network request is used as a parameter for several hash functions that are used for assigning clients to different servers.<br/><br/>
NoSQL database is used, particularly MongoDB with which Web API communicates using Mongoose library.

## Technologies used
<ul>
  <li>Visual Studio Code</li>
  <li>MongoDB Atlas</li>
  <li>React.js</li>
  <li>Node.js & Express</li>  
</ul>

## Furthermore
Application images can be seen [here](Slike_aplikacije/). <br/>
Integrated project is hosted on Heroku and can be accessed by clicking on the [link](https://cow-farm.herokuapp.com).
