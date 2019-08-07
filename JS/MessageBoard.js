var MESSAGES=[];
var PROFILES=[];
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

});
function loadMessageBoard(){
 var db = firebase.firestore();
    let doc = db.collection('MessageBoard').onSnapshot(querySnapshot => {
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
    upvoteIc.setAttribute("class","far fa-thumbs-up");
    var upvoteLbl=document.createElement("label");
    upvoteLbl.setAttribute("style","margin:12px");
    upvoteLbl.textContent=messageBoard.upvote.length+"";
    var miniRow=document.createElement("div");
    miniRow.setAttribute("div","row");
    miniRow.appendChild(upvoteIc);
    miniRow.appendChild(upvoteLbl);
   


    
    var downvoteIc=document.createElement("ic");
    downvoteIc.setAttribute("class","far fa-thumbs-down");
    var downvoteLbl=document.createElement("label");
    downvoteLbl.setAttribute("style","margin:12px");
    downvoteLbl.textContent=messageBoard.downvotes.length+"";
    var miniRow1=document.createElement("div");
    miniRow1.setAttribute("div","row");
    miniRow1.appendChild(downvoteIc);
    miniRow1.appendChild(downvoteLbl);

    var commentIc=document.createElement("ic");
    commentIc.setAttribute("class","fas fa-comment-alt");
    var commentLbl=document.createElement("label");
    commentLbl.setAttribute("style","margin:12px");
    commentLbl.textContent=messageBoard.comments.length+"";
    var miniRow2=document.createElement("div");
    miniRow2.setAttribute("div","row");
    miniRow2.appendChild(commentIc);
    miniRow2.appendChild(commentLbl);

    var shareIc=document.createElement("ic");
    shareIc.setAttribute("class","fa fa-share");
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
    video.setAttribute("autoplay","");
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
function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
