const express = require ('express');
const morgan = require ('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

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
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  myFlixDB.find()
  .then((movies)=>{
      res.status(201).json(movies);
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
  });
});

//Get title of a single movie
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    myFlixDB.findOne({Title: req.params.title})
    .then((movie)=>{
        res.json(movie);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
   });

// return description of genre
app.get('/genres/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    myFlixDB.findOne({'Genre.Name': req.params.genre})
    .then((movie)=>{
        res.json(movie.Genre)
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
})

// return director info
app.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    myFlixDB.findOne({'Director.Name': req.params.directorName})
    .then((movie)=>{
        res.json(movie.Director);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
})

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//adds new users
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//allow users to remove a movie from favorites list
app.delete('/users/:userName/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({userName: req.params.userName}, {
        $pull: {FavoriteMovies: req.params.title}
    },
    { new: true},
   (err, updatedUser) => {
       if (err) {
           console.error(err);
           res.status(500).send('Error' + err);
       } else {
           res.json(updatedUser);
       }
   });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somethings not working!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
