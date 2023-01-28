#!/usr/bin/env python3
import subprocess
import os
import sys
import importlib


def install_dependencies():
  # Check if rich and desktop-notifier modules are installed
  try:
      import rich
      import desktop_notifier
  except ImportError:
      # Try to install using pip or pip3
      try:
          subprocess.run(["pip", "install", "rich", "desktop-notifier"])
      except:
          subprocess.run(["pip3", "install", "rich", "desktop-notifier"])
      # Import the modules again
      import rich
      import desktop_notifier

  # Print a message to indicate that the modules are installed
  print("Modules are installed!")

  os.system("clear")


install_dependencies()

# usage:
# python start.py [dev|prod] [--no-detach]
# python start.py dev
# python start.py prod


def read_env_file():
    env_config = {}
    # if .env file does not exist, create it
    if not os.path.exists(".env"):
        with open(".env", "w") as f:
            f.write("PORT=3000\n")
            f.write("APP_NAME=ngpt-ms\n")
            f.write("OPENAI_API_KEY=\n")
            f.write("OPENAI_ORGANIZATION=\n")
            f.write("AUTH_TOKEN=\n")
            f.close()

    # read .env file
    with open(".env", "r") as f:
        for line in f:
            # if line is empty, skip
            if line == "\n":
                continue
            line = line.strip().replace("\n", "")
            key, value = line.split("=", 1)
            env_config[key] = value

        f.close()

    # if AUTH_TOKEN is not set, generate using generate_token.py
    if "AUTH_TOKEN" not in env_config or env_config["AUTH_TOKEN"] == "":
        os.system("python3 generate_token.py")

    return env_config


config = read_env_file()

# get port and app name from .env file
port = config["PORT"]
app_name = config["APP_NAME"]

# get arguments
args = sys.argv
command = "dev"
detached = "-d"
if "--no-detach" in args:
    detached = ""
if "dev" in args:
    command = "dev"
if "prod" in args:
    command = "prod"
if "dev" in args and "prod" in args:
    print("Invalid arguments")
    exit(1)

from docker import execute

execute(port, app_name, command, detached)
