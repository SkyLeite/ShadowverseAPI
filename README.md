# ShadowverseAPI
Real API for Shadowverse. Caches data from Shadowverse Portal and returns it in a bunch of different ways.

### Endpoints
* `/cards` - Returns every card in the database
* `/cards/:id` - Looks up cards that contain `id` in the name

### Developing
Source is contained in the `src` folder. Running `npm run dev` will start the server with `nodemon`, which will reload the server automatically when you make changes to the files, allowing you to test them more easily.