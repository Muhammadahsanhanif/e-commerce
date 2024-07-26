import {
    auth,
    db,
    signOut,
    getDoc,
    doc,
    onAuthStateChanged,
    getDocs,
    collection,
    query,
    where,
    deleteDoc,
  } from "../utlis.js";
  
  const logout_btn = document.getElementById("logout_btn");
  const login_link = document.getElementById("login_link");
  const user_img = document.getElementById("user_img");
  const product_conatiner = document.getElementById(
    "product_container"
  );
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      login_link.style.display = "none";
      user_img.style.display = "inline-block";
      getUserInfo(uid);
      getMyproduct(user.uid);
  
      // ...
    } else {
      login_link.style.display = "inline-block";
      user_img.style.display = "none";
    }
  });
  
  logout_btn.addEventListener("click", () => {
    signOut(auth);
  });
  
  function getUserInfo(uid) {
    const userRef = doc(db, "users", uid);
    getDoc(userRef).then((data) => {
      console.log("data==>", data.id);
      console.log("data==>", data.data());
      user_img.src = data.data()?.img;
    });
  }
  
  async function getMyproduct(uid) {
    try {
      const q = query(collection(db, "product"), where("createdBy", "==", uid));
      const querySnapshot = await getDocs(q);
      product_conatiner.innerHTML = "";
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
  
        const product = doc.data();
  
        console.log("product=>", product);
  
        const { banner, title, createdByEmail, description,  date } =
          product;
  
        const card = `<div class="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src="${banner}"
            alt="Event Image"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="text-xl font-bold mb-2">${title}</h2>
            <h2 class="text-xl font-bold mb-2">description:${description}</h2>
            <p class="text-gray-600 mb-2">date: ${date},</p>
            <p class="text-gray-600 mb-2">Creator: ${createdByEmail}</p>
            
            <div class="flex justify-between items-center">
              <button
                class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
           : ""}
              </button>
  
              <button
              id = ${doc.id}
              onclick = "deleteEvent(this)"
              class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
            >
             Delete
            </button>
            </div>
          </div>
        </div>`;
  
        window.deleteEvent = deleteEvent;
        product_conatiner.innerHTML += card;
        console.log(event);
      });
    } catch (err) {
      alert(err);
    }
  }
  
  async function deleteEvent(e) {
    console.log(e);
  
    const docRef = doc(db, "product", e.id);
    await deleteDoc(docRef);
    getMyproduct(auth.currentUser.uid);
  }