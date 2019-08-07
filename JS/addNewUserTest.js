var Profile={};

    window.onload=init();

function init(){
    Profile={
        "id":"16159381",
        "confirmed":false,
        "email":"16159381@studentmail.ul.ie",
        "first_name":"Olamide",
        "last_name":"Ogunlade",
        "loginWithId":true,
        "dob":912420000000,
        "country":"Nigeria",
        "gender":"male",
        "degree":"Under Graduate",
        "course":"LM121",
        "year":"4th Year",
        "bio":"",
        "image":"",
        "paid":15,
        "role":"President",
        "relationship":"single"
    }
    addProfile(Profile);
}
function addProfile(p){
    let database = firebase.database();
    database.ref("Profile/M4Paid7qXkbZgHI8hTYgHiQ120K2")
    .push(p);
}