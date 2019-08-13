$( document ).ready(function() {
    // Handler for .ready() called.
    init();
  });
var ADMINPROFILE;
var PROFILES=[];
function init(){
    ADMINPROFILE=JSON.parse(localStorage.getItem("AdminProfile"));
    if(ADMINPROFILE.id!=undefined){
        firebase.auth().onAuthStateChanged(function(user) { //or use firebase.auth().currentUser;
            if (user) {
             // User is signed in. 
             database.ref("Profiles/"+user.uid+"/")
            .on("value",(ds)=>{
                console.log(ds.val())
                ADMINPROFILE=ds;});
               localStorage.setItem("AdminProfile",JSON.stringify(ADMINPROFILE));
                $("#admin-sid").text(ADMINPROFILE.profile.id!=undefined?ADMINPROFILE.profile.id:"");
                $("#admin-image").attr("src",ADMINPROFILE.profile.image!=undefined?ADMINPROFILE.profile.image:"")
                $("#admin-sname").text((ADMINPROFILE.profile.first_name!=undefined?ADMINPROFILE.profile.first_name:"")+" "+(ADMINPROFILE.profile.last_name!=undefined?ADMINPROFILE.profile.last_name:""));
                $("#admin-srole").text(ADMINPROFILE.role!=undefined?ADMINPROFILE.role:"");
               
            }})
    }
    setupProfile()
}
function setupProfile(){
   
    $("#admin-sid").text(ADMINPROFILE.profile.id!=undefined?ADMINPROFILE.profile.id:"");
    $("#admin-image").attr("src",ADMINPROFILE.profile.image!=undefined?ADMINPROFILE.profile.image:"")
    $("#admin-sname").text((ADMINPROFILE.profile.first_name!=undefined?ADMINPROFILE.profile.first_name:"")+" "+(ADMINPROFILE.profile.last_name!=undefined?ADMINPROFILE.profile.last_name:""));
    $("#admin-srole").text(ADMINPROFILE.role!=undefined?ADMINPROFILE.role:"");
    let database = firebase.database();
    firebase.auth().onAuthStateChanged(function(user) { //or use firebase.auth().currentUser;
    if (user) {
     // User is signed in. 
     database.ref("Profiles/"+user.uid+"/")
    .on("value",(ds)=>{
        console.log(ds.val())
        var profile=ds;
        profile.forEach((p)=>{
            console.log(p.val())
           PROFILES.push(p.val());
        })
      
    })
    } else {
    // No user is signed in.
    }
    });
   
   
}
function updateCourseInstances(course){
    
}
function getCourseRef(courseID){
    let database = firebase.database();
    database.ref("Course/")
    .on("child_added",(ds)=>{
        //ds=Course
        if(ds.val().code==courseID){
            updateCourse(ds.val())
        }
    })
}