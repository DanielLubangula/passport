const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();

// Middleware pour parser les données du formulaire
app.use(express.urlencoded({ extended: false }));

// Configuration de session
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

// Définir la stratégie de Passport (LocalStrategy pour utiliser un nom d'utilisateur et un mot de passe)
passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log("ici : ");
    // Simuler une recherche dans la base de données
    const user = { id: 1, username: "test", password: "password" };

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (username === user.username && password === user.password) {
      const hello = "hello"
      return done(null, user); // Authentification réussie, et on envoie la variable user dans serialisation
    } else {
      return done(null, false, {
        message: "Nom d'utilisateur ou mot de passe incorrect",
      });
    }
  })
);

// Sérialisation (quand l'utilisateur se connecte)
passport.serializeUser(function (user, done) {
  console.log( user); // si user fonctionne
  done(null, user.id);
});

// Désérialisation (pour retrouver les infos de l'utilisateur dans la session)
passport.deserializeUser(function (id, done) {
    console.log("desername == : ")
    const user = { id: 1, username: "test" }; // Simuler la récupération d'utilisateur
  done(null, user);
});

// Route de connexion
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard", // Redirection en cas de succès
    failureRedirect: "/login", // Redirection en cas d'échec
    failureFlash: false, // Peut être utilisé pour envoyer des messages d'erreur (si configuré)
  })
);

// Page de tableau de bord (accessible seulement si authentifié)
app.get("/dashboard", (req, res) => {
  console.log("req.isAuthenticated() : " + req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.send(`Bienvenue ${req.user.username} !`);
  } else {
    res.redirect("/login");
  }
});

// Page de connexion
app.get("/login", (req, res) => {
  res.send(
    '<form method="post" action="/login"><input type="text" name="username"/><input type="password" name="password"/><button type="submit">Login</button></form>'
  );
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
