
## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Zukashi/imoli-node-task
   ```
2. Change directory
    ```sh
    cd imoli-node-task
    ```
<br/>   


## HOW TO RUN

### Using Docker
1. Build Docker Images
  ```sh
  docker compose build
  ```
2. Run Docker Containers
  ```
  docker compose up
  ```
### Locally
#### Remember to turn on postgres service on your machine.
1. Install packages
  ```sh
  npm i
  ```
2. Compile Typescript code to Javascript
  ```
  npm run build
  ```
3. Launch app.
  ```
  npm run start
  ```
