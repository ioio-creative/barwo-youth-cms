# Barwo Youth CMS

> Full stack MERN CMS with React hooks, context & JWT authentication.

## Usage

Install dependencies

```bash
npm install
npm client-install
```


### Mongo connection setup

Edit your /config/default.json file to include the correct MongoDB URI


### Run Server

```bash
npm run dev     # Express & React :3000 & :5000
npm run server  # Express API Only :5000
npm run client  # React Client Only :3000
```


## Backend dependencies:
* express
* bcryptjs
* jsonwebtoken
* config
* express-validator
* mongoose

## Backend not-too-important dependencies
* opencc

I encountered the "/bin/sh: python: not found" issue when I ran "npm install opencc" on my ubunty server. The following solved it for me.
Unable to set default python version to python3 in ubuntu
https://stackoverflow.com/questions/41986507/unable-to-set-default-python-version-to-python3-in-ubuntu
update-alternatives --install /usr/bin/python python /usr/bin/python3 10

## Backend dev dependencies:
* nodemon
* concurrently

## Frontend dependencies:
* react
* axios
* react-router-dom

## Frontend not-too-important dependencies
* react-loadable
* uuid
* @fortawesome/fontawesome-svg-core
* @fortawesome/free-solid-svg-icons
* @fortawesome/react-fontawesome
* admin-lte
* react-router-global-history
* react-beautiful-dnd
* react-dnd
