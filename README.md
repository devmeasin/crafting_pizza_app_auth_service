## crafting_pizza_app_auth_service

### <samp>&gt; Hi there👋, I'm Mohammad Easin!

<!-- PROJECT LOGO -->
<br />
 <p align="center">
    <img src="https://yt3.googleusercontent.com/xTmRjY6I1PNWO6KhAX59R-sqgbcPvTqkg2FbcZ8wvnjIqwwh5OBpzT69xQ_RO29J3DEofZX2qw=s176-c-k-c0x00ffffff-no-rj" alt="Logo" width="80" height="80" />
    <h3 align="center "><a href="https://github.com/codereasin/node_app_starter_kit" target="_blank" >crafting_pizza_app_auth_service</a></h3>
</p>

Add all necessary tool like ["Prettier", "ESlint", "Auto Testing", "git hook action commit before check all code using husky lint-stage" , "API Testing", "Error Handling", "logger"] || setup specially typescript project 🎉

-   📫 How to reach me. => codereasin@gmail.com 🥚 [Coder Easin](https://codereasin.com)

## How to run

Please follow the below instructions to run different branches of this repository in your machine:

1. Clone this repository -
    ```sh
    git clone git@github.com:codereasin/crafting_pizza_app_auth_service.git
    ```
2. Go to the cloned project directory
    ```sh
    cd crafting_pizza_app_auth_service
    ```
3. install all npm dev dependencies
    ```sh
    npm ci || npm i || npm install
    ```

### Dockerize your application following this command.

4. create docker image using this command
    ```sh
    docker build -t auth-service:dev -f docker/dev/Dockerfile .
    ```
    or
    ```sh
    docker build -t auth-service:dev -f your_location/Dockerfile .
    ```
5. Run Docker image run for window system

    ```sh
     docker run --rm -it -v "%cd%":/usr/src/app -v /usr/src/app/node_modules --env-file "%cd%"/.env -p 5501:5501 -e NODE_ENV=development auth-service:dev
    ```

    Mac or Lunix system

    ```sh
    docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 5501:5501 -e NODE_ENV=development auth-service:dev
    ```

After sucessfuly run your face nodemon reload isses follow this step otherwise all ok skip this part.

1.. first step add this line
[https://prnt.sc/X7smtefHsCmx](https://prnt.sc/X7smtefHsCmx)

2.. package.json file edit and just add
[https://prnt.sc/QSyEc9Woufx3](https://prnt.sc/QSyEc9Woufx3)

## Authors

-   [@codereasin](https://www.github.com/codereasin)

<div align="center">

### 🔗 Connected to Me

<div  style="display:flex; align-items: center; justify-content: center;">
    <a href="https://www.facebook.com/codereasin/">
       <img  alt="FB" width="30px" src="https://img.icons8.com/fluent/2x/facebook-new.png" />
     </a>
     <a href="https://linkedin.com/in/codereasin">
        <img  alt="Linkdein" width="27px" src="https://avatars.githubusercontent.com/u/357098?s=200&v=4" />
     </a>
       <a href="https://twitter.com/codereasin">
         <img alt="Twitter" width="27px" src="https://avatars.githubusercontent.com/u/50278?s=200&v=4" />
       </a>
      <a href="https://www.hackerrank.com/codereasin">
        <img  alt="HackerRank" width="27px" src="https://avatars.githubusercontent.com/u/7596827?s=460&v=4" />
      </a>
      <a href="https://app.codesignal.com/profile/codereasin">
        <img  alt="CodeSignal" width="27px" src="https://avatars.githubusercontent.com/u/12802966?s=200&v=4" />
      </a>
<div/>

</div>

</div>
```
