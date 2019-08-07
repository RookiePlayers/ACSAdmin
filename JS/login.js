var email="",
password="";
$( document ).ready(function() {
    // Handler for .ready() called.
    init();
  });

function init(){
    login();
}
function login(){
    $(".sumbit-btn").on("click",()=>{
         email=$("#email").val();
        password=$("#pword").val();
        loginWithFirebase(email+"@studentmail.ul.ie",password);
    })
   

}
function loginWithFirebase(email,password){
    console.log("Login with firebase");
    console.log("Email: ",email);
    console.log("Password: ","");

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    alert(errorMessage);
    });
    firebase.auth().onAuthStateChanged(function(user) { //or use firebase.auth().currentUser;
    if (user) {
     // User is signed in.
     varifyAsAdmin(user)
    } else {
    // No user is signed in.
    }
    });
    
    
    
}
function varifyAsAdmin(user){
    let database = firebase.database();
    database.ref("Admins/")
    .on("value",(ds)=>{
       var isAdmin=false;
       var admins=ds.val();
        admins.forEach((s)=>{
            if(s.id==user.uid)
            {
                isAdmin=true;
            }
        })
        if(isAdmin){
            launchAdminSite();
        
        }
        else{
            firebase.auth().signOut().then(function() {
            // Sign-out successful.
                denyAccess();
            }).catch(function(error) {
            // An error happened.
               alert(error.message)
            });
        }
    })


}
function launchAdminSite(){
    window.location.href="../HTML/home.html";
}
function denyAccess(){
    alert("Sorry This User is not an ACS Admin");
}
