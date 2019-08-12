var LocationData={
    "uid":"",
    "location":{
        "long":0,
        "lat":0,

    }
}
var MyProfile={}
$( document ).ready(function() {
    // Handler for .ready() called.
init();
});
function init(){
    let database = firebase.database();
    firebase.auth().onAuthStateChanged(function(user) {
       
       
        database.ref("Profile/"+user.uid).on("child_added",(p)=>{
            console.log(p.val());
             MyProfile={"id":user.uid,"profile":p.val()}
       
             updateUserLocation(MyProfile);
            })
       
    });
     
}
function setLocation(profile){
    console.log(profile);
    navigator.geolocation.getCurrentPosition((loc)=>{
        LocationData.uid=profile.id;
        LocationData.location.long=loc.coords.longitude;
        LocationData.location.lat=loc.coords.latitude;
              const db = firebase.firestore();
              
              db.collection("Locations").doc(profile.id).set(
                  LocationData
              ).then(function (response) {
                
                    })
                    .catch(function (error) {
                
                    });
               
             
            });
}
function updateUserLocation(profile){
    navigator.geolocation.getCurrentPosition((loc)=>{
LocationData.uid=profile.id;
LocationData.location.long=loc.coords.longitude;
LocationData.location.lat=loc.coords.latitude;
      const db = firebase.firestore();
     
            db.collection("Locations").doc(profile.id).update({
                "location":LocationData.location
            }).then(function (response) {
        
            })
            .catch(function (error) {
        
            });
        
    
    });
}
getLocation();

function initMap() {
    // The location of Uluru
    var uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementsByClassName("mapArea")[0], {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: uluru, map: map});
  }
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
     alert("Geolocation is not supported by this browser.");
    }
  }
  function avatarList(profile) {
      var list=document.createElement("div");
      list.setAttribute("class","list-group-item list-group-item-action");
      var leading=document.createElement("img");
      leading.setAttribute("class",".circle-image.sml");
      leading.src=profile.url!=undefined?profile.url:"";
      leading.alt="";

      var title=document.createElement("div");
      list.appendChild(leading);
      list.appendChild(title);
  }
  
  function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + 
    "Longitude: " + position.coords.longitude); 

  }
  