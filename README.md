# Techzu Test

Techzu Test - Implementing a Comment System with MERN Stack. [Click Here](https://techzu-test-seven.vercel.app/) to see the result online.

## Frontend

Refer to the client subdirectory. [View Live App](https://techzu-test-seven.vercel.app/).

```bash
./client
```

### Technology
#### Framework & Library
[Typescript](https://www.typescriptlang.org/) | [ReactJS](https://react.dev/) | [React Router](https://reactrouter.com/) | [socket.io](https://socket.io/how-to/use-with-react) | [React Query](https://tanstack.com/query/latest/) | [date-fns](https://date-fns.org/)

#### State Management
We are using [React Context](https://react.dev/reference/react/useContext) for state management on user service and [React Query](https://tanstack.com/query/latest/) for the rest.
##### Why React Query?
React Query concentrates on data fetching and caching, while Redux supplies a comprehensive client-side state management solution. [React Query vs Redux](https://www.frontendmag.com/insights/react-query-vs-redux-comparison/). Since we don't have heavy state processes on this assignment, I choose to use React Query for faster development

#### UI/UX/Methodology Related
For Components, we are using [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/). One of the biggest advantages atomic design provides is the ability to quickly shift between abstract and concrete. We can simultaneously see our interfaces broken down to their atomic elements and also see how those elements combine together to form our final experiences.

We are using SCSS/SASS to style our components on the atomic parts and [tailwindcss](https://tailwindcss.com/) utility classes for our page or layout. (The purpose is to reach faster development) [Read Why Tailwind?](https://incentius.com/blog-posts/pros-and-cons-of-using-tailwind-css/).

## Backend

Refer to the server subdirectory. [API Root](https://giaendong.site)

```bash
./server
```

### Technology
#### Framework & Library
[MongoDB](https://www.mongodb.com/) | [Mongoose](https://mongoosejs.com/) | [express](https://expressjs.com/) | [nodeJS](https://nodejs.org/en) | [socket.io](https://socket.io/how-to/use-with-react) | [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

#### Authentication
We are using [jwt](https://www.npmjs.com/package/jsonwebtoken) to authenticate our [REST API](https://www.ibm.com/topics/rest-apis)

## Infrastructure
### Technology
We are using [MongoDB Atlas](https://www.mongodb.com/atlas/database) to host our database.

We create an instance using [AWS EC2](https://aws.amazon.com/ec2/) to serve our backend, [AWS Route53](https://aws.amazon.com/route53/) to setup our DNS, [NGINX](https://www.nginx.com/) with Reverse Proxy, [LetsEncrypt](https://letsencrypt.org/) for SSL encryption and [PM2](https://pm2.keymetrics.io/) for our ecosystem inside instance.

On Frontend side we are using [Vercel](https://vercel.com) to serve our frontends.


## REALTIME Comment System
We are using [socket.io](https://socket.io/how-to/use-with-react) for our comment system. You can check by login into 2 account at try to post a comment at the same time.