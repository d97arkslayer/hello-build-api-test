# HelloBuild server api (for entry test)

To run this server you should follow the next steps:

1. Clone this repo
2. Download docker (if you don't have docker)
3. Build the docker image (in the terminal of this downloaded repo)
    ```bash
   docker build  -t hello_build_server .
    ```
4. Run the previous built image
    ```bash
   docker run -d -p 9000:9000 hello_build_server
   ```
