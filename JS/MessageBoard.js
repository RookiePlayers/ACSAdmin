var MESSAGES=[];
var PROFILES=[];
var MyProfile; 
 var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext //audio context to help us record
var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

$( document ).ready(function() {
    // Handler for .ready() called.
  
// timeAgo Function
(function timeAgo(selector) {

    var templates = {
        prefix: "",
        suffix: " ago",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years"
    };
    var template = function (t, n) {
        return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
    };

    var timer = function (time) {
        if (!time) return;
        time = time.replace(/\.\d+/, ""); // remove milliseconds
        time = time.replace(/-/, "/").replace(/-/, "/");
        time = time.replace(/T/, " ").replace(/Z/, " UTC");
        time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
        time = new Date(time * 1000 || time);

        var now = new Date();
        var seconds = ((now.getTime() - time) * .001) >> 0;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365;

        return templates.prefix + (
        seconds < 45 && template('seconds', seconds) || seconds < 90 && template('minute', 1) || minutes < 45 && template('minutes', minutes) || minutes < 90 && template('hour', 1) || hours < 24 && template('hours', hours) || hours < 42 && template('day', 1) || days < 30 && template('days', days) || days < 45 && template('month', 1) || days < 365 && template('months', days / 30) || years < 1.5 && template('year', 1) || template('years', years)) + templates.suffix;
    };

    var elements = document.getElementsByClassName('timeago');
    for (var i in elements) {
        var $this = elements[i];
        if (typeof $this === 'object') {
            $this.innerHTML = timer($this.getAttribute('title') || $this.getAttribute('datetime'));
        }
    }
    // update time every minute
    setTimeout(timeAgo, 60000);

})();
    let database = firebase.database();
    firebase.auth().onAuthStateChanged(function(user) {
       
       
        database.ref("Profile/"+user.uid).on("child_added",(p)=>{
            console.log(p.val());
             MyProfile={"id":user.uid,"profile":p.val()}
       
                    database.ref("Profile/")
            .on("value",(ds)=>{
                console.log(ds.val())//ids
                ds.forEach(e=>{
                var uid=e;
                console.log(e.key)
                uid.forEach((s)=>{

                    console.log("-->",s.val());
                
                    PROFILES.push({"id":e.key,"profile":s.val()});
                
                    
            
                });
            
            });
            initMB()
            })
        })
    });
     
   

});
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
function loadMessageBoard(){
 var db = firebase.firestore();
    let doc = db.collection('MessageBoard').onSnapshot({ includeMetadataChanges: true },querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            console.log('New Message: ', change.doc.data());
            MESSAGES.push(change.doc.data());
            updateUI();
          }
          if (change.type === 'modified') {
            console.log('Modified Message: ', change.doc.data());
            MESSAGES.push(change.doc.data())
          }
          if (change.type === 'removed') {
            console.log('Removed Message: ', change.doc.data());
            MESSAGES.splice (MESSAGES.indexOf(change.doc.data()))
          }
          var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
          console.log("Data came from " + source);
        });
      });
}

function initMB(){
   
    loadDB()
}
function loadDB(){
    loadMessageBoard();
}
function updateUI(){
    $(".message-board").html('');
    MESSAGES.reverse();
    MESSAGES.forEach(m=>{
        $(".message-board").append(MessageBoardCard(m));
    })
}


function getProfileByID(id){
   var res={};
   console.log(id);
    PROFILES.forEach(p=>{
       if(p.id==id){
        res=p;
       }
   })
   console.log(res)
   return res;

}

