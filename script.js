// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    getFirestore
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyB0Ne89Xk2FAstGIDDIjUEjLGDq5OCkOuo",
    authDomain: "chat-8ed1b.firebaseapp.com",
    projectId: "chat-8ed1b",
    storageBucket: "chat-8ed1b.appspot.com",
    messagingSenderId: "249143169345",
    appId: "1:249143169345:web:792569c20f939de9af91c0"
  }

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

var username = document.getElementById("username")
var password = document.getElementById("password")
var signin = document.getElementById("login")
var signup = document.getElementById("create")
var logout = document.getElementById("logout")

signup.addEventListener("click", function () {
    createUserWithEmailAndPassword(auth, username.value, password.value)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user
        console.log("created user")
        location.reload()
    })
    .catch((error) => {
        console.log("nope bro")
    })
})

signin.addEventListener("click", function () {
    signInWithEmailAndPassword(auth, username.value, password.value)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user
        console.log("logged in")
        location.reload()
    })
    .catch((error) => {
        console.log("nope bro")
    })
})

logout.addEventListener("click", function () {
    signOut(auth)
    .then(() => {
        // Sign-out successful.
        console.log("logged out successful")
    })
    .catch((error) => {
        console.log("nope bro")
    })
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        const uid = user.uid
        var useremail = user.email
        console.log(user)
        document.getElementsByClassName("authdiv")[0].style.display = "none"
        document.getElementsByClassName("chatdiv")[0].style.display = ""
        document.getElementsByClassName("link")[0].innerHTML = user.email

        const q = query(collection(db, "messages"), orderBy("time", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    if (change.doc.data().sentby == useremail) {
                        var msgdiv = document.createElement("div")
                            msgdiv.className = "chat2"
                            msgdiv.innerHTML = change.doc.data().value
                            document.getElementsByClassName("uploaded")[0].appendChild(msgdiv)
                    } else {
                        var msgdiv = document.createElement("div")
                        var msgdivname = document.createElement("div")
                        var msg = document.createElement("div")
                            msgdiv.className = "chat"
                            msg.innerHTML = change.doc.data().value
                            msgdivname.innerHTML = change.doc.data().sentby.slice(0, change.doc.data().sentby.lenght - 10)
                            document.getElementsByClassName("uploaded")[0].appendChild(msgdiv)
                            msgdiv.appendChild(msg)
                            msgdiv.appendChild(msgdivname)
                    }
                }

                if (change.type === "modified") {
                    console.log("Modified city: ", change.doc.data())
                }
                if (change.type === "removed") {
                    console.log("Removed city: ", change.doc.data())
                }
            })
            // window.setTimeout(function() {
            //     window.location.reload()
            // }, 500)
        })

        document.getElementsByClassName("send")[0].addEventListener("click", async function () {
            var time = new Date().getTime()
            // await is used, so function has t be async
            const docRef = await addDoc(collection(db, "messages"), {
                value: document.getElementById("txt").value,
                time: time,
                sentby: useremail
            })
            document.getElementById("txt").value = ""
            console.log("Document written with ID: ", docRef.id)
        })
    } else {
      // User is signed out
      console.log("user logged out")
      document.getElementsByClassName("authdiv")[0].style.display = ""
      document.getElementsByClassName("chatdiv")[0].style.display = "none"    }
})