📦 Context: Act as a Senior Full-Stack Engineer. We are building a MERN stack app called "[App Name]". The backend uses Node/Express/Mongoose. The frontend is React (Vite).

.

🎯 Action:

Generate the folder structure for client and server.
Create the Mongoose Schema for [Model Name] with fields: [field1, field2].
Create standard CRUD REST API routes in server.js.
Create a React component to fetch and display the data.

Constraints:

Connect to my local MongoDB at mongodb://127.0.0.1:27017/[dbname].
CRITICAL: Include an initDB() function in server.js that runs on startup. It must check if the collection is empty, and if so, automatically insert 2 default "seed" documents. This ensures the collection is created automatically on the first run.
Ensure cors() and express.json() middleware are applied before the routes.
Give me the terminal commands to install dependencies and start both servers.