var Courses=[];
$(document).ready(function(){
  
    let database = firebase.database();
    database.ref("Course/")
    .on("value", function(data) {
   
        data.forEach(function(ds) {  
            Courses.push(ds.val());
            
        });
        let database = firebase.database();
       
         database.ref("Profile/")
            .on("value",(ds)=>{
                console.log(ds.val())//ids
                ds.forEach(e=>{
                 var uid=e;
                 console.log(e.key)
                uid.forEach((s)=>{

                    console.log("-->",s.val())//ids
                 
    
                   
                    PROFILES.push(s.val());
                    
               
                });
               
            });
             init();
            })

            
        
        
       
     

    },function(){
             
    });

function init(){
	$('[data-toggle="tooltip"]').tooltip();
    var actions ="<a class='edit'><i class='material-icons'>&#xE254;</i></a>"
    +"<a class='add'><i class='material-icons'>&#xE03B;</i></a>"+
    
    "<a class='delete'><i class='material-icons'>&#xE872;</i></a>";
    // Append table with add row form on add new button click
    console.log(">>")
    PROFILES.forEach(p => {
        console.log(p)
        var index = $("table tbody tr:last-child").index();
        var row = '<tr class="student-row">' +
            '<td class="student-ids">'+p.id+'</td>' +
            '<td class="student-names">'+p.first_name+" "+p.last_name+'</td>' +
            '<td class="student-years">'+p.year+'</td>' +
            '<td class="student-deg"><select class="student-degrees custom-select" id="degree-select">'+generatingDegress(p.degree) + '</select></td>' +
            '<td class="student-course"><select class="student-courses custom-select" id="course-select">'+generatingCourses(getCourseFromCode(p.Course)) + '</select></td>' +
            '<td class="student-phones">'+(p.phone==undefined?'--':p.phone)+'</td>' +
            '<td class="student-countries">'+p.country+'</td>' +
             '<td class="student-dobs">'+(new Date(p.dob).toLocaleDateString())+'</td>' +
             '<td class="student-gender">'+p.gender+'</td>' +
            '<td class="student-role"><select class="student-roles custom-select" id="roles-select">'+generatingRoles(p.role) + '</select></td>' +
           '<td class="student-sc">'+(p.snapchat!=undefined?p.snapchat:"--")+'</td>' +
            '<td class="student-in">'+(p.Instagram!=undefined?p.Instagram:"--")+'</td>' +
            '<td class="student-tw">'+(p.twitter!=undefined?p.twitter:"--")+'</td>' +
            '<td class="student-fb">'+(p.facebook!=undefined?p.facebook:"--")+'</td>' +
            '<td class="student-paid"id="paidCol'+p.id+'">'+p.paid+'</td>' +
			'<td>' + actions + '</td>' +
        '</tr>';
      
    	$("table").append(row);		
		
        $('[data-toggle="tooltip"]').tooltip(); 
         highlightPaid(p);
    });
    $(".add-new").click(function(){
        
		$(this).attr("disabled", "disabled");
		var index = $("table tbody tr:last-child").index();
        var row = '<tr class="student-row">' +
            '<td class="student-ids"><input type="text" class="form-control" name="studentid" id="id"></td>' +
            '<td class="student-names"><input type="text" class="form-control" name="name" id="name"></td>' +
            '<td class="student-years"><input type="text" class="form-control" name="year" id="year"></td>' +
            '<td class="student-deg"><select class="student-degrees custom-select" id="degree-select">'+generatingDegress(Degrees[0]) + '</select></td>' +
            '<td class="student-course"><select class="student-courses custom-select" id="course-select">'+generatingCourses(Courses[0]) + '</select></td>' +
            '<td class="student-phones"><input type="text" class="form-control" name="phone" id="phone"></td>' +
            '<td class="student-countries"><input type="text" class="form-control" name="country" id="country"></td>' +
              '<td class="student-dobs"><input type="date" class="form-control" name="dob" id="country"></td>' +
              '<td class="student-gender"><input type="text" class="form-control" name="country" id="country"></td>' +
            '<td class="student-role"><select class="student-roles custom-select" id="roles-select">'+generatingRoles(Roles[0]) + '</select></td>' +
          '<td class="student-sc"><input type="text" class="form-control" name="sc" id="country"></td>' +
            '<td class="student-in"><input type="text" class="form-control" name="in" id="country"></td>' +
            '<td class="student-tw"><input type="text" class="form-control" name="tw" id="country"></td>' +
            '<td class="student-fb"><input type="text" class="form-control" name="fb" id="country"></td>' +
            
            '<td class="student-paid"><input type="number" class="form-control"  id="amountPaid"  name="paid" id="paid"></td>' +
			'<td>' + actions + '</td>' +
        '</tr>';
    	$("table").append(row);		
		$("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
        
    });
	// Add row on add button click
	$(document).on("click", ".add", function(){
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
			if(!$(this).val()){
				$(this).addClass("error");
				empty = true;
			} else{
                $(this).removeClass("error");
            }
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});			
			$(this).parents("tr").find(".add, .edit").toggle();
			//$(".add-new").removeAttr("disabled");
        }
        $(this).parents("tr").find('select').each(function(){
          //  $(this).parent("td").html($(this).val());
        });	
        $(this).parents("tr").find('input[type="number"]').each(function(){
            $(this).parent("td").html($(this).val());
        });	
        $(this).parents("tr").find('input[type="date"]').each(function(){
            $(this).parent("td").html(new Date($(this).val()).toLocaleDateString());
        });			
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){
       
        var i=0;
        console.log("--------------------------")
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
            console.log("edit mode",i,$(this).text())		
            var input=document.createElement("input");
            input.setAttribute("type","number");
            input.setAttribute("class","form-control")
            
            input.addEventListener("keyup",()=>{
                console.log(input.value)
                if(Number(input.value)>=15)
                {
                    input.parentElement.style.backgroundColor="#00d000db";
                    input.parentElement.style.color="white"
                }
                else if(Number(input.value)>=7&&(Number(input.value)<15))
                {
                    input.parentElement.style.backgroundColor="yellow";
                    input.parentElement.style.color="white"
                }
                else{
                    input.parentElement.style.backgroundColor="red";
                    input.parentElement.style.color="white"
                }
            });
            input.addEventListener("change",()=>{
                console.log(input.value)
                if(Number(input.value)>=15)
                {
                    input.parentElement.style.backgroundColor="#00d000db";
                    input.parentElement.style.color="white"
                }
                else if(Number(input.value)>=7&&(Number(input.value)<15))
                {
                    input.parentElement.style.backgroundColor="yellow";
                    input.parentElement.style.color="white"
                }
                else{
                    input.parentElement.style.backgroundColor="red";
                    input.parentElement.style.color="white"
                }
            })
           
            switch(i){
                case 3:$(this).html('<select class="custom-select" id="degree-select">'+generatingDegress( $(this).text()) + '</select>');break;
                case 4:$(this).html('<select class="custom-select" id="course-select">'+generatingCourses( $(this).text()) + '</select>');break;
                case 9:$(this).html('<select class="custom-select" id="roles-select">'+generatingRoles( $(this).text()) + '</select>');break;
                case 7:$(this).html('<input type="date" class="form-control" value=' + (new Date(+new Date($(this).text()+" 00:00:00").getTime()).toISOString().split('T')[0]) + '>');break;
          
                case 14:{input.value= Number($(this).text());$(this).html("");$(this).append(input)}break;
                default:$(this).html('<input type="text" class="form-control" value=' + ($(this).text()) + '>');break;
            }i++;
        });		
		$(this).parents("tr").find(".edit, .add").toggle();
		//$(".add-new").attr("disabled", "disabled");
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
    });
    $("#myInput").on("keyup",()=>{
        searchMembers();
    })
    $(".saveMembersChanges").on("click",function () {
        saveMembersChanges();
    })

    function saveMembersChanges(){
        var j=0;
      //  alert(document.getElementsByClassName("student-row").length)
       for (var i=0;i<document.getElementsByClassName("student-row").length;i++) {
            var exp=RegExp(/([a-zA-z0-9]+\()/);  
            var newProfile=true;
            var db = firebase.database();
            console.log(document.getElementsByClassName("student-degrees")[i].value)
           // alert(document.getElementsByClassName("student-ids")[i].textContent)
            PROFILES.forEach(profile=>{
                if(profile.id==document.getElementsByClassName("student-ids")[i].textContent){
                    newProfile=false;
                    profile.id=document.getElementsByClassName("student-ids")[i].textContent==""?profile.id:document.getElementsByClassName("student-ids")[i].textContent;
                    profile.first_name=document.getElementsByClassName("student-names")[i].textContent==""?profile.first_name:document.getElementsByClassName("student-names")[i].textContent.split(" ")[0];
                    profile.last_name=document.getElementsByClassName("student-names")[i].textContent==""?profile.last_name:document.getElementsByClassName("student-names")[i].textContent.split(" ")[document.getElementsByClassName("student-names")[i].textContent.split(" ").length>1?document.getElementsByClassName("student-names")[i].textContent.split(" ").length-1:profile.last_name]
                    profile.year=document.getElementsByClassName("student-years")[i].textContent==""?profile.year:document.getElementsByClassName("student-years")[i].textContent;
                    profile.degree=document.getElementsByClassName("student-degrees")[i].value==""?profile.degree:document.getElementsByClassName("student-degrees")[i].value;
                    profile.course=document.getElementsByClassName("student-courses")[i].value==""?profile.course:exp.exec(document.getElementsByClassName("student-courses")[i].value);
                    profile.phone=document.getElementsByClassName("student-phones")[i].textContent==""?profile.phone:document.getElementsByClassName("student-phones")[i].textContent;
                    profile.country=document.getElementsByClassName("student-countries")[i].textContent==""?profile.country:document.getElementsByClassName("student-countries")[i].textContent;
                    profile.gender=document.getElementsByClassName("student-gender")[i].textContent==""?profile.gender:document.getElementsByClassName("student-gender")[i].textContent;
                   
                    profile.role=document.getElementsByClassName("student-roles")[i].value==""?profile.role:document.getElementsByClassName("student-roles")[i].value;
                    profile.dob=document.getElementsByClassName("student-dobs")[i].textContent==""?profile.dobs:new Date(document.getElementsByClassName("student-dobs")[i].textContent).toLocaleDateString();
                    profile.snapchat=document.getElementsByClassName("student-sc")[i].textContent==""?profile.snapchat:document.getElementsByClassName("student-sc")[i].textContent;
                    profile.Instagram=document.getElementsByClassName("student-in")[i].textContent==""?profile.Instagram:document.getElementsByClassName("student-in")[i].textContent;
                    profile.facebook=document.getElementsByClassName("student-fb")[i].textContent==""?profile.facebook:document.getElementsByClassName("student-fb")[i].textContent;
                    profile.twitter=document.getElementsByClassName("student-tw")[i].textContent==""?profile.twitter:document.getElementsByClassName("student-tw")[i].textContent;

                    profile.paid=document.getElementsByClassName("student-paid")[i].textContent==""?profile.paid:document.getElementsByClassName("student-paid")[i].textContent;
                    db.ref("Profile").on("value",(ds)=>{
                        console.log(ds.val())//ids
                        ds.forEach(e=>{
                         var uid=e;
                         console.log(e.val())
                        uid.forEach((s)=>{
                            console.log(e.key,"--",s.key)
                            if(s.val()['id']==profile.id)
                            {
                                db.ref("Profile/"+e.key+"/"+s.key+"/").set(profile)
                                alert("Saved")
                            }

                           
                            
                       
                        });
                       
                    });
                    
                    })

                }
            });
            if(newProfile)
            {
               // alert(exp.exec(document.getElementsByClassName("student-courses")[i].textContent))
                var _profile={
                    "course":document.getElementsByClassName("student-courses")[i].value,
                        "role":document.getElementsByClassName("student-roles")[i].value,
                        "bio":"",
                        "gender": profile.gender=document.getElementsByClassName("student-gender")[i].textContent==""?profile.gender:document.getElementsByClassName("student-gender")[i].textContent,
                        "email":document.getElementsByClassName("student-ids")[i].textContent+"@studentmail.ul.ie",
                        "confirmed":document.getElementsByClassName("student-paid")[i].textContent>=15?true:false,
                        "country":document.getElementsByClassName("student-countries")[i].textContent,
                        "degree":document.getElementsByClassName("student-degrees")[i].value,
                        "dob":new Date(document.getElementsByClassName("student-dobs")[i].textContent).toLocaleDateString(),
                        "paid":document.getElementsByClassName("student-paid")[i].textContent==""?0:document.getElementsByClassName("student-paid")[i].textContent,
                        "id":document.getElementsByClassName("student-ids")[i].textContent,
                        "first_name":document.getElementsByClassName("student-names")[i].textContent.split(" ")[0],
                        "last_name":document.getElementsByClassName("student-names")[i].textContent.split(" ")[document.getElementsByClassName("student-names")[i].textContent.split(" ").length>1?document.getElementsByClassName("student-names")[i].textContent.split(" ").length-1:profile.last_name],
                        "year":document.getElementsByClassName("student-years")[i].textContent,
                        "phone":document.getElementsByClassName("student-phones")[i].textContent,
                        "snapchat":document.getElementsByClassName("student-sc")[i].textContent==""?profile.snapchat:document.getElementsByClassName("student-sc")[i].textContent,
                        "Instagram":document.getElementsByClassName("student-in")[i].textContent==""?profile.Instagram:document.getElementsByClassName("student-in")[i].textContent,
                        "facebook":document.getElementsByClassName("student-fb")[i].textContent==""?profile.facebook:document.getElementsByClassName("student-fb")[i].textContent,
                        "twitter":document.getElementsByClassName("student-tw")[i].textContent==""?profile.twitter:document.getElementsByClassName("student-tw")[i].textContent,
                        "image":"",
                        "single":true
            
                    
                }
                firebase.auth().createUserWithEmailAndPassword(_profile.id+"@studentmail.ul.ie", "ACS"+_profile.id)
                .then(function (event) {
                    db.ref("Profile").child(user.uid).push(
                      _profile  
                    )
                    alert("Saved");
                })
                .catch(function(error) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                });


            }
           
       }
    }
    function searchMembers() {
        var input, filter, table, tr, td, i, txtValue,td2,txtValue2,td7,txtValue7;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("membersTable");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }   
          td2 = tr[i].getElementsByTagName("td")[1];
          if (td7) {
            txtValue2 = td2.textContent || td2.innerText;
            if (txtValue2.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }    
          td7 = tr[i].getElementsByTagName("td")[6];
          if (td2) {
            txtValue7 = td7.textContent || td7.innerText;
            if (txtValue7.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }         
        }
      }
    }
});


