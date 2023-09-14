## NGPTServer

The start.py script is used to start a development or production environment for an app using Docker.

### Dependencies

The script uses the following modules:

- rich
- desktop-notifier

These modules are installed using pip or pip3. If they are not found in the system, the script will try to install them.

### Usage

`python start.py [dev|prod] [--no-detach]`

- `dev`: starts the app in development mode
- `prod`: starts the app in production mode
- `--no-detach`: runs the app in the foreground

The script also reads the environment configuration from a `.env` file. The file should contain the following variables:

- PORT: the port on which the app will run
- APP_NAME: the name of the app
- OPENAI_API_KEY: the api key for OpenAI
- OPENAI_ORGANIZATION: the OpenAI organization name
- AUTH_TOKEN: the authentication token for the app

If the `.env` file does not exist, the script will create it with default values, but you must complete with your openai key and organization.

The script also runs a `generate_token.py` script to generate the authentication token if it is not set in the `.env` file.

Finally, the script runs a `docker.execute` function to start the app in the specified mode and with the specified arguments.

# API Docs

This API allows for generating answers to prompts using the OpenAI API and provides endpoints for logging requests and getting the app name.

## Routes

### /ask (POST)

Handles a POST request to the '/ask' route. Parses options from the body, checks for a valid prompt, and uses the OpenAI API to generate an answer.

Available options:

- model {string} - The model to use for generating the answer prompt
- {string} - The prompt to use for generating the answer temperature
- {number} - The temperature to use for generating the answer
- max_tokens {number} - The maximum number of tokens to use for generating the answer
- top_p {number} - The top_p value to use for generating the answer
- frequency_penalty {number} - The frequency_penalty value to use for
  generating the answer
- presence_penalty {number} - The presence_penalty value to use for
  generating the answer
- stop {string} - The stop string to use for generating the answer

### /log (GET)

Endpoint for retrieving the log from the logger module.

### / (GET)

Endpoint for retrieving a greeting message along with the app name from the environment variable.

### Middleware

All routes go through a middleware function that logs the request method, URL, and body, and checks for a valid token.
