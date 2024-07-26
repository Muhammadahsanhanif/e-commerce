import {
  auth,
  createUserWithEmailAndPassword,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  doc,
  setDoc,
  db,
} from "../../utlis/utlis.js";

const signup_btn = document.getElementById('signup_forms');
const submit_btn = document.getElementById('submit_btn');

signup_btn.addEventListener("submit", function (e) {
  e.preventDefault();

  const img = e.target[0].files[0];
  const email = e.target[1].value;
  const password = e.target[2].value;
  const firstname = e.target[3].value;
  const lastname = e.target[4].value;

  const userInfo = {
    img,
    email,
    password,
    firstname,
    lastname,
  };

  submit_btn.disabled = true; // Disable the submit button
  submit_btn.innerText = "loading..."; // Change button text to indicate loading

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user);

      const userRef = ref(storage, `user/${user.uid}`);

      return uploadBytes(userRef, img)
        .then((snapshot) => {
          console.log('Uploaded a blob or file!');
          return getDownloadURL(userRef)
            .then((url) => {
              console.log("Download URL:", url);
              userInfo.img = url;

              const userdbref = doc(db, "users", user.uid);

              return setDoc(userdbref, userInfo)
                .then(() => {
                  console.log("User data saved to Firestore");
                  // Redirect or perform other actions after successful signup
                 location.href = "/";
                })
                .catch((error) => {
                  console.error("Error saving user data to Firestore:", error);
                  throw error; // Propagate the error to be caught later
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              throw error; // Propagate the error to be caught later
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          throw error; // Propagate the error to be caught later
        })
        .finally(() => {
          submit_btn.disabled = false; // Enable the submit button
          submit_btn.innerText = "Submit"; // Reset button text
        });
    })
    .catch((error) => {
      console.error("Signup failed:", error);
      submit_btn.disabled = false; // Enable the submit button
      submit_btn.innerText = ""; // Reset button text
    });
});
