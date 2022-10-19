import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { initializeApp } from "firebase/app";
import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";


const firebaseConfig = {
  apiKey: "AIzaSyDuZ-LwCCSahX6j2T8QdUmq8mR4XZkqhmw",
  authDomain: "goodeats-delivery.firebaseapp.com",
  projectId: "goodeats-delivery",
  storageBucket: "goodeats-delivery.appspot.com",
  messagingSenderId: "851617425804",
  appId: "1:851617425804:web:d55699e0562b2b4e1d8ea9"
};

// Initialize Firebase 
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();


const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

let googleEmail = '';
let googleUID = '';
let googleDis = '';
export const signInWithGoogle = async () => {
  
    const res = await auth.signInWithPopup(provider)
    googleEmail = res.user.email;
    googleUID = res.user.uid;
    googleDis = res.user.displayName
    

    if (typeof window === "undefined") {
      return;
    }
  
    return new Promise((resolve, reject) => {
      console.log('EMAIL: ', googleEmail)
      console.log('UID ', res.user.uid)
      console.log('DISPLAY NAME ', res.user.displayName)
      axios
        .post(`${API_URL}/auth/local/register`, {username: googleDis, email: googleEmail, password: googleUID })
        // .post(`${API_URL}/api/google/login/`, {identifier: googleEmail, password: googleUID })
        // .post(`${API_URL}/api/auth/google/login/`, { googleAccess })
        .then((response) => {
          //set token response from Strapi for server validation
          Cookie.set("token", response.data.jwt);
  
          //resolve the promise to set loading to false in SignUp form
          resolve(response);
          //redirect back to home page for restaurance selection
          Router.push("/");
          console.log("Google Login Success")
        })
        .catch((error) => {
          //reject the promise and pass the error object back to the form
          // reject(error);
          console.log("Google Login Fail")
        });
    });
    
};
