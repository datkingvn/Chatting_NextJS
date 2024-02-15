
# Real-time Chat App Using NextJS
The Real-time Chat App is a modern web application built using Next.js, a popular React framework for server-side rendering, and MongoDB, a NoSQL database. This application allows users to engage in real-time conversations with each other in a seamless and interactive manner.



## Installation (Development Environment)

```bash
  npm i
```


## Config connect
Open `.env.example` and rename file to `.env`

Example Connect:
```javascript
MONGODB_URL=mongodb+srv://<username>:<password>@dchatapp.mongodb.net/?retryWrites=true&w=majority

NEXTAUTH_SECRET=<random>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<random>

PUSHER_APP_ID=<random>
NEXT_PUBLIC_PUSHER_KEY=<random>
PUSHER_SECRET=<random>
NEXT_PUBLIC_PUSHER_CLUSTER=ap1
```
If you need get the key `NEXTAUTH_SECRET`. Please click here:
https://next-auth.js.org/deployment

You can get all Apps Key Pusher at here:
https://pusher.com

## Run Project

```bash
  npm run dev
```

## Screenshots Of Project

Login Page
![App Screenshots](https://i.imgur.com/oTMbgRo.png)

Register Page
![App Screenshots](https://i.imgur.com/LHvQ3z3.png)

Chat Page
![App Screenshots](https://i.imgur.com/L3fVfdV.png)

Profile Page
![App Screenshots](https://i.imgur.com/rykVxCI.png)
