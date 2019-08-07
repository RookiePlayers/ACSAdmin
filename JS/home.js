$( document ).ready(function() {
    // Handler for .ready() called.
    init();
  });
var ADMINPROFILE;
var PROFILES=[];
function init(){
    ADMINPROFILE=JSON.parse(localStorage.getItem("AdminProfile"));
  
    setupProfile()
}
function setupProfile(){
   
    $("#admin-sid").text(ADMINPROFILE.profile.id!=undefined?ADMINPROFILE.profile.id:"");
    $("#admin-image").attr("src",ADMINPROFILE.profile.image!=undefined?ADMINPROFILE.profile.image:"")
    $("#admin-sname").text((ADMINPROFILE.profile.first_name!=undefined?ADMINPROFILE.profile.first_name:"")+" "+(ADMINPROFILE.profile.last_name!=undefined?ADMINPROFILE.profile.last_name:""));
    $("#admin-srole").text(ADMINPROFILE.role!=undefined?ADMINPROFILE.role:"");
   
   
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