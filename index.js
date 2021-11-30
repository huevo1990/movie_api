const express = require ('express');
const morgan = require ('morgan');
const app = express();

let movielist = [
  {
    title: 'Terminator 2: Judgement Day',
    genre: ['Action', 'Science-Fiction'],
    director: 'James Cameron'
  },
  {
    title: 'Inception',
    genre: ['Action', 'Sciene-Fiction'],
    director: 'Christopher Nolan'
  },
  {
    title: 'The Big Lebowski',
    genre: ['Comedy'],
    director: 'The Coen Brothers'
  },
  {
    title: 'Drive',
    genre: ['Action', 'Drama'],
    director: 'Nicholas Weinding Refn'
  },
  {
    title: 'Birdman',
    genre: ['Comedy', 'Drama'],
    director: 'Iñarritu'
  },
  {
    title: 'The Waterboy',
    genre:['Comdedy'],
    director: 'Adam Sandler'
  },
  {
    title: '2001: A Space Odyssey',
    genre: ['Sci-fi', 'Drama'],
    director: 'Stanley Kubrick'
  },
  {
    title: 'Yes Man',
    genre: ['Comedy'],
    director: 'Jim Carrey'
  },
  {
    title: 'The Lion King',
    genre: ['Family', 'Comedy'],
    director: 'Walt Disney'
  },
  {
    title: 'Napolean Dynamite',
    genre: ['Comedy'],
    director: 'Emmanuel Gomez'
  }
];

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send("Welcome to my Top 10 Movies list!");
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname});
});

//gets list of all movies
app.get('/movies', (req, res)=> {
  res.json
  (movielist);
});

//Get title of a single movie
app.get("/movies/:title", (req, res) => {
  res.json(
    movielist.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

// return description of genre
app.get('/genres/:genre', (req, res) => {
  res.send("Successful description of genre!");
});

// return director info
app.get('/director/:DirectorName', (req, res) => {
  res.send("Director info Successful!");
});

//adds new users
app.post("/users", (req, res) => {
  res.send("Registration was successful!");
});

//allow users to update their info
app.put('/users/:name/:Username', (req, res) => {
  res.send("User update info was successful!");
});

//add movie to a user's favorite movie list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  res.send("Add movie to a user's favorite movie was Successful");
});

//allow users to remove a movie from favorites list
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  res.send("Remove a movie from favorites list Successful!");
});

//Deregister users
app.delete('/users/:Username', (req, res) => {
    res.send("Deregirster user is Successful!");
  });


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somethings not working!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
