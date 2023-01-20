# generates a SHA256 encrypted token and append to .env file

import hashlib
import time
from base64 import b64encode


def generate_token():
    # generate a token
    token = hashlib.sha256(str(time.time()).encode()).hexdigest()
    # encode token
    token = b64encode(token.encode()).decode()
    return token


if __name__ == "__main__":
    token = generate_token()
    print(token)

    # read .env file
    with open(".env", "r") as f:
        lines = f.readlines()

    # append token to .env file
    with open(".env", "w") as f:
        has_token_key = False
        for line in lines:
            if line.startswith("AUTH_TOKEN="):
                line = f"AUTH_TOKEN={token}"
                has_token_key = True

            f.write(line)

        if not has_token_key:
            f.write(f"AUTH_TOKEN={token}")
