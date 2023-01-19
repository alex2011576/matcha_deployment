# <a href="https://matcha-client.onrender.com/">Matcha</a> 

<img src="https://github.com/fglsn/matcha/blob/master/client/screenshots/landingPage.gif">  

1. [Stack](#stack)
2. [Restrictions and rules of the assignment ](#restrictions-and-rules-of-the-assignment)
3. [How to run locally](#how-to-run-locally)
4. [Features](#features)

## Short description  
A team project, implemented as a part of the Hive Helsinki coding school web-branch.  
  
A dating app allowing two potential lovers to meet, from the registration to the final encounter.  
Application suggests potential matches based on age, location, common interests, rating and gender or sexual preferences.  
User can sort and filter match suggestions, like, dislike or report profiles of other users, chat with those who liked back and be notified in real time about related activities.  

Team members: [Ilona](https://github.com/fglsn) & [Alexei](https://github.com/alex2011576).  
  
**Deployed <a href="https://matcha-client.onrender.com/">here</a>**  
  
Our workflow, current TO-DOs, project subject and state can be found <a href="https://trello.com/b/pNoT2ZPs/matcha-todos">here</a>  
## Stack  

Backend:
- TypeScript
- NodeJs
- PostgreSQL
- Jest

Frontend:
- TypeScript
- React
- Material UI  

We were also taking a Test Driven Development approach with Jest on a server side.  
  
## Restrictions and rules of the assignment  
- No security breaches allowed 
- Code cannot produce any errors, warnings or notices either from the server or the client side in the web console.
- HTML, CSS, and Javascript on a clientside
- Micro-frameworks and UI libraries are allowed
- No ORM, validators or User Accounts Manager
- Relational or graph-oriented database
- Compatibility at least with Firefox (>= 41) and Chrome (>= 46)
- Responsive layout
- All the forms must have correct validations

## How to run locally
### Go to the server directory:  
&emsp; `cd server`  
### Prepare database:  
&emsp; `docker-compose up -d`    

### To run backend:
1. Install dependencies:  
&emsp; `npm install`  
2. Migrate database:  
&emsp; `npm run migrate`  
3. Populate tables with dummy data:  
&emsp; `npm run populate`  
&emsp; `npm run populate:likes`  
<i>(you may also want to add more dummy users: change number of iterations in a for loop inside the file server/src/populateUsers.ts)</i>   
4. Start the server:  
&emsp; `npm run dev`  

### To run frontend:  
1. Go to the client directory:  
&emsp; `cd ../client`  
2. Install dependencies:  
&emsp; `npm install`  
3. Start the client with:  
&emsp; `npm start`  
  
### Tests:
1. Run test migration:  
&emsp; `npm run migrate:test`  
2. Run test suit:  
&emsp; `npm run test`  
  
<i>to run one test, use for.ex:</i>  
&emsp; `npm test -- tests/login_api.test.js`  

## Content

1) **Registration and Signing-in:**  
Registration and activation through email, possibility to restore password by requesting reset link to email.  

https://user-images.githubusercontent.com/40247953/213471921-50b86fa6-717c-4142-aec9-3057831f1f76.mov  
  
2) **User profile**  
After succesful sign up and login user is redirected to the profile editor page, which must be completed in order to use the service.

https://user-images.githubusercontent.com/40247953/213473624-07e3e51b-d281-4382-93d7-d8c4e26bc21b.mov

Here user can modify given information at any time, but cannot leave it blank.  
- Each user has a public fame rating: initially it is of value 40 and user gets 1 point per selected tag and 2 points per uploaded profile picture.  
- As per the instructions user must be located using GPS positionning, up to his/her neighborhood.
- If the user does not want to be positionned, you we were required to find a way to locate the user even without his/her knowledge. So we request the location by IP address on background during the sign-up, on fail the default location to the Helsinki city center will be set. 
- User can change his location by clicking on a 'locate me' button, clicking on desired spot on a map or by dragging the mark.

3) **Match suggestions / Main search page**  
Infinite scroll page with a list of match suggestions. Suggestions are based on:  
- Gender and sexual orientation of logged in user (only straight and bi girls for a straight boy; gay or bi girl for gay girl etc.)  
- In priority people from the same geographical area (less than 50 km away)  
User may perform an advanced search selecting one or a few criterias such as: age, fame rating, distance range and one or multiple common interests.  
Results may be sorted in asc or desc order.  
  
https://user-images.githubusercontent.com/40247953/213479175-6b1047aa-6513-4116-9651-40b5e3137059.mov  
  
User can like or dislike user. Disliked user will be removed from the list right away and won't appear again in the search results.  
Liked user will stay in the list until user desides to refresh or lave the page (in case of a match user can instantly see that match happened and go to chat)  
It is possible to see all the pictures and bio in the carousel of each profile.  
  
4) **Public profile page** 
User can consult public profile of other user and the notification will be sent to that user on the first visit.  

https://user-images.githubusercontent.com/40247953/213487258-9193a25b-4997-4878-bba2-60a4415c3b68.mov
  
5) **Chat page**  
After a match users can chat with each other in real time.  Infinite scroll is implemented on a achat window.  
If match was removed, chat will be also instantly removed without requiring the user to refresh page.  Messages are preserved if match happened back.  

6) **Notifications**  
User will be notified in real time about new visit, new like, match, new message or when matched user removed a like.  
New notifications would stay in the navbar until user checks them by clicking a button.  

7) **Statistic pages**
User can visit spetial pages and check whom he visited and who visited his page, all matches, likes, blocks.


https://user-images.githubusercontent.com/40247953/213487481-a3db901a-f98d-4018-92f1-4e61e7e1b2ea.mov


