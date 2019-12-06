## Okhati UI

### Running docker-compose

docker-compose requires both **okhatiui** and **okhatiserver** placed under same parent folder. Name should be exactly so as well.

Then go to okhatiui root in the terminal.

Make sure docker-compose is working!

```
docker-compose -v
```

Then run the command below to build the container images for the first time. Building images is done only once and need not re-building unless images are deliberately destroyed or Docerfile and/or docker-compose.yml are modified

```
docker-compose build
```

Once the images are built. Run the follwoing to run the servers,
**This command needs to be run everytime you want to start the servers**

```
docker-compose up
```

---

Steps to be followed while geting database changes

---

Sometimes, it might require extra:
Get latest(git pull) for both okhatiUI and okhatiServer solutions

```
Sometimes needs volume clearing to get rid of node modules cache. List the volumes with 'docker ls'
and remove with 'docker rm'the ones needed cleaning. E.g.
```
docker volume ls
docker volume rm okhatiui_reserved3
```
Migration need to be run after recreation of volume
Open another terminal and go to root of okhatiUi

Run latest migration
```

npm run migrate

```

### Seeding
Run repl and add user name and password for login
```

npm run seed

```
This creates an admin, a resourceCentre called Kalika Medical, a resourceCentre's employee (u: 9876543210, p: Rao9876543210)
and a serviceProvider (u: 9893242333, P: Provider9893242333)

**************************************************

( This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). )

## Running the UI only without docker

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
```
