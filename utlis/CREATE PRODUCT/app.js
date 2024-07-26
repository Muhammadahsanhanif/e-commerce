import {
    ref,
    storage,
    uploadBytes,
    getDownloadURL,
    db,
    collection,
    addDoc,
    auth,
  } from "../../utlis/utlis.js";
  console.log(auth);
  

  const product_form = document.getElementById('product_form');


  product_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log(e);
    console.log(e.target);

    const productinfo ={
         
    banner: e.target[0].files[0],
    title: e.target[1].value,
    description: e.target[2].value,
    date: e.target[3].value,
    createdBy: auth.currentUser.uid,
    createdByEmail: auth.currentUser.email,

        //   price: e.target[4].value

    };
    
   

    const imgref =ref(storage,productinfo.banner.name);

    uploadBytes(imgref,productinfo.banner).then(()=>{
        console.log("file uplode hu gaye hai ");
        getDownloadURL(imgref).then((url)=>{
            console.log("url agaya hai",url );
            productinfo.banner = url;
            const productcollection = collection(db,"product")

            addDoc(productcollection,productinfo).then(()=>{
                console.log("collection added hu gaye");
                window.location.href ='/'
                
            })
            

        })
        
    })

    
  })