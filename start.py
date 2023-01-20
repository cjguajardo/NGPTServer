#!/usr/bin/env python3
import subprocess
import os


def install_dependencies():

    # check if dependencies are installed
    output = subprocess.run(
        ["pip3", "list", "--format=columns"], stdout=subprocess.PIPE
    )
    # check if colorama is installed
    if "colorama" not in output.stdout.decode():
        print("colorama not found, installing...")
        subprocess.run(["pip3", "install", "colorama"])
    # check if ntfy in installed
    if "desktop-notifier" not in output.stdout.decode():
        print("desktop-notifier not found, installing...")
        subprocess.run(["pip3", "install", "-U", "desktop-notifier"])

    os.system("ntfy -b notify-send config")
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

    return env_config


def kill_container():
    # get container id from docker ps
    cmd = f"docker ps | grep '{app_name}'" + " | awk '{print $1}'"
    container = os.system(cmd)

    print(f"docker stop {app_name}")
    # stop the container
    stoped = os.system(f"docker stop {app_name}")
    if stoped == container:
        print("container stoped")


def run_dev():
    kill_container()

    cmd = "docker run -v $PWD/src/:/app/ -d --rm --name dependency_installer node:18  bash -c 'cd /app && npm install'"
    print(cmd)
    os.system(cmd)

    cmd = f"docker build -t {app_name}:latest -f Dockerfile.dev ."
    cmd = cmd.strip()
    print(cmd)
    os.system(cmd)

    cmd = f"docker run -p {port}:3000 -v $PWD/src/:/app/ --rm --env-file .env --name {app_name} {app_name}:latest"
    cmd = cmd.strip()
    print(cmd)
    os.system(cmd)


def run_prod():
    kill_container()
    os.system(f"docker build -t {app_name}:latest -f Dockerfile .")
    os.system(
        f"docker run -d -p {port}:3000 --env-file .env --rm --name {app_name} {app_name}:latest"
    )


config = read_env_file()

# get port and app name from .env file
port = config["PORT"]
app_name = config["APP_NAME"]


print(":rocket:", f"[blue bold center]Starting app...[/blue bold center]")
print(f"Port: {port}")
print(f"App name: {app_name}")

# get command line argument
command = os.getenv("1", "dev")


if command == "dev":
    run_dev()
elif command == "prod":
    run_prod()
else:
    print("Invalid command")
