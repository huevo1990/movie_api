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

app.get('/movies', (req, res)=> {
  res.json(movielist);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somethings not working!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
