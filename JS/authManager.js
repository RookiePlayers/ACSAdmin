var profile={};
var AdminProfile={
    "id":"",
    "role":"",
    "profile":""
}
window.onload=init();
function init(){
   /* firebase.auth().signOut()
        .then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });*/
    isLogged();
}
function isLogged(){
    console.log("--")
    firebase.auth().onAuthStateChanged(function(user) { //or use firebase.auth().currentUser;
    if (user) {
     // User is signed in.
     goHome(user)
    } else {
    // No user is signed in.
        goLogin();
    }
    });
}
function getAdminProfile(user){
    let database = firebase.database();
    database.ref("Admins/")
    .on("value",(ds)=>{
        var admins=ds.val();
        admins.forEach((s)=>{
            if(user.uid==s.id){
                AdminProfile.id=s.id;
                AdminProfile.role=s.role;
                firebase.database().ref("Profile/"+user.uid+"/").on("child_added",(ds)=>{
                    profile=ds.val(); 
                    AdminProfile.profile=profile;
                    window.localStorage.setItem("AdminProfile",JSON.stringify(AdminProfile))
                    window.location.replace("../HTML/home.html");
                })
               
            }
        })
      
    })
}
function goHome(user){
    getAdminProfile(user);
   //  window.location.replace("../HTML/home.html");
}
function goLogin(){
    window.location.replace("../HTML/login.html");
}