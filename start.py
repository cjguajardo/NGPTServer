import os

# usage:
# python start.py dev
# python start.py prod

# read src/.env file
with open("src/.env", "r") as f:
    for line in f:
        if line.strip():
            key, value = line.split("=")
            # trim whitespace
            value = value.strip().replace("\n", "")
            os.environ[key] = value

# get port and app name from .env file
port = os.getenv("PORT", 3000)
app_name = os.getenv("APP_NAME", "app")

print("Starting app...")
print(f"Port: {port}#")
print(f"App name: {app_name}#")


# get command line argument
command = os.getenv("1", "dev")


def kill_container():
    # get container id from docker ps
    container = os.system(
        f"docker ps | grep '0.0.0.0:{port}->{port}/tcp'" + " | awk '{print $1}'"
    )
    # kill container
    os.system(f"docker stop {container}")


def run_dev():
    cmd = "docker run -v $PWD/src/:/app/ node:18  bash -c 'cd /app && npm install'"
    print(cmd)
    os.system(cmd)

    kill_container()
    cmd = f"docker build -t {app_name}:latest -f Dockerfile.dev ."
    cmd = cmd.strip()
    print(cmd)
    os.system(cmd)

    cmd = f"docker run -d -p {port}:{port} -v $PWD/src/:/app/ --env-file ./src/.env --name {app_name} {app_name}:latest"
    cmd = cmd.strip()
    print(cmd)
    os.system(cmd)


def run_prod():
    kill_container()
    os.system(f"docker build -t {app_name}:latest -f Dockerfile .")
    os.system(
        f"docker run -d -p {port}:{port} --env-file ./src/.env --name {app_name} {app_name}:latest"
    )


if command == "dev":
    run_dev()
elif command == "prod":
    run_prod()
else:
    print("Invalid command")
