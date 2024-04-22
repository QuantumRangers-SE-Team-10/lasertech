# Photon React App

###  Team 10 Members

Name | GitHub | Slack
|--------------|-----------|------------|
Alex Tran | AlexTran0899 | Alex Tran
Shawn Ericksen | shawnericksen | Shawn Ericksen
Malachi Massey | MalachiMassey | Malachi Massey
Cassie Smith | CassieSmith8001 | Casi Siempre
Shawn Wheeler | Shawn-Wheeler | Shawn Wheeler
Tyler Cash | tcash1990 | Tyler Cash

# To run the application

### Setup Dependencies

To run the project, you need to have Node.js (>v20.12.1) and npm installed on your machine.

Run
```bash
node --version
```

If node is not already downloaded, go to https://nodejs.org/en/download and download the latest LTS version. If it is already installed and the version is not at least v20.12.1, follow the below steps in this section.

To control your node version, download and install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script) with a unix-based shell.

Then reload your shell (you can open a new terminal window) and run
```bash
nvm install lts/*
```

Confirm your node version is at least v20.12.1 with
```bash
nvm current
```

If not, diagnose with
```bash
nvm list
nvm use --lts
```

### Setup Project

You will need the DB_URL and DB_KEY key to connect to supabase.
- Check the pinned messages in the team-10 Slack channel for the config variables.
- Then put the config variables in a `.env.development.local` file. Template provided below.

```
# .env.development.local
VITE_DB_URL=
VITE_DB_KEY=
```

Commands to run the project:

```bash
npm install
npm run dev
```

### Usage

Go to http://127.0.0.1:5173/ to see the project running.

To start coding, clone the repository and create a new branch with the name of the feature you are working on.

### Notes

Our project uses the `concurrently` package to start both the React app and the server.cjs used for sending UDP messages.