function MessageBoardCard(messageBoard)
{
    var card=document.createElement("div");
    var card_head=document.createElement("div");
    var card_body=document.createElement("div");
    var card_footer=document.createElement("div");

    card.setAttribute("class","card");
    card_head.setAttribute("class","card-header space-between-row");
    card_head.style.width="100%";
    card_body.setAttribute("class","card-body");
    card_footer.setAttribute("class","card-footer space-between-row");

    var img=document.createElement("img");
    img.alt="";
    img.setAttribute("class","circle-image tiny");
    img.src=getProfileByID(messageBoard.uploader).profile.url!=null?getProfileByID(messageBoard.uploader).profile.url:"";

    var backup=document.createElement("div");
    backup.setAttribute("class","circle-image tiny space-between-row");
    backup.textContent=getProfileByID(messageBoard.uploader).profile.first_name.substring(0,1);


    var uploader=document.createElement("div");
    uploader.innerHTML="<p style='color:black; margin:0 5px;font-size:12px;font-weight:bold'>"+getProfileByID(messageBoard.uploader).profile.first_name+"<sub style='color:grey;font-size:8px'>~"+getProfileByID(messageBoard.uploader).profile.id+"@studentmail.ul.ie</sub></p>"

    var _card_head=document.createElement("div");
    _card_head.setAttribute("class","row");
   
    _card_head.appendChild(img.src!=""?img:backup)
    _card_head.appendChild(uploader);

    var _timeAgo=document.createElement("span");
    _timeAgo.setAttribute("class","timeago");
    var temp=new Date(messageBoard.postedOn).toISOString();
    _timeAgo.setAttribute("title",temp);
    _timeAgo.style.fontSize="12px"
    
    
    card_head.appendChild(_card_head)
    card_head.appendChild(_timeAgo);

    var actions=document.createElement("div");
    actions.setAttribute("div","space-between-row");

    var upvoteIc=document.createElement("ic");
    upvoteIc.setAttribute("class","far fa-thumbs-up grow");
    upvoteIc.addEventListener("click",()=>{
        toggleLike(messageBoard,upvoteIc,upvoteLbl);
    })

    var upvoteLbl=document.createElement("label");
    upvoteLbl.setAttribute("style","margin:12px");
    upvoteLbl.textContent=messageBoard.upvote.length+"";
    var miniRow=document.createElement("div");
    miniRow.setAttribute("div","row");
    miniRow.appendChild(upvoteIc);
    miniRow.appendChild(upvoteLbl);
   


    
    var downvoteIc=document.createElement("ic");
    downvoteIc.setAttribute("class","far fa-thumbs-down grow");
    var downvoteLbl=document.createElement("label");
    downvoteLbl.setAttribute("style","margin:12px");
    downvoteLbl.textContent=messageBoard.downvotes.length+"";
    var miniRow1=document.createElement("div");
    miniRow1.setAttribute("div","row");
    miniRow1.appendChild(downvoteIc);
    miniRow1.appendChild(downvoteLbl);
    downvoteIc.addEventListener("click",()=>{
        toggleLike(messageBoard,downvoteIc,downvoteLbl);
    })



    var commentIc=document.createElement("ic");
    commentIc.setAttribute("class","fas fa-comment-alt grow");
    var commentLbl=document.createElement("label");
    commentLbl.setAttribute("style","margin:12px");
    commentLbl.textContent=messageBoard.comments.length+"";
    var miniRow2=document.createElement("div");
    commentIc.addEventListener("click",()=>{
        setupMessageThread(messageBoard,card_head.cloneNode(true),miniRow.cloneNode(true),miniRow1.cloneNode(true),card_body.cloneNode(true));
       
    })
    miniRow2.setAttribute("div","row");
    miniRow2.appendChild(commentIc);
    miniRow2.appendChild(commentLbl);

    var shareIc=document.createElement("ic");
    shareIc.setAttribute("class","fa fa-share grow");
    var shareLbl=document.createElement("label");
    shareLbl.setAttribute("style","margin:12px");
    shareLbl.textContent="Share";
    var miniRow3=document.createElement("div");
    miniRow3.setAttribute("div","row");
    miniRow3.appendChild(shareIc);
    miniRow3.appendChild(shareLbl);

    card_footer.appendChild(miniRow);
    card_footer.appendChild(miniRow1);
    card_footer.appendChild(miniRow2);
    card_footer.appendChild(miniRow3);

    var caption=document.createElement("h4");
    caption.textContent=messageBoard.title;
    caption.style.fontSize="16px";
    caption.style.fontWeight="none";

    var desc=document.createElement("h4");
    desc.textContent=messageBoard.desc;
    desc.style.fontSize="10px";
    desc.style.color="grey";
    desc.style.fontWeight="none";
    
    
    card_body.appendChild(caption);
    card_body.appendChild(desc);

    var AspectRatioCont=document.createElement("div");
    AspectRatioCont.setAttribute("class","card-img overlay-cont");

    var overlay=document.createElement("div");
    overlay.setAttribute("class","overlay");
    overlay.innerHTML=messageBoard.image.includes("gif")?"<span class='badge badge-dark'>Gif</span>":"";
    var image=document.createElement("img");
    image.src=messageBoard.image;
    image.alt="";
    image.style.objectFit="cover";
    image.style.width="100%";
    image.style.height="100%";

    var video=document.createElement("video");
    
    video.setAttribute("controls","");
    video.style.width="100%";
    video.style.height="100%";
    


    var videoSrc=document.createElement("source");
    videoSrc.setAttribute("type","video/mp4");
    videoSrc.setAttribute("src",messageBoard.video);
    video.appendChild(videoSrc);
    
    if(messageBoard.type=="Image")
    {
        AspectRatioCont.appendChild(image);
        AspectRatioCont.appendChild(overlay);
        card_body.appendChild(AspectRatioCont);
    }
    else
    if(messageBoard.type=="Video")
    {
         AspectRatioCont.appendChild(video);
         AspectRatioCont.appendChild(overlay);
       
        overlay.innerHTML="<span class='badge badge-dark'>Video</span>";
        card_body.appendChild(AspectRatioCont);
        
    }

    


    card.appendChild(card_head);
    card.appendChild(card_body);
    card.appendChild(card_footer);

    card.style.margin="20px";
    
    card.addEventListener("mouseenter",()=>{
        if(messageBoard.type=="Video")
           video.play().catch(()=>{})
        
    })
    card.addEventListener("mouseleave",()=>{
        if(messageBoard.type=="Video")
       video.pause()
    
})
    return card;
    
}
var isPlaying;
function togglePlay(video){
  
}
function setupMessageThread(message,header,liker,disliker,body){
    $("#messageThreadModal").modal('show');
    header.classList.remove("card-header");
    $("#messageThreadModal").find(".thread-body").html('');
   $("#messageThreadModal").find(".thread-body").append(body);
    $(".thread-header").attr("style","padding:0 20px;width:100%")
    $(".thread-header").html(header.outerHTML);
    $(".thread-footer").html('');
    $(".thread-footer").append(liker);
    $(".thread-footer").append(disliker);
    liker.getElementsByTagName("ic")[0].addEventListener("click",()=>{
        toggleLike(message, liker.getElementsByTagName("ic")[0], liker.getElementsByTagName("label")[0]);
    })
    disliker.getElementsByTagName("ic")[0].addEventListener("click",()=>{
        toggleLike(message, disliker.getElementsByTagName("ic")[0], disliker.getElementsByTagName("label")[0]);
    })
    $("#addComment").on("click",()=>{
        addNewComment();
    })
    

}
function toggleLike(message,ic,lbl){
 

    //check if already liked
    if(!alreadyOnList(message.upvote,MyProfile.id))
    {
        console.log("Liked");
        //add me to liked list
        message.upvote.push(MyProfile.id)
        //change Color and Number
        ic.classList.remove("far");
        ic.classList.add("fas");
        lbl.textContent=message.upvote.length+"";
        //update message.vote

    }else{
        message.upvote.remove(MyProfile.id)
        ic.classList.remove("fas");
        ic.classList.add("far");
        lbl.textContent=message.upvote.length+"";
        //update message.vote
    }
    
    
}
function addNewComment(parent){
    var card=document.createElement("div");
    var card_head=document.createElement("div");
    var card_body=document.createElement("div");
    var card_footer=document.createElement("div");
    //card.setAttribute("class","card-content");
  
    card_head.setAttribute("class","card-header space-between-row");
    card_head.style.width="100%";
    card_body.setAttribute("class","card-body");
    card_footer.setAttribute("class","card-footer space-between-row");

    var t_text=document.createElement("button");
    var t_pic=document.createElement("button");
    var t_vid=document.createElement("button");
    var t_gif=document.createElement("button");
    var t_voice=document.createElement("button");

    t_text.setAttribute("class","btn btn-dark type1");
    t_text.setAttribute("onclick","");
    t_pic.setAttribute("class","btn btn-dark type2");
    t_vid.setAttribute("class","btn btn-dark type3");
    t_gif.setAttribute("class","btn btn-dark type4");
    t_voice.setAttribute("class","btn btn-dark type5");
    t_text.textContent="Text";
    t_pic.textContent="Image";
    t_vid.textContent="Video";
    t_gif.textContent="Gif";
    t_voice.textContent="VM";

    card_head.appendChild(t_text);
    card_head.appendChild(t_pic);
    card_head.appendChild(t_vid);
    card_head.appendChild(t_gif);
    card_head.appendChild(t_voice);
    card_body.innerHTML="<textarea id='text'style='width:100%;height:136px' placeholder='Enter Reply'></textarea>";  
    onchooseText(card_body,t_text);
    onchoosePic(card_body);
    onchooseGif(card_body);
    onchooseVid(card_body);
    onchooseRec(card_body);
    
    function onchooseText(body,elem){
       
    elem.addEventListener("click",()=>{
        player.pause();
        player.pause();
        if(rec!=null)rec.stop();
        clearInterval(recTime);
        body.innerHTML="<textarea id='text'style='width:100%;height:136px' placeholder='Enter Reply'></textarea>";   
        console.log("clikc**");
    })  
    }
    function onchoosePic(body){
     
        t_pic.addEventListener("click",()=>{  
            player.pause();
            player.pause();
            if(rec!=null)rec.stop();
            clearInterval(recTime); 
            console.log("pic")
            var option=document.createElement("div");
            var option1=document.createElement("div");
            var image=document.createElement("img");
            image.setAttribute("id","cm-img");
            image.alt="";
            image.style.objectFit="cover";
            image.style.width="100%";
            image.style.height="150px";
            
            option1.setAttribute("class","input-group mb-3");
            var option2=document.createElement("div");
            option2.setAttribute("class","input-group mb-3");
            option.setAttribute("class","left-col");
            option1.innerHTML="<div class='custom-file'> <input type='file' class='custom-file-input'id='ImageBrowse'><label class='custom-file-label' for='ImageBrowse'>Choose file</label>"
            option2.innerHTML="<div class=''> <input type='text' class='custom-link-input' placeholder='or Paste Link' id='ImageLink'><label class='' for='ImageLink'></label>"
          
            option.innerHTML="";
            option.appendChild(image);
           option.appendChild(option1);
           option.appendChild(option2);
          
           body.innerHTML=option.outerHTML;  
           document.getElementById("ImageBrowse").addEventListener('change',(e)=>{
              readURL(document.getElementById("ImageBrowse"),(e)=>{document.getElementById("cm-img").src=e.target.result;})
             })  
             document.getElementById("ImageLink").addEventListener('keyup',(e)=>{
                document.getElementById("cm-img").src= document.getElementById("ImageLink").value
               }) 
       })  
       }
      
    function onchooseVid(body){
    
        t_vid.addEventListener("click",()=>{
            player.pause();
            if(rec!=null)rec.stop();
            clearInterval(recTime);
            console.log("vid")
            var option=document.createElement("div");
            var option1=document.createElement("div");
            var video=document.createElement("video");
            video.setAttribute("autoplay","");
            video.setAttribute("controls","");
            video.setAttribute("id","myVideo");
            video.style.width="100%";
            video.style.height="100%";

            var videoSrc=document.createElement("source");
            videoSrc.setAttribute("type","video/mp4");
           
            videoSrc.setAttribute("id","videoSrc");
            video.appendChild(videoSrc);
            
            option1.setAttribute("class","input-group mb-3");
            var option2=document.createElement("div");
            option2.setAttribute("class","input-group mb-3");
            option.setAttribute("class","left-col");
            option1.innerHTML="<div class='custom-file'> <input type='file' class='custom-file-input'id='vidBrowse'><label class='custom-file-label' for='ImageBrowse'>Choose file</label>"
            option2.innerHTML="<div class=''> <input type='text' class='custom-link-input' placeholder='or Paste Link' id='vidLink'><label class='' for='ImageLink'></label>"
          
            option.innerHTML="";
            option.appendChild(video);
           option.appendChild(option1);
           option.appendChild(option2);
          
           body.innerHTML=option.outerHTML;  
           document.getElementById("vidBrowse").addEventListener('change',(e)=>{
              readURL(document.getElementById("vidBrowse"),(e)=>{document.getElementById("videoSrc").src=e.target.result;document.getElementById("myVideo").load();})
             })  
             document.getElementById("vidLink").addEventListener('keyup',(e)=>{
                document.getElementById("videoSrc").src= document.getElementById("vidLink").value;
                document.getElementById("myVideo").load();
               }) 
       })  
       }
       function onchooseGif(body){
      
        t_gif.addEventListener("click",()=>{
            player.pause();
            if(rec!=null)rec.stop();
            clearInterval(recTime);
            console.log("pic")
            var option=document.createElement("div");
            var option1=document.createElement("div");
            var slider=document.createElement("div");
            slider.setAttribute("class","gif-slider");
            var image=document.createElement("img");
            image.setAttribute("id","cm-gif");
            image.alt="";
            image.style.objectFit="cover";
            image.style.width="100%";
            image.style.height="150px";
            
            option1.setAttribute("class","input-group mb-3");
            var option2=document.createElement("div");
            option2.setAttribute("class","input-group mb-3");
            option.setAttribute("class","left-col");
            option1.innerHTML="<div class='custom-file'> <input type='text' class='' id='gifBrowse'placeholder='Search Giphy'><label class='custom-text-label' for='gifBrowse'></label>"
            option2.innerHTML="<div class=''> <input type='text' class='custom-link-input' placeholder='or Paste Link' id='gifLink'><label class='' for='gifLink'></label>"
          
            option.innerHTML="";
            option.appendChild(image);
            option.appendChild(slider);
           option.appendChild(option1);
           option.appendChild(option2);
          
           body.innerHTML=option.outerHTML;  
           document.getElementById("gifBrowse").addEventListener('keyup',(e)=>{
              var val=$('#gifBrowse').val();
             
              val.replace(" ","+").toLowerCase();
              var xhr = $.get("http://api.giphy.com/v1/gifs/search?q="+val+"&api_key=aO8F8N8hYtN6sYd3xucGxcLqvVu0gcPS&limit=5");
                xhr.done(function(data) { console.log("success got data", data);
                setupGifResults(data.data, document.getElementById("cm-gif")); 
                
            });

             })  
             document.getElementById("gifLink").addEventListener('keyup',(e)=>{
                document.getElementById("cm-gif").src= document.getElementById("ImageLink").value
               }) 
       })  
       }
       function onchooseRec(body){
           t_voice.addEventListener("click", () => {
               isRec = 0;
              player.pause()
               if(rec!=null)rec.stop();
               clearInterval(recTime);
               console.log("voice")
               var option = document.createElement("div");
               option.style.textAlign="center"
               var option1 = document.createElement("div");
               var time = document.createElement("label");
               time.setAttribute("id", "timeElapsed");
               time.textContent = "--/30s";
              
               var info = document.createElement("small");
              // info.setAttribute("id", "timeElapsed");
               info.textContent = "click to play/stop, double click to restart";


               option.setAttribute("class", "rec centered-row");
             
               var option2 = document.createElement("div");
               option1.setAttribute("class", "centered-col");
               option2.setAttribute("class", "centered-col text-center overlay-cont record");
                 var option2b = document.createElement("div");
                option2b.setAttribute("class", "centered-col text-center circle-overlay");
               option2b.style.backgroundColor ="white";
               option2b.style.fontSize="20px"
                
                            
               var option2a = document.createElement("div");
                 option2a.setAttribute("class", "centered-row");
                              option2a.appendChild(option2);
               option2.innerHTML ="<i class='fas fa-assistive-listening-systems'></i>"
               option2b.innerHTML = "<i class='fas fa-assistive-listening-systems'></i>"
                option2.appendChild(option2b);
               
               option2b.addEventListener('click',()=>{
                 
                    toggleRecState(option2,option2b,time)
                })
               option2b.addEventListener('dblclick', () => {

                isRec=0;
                   time.textContent = "--/30s";
                player.pause();
                   option2.innerHTML = "<i class='fas fa-assistive-listening-systems'></i>"
                   option2b.innerHTML = "<i class='fas fa-assistive-listening-systems'></i>"
                   option2.appendChild(option2b);
               })
               $(".record")
                   .focusout(function(){
                    console.log("focus lost")
      isRec = 0;
      time.textContent = "--/30s";
      player.pause();
      option2.innerHTML = "<i class='fas fa-assistive-listening-systems'></i>"
      option2b.innerHTML = "<i class='fas fa-assistive-listening-systems'></i>"
      option2.appendChild(option2b);

                })
               option2a.style.width="100%";
                 option.innerHTML = "";
               option1.appendChild(info);
                 option1.appendChild(option2a);
               option1.appendChild(time);
             
               option.appendChild(option1);

               body.innerHTML = "";
               body.appendChild(option);
              
           })  
        }

       var savecomment=document.createElement("button");
       savecomment.setAttribute("class","btn btn-primary");
       savecomment.textContent="Post";
       var discardcomment=document.createElement("button");
       discardcomment.setAttribute("class","btn btn-secondary");
      
       discardcomment.textContent="Discard";

       savecomment.addEventListener("click",()=>{

       })
      discardcomment.addEventListener("click",()=>{
       // $("#commentThreadModal").modal('hide');
       document.getElementsByClassName("comment-content")[0].innerHTML="";
    });
    
    
    card.appendChild(card_head);
    card.appendChild(card_body);
    card.appendChild(card_footer);

    card_footer.appendChild(savecomment);
    card_footer.appendChild(discardcomment);
    document.getElementsByClassName("comment-content")[0].innerHTML="";
    document.getElementsByClassName("comment-content")[0].appendChild(card);
    //$("#commentThreadModal").modal('show');

}
var isRec=0
function toggleRecState(elem,overlay,lbl) {
    //0=stop
    console.log(isRec)
    if(isRec==1){
        stopRecording(lbl);
        isRec=2;//play
        elem.classList.remove("rotate-center")
        overlay.innerHTML = "<i class='fas fa-play'></i>"
        elem.style.border = "#00ff1f solid"
            elem.innerHTML = "<i class='fas fa-play'></i>"
        elem.appendChild(overlay);
    }
    else if (isRec == 2) {
        isRec = 3;//pause
       
        player.onended=function(){
            overlay.innerHTML = "<i class='fas fa-play'></i>"
            elem.style.border = "#00ff1f solid"
            elem.innerHTML = "<i class='fas fa-play'></i>"
            elem.appendChild(overlay);
        }
        elem.classList.remove("rotate-center")
        overlay.innerHTML = "<i class='fas fa-pause'></i>"
        if (player.paused) {
            player.play().catch(()=>{

            });
        }
        elem.style.border = "#00d0ff solid"
        elem.innerHTML = "<i class='fas fa-pause'></i>"
        elem.appendChild(overlay);
    }
    else if (isRec == 3) {
        
        isRec = 2;//play
        if(!player.paused){
            player.pause();
        }
        elem.classList.remove("rotate-center")
        overlay.innerHTML = "<i class='fas fa-play'></i>"
        elem.style.border = "#00ff1f solid"
        elem.innerHTML = "<i class='fas fa-play'></i>"
        elem.appendChild(overlay);
    }
    else{
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) { 

            startRecording(lbl,stream);
        starttimer(0,elem,overlay,lbl)
         }).catch((e) => { });
        
        isRec=1;
        elem.classList.add("rotate-center")
        overlay.innerHTML = "<i class='fas fa-stop'></i>"
        elem.innerHTML = "<i class='fas fa-assistive-listening-systems'></i>"
        elem.style.border="#ff0000 dashed"
        elem.appendChild(overlay);

    }
    console.log(isRec)
}
function setupGifResults(data,parent){
    
    document.getElementsByClassName("gif-slider")[0].innerHTML="";
    console.log(data.length)
    for(var i=0;i<data.length;i++){
        var giphy=data[i];
        console.log(giphy)
        var img=document.createElement("img");
        img.alt="";
        img.style.objectFit="cover";
        img.style.width="50px";
        img.style.height="50px";
        img.src=giphy.images.original.url;
        img.style.margin="12px";
        document.getElementsByClassName("gif-slider")[0].appendChild(img);
        clicked(img);
        function clicked(elem){
        elem.addEventListener("click",()=>{
           parent.src= elem.src
        });
        }
        
    }
   // var slideContainer = $('.gif-slider');
   //  slideContainer.slick();
    
//parent.innerHTML="";
//parent.appendChild()


    //(".home-featured-spotlight").show();




}
function updateTimeText(lbl){

}
function setupGiphyAPI(){
    var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=aO8F8N8hYtN6sYd3xucGxcLqvVu0gcPS&limit=5");
xhr.done(function(data) { console.log("success got data", data); });
}
function readURL(input,onload) {
console.log("loaded",input.files);

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload =function(e){onload(e)};

        reader.readAsDataURL(input.files[0]);
    }
}
function commentModule(comment){
    var card=document.createElement("div");
    var card_head=document.createElement("div");
    var card_body=document.createElement("div");
    var card_footer=document.createElement("div");

    card.setAttribute("class","card");
    card_head.setAttribute("class","card-header space-between-row");
    card_head.style.width="100%";
    card_body.setAttribute("class","card-body");
    card_footer.setAttribute("class","card-footer space-between-row");

    var uploader=document.createElement("div");
    uploader.innerHTML="<p style='color:black; margin:0 5px;font-size:12px;font-weight:bold'>"+getProfileByID(comment.user).profile.first_name+"<sub style='color:grey;font-size:8px'>~"+getProfileByID(comment.uder).profile.id+"@studentmail.ul.ie</sub></p>"

    var _card_head=document.createElement("div");
    _card_head.setAttribute("class","row");
    var _timeAgo=document.createElement("span");
    _timeAgo.setAttribute("class","timeago");
    var temp=new Date(comment.date).toISOString();
    _timeAgo.setAttribute("title",temp);
    _timeAgo.style.fontSize="12px"
    
    
    card_head.appendChild(_card_head)
    card_head.appendChild(_timeAgo);
    var actions=document.createElement("div");
    actions.setAttribute("div","space-between-row");

    var upvoteIc=document.createElement("ic");
    upvoteIc.setAttribute("class","far fa-thumbs-up grow");
    upvoteIc.addEventListener("click",()=>{
        toggleLike(comment,upvoteIc,upvoteLbl);
    })

    var upvoteLbl=document.createElement("label");
    upvoteLbl.setAttribute("style","margin:12px");
    upvoteLbl.textContent=comment.upvote.length+"";
    var miniRow=document.createElement("div");
    miniRow.setAttribute("div","row");
    miniRow.appendChild(upvoteIc);
    miniRow.appendChild(upvoteLbl);
   


    
    var downvoteIc=document.createElement("ic");
    downvoteIc.setAttribute("class","far fa-thumbs-down grow");
    var downvoteLbl=document.createElement("label");
    downvoteLbl.setAttribute("style","margin:12px");
    downvoteLbl.textContent=comment.downvotes.length+"";
    var miniRow1=document.createElement("div");
    miniRow1.setAttribute("div","row");
    miniRow1.appendChild(downvoteIc);
    miniRow1.appendChild(downvoteLbl);
    downvoteIc.addEventListener("click",()=>{
        toggleLike(comment,downvoteIc,downvoteLbl);
    })



    var commentIc=document.createElement("ic");
    commentIc.setAttribute("class","fas fa-comment grow");
    var commentLbl=document.createElement("label");
    commentLbl.setAttribute("style","margin:12px");
    commentLbl.textContent=comment.replies.length+"";
    var miniRow2=document.createElement("div");
    commentIc.addEventListener("click",()=>{
      addNewComment(card_body);
    })
    miniRow2.setAttribute("div","row");
    miniRow2.appendChild(commentIc);
    miniRow2.appendChild(commentLbl);

    var shareIc=document.createElement("ic");
    shareIc.setAttribute("class","fa fa-share grow");
    var shareLbl=document.createElement("label");
    shareLbl.setAttribute("style","margin:12px");
    shareLbl.textContent="Share";
    var miniRow3=document.createElement("div");
    miniRow3.setAttribute("div","row");
    miniRow3.appendChild(shareIc);
    miniRow3.appendChild(shareLbl);

    card_footer.appendChild(miniRow);
    card_footer.appendChild(miniRow1);
    card_footer.appendChild(miniRow2);
    card_footer.appendChild(miniRow3);

    var caption=document.createElement("h4");
    caption.textContent=comment.title;
    caption.style.fontSize="16px";
    caption.style.fontWeight="none";

 
    card_body.appendChild(caption);
   

    var AspectRatioCont=document.createElement("div");
    AspectRatioCont.setAttribute("class","card-img overlay-cont");

    var overlay=document.createElement("div");
    overlay.setAttribute("class","overlay");
    overlay.innerHTML=comment.image.includes("gif")?"<span class='badge badge-dark'>Gif</span>":"";
    var image=document.createElement("img");
    image.src=comment.image;
    image.alt="";
    image.style.objectFit="cover";
    image.style.width="100%";
    image.style.height="100%";

    var video=document.createElement("video");
    video.setAttribute("autoplay","");
    video.setAttribute("controls","");
    video.style.width="100%";
    video.style.height="100%";
    


    var videoSrc=document.createElement("source");
    videoSrc.setAttribute("type","video/mp4");
    videoSrc.setAttribute("src",comment.video);
    video.appendChild(videoSrc);
    
    if(comment.type=="Image")
    {
        AspectRatioCont.appendChild(image);
        AspectRatioCont.appendChild(overlay);
        card_body.appendChild(AspectRatioCont);
    }
    else
    if(comment.type=="Video")
    {
         AspectRatioCont.appendChild(video);
         AspectRatioCont.appendChild(overlay);
       
        overlay.innerHTML="<span class='badge badge-dark'>Video</span>";
        card_body.appendChild(AspectRatioCont);
        
    }

    


    card.appendChild(card_head);
    card.appendChild(card_body);
    card.appendChild(card_footer);

    card.style.margin="20px";
    
    card.addEventListener("mouseenter",()=>{
        if(comment.type=="Video")
           video.play().catch(()=>{})
        
    })
    card.addEventListener("mouseleave",()=>{
        if(comment.type=="Video")
       video.pause()
    
})
    return card;


}
function toggleDislike(message,ic,lbl){
 

    //check if already liked
    if(!alreadyOnList(message.downvotes,MyProfile.id))
    {
        console.log("Disliked");
        //add me to liked list
        message.downvotes.push(MyProfile.id)
        //change Color and Number
        ic.classList.remove("far");
        ic.classList.add("fas");
        lbl.textContent=message.upvote.length+"";
        //update message.vote

    }else{
        message.downvotes.remove(MyProfile.id)
        ic.classList.remove("fas");
        ic.classList.add("far");
        lbl.textContent=message.upvote.length+"";
        //update message.vote
    }
    
    
}
function alreadyOnList(list,uid)
{
    var exists=false;
    list.forEach(e => {
        if(JSON.stringify(e)==JSON.stringify(uid)){
            exists=true;
        }
    });
    return exists;
}
function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
var recTime; var constraints = { audio: true, video: false }
function startRecording(lbl,stream) {
    console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

   

    /*
      Disable the record button until we get a success or fail from getUserMedia() 
  */

    

    
	/*
    
    	We're using the standard promise bas
    ed getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

   // navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/
        audioContext = new AudioContext();

        //update the format 
       // document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
        rec = new Recorder(input, { numChannels: 1 })

        //start the recording process
        rec.record()


        console.log("Recording started");

        var t=0;
      
        

   /* }).catch(function (err) {
        //enable the record button if getUserMedia() fails
      
    });*/
}
function starttimer(t,elem,overlay,lbl){
   
        recTime=setInterval(() => {
            t+=1000;
           console.log(t/1000)
            if(t>=30000)toggleRecState(elem,overlay,lbl)
            else {
               lbl.textContent=t/1000+"/30s";
            }
            }, 1000);
    }
