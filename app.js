const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const PORT = 3000;

const app = express();

// Session creation
app.use(session({
    secret: 'sduh3788994ffcnbidcn',
    resave: false,
    saveUninitialized: true
}));

// Body-parser middleware for form submission validation
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

// Dummy user data (replace with database)
const users = [
    { username: "aziya", password: '$2b$10$y6.I80AVx0wBP8AOruMg7.9FE7VDegqyZ22CBLdM6z3Rhb8ebXZ8e' } // Hashed password: 'user'
];



// Root route

app.get('/', (req, res) => {
    const username=req.session.username
    if (req.session && req.session.authenticated) {
        res.redirect('/home',{username:username});

    } else {
        res.render('login', { errorMessage: req.query.error });
    }
});

// Login route
    app.post('/login',(req,res)=>{
    const{username,password}=req.body;
    const user = users.find(user => user.username===username);
    if(user && bcrypt.compareSync(password, user.password)){
        req.session.authenticated=true;
        req.session.username=username
        res.redirect('/home');
    }else{
        req.session.errorMessage= "Incorrect username or Password";
        res.render('login',{errorMessage:req.session.errorMessage})
    }
});



// Home route
app.get('/home', isAuthenticated, (req, res) => {
    const username=req.session.username
   
   
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0
    res.setHeader("Expires", "0"); // Proxies
    
    res.render('home',{username:username});
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        res.redirect('/?error=' + encodeURIComponent("You must be logged in to access the home page"));
    }
}


// Server port listener
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));



