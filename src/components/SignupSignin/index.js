import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import {
    GoogleAuthProvider,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
} from "firebase/auth";
import { auth, db, doc, provider, setDoc } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";

const SignupSignin = () => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [loginForm, setLoginForm] = useState(false);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   const signupWithEmail = (e) => {
      e.preventDefault();
      setLoading(true);
      if (name && email && password && confirmPassword) {
         if (password == confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password)
               .then((userCredential) => {
                  // Signed in
                  const user = userCredential.user;
                  toast.success("User Created");
                  setLoading(false);
                  setName("");
                  setPassword("");
                  setEmail("");
                  setConfirmPassword("");
                  createDoc(user);
                  navigate("/dashboard")
               })
               .catch((error) => {
                  const errorMessage = error.message;
                  toast.error(errorMessage);
                  setLoading(false);
               })
         } else {
            toast.error("Passwords do not match!");
            setLoading(false);
         }
      } else {
         toast.error("All fields are mandatory!!");
         setLoading(false);
      }
   };

   const createDoc = async (user) => {
    setLoading(true);
    if (!user) return; 
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if(!userData.exists()){
        try {
           await setDoc(doc(db, "users", user.uid), {
              name: user.displayName ? user.displayName : name,
              email: user.email,
              photoURL: user.photoURL ? user.photoURL : "",
              createdAt: new Date(),
           });
           toast.success("Doc created!");
           setLoading(false);
        } catch (e) {
           toast.error(e.message);
           setLoading(false);
        }
    }else{
        setLoading(false);
    }
   };

   const loginWithEmail = (e) => {
      e.preventDefault();
      setLoading(true);

      if (email && password) {
         signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
            const user = userCredential.user;
            toast.success("User logged in!")
            console.log("User logged in", user);
            setLoading(false);
            navigate("/dashboard");
         })
         .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage)
            setLoading(false);
         })
      }else{
        toast.error("All fields are mandatory!")
        setLoading(false);
      }
   };

   const googleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    try{
        signInWithPopup(auth, provider)
           .then((result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential =
                 GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              // The signed-in user info.
              const user = result.user;
              // IdP data available using getAdditionalUserInfo(result)
              // ...
              console.log("user>>>>", user);
              createDoc(user);
              navigate("/dashboard");
              toast.success("User Authenticated Successfully!")
              setLoading(false);
           })
           .catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
            //   toast.error(errorMessage);
              setLoading(false);
              // ...
           });
    }catch(e){
        toast.error(e.message);
        setLoading(false);
    }
   }

   return (
      <>
         {loginForm ? (
            <div className="signup-wrapper">
               <h2 className="title">
                  Login on{" "}
                  <span style={{ color: "var(--theme)" }}>Finance.ly</span>
               </h2>
               <form>
                  <Input
                     label={"Email"}
                     type={"email"}
                     state={email}
                     setState={setEmail}
                     placeholder={"johnDoe@example.com"}
                  />
                  <Input
                     label={"Password"}
                     type={"password"}
                     state={password}
                     setState={setPassword}
                     placeholder={"Password@123"}
                  />
                  <Button
                     text={
                        loading
                           ? "Loading..."
                           : "Login using Email and Password"
                     }
                     onClick={loginWithEmail}
                     disabled={loading}
                  />
                  <p className="p-login">or</p>
                  <Button
                     disabled={loading}
                     onClick={googleAuth}
                     text={loading ? "Loading..." : "Login using Google"}
                     blue={true}
                  />
                  <p
                     className="p-login"
                     onClick={() => setLoginForm(!loginForm)}
                  >
                     Don't have an account? Click here!
                  </p>
               </form>
            </div>
         ) : (
            <div className="signup-wrapper">
               <h2 className="title">
                  Sign Up on{" "}
                  <span style={{ color: "var(--theme)" }}>Finance.ly</span>
               </h2>
               <form>
                  <Input
                     type={"text"}
                     label={"Full Name"}
                     state={name}
                     setState={setName}
                     placeholder={"John Doe"}
                  />
                  <Input
                     label={"Email"}
                     type={"email"}
                     state={email}
                     setState={setEmail}
                     placeholder={"johnDoe@example.com"}
                  />
                  <Input
                     label={"Password"}
                     type={"password"}
                     state={password}
                     setState={setPassword}
                     placeholder={"Password@123"}
                  />
                  <Input
                     label={"Confirm Password"}
                     state={confirmPassword}
                     type={"password"}
                     setState={setConfirmPassword}
                     placeholder={"Password@123"}
                  />
                  <Button
                     text={
                        loading
                           ? "Loading..."
                           : "Sign Up using Email and Password"
                     }
                     onClick={signupWithEmail}
                     disabled={loading}
                  />
                  <p className="p-login">or</p>
                  <Button
                     disabled={loading}
                     onClick={googleAuth}
                     text={loading ? "Loading..." : "Sign Up using Google"}
                     blue={true}
                  />
                  <p
                     className="p-login"
                     onClick={() => setLoginForm(!loginForm)}
                  >
                     Already have an account?? Click here!
                  </p>
               </form>
            </div>
         )}
      </>
   );
};

export default SignupSignin;
