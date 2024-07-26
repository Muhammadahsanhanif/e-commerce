import {
  auth, signOut, onAuthStateChanged, doc, getDoc, db, getDocs, collection, updateDoc, arrayUnion, arrayRemove
} from "./utlis/utlis.js";

const signout_btn = document.getElementById('logout_btn');
const login_link = document.getElementById('login_link');
const user_img = document.getElementById('user_img');
const product_container = document.getElementById('product_container');

// Array to store ordered products

// Firebase authentication state change listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    login_link.style.display = "none";
    user_img.style.display = "inline-block";
    getUserInfo(uid);
    getAllProducts();
  } else {
    // User is signed out
    login_link.style.display = "inline-block";
    user_img.style.display = "none";
  }
});

// Sign out button event listener
signout_btn.addEventListener("click", () => {
  signOut(auth);
  window.location.href = './auth/login/login.html';
});

// Function to fetch user info
function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((data) => {
    user_img.src = data.data().img;
  });
}



// Function to fetch all products and render them in product_container
async function getAllProducts() {
  const querySnapshot = await getDocs(collection(db, "product"));
  product_container.innerHTML = ''; // Clear previous content

  querySnapshot.forEach((doc) => {
    const product = doc.data();
    const { banner, title, description, date, createdByEmail } = product;

    // Construct HTML for each product card
    const card = `
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <img src="${banner}" alt="Event Image" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">${title}</h2>
          <p class="text-gray-600 mb-2">Description: ${description}</p>
          <p class="text-gray-600 mb-2">Date: ${date}</p>
          <p class="text-gray-600 mb-2">Creator: ${createdByEmail}</p>
          <div class="flex justify-between items-center"> 
           <button id="${doc.id}" onclick="addTocart(this)" class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            ${auth?.currentUser && product?.addTocart?.includes(auth?.currentUser.uid) ? "Added to Cart" : "Add to Cart"}
 </button>
          </div>
        </div>
      </div>
    `;

    // Append each card to product_container
    
    product_container.innerHTML += card;
    window.addTocart =addTocart;

    // product_container.addEventListener('click', (event) => {
      // if (event.target.classList.contains('card_btn')) 
    
  });

  
}

async function addTocart(e) {
  if (auth.currentUser) {
    e.disabled = true;
    const docRef = doc(db, "product", e.id);
    if (e.innerText == "Carted") {
      updateDoc(docRef, {
        addTocart: arrayRemove(auth.currentUser.uid)
      }).then(() => {
        e.innerText = "addToCart";
        e.disabled = false;
        updateCart(); // Update the cart page
      })
       .catch((err) => console.log(err));
    } else {
      updateDoc(docRef, {
        addTocart: arrayUnion(auth.currentUser.uid)
      }).then(() => {
        e.innerText = "Carted";
        e.disabled = false;
        updateCart(); // Update the cart page
      })
       .catch((err) => console.log(err));
    }
  } else {
    window.location.href = "./auth/login/login.html";
}
}
