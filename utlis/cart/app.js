import {
    auth,
    db,
    getDocs,
    collection,
    query,
    where,
    onAuthStateChanged,
    arrayRemove,
    updateDoc,
    doc,
  } from "../utlis.js";
  document.addEventListener("DOMContentLoaded", () => {
    const cart_container = document.getElementById("cart_container");
    console.log("cart_container:", cart_container); // Add this line for debugging
  
    if (!cart_container) {
      console.error("Element with ID 'cart_container' not found in the DOM.");
      return; // Exit the function early
    }
  
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        getCartItems(uid);
      } else {
        // Handle user not authenticated case
        window.location.href = "./auth/login/login.html";
      }
    });
  
    async function getCartItems(uid) {
      try {
        const q = query(collection(db, "product"), where("addTocart", "array-contains", uid));
        const querySnapshot = await getDocs(q);
  
        cart_container.innerHTML = ""; // Clear the container before appending new items
  
        querySnapshot.forEach((doc) => {
          const product = doc.data();
          const { banner, title, createdByEmail, description, date } = product;
  
          const cartItem = `
            <div class="bg-white shadow-md rounded-lg overflow-hidden mb-4">
              <img
                src="${banner}"
                alt="Event Image"
                class="w-full h-48 object-cover"
              />
              <div class="p-4">
                <h2 class="text-xl font-bold mb-2">${title}</h2>
                <h2 class="text-xl font-bold mb-2">Description: ${description}</h2>
                <p class="text-gray-600 mb-2">Date: ${date}</p>
                <p class="text-gray-600 mb-2">Creator: ${createdByEmail}</p>
                <div class="flex justify-between items-center">
                  <button
                    id="${doc.id}"
                    onclick="removeFromCart('${doc.id}')"
                    class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            </div>`;
  
          cart_container.innerHTML += cartItem;
        });
      } catch (err) {
        console.error(err);
        alert('An error occurred while fetching cart items.');
      }
    }
  
    window.removeFromCart = async (productId) => {
      try {
        if (auth.currentUser) {
          const uid = auth.currentUser.uid;
          const docRef = doc(db, "product", productId);
          await updateDoc(docRef, {
            addTocart: arrayRemove(uid)
          });
  
          // Refresh the cart page after removal
          getCartItems(uid);
        } else {
          window.location.href = "./auth/login/login.html"; // Redirect to login if not authenticated
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred while removing the item from the cart.');
      }
    };
  });
  