import os, subprocess
import rich
from rich import print


def kill_container(app_name):
    # Get container id from docker ps
    cmd = f"docker ps -q --filter name={app_name}"
    container = subprocess.run(cmd, shell=True, capture_output=True).stdout.decode().strip()
    if container:
        print(f"[bold green]docker stop {app_name}[/bold green]")
        # stop the container
        stop_cmd = f"docker stop {container}"
        stoped = subprocess.run(stop_cmd, shell=True)
        if stoped.returncode == 0:
            print(":stop_sign:", "container stoped")
    else:
        print(":grey_question:",f"No container found with the name {app_name}")


def install_dependencies():
    cmd = "docker run -v $PWD/src/:/app/ -d --rm --name dependency_installer node:18  bash -c 'cd /app && npm install' >/dev/null 2>&1"
    print(":rocket:",f"[blue bold]{cmd}[/blue bold]")
    os.system(cmd)


def run_dev(port, app_name, detach):
    kill_container(app_name)
    install_dependencies()

    cmd = f"docker build -t {app_name}:latest -f Dockerfile.dev . >/dev/null 2>&1"
    cmd = cmd.strip()
    print(":rocket:",f"[blue bold]{cmd}[/blue bold]")
    subprocess.run(cmd, shell=True, check=True)

    cmd = f"docker run {detach} -p {port}:3000 -v $PWD/src/:/app/ --rm --env-file .env --name {app_name} {app_name}:latest"
    cmd = cmd.strip()
    print(":rocket:",f"[blue bold]{cmd}[/blue bold]")
    subprocess.run(cmd, shell=True, check=True)


def run_prod(port, app_name, detach):
    kill_container(app_name)
    install_dependencies

    cmd = f"docker build -t {app_name}:latest -f Dockerfile ."
    cmd = cmd.strip()
    print(":rocket:",f"[blue bold]{cmd}[/blue bold]")
    subprocess.run(cmd,shell=True, check=True)

    cmd = f"docker run {detach} -p {port}:3000 --env-file .env --rm --name {app_name} {app_name}:latest"
    cmd = cmd.strip()
    print(":rocket:",f"[blue bold]{cmd}[/blue bold]")
    subprocess.run(cmd,shell=True, check=True)


def execute(port, app_name, command, detached):
    print( f":rocket: [blue bold]Starting app...[/blue bold]")
    print(f":door: Port: {port}")
    print(f":a: App Name: {app_name}")
    if command == "dev":
        run_dev(port, app_name, detached)
    elif command == "prod":
        run_prod(port, app_name, detached)
    else:
        print(":no_entry_sign: [red]Invalid command[/red]")