function pauseRecording() {
    console.log("pauseButton clicked rec.recording=", rec.recording);
    if (rec.recording) {
        //pause
        if(rec!=null)rec.stop();;
        pauseButton.innerHTML = "Resume";
    } else {
        //resume
        rec.record()
        pauseButton.innerHTML = "Pause";

    }
}

function stopRecording(lbl) {
    console.log("stopButton clicked");
    clearInterval(recTime);
    //disable the stop button, enable the record too allow for new recordings
   
    if(rec!=null)rec.stop();;

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
_lbl=lbl;
    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
}
var player=new Audio();
var _lbl="";
function createDownloadLink(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    player=new Audio();
    player.src=url;
    player.onloadeddata=function(){
     _lbl.textContent=calculateTotalValue(player.duration)
   
    }
    player.ontimeupdate=function() {
        _lbl.textContent =calculateTotalValue(player.currentTime)+"/"+ calculateTotalValue(player.duration)
    }

    //save to disk link
    link.href = url;
    link.download = filename + ".wav"; //download forces the browser to donwload the file using the  filename
    link.innerHTML = "Save to disk";

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.appendChild(document.createTextNode(filename + ".wav "))

    //add the save to disk link to li
    li.appendChild(link);

    //upload link
    var upload = document.createElement('a');
    upload.href = "#";
    upload.innerHTML = "Upload";
    upload.addEventListener("click", function (event) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function (e) {
            if (this.readyState === 4) {
                console.log("Server returned: ", e.target.responseText);
            }
        };
        var fd = new FormData();
        fd.append("audio_data", blob, filename);
        xhr.open("POST", "upload.php", true);
        xhr.send(fd);
    })
    li.appendChild(document.createTextNode(" "))//add a space in between
    li.appendChild(upload)//add the upload link to li

    //add the li element to the ol
   // recordingsList.appendChild(li);
}
function calculateTotalValue(length) {
    //;


    var s = parseInt(length % 60);
    var m = parseInt((length / 60) % 60);

    if (s < 10) s = '0' + s;
    if (m < 10) m = '0' + m;
    var time = m + ':' + s;
    if (time == "NaN:NaN") return ".."
    else
        return time;
}