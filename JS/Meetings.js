
var MyLocation={
    locationdata:""
}
var MyProfile=
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
var map;
var view;
function initUI(){
   var attribution = new ol.control.Attribution({
        collapsible: false
      });
       view=new ol.View({
        center: [MyLocation.locationdata.location.long, MyLocation.locationdata.location.lat],
        zoom: 10,
       
      });
      
     map = new ol.Map({
        target: 'mapArea',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view:view
      });
      var geolocation = new ol.Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
          enableHighAccuracy: true
        },
        
        projection: view.getProjection()
      });
     
      geolocation.on('error', function(error) {
       alert(erroe.message)
      });
      var accuracyFeature = new ol.Feature();
      geolocation.on('change:accuracyGeometry', function() {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      });
      var positionFeature = new ol.Feature();
      positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: '#3399CC'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
          })
        })
      }));
     
      setPing(0,0,map,icon="")
      
      geolocation.setTracking(true);
      var coordinates = geolocation.getPosition();
      positionFeature.setGeometry(coordinates ?
        new ol.geom.Point(coordinates) : null);
      geolocation.on('change:position', function() {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ?
          new ol.geom.Point(coordinates) : null);
      });
      setupLocations()
      new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
          features: [accuracyFeature, positionFeature]
        })
      });
   
   
    


      $(".findMe").on("click",()=>{
        flyTo(new ol.proj.fromLonLat([MyLocation.locationdata.location.long, MyLocation.locationdata.location.lat]),()=>{},view)
  
        });
      flyTo(new ol.proj.fromLonLat([MyLocation.locationdata.location.long, MyLocation.locationdata.location.lat]),()=>{},view)
     $("#searchPlace").on('keyup',function(){
        document.getElementsByClassName("suggestions")[0].innerHTML="";
       getGeocode( document.getElementById("searchPlace").value,(lon,lat)=>{
           console.log(MyLocation.locationdata.location.long, MyLocation.locationdata.location.lat)
           console.log(lon,lat)
           addMarker(lon,lat,map);

        flyTo(new ol.proj.fromLonLat([lon, lat]),()=>{},view)
       },view)
     })
      getOnlineUsers();
     $(".clearPings").on("click",()=>{
         map.removeOverlay(pingoverlayelement);
         map.removeOverlay(pingsoverlayelement);
         
     })
      map.addOverlay(pingoverlayelement);
    }
    var ping;
    var pingoverlayelement;
    var pingsoverlayelement;
    function setPing(lon,lat,map,icon=""){
        var pingcon=document.createElement("div");
        var _pingcon=document.createElement("div");
        pingcon.setAttribute("class","ping-container"); 
        _pingcon.setAttribute("class","ring small-ping");
        
        pingcon.appendChild(_pingcon);pingcon.innerHTML+="<span></span>";
         ping=new ol.Feature();
        ping.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
              color: '#fff',
              width: 2
            })
          })
        })); 
        var markerSource = new ol.source.Vector({
            features:[ping] //add an array of features
          });
           pingoverlayelement = new ol.Overlay({
            stopEvent: false,
            positioning: 'center-center',
            element: pingcon
          });
          ping.setGeometry(
            new ol.geom.Point(ol.proj.fromLonLat([lon,lat])
            ));
          pingoverlayelement.setPosition(ping.getGeometry().getCoordinates());
        
    }
    function addMarker(lon,lat,map,icon=""){
   if(icon!="")icon.addEventListener("click",()=>{
            flyTo(new ol.proj.fromLonLat([lon,lat]),()=>{},view,16)
        })
        var marker=new ol.Feature();
        marker.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
              color: '#fff',
              width: 2
            })
          })
        })); 
        
    
      
        var markerSource = new ol.source.Vector({
          features:[marker] //add an array of features
        });
       
        marker.setGeometry(
            new ol.geom.Point(ol.proj.fromLonLat([lon,lat])
            ));
           if(icon=="")
        new ol.layer.Vector({
                source: markerSource,
                map:map
              })
              else
              {
                   pingsoverlayelement = new ol.Overlay({
                stopEvent: false,
                positioning: 'center-center',
                element: icon
              });
              pingsoverlayelement.setPosition(marker.getGeometry().getCoordinates());
            
              map.addOverlay(pingsoverlayelement);
            }
    }
    function setupLocations(){
       
        reverseGeocode(MyLocation.locationdata.location.long, MyLocation.locationdata.location.lat)
       
    }
    function getGeocode(search,exec=()=>{},view){
        console.log(search)
        fetch('http://nominatim.openstreetmap.org/search.php?key=KEY&format=json&q='+search+'&addressdetails=1&limit=3&viewbox=-1.99%2C52.02%2C0.78%2C50.94&exclude_place_ids=41697')
        .then(function(response) {
               return response.json();
           }).then(function(json) {
               console.log(json);
               if(json.length<=0)
         document.getElementsByClassName("suggestionBox")[0].style="none";
         else document.getElementsByClassName("suggestionBox")[0].style="";
               document.getElementsByClassName("suggestions")[0].innerHTML="";
                json.forEach(s => {
                    var link=document.createElement("button");
                    link.setAttribute("class","list-group-item list-group-item-action")
                    link.textContent=s.display_name.toUpperCase();
                    link.style.fontSize="10px";
                    link.style.fontFamily="Helvetica";
                    link.addEventListener("click",()=>{
                       console.log(s.lon,s.lat)
                       
                        exec(Number(s.lon),Number(s.lat));
   
                    })
                 document.getElementsByClassName("suggestions")[0].appendChild(link);
                });
            
           });
     }
    function reverseGeocode(lon,lat,exec=()=>{}) {
        fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + lon + '&lat=' + lat)
          .then(function(response) {
                 return response.json();
             }).then(function(json) {
                 console.log(json);
                setupsideMenu(json);
                exec(json);
             });
     }
     function setupsideMenu(json){
        $("#myLocation").html('<p><label>'+json.address.city_district+'<br>'+json.address.county+'</label><br><small>'+json.address.country+'</small></p>')
       
     }
    function flyTo(location, done,view,zoom=10) {
        map.addOverlay(pingoverlayelement);
        if(pingsoverlayelement!=undefined)map.addOverlay(pingsoverlayelement);
        ping.setGeometry(
            new ol.geom.Point(location)
            );
            pingoverlayelement.setPosition(ping.getGeometry().getCoordinates());
        var duration = 2000;
        var zoom = zoom;
        var parts = 2;
        var called = false;
        function callback(complete) {
          --parts;
          if (called) {
            return;
          }
          if (parts === 0 || !complete) {
            called = true;
            done(complete);
          }
        }
        view.animate({
          center: location,
          duration: duration
        }, callback);
        view.animate({
          zoom: zoom - 1,
          duration: duration / 2
        }, {
          zoom: zoom,
          duration: duration / 2
        }, callback);
      }
    
