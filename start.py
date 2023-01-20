#!/usr/bin/env python3
import subprocess
import os
import sys
import importlib


def install_dependencies():

    modules = ["rich", "desktop-notifier"]
    for module in modules:
        try:
            importlib.import_module(module)
        except ImportError:
            print(f"{module} not found, installing...")
            subprocess.run(["pip", "install", module])
        else:
            print(f"{module} found")

    os.system("clear")


install_dependencies()

# usage:
# python start.py dev
# python start.py prod


def read_env_file():
    env_config = {}
    # read .env file
    with open(".env", "r") as f:
        for line in f:
            line = line.strip().replace("\n", "")

            key, value = line.split("=", 1)

            env_config[key] = value

    # if AUTH_TOKEN is not set, generate using generate_token.py
    if "AUTH_TOKEN" not in env_config:
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
