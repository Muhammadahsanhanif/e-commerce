import { auth, signInWithEmailAndPassword, } from "../../utlis/utlis.js";

const login_form = document.getElementById('login_user')

login_form.addEventListener("submit", function (e) {
    e.preventDefault();
    
       console.log(e);

       const email = e.target[0].value;
       const password = e.target[1].value;

       console.log(email);
       console.log(password);


       signInWithEmailAndPassword(auth, email, password)
       .then(() => {
         window.location.href = "/";
       })
       .catch((err) => alert(err));
       
  });