function setLocation(profile){
    console.log(profile);
    if(LocationData.uid=="")
    navigator.geolocation.getCurrentPosition((loc)=>{
        LocationData.uid=profile.id;
        LocationData.location.long=loc.coords.longitude;
        LocationData.location.lat=loc.coords.latitude;
        MyLocation.locationdata=LocationData;
              const db = firebase.firestore();
              
              db.collection("Locations").doc(profile.id).set(
                  LocationData
              ).then(function (response) {
                
                    })
                    .catch(function (error) {
                
                    });
               
             
            });
            else{
                const db = firebase.firestore();
              
              db.collection("Locations").doc(profile.id).set(
                  LocationData
              ).then(function (response) {
                
                    })
                    .catch(function (error) {
                
                    });
                }
}
var ONLINEUSERS=[],OFFLINEUSERS=[];

function getUserLocation(uid){

}
function updateUI(){
    $(".profiles-online").html('');
    $(".profiles-offline").html('');
    let database = firebase.database();
   // alert(ONLINEUSERS.length);
    ONLINEUSERS.forEach(user=>{
    
        database.ref("Profile/"+user.uid).on("child_added",(p)=>{
            console.log(p.val());
                var list=document.createElement("div");
                list.setAttribute("class","grow list-group-item list-group-item-action left-row");
                var inner=document.createElement("div");
                var image=document.createElement("img");
                image.src=p.val().url!=undefined?p.val().url:"",
                image.alt="";
                image.style.border="2px rgb(81, 255, 0) solid";
                image.style.margin="0 10px";
                image.setAttribute("class","circle-image sml grow");
                

                list.appendChild(image);
                inner.innerHTML="<label>"+p.val().first_name+" | "+p.val().id+"</label><br>";
                reverseGeocode(user.location.long,user.location.lat,(e)=>{
                    inner.innerHTML+= "<label>location: "+e.address.city_district+" - <small>"+e.address.county+"</small></label>"
                })
                list.appendChild(inner);
                $(".profiles-online").append(list);
                
                list.addEventListener("click",()=>{
                   
                    flyTo(new ol.proj.fromLonLat([user.location.long,user.location.lat]),()=>{},view,16)
                })
                addMarker(user.location.long,user.location.lat,map,image.cloneNode(true))
            })
    });
    OFFLINEUSERS.forEach(p=>{
    
        
                var list=document.createElement("div");
                list.setAttribute("class","grow list-group-item list-group-item-action left-row");
                var inner=document.createElement("div");
                var image=document.createElement("img");
                image.src=p.profile.url!=undefined?p.profile.url:"",
                image.alt="";
                image.style.border="2px red solid";
                image.style.margin="0 10px";
                image.setAttribute("class","circle-image sml grow");
                

                list.appendChild(image);
                inner.innerHTML="<label>"+p.profile.first_name+" | "+p.profile.id+"</label><br>";
                /*reverseGeocode(user.location.long,user.location.lat,(e)=>{
                    inner.innerHTML+= "<label>location: "+e.address.city_district+" - <small>"+e.address.county+"</small></label>"
                })*/
                list.appendChild(inner);
                $(".profiles-offline").append(list);
                
                /*list.addEventListener("click",()=>{
                    flyTo(new ol.proj.fromLonLat([user.location.long,user.location.lat]),()=>{},view,16)
                })*/
               // addMarker(user.location.long,user.location.lat,map,image.cloneNode(true))
            
    })
}
function getProfileById(){

}
function getOnlineUsers(){
    const db = firebase.firestore();
    let doc = db.collection('Online').onSnapshot({ includeMetadataChanges: true },querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
            console.log(change.doc.data());
          if (change.type === 'added') {
           
            if(!change.doc.data().uid!=undefined){
                if(change.doc.data().uid!=null)
                db.collection("Locations").doc(change.doc.data().uid).get()
                .then(doc =>{
                    console.log("$$",doc)
                  if(doc!=undefined)
                    console.log("??",doc.data());
                      
                        ONLINEUSERS.push(doc.data());
                        getOfflineUsers();
                    
                }).then(function (response) {
                    readytoGo=true;
                    getOfflineUsers();
                })
                .catch(function (error) {
                    console.log(error.message)
                });
               
        }
        getOfflineUsers();
          }
          if (change.type === 'modified') {
        
            db.collection("Locations").doc(change.doc.data().uid).get().then(querySnapshot =>{
                querySnapshot.docs().forEach(change => {
                    if (change.type === 'added') 
                    ONLINEUSERS.push(change.doc.data());
                })
            })
          }
          if (change.type === 'removed') {
            db.collection("Locations").doc(change.doc.data().uid).get().then(querySnapshot =>{
                querySnapshot.docs().forEach(change => {
                    if (change.type === 'added') 
                    
                    ONLINEUSERS.splice (ONLINEUSERS.indexOf(change.doc.data()))
                })
            })
          
          }
          var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
          console.log("Data came from " + source);
        });
      });
}
function getOfflineUsers(){
    OFFLINEUSERS=[];
    let database = firebase.database();
    database.ref("Profile/")
    .on("value",(ds)=>{
        console.log(ds.val())//ids
        ds.forEach(e=>{
        var uid=e;
      
        uid.forEach((s)=>{

            console.log("-->",s.val());
        
            var online=false;
            var added=false;

            ONLINEUSERS.forEach(op=>{
                if(op.uid==e.key)
                online=true;
            })
            OFFLINEUSERS.forEach(op=>{
                if(op.id==e.key)
                added=true;
            })
            if(!online&&!added){
               
                OFFLINEUSERS.push({"id":e.key,"profile":s.val()});
           }
           
        
            
    
        });
    
    });
    updateUI();
    })
}
var readytoGo=false;
mainThread();
function mainThread(){
var thread=setInterval(() => {
    if(readytoGo==true){
        clearInterval(thread);
        initUI();
    }
}, 1000);
}
function updateUserLocation(profile){
    if(LocationData.uid=="")
    navigator.geolocation.getCurrentPosition((loc)=>{
LocationData.uid=profile.id;
LocationData.location.long=loc.coords.longitude;
LocationData.location.lat=loc.coords.latitude;
MyLocation.locationdata=LocationData;
      const db = firebase.firestore();
     
            db.collection("Locations").doc(profile.id).update({
                "location":LocationData.location
            }).then(function (response) {
                readytoGo=true;
            })
            .catch(function (error) {
                console.log(error.message)
            });
        
    
    });
    else{
        const db = firebase.firestore();
     
        db.collection("Locations").doc(profile.id).update({
            "location":LocationData.location
        }).then(function (response) {
            readytoGo=true;
        })
        .catch(function (error) {
            console.log(error.message)
        });
    }
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
  