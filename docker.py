import os
import rich
from rich import print


def kill_container(app_name):
    # get container id from docker ps
    cmd = f"docker ps | grep '{app_name}'" + " | awk '{print $1}'"
    container = os.system(cmd)

    print(f"[bold green]docker stop {app_name}[/bold green]")
    # stop the container
    stoped = os.system(f"docker stop {app_name}")
    if stoped == container:
        print(":red_circle:", "container stoped")


def install_dependencies():
    cmd = "docker run -v $PWD/src/:/app/ -d --rm --name dependency_installer node:18  bash -c 'cd /app && npm install' >/dev/null 2>&1"
    print(f"[blue bold]{cmd}[/blue bold]")
    os.system(cmd)


def run_dev(port, app_name, detach):
    kill_container(app_name)

    install_dependencies()

    cmd = f"docker build -t {app_name}:latest -f Dockerfile.dev . >/dev/null 2>&1"
    cmd = cmd.strip()
    print(f"[blue bold]{cmd}[/blue bold]")
    os.system(cmd)

    cmd = f"docker run {detach} -p {port}:3000 -v $PWD/src/:/app/ --rm --env-file .env --name {app_name} {app_name}:latest"
    cmd = cmd.strip()
    print(f"[blue bold]{cmd}[/blue bold]")
    os.system(cmd)


def run_prod(port, app_name, detach):
    kill_container(app_name)

    install_dependencies

    os.system(f"docker build -t {app_name}:latest -f Dockerfile .")
    cmd = f"docker run {detach} -p {port}:3000 --env-file .env --rm --name {app_name} {app_name}:latest"
    print(f"[blue bold]{cmd}[/blue bold]")
    os.system(cmd)


def execute(port, app_name, command, detached):
    print(":rocket:", " ", f"[blue bold]Starting app...[/blue bold]")
    print(":door:", " ", f"Port: {port}")
    print(":a:", " ", f"App Name: {app_name}")
    if command == "dev":
        run_dev(port, app_name, detached)
    elif command == "prod":
        run_prod(port, app_name, detached)
    else:
        print(":no_entry_sign:", "[red]Invalid command[/red]")
