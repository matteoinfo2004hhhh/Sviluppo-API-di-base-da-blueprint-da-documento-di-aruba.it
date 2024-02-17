const express = require('express');// Import delle librerie per istallare il compilamento express.
const fs = require('fs');//permette di leggere il file
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const bodyParser = require('body-parser');
const userDataPath = path.join(__dirname, 'data', 'person.json');
const personData = JSON.parse(fs.readFileSync('./data/person.json', 'utf-8'));
let MatteoBarcellonaLibrary = require('./functions.js');
let data = require('./data/person.json');
let app = express(); //crea una nuova applicazione express.
app.set('view engine', 'ejs');// configura il motore di visualizzazione ejs.
// Configura il motore di visualizzazione ejs. 
app.set('views', path.join(__dirname, 'views')); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/s', express.static(path.join(__dirname, 's')));
app.use(express.static('public'));//ofre servizio ai file statici dalla cartella public
// lo indirizza al route per la pagina home.

app.get('/', (req, res) => {
  res.render('home');
});// lo indirizza al route per altre pagine.

app.post('/registra', function (req, res) {
  res.render('registra');
});

app.get('/registra', (req, res) => {
  res.render('registra');
});

app.post('/login', function (req, res) {
  res.render('login');
});

app.get('/login', (req, res) => {
  res.render('login');
});


// Route per il processo di accesso
app.post('/loginn', (req, res) => {
  const { username, password } = req.body;
  // Lettura dei dati degli utenti dal file JSON
  fs.readFile(userDataPath, 'utf-8', (err, data) => {
    try {
      const users = JSON.parse(data);
      // Controllo delle credenziali
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        return res.status(200).json({ message: 'Logato con sucesso' });
      } else {
        return res.status(401).json({ message: 'credenziali invalide' });
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      return res.status(500).json({ message: 'Error parsing user data' });
    }
  });
});

app.post('/scrivi', (req, res) => {
  const { username, password } = req.body;

  // Controllo se l'utente esiste già
  fs.readFile(userDataPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading user data from file:', err);
      return res.status(500).json({ message: 'errore di caricamento del file' });
    }
    const users = JSON.parse(data);
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Utente è presente uscire grazie' });
    } else {
      // Aggiunta del nuovo utente
      users.push({ username, password });
      // Scrivi i dati dell'utente su file JSON
      fs.writeFile(userDataPath, JSON.stringify(users), (err) => {
        if (err) {
          console.error('Error writing user data to file:', err);
          res.status(500).json({ message: 'errore del login' });
        } else {
          res.status(201).json({ message: 'Regiestrazione completata' });
        }
      });
    }
  });
});

//route per la visualizzazione dei dati dal file json.
app.get('/postit', (req, res) => {
  var data1;
  data1 = fs.readFileSync('./data/person.json', 'utf8', (err, dati) => {
    if (err) {//controlla che isa giusto altrimenti stampa errore.
      console.error(err);
      return;
    } else {
      return dati;
    }
  });
  res.render('postit', { data: JSON.parse(data1) });
});

app.get('/json', function (req, res) {
  res.sendFile(__dirname + '/data/person.json');
});
// route per la gestione del post dei dati inseriti.

app.post('/scrivi', function (req, res) {
  let size = Object.keys(data).length;//calcola lo psazio della larghezza di dati.
  let datoJSON = JSON.parse(
    fs.readFileSync('./data/person.json', 'utf8', function (err) {
      if (err) {
        console.log('');
      }
    })
  );
  // crea un oggetto 'person' con i dati dalla richiesta POST e li registra nel json.
  let person = {
    username: req.body.username,
    password: req.body.password
  };
  datoJSON.push(person); // aggiunta del nuovo oggetto al JSON.
  console.log(datoJSON);
  // scrive del nuovo JSON nel file.
  fs.writeFile('./data/person.json', JSON.stringify(datoJSON), (err) => {
    if (err) {
      throw err;
    }
    console.log('i dati li ho scritti nel file person.json');
  });
  res.redirect('/postit');// irizzamento alla pagina dei dati su postit.
});
// avvia il server sulla porta 8080.

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