var Degrees=[
    "Under Graduate",
    "Masters",
    "Dotoral"
],
Roles=[
    "Admin",
    "Member",
    "President",
    "VP",
    "Treasurer",
    "Secretary",
    "PR",
    
]
function getCourseFromCode(code)
{
    var course;
    Courses.forEach(c=>{
        if(c.code==code)
        course=c;
    })
    return course;
}
function highlightPaid(p){
 
         if(Number(p.paid)>=15){
        console.log("#paidCol"+p.id)
      
        $("#paidCol"+p.id).attr("style","background-color:#00d000db;color:white");
        }
        else if(Number(p.paid)>=7&&(Number(p.paid)<15))
        {
            $("#paidCol"+p.id).attr("style","background-color:yellow;color:black");
        }
        else{
        
            $("#paidCol"+p.id).attr("style","background-color:red;color:white");
        }
    
   
}
function generatingDegress(text){
    var html="";
    var n=1;
    Degrees.forEach(d=>{
        html+="<option value="+d+">"+d+"</option>";
        n++;
    })
    $(".degree-select").val(text)
    return html;
}
function generatingCourses(text){
    var html="";
    var n=1;
    Courses.forEach(c=>{
        html+="<option value="+c.code+">"+c.code+"("+c.name+")"+"</option>";
        n++;
    })
    $(".course-select").val(text)
    return html;
}
function generatingRoles(text){
    var html="";
    var n=1;
    Roles.forEach(r=>{
        html+="<option value="+r+">"+r+"</option>";
        n++;
    })
    $(".roles-select").val(text)
    return html;
}