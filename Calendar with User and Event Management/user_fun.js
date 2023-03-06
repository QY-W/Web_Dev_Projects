
function checkState() {
    fetch('login_verify.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            $("#hidden-token").val(data.token);
            $("#hidden-username").val(data.username);
            $("#hidden-id").val(data.userid);

            $("#myModal-log").hide();
            $("#modal-btn-log").html("Hi! "+data.username+".");   
            $("#logout-btn").attr('hidden', false);
        } else { // login fail
            $("#myModal-log").hide();
            $("#modal-btn-log").html("Hi Guest, Click Here to Register");   
            $("#logout-btn").attr('hidden', true);
            login = false;
        }
    })
    .catch(err => console.error(err));
}
document.addEventListener("DOMContentLoaded", checkState, false);

//console.log($("#hidden-username").val());
// ajax.js
function registerAjax(event) {
    const regusername = encodeURIComponent(document.getElementById('regusername').value);
    const regpassword = encodeURIComponent(document.getElementById('regpassword').value);
    const data = {'reg_username': regusername, 'reg_password':regpassword};
    // Fetching
    fetch("register_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })

    .then(function(data) {
        //console.log(data.success ? "You've Registered!" : 'You were not Registered!${data.message}');
        console.log(data.success ? "You've Registered!" : `You were not Registered!${data.message}`);
        //alert(data.success ? "You've Registered!" : `You were not Registered!${data.message}`);
    })
    .catch(err => console.error(err));
}

 // Bind the AJAX call to button click
document.getElementById("register_btn").addEventListener("click", registerAjax, false);

function loginAjax(event) {
    const username = encodeURIComponent(document.getElementById("username").value); // Get the username from the form
    const password = encodeURIComponent(document.getElementById("password").value); // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };
    //var xmlHttp = new XMLHttpRequest();
    //open("POST", "login_ajax.php", true);
    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(data => data.json())
        .then(data=> {
            console.log(data);
            //alert(data.success ? "You've loggin! Redirecting to Calendar page" : `Log in failed: ${data.message}`);
            //alert(data.success ? "You've Registered!" : `You were not Registered!${data.message}`);
            if (data.success) {
                // header("Location: calendar.html");
                $("#hidden-token").val(data.token);
                $("#hidden-username").val(data.username);
                $("#hidden-id").val(data.userid);
                $("#myModal-log").hide();
                $("#modal-btn-log").html("Hi! "+username+".");   
                $("#logout-btn").attr('hidden', false);
            }
        })
        .catch(err => console.error(err));
}
// Bind the AJAX call to button click
document.getElementById("login_btn").addEventListener("click", loginAjax, false); 

function logoutAjax(event) {
    fetch("logout_ajax.php", {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //alert(data.success ? "You've logout! Redirecting to Calendar page" : `Log out failed: ${data.message}`);
            if (data.success) {
                let eventParent = $("#event-total");
                eventParent.html("");
                $("#hidden-token").val(data.token);
                $("#hidden-username").val(data.username);
                $("#hidden-id").val(data.userid);
                // header("Location: calendar.html");
                $("#myModal-log").hide();
                $("#modal-btn-log").html("Hi Guest, Click Here to Register");   
                $("#logout-btn").attr('hidden', true);
            }
        })
        .catch(err => console.error(err));
}
// Bind the AJAX call to button click
document.getElementById("logout-btn").addEventListener("click", logoutAjax, false); 



//checks the login status of user
// function loginStatus(){
//     fetch("user_status_ajax.php")
//     .then(response => response.json())
//     .then(function(userData){
//             login = true;
//         }else{
//             login = false;
//         }
//     })
//     .catch(err => console.error(err));
// }
//document.addEventListener("DOMContentLoaded", loginStatus, false);
