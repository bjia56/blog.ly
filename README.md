# coms4156

COMSW4156 Team Project

## Running VSCode with Docker

-   Install [VSCode](https://code.visualstudio.com/) and
    [Docker](https://www.docker.com/).
-   In VSCode, install the
    [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    plugin.
-   In VSCode, click the green arrows in the bottom-left of the screen and
    select "Remote-Containers: Reopen in Container".
-   Allow some time for the container to download all relevant packages and
    launch. Your VSCode will relaunch in the container once complete. VSCode
    will also install the `prettier` extension for you (specified in
    `.devcontainer.json`).
-   Run `npm install` inside the container to download all Nodejs dependencies,
    including `prettier`. You can open a shell into the container from within
    VSCode.

If other software is needed, install them inside the container with `apt` or add
them to the `Dockerfile` and rebuild the container.
