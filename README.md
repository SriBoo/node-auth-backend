##  `backend/README.md`

```markdown
# Node Auth Backend

A Node.js + Express + SQLite authentication backend with sessions.  
This backend works with the React Auth Frontend.

##  Features
- Register (email + password)
- Login with session cookies
- Session check (`/auth/me`)
- Logout
- Protected route (`/auth/dashboard`)

##  Setup

1. Clone repo:
   ```bash
   git clone https://github.com/SriBoo/node-auth-backend.git
   cd node-auth-backend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```
   SESSION_SECRET=your_secret_here
   ```

4. Run locally:

   ```bash
   npm run dev
   ```

5. DB file is stored at `./data/users.db`.
   It will be auto-created on first run.

##  Deployment (Vercel)

* Use **Serverless function** setup (`api/index.js` entry).
* Ensure `vercel.json` is present:

  ```json
  {
    "version": 2,
    "builds": [
      { "src": "api/index.js", "use": "@vercel/node" }
    ]
  }
  ```
  