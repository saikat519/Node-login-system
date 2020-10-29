const express = require('express');
const router = express.Router();
const User = require('../models/user')
const fernet = require('fernet');
const logout = require('express-passport-logout');


router.get('/login',(req,res) =>{
    res.render("login");
})
 
router.get('/logout',(req,res) =>{
    logout();
    res.redirect('/users/login');
})

router.get('/register',(req,res) =>{
    res.render("register");
})

router.get('/dashboard',(req,res) =>
    res.render("dashboard")
)

router.post('/register',(req,res) =>{
    const { name,email,password,password2 } = req.body;
    let errors = [];

    //check required fields
    if(!email || !password || !password2 || !name){
        errors.push({ msg: 'please fill in all fields' })
    }
    //check password match
    if(password !== password2){
        errors.push({ msg: 'password does not match' })
    }
    //check password length
    if(password.length <6){
        errors.push({ msg: 'password must be at least 6 characters' })
    }
    if(errors.length > 0){
        res.render('register',{ 
            errors,
            name,
            email,
            password,
            password2
        
        })
    }else{
      // validation passed
      
                const newUser = new User({ 
                    name,
                    email,      // same as name:name
                    password
                })
                
                let secret = new fernet.Secret("cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4=");
                let token = new fernet.Token({
                    secret: secret,
                    time: Date.parse(1),
                    iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                  })
                  newUser.password = token.encode(newUser.password);
                  newUser.save()
                  .then(user =>{
                      console.log(newUser.password)
                    res.redirect('/users/login')
                })
                .catch(err => console.log(err))

       
    }
})



router.post('/login',(req,res)=>{
    
    const { email,password } = req.body;
   
    User.findOne({ where: {email:email }})
    .then(user => {
        console.log(user.password);     // fetching encrypted password

        // fernet decode
        
        let secret = new fernet.Secret("cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4=");
        let token = new fernet.Token({
            secret: secret,
            token: user.password,
            ttl: 0
          })
          let password2 = token.decode();
          console.log(password2);
          var errors = [];

          if(password === password2){
            res.redirect('/users/dashboard')
          }

          if(password !== password2)
          {
             errors.push({ msg: 'invalid username or password ' })             
          }   
         if(errors.length > 0){
              console.log(errors)
            res.render('login',{ 
                errors,
                email,
                password         
            })
        }
          
          
        
    })
    .catch(err => console.log(err))
    
})


module.exports = router;