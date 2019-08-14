$( document ).ready(function() {
    // Handler for .ready() called.
    init();
  });
var ADMINPROFILE;
var PROFILES=[];
function init(){

    ADMINPROFILE=JSON.parse(localStorage.getItem("AdminProfile"));
  
    if(ADMINPROFILE.id==undefined){
           let database= firebase.database();
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
                setupProfile();
                goOnline(ADMINPROFILE.profile,ADMINPROFILE.id);
            }})
    }
    else{
            setupProfile();
            //goOnline(ADMINPROFILE.profile,ADMINPROFILE.id)
        }
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
function offline(profile){
    const db = firebase.firestore();
    let database=firebase.database();
    db.collection("Online").doc(profile.id).delete().then(function() {
        database.ref("Profile/"+profile.id).on("child_added",(p)=>{
            console.log(p.key);
            database.ref("Profile/"+profile.id+"/"+p.key).update({
                "online": false
              }).then((resonse)=>{
                console.log(profile.id,": Now Off line!");
           })
              
         })
       

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}
function goOnline(profile,id){
    console.log(profile)
    if(profile.online){
        console.log("going online...")
      
                  const db = firebase.firestore();
                  db.collection("Online").doc(id).set(
                    {"uid":profile.id}
                ).then(function (response) {
                    STATUS=false;
                  toggleOffline();
                    console.log("You are online!!")
              }) .catch(function (error) {
               
            });

      
    }
    else{
        STATUS=true;
                  toggleOffline();
    }
}
var STATUS=true;
function toggleOffline(){
    console.log("toggling....")
    ADMINPROFILE=JSON.parse(localStorage.getItem("AdminProfile"));
    if(!STATUS){
        $(".goOffline").html('<i class="fas fa-check-circle"style="color:lime"></i> You\'re Online ')
        STATUS=true;
       setOnline(ADMINPROFILE); 
    }
    else{
        $(".goOffline").html('<i class="fas fa-power-off"style="color:red"></i> You\'re Offline ')
        STATUS=false;
        offline(ADMINPROFILE);
    }
}
$(".goOffline").on("click",()=>{
    toggleOffline();
})
var LocationData={
        "uid":"",
        "location":{
            "long":0,
            "lat":0,
    
        }
    }
function setOnline(profile){
    let database=firebase.database();
    const db = firebase.firestore();
    database.ref("Profile/"+profile.id).on("child_added",(p)=>{
            console.log(p.key);
            database.ref("Profile/"+profile.id+"/"+p.key).update({
                            "online": true
                          }).then((resonse)=>{
                            db.collection("Online").doc(profile.id).set(
                                {"uid":profile.id}
                            ).then(function (response) {
                          }) .catch(function (error) {
                    
                        });
                         
                     
                        })
                       
                   
                 
                });
    

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