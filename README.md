# ev-infrastructure-tool

This web-based Electric Vehicle Infrastructure tool provides the ability to estimate the requirements for charging infrastructure and the related electrical demands.

## Directories

- `client`: React frontend
- `server`: Express, Python backend

## Setup/Installation

Install [Node.js 20](https://nodejs.org) and [Python 3.10](https://www.python.org/downloads/) or higher.

In the `server/python-backend/scripts` directory, you need the following yaml configuration file “config.yaml” to save the Google Maps API key and URL:

```
google:
 api_key: [API Key]
 url: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins={}&destinations={}'
```

## Available Scripts

NOTE: Scripts are directory dependent. Certain scripts will not work in other directories and are reliant on the `package.json` file in the directory you are in.

### `npm start`

Client Directory: Runs the client in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Server Directory: Runs the server in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

### `npm install`

Installs all packages listed in the `package.json` file in the directory you are in. Make sure to install for the `home`, `client`, and `server` directories.

### `pip install -r requirements.txt`

Installs all required dependencies to run the Python scripts. Make sure to run in the `server/python-backend` directory.

### `npm run format`

Formats all code using Prettier. Run this in the `home` directory to format all files. \
In VS Code, you can install the plugin [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to format code automatically when saving a file.
