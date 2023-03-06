// Modal box inspired from https://www.w3schools.com/howto/howto_css_modals.asp
let modal = document.getElementById("myModal");
let modal2 = document.getElementById("myModal-log");
let modalEdit = document.getElementById("myModal-edit");

// Get the button that opens the modal
let btn = document.getElementById("modal-btn");
let btn2 = document.getElementById("modal-btn-log");
// btns on edit btns event is triger else

//  close the modal when user hit x.
$('.close').click(function () {
    modal.style.display = "none";
    modal2.style.display = "none";
    modalEdit.style.display = "none";
})

btn.onclick = function () {
    modal.style.display = "block";
}
btn2.onclick = function () {
    modal2.style.display = "block";
}

// close modal when user hit
window.onclick = function (event) {
    if ((event.target == modal)||(event.target == modal2) || (event.target == modalEdit)) {
        modal.style.display = "none";
        modal2.style.display = "none";
        modalEdit.style.display = "none";
    }
}
// updateFunction Here
updateCalendar();
let date = "1900=00-00";
function addEventAjax(event) {
    console.log("Clicked Add Event JS");
    let allTags = ["red","blue","green"];
    let username = $('#hidden-username').val();
    let id = $('#hidden-id').val();
    let token = $('#hidden-token').val();
    date = $("#event_date").val();
    let title = $("#event_title").val();
    let members = $("#event_members").val();
    if (!title || title == ''){
        title = "UNNAMED TITLE";
    }
  
    let time = $("#event_time").val();
    let selectedTags = "";
    if ($('#event_tag1').is(":checked")){
        selectedTags += '@'+(allTags[0]);
    }
    if ($('#event_tag2').is(":checked")){
        selectedTags+='@'+(allTags[1]);
    }
    if ($('#event_tag3').is(":checked")){
        selectedTags+='@'+(allTags[2]);
    }
    let detail = $("#event_detail").val();
    if (!detail || detail == ''){
        detail = "UNNAMED DETAIL";
    }
    console.log(id+username+ date+time+selectedTags);
    const data = {'add_id': id, 'add_title':title,'add_date':date,'add_time':time,'add_tag':selectedTags,'add_detail':detail, 'token':token,
    'members':members};
    console.log(JSON.stringify(data));

    fetch("addEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })

    .then(function(data) {
        //console.log(data.success ? "You've Registered!" : 'You were not Registered!${data.message}');
        console.log(data.success ? `You've Added Event!${data.message}` : `Adding failed!${data.message}`);
        updateEventByHidden();
        alert(data.success ? `You've Added Event!${data.message}`: `Adding failed!${data.message}`);
        //alert(`${data.message}`);
    })
    .catch(err => console.error(err));
    // update Events once added
}
document.getElementById("add-event_btn").addEventListener("click", addEventAjax, false); 


// show event 
let isThisMonth = -99;
let day = -999;
let eid = -999;
function showEventAjax() {
    //let id = 1;//$('#hidden-id').val();
    //updateCalendar();
    console.log("triggered");
    let rawDate = $("#month_year").data('cleandate');
    //let dateList = rawDate.split(/(\s+)/);
    rawDate = updateMonth(rawDate,isThisMonth);
    date = rawDate+ "-"+String(day).padStart(2, '0');
    $("#hidden-date").val(date);
    updateEvent(date);
    updateEventByHidden();
}


function updateEvent(date){
    //let date = date;
    let id = $('#hidden-id').val();
    let token = $('#hidden-token').val();
    const data = {'id' : id, 'date': date, 'token':token};
    //console.log('token sending: '+token);
    fetch("showEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //console.log(data.success ? "JS: show event sucess" : `JS: show event fail!${data.message}`);
        if (data.success){
            //console.log("There are"+(data.sent_data).length);
            let eventParent = $("#event-total");
            eventParent.html("");
            if (data.sent_data.length>0){

                // get html dates parent 
                data.sent_data.forEach(function (item, index) {
                    let eid = item.eid;
                    let uid = item.uid;
                    let title = item.title;
                    let date = item.date;
                    let time = item.time;
                    let tags = item.tags;
                    let detail = item.detail;
                    let uniqueId = eid+"Z"+uid; 
                    //eventParent.innerHTML += "<li class='event-inst' id='"+uniqueId +"'>";
                    let temp = "";
                    temp += "<li class='event-inst' id='"+uniqueId +"'>";
                    temp += '<p hidden>' + eid+ '</p>';
                    temp += '<p hidden>' + uid+ '</p>';
                    temp += '<p>' + title+ '</p>';
                    temp += '<p>' + date+ '</p>';
                    temp += '<p>' + time+ '</p>';
                    temp += '<p>' + tags+ '</p>';
                    temp += '<p>' + detail+ '</p>';
                    temp += "<button class = 'btnE' id= " + "btnE"+uniqueId +  " > ✎ / 📤</button>";
                    temp += "<button class = 'btnD' id= " + "btnD"+uniqueId +  " > ✗</button>";
                    temp += "</li>";
                    eventParent.html(eventParent.html() + temp);
                    let btnEid = 'btnE'+uniqueId;
                    let btnDid = 'btnD'+uniqueId;
                    let btnSid = 'btnS'+uniqueId;
                    $(document).ready(function(){
                        $("#"+btnEid).click(function() {
                            //console.log("Click Edit Button"+ btnEid);
                            btnEdit(uniqueId);
                            let spiltArray = uniqueId.split("Z");
                            eid = spiltArray[0];
                            $("#hidden-eid").val(eid);
                        });
                        $("#"+btnDid).click(function() {
                            //console.log("Click Delete Button"+ btnDid);
                            btnDelete(uniqueId);
                            let spiltArray = uniqueId.split("Z");
                            let eid = spiltArray[0];
                            let uid = spiltArray[1];
                            $("#hidden-eid").val(eid);
                            deleteEventAjax(eid);
                        });

                    });        
                    function btnEdit(uniqueId){
                        let spiltArray = uniqueId.split("Z");
                        let eid = spiltArray[0];
                        let uid = spiltArray[1];
                        console.log("Click Edit Button EID: " + eid + "  UID: " + uid);
                    }

                    $('.btnE').click(function () {
                        console.log("Trying open Modal");
                        modalEdit.style.display = "block";
                        
                    })
                    function btnDelete(uniqueId){
                        let spiltArray = uniqueId.split("Z");
                        let eid = spiltArray[0];
                        let uid = spiltArray[1];   
                        console.log("Click Delete Button EID: " + eid +   "  UID: " + uid);
                        //updateEventByHidden()
                    }
                });
            }
        }
    })
    .catch(err => console.error(err));
}


$("#edit_btn").click(function() {   
    eid = $("#hidden-eid").val();                         
    editEventAjax(eid);
});


$("#share_btn").click(function() {
    let sid = $("#share_input").val();
    eid = $("#hidden-eid").val();  
    console.log("SID:   "+sid);
    shareEventAjax(eid, sid);
})

//hidden-date
function updateEventByHidden(){
    let hiddenDate = $('#hidden-date').val();
    console.log("Event Updated:"+ hiddenDate);
    updateEvent(hiddenDate);
}


function editEventAjax(eid) {
    console.log("Clicked Edit Event JS");
    let allTags = ["red","blue","green"];
    let username = $('#hidden-username').val();
    let uid = $('#hidden-id').val();
    let token = $('#hidden-token').val();

    date = $("#edit_date").val();
    let title = $("#edit_title").val();
    if (!title || title == ''){
        title = "UNNAMED TITLE";
    }
    let time = $("#edit_time").val();
    let selectedTags = "";
    if ($('#edit_tag1').is(":checked")){
        selectedTags += '@'+(allTags[0]);
    }
    if ($('#edit_tag2').is(":checked")){
        selectedTags+='@'+(allTags[1]);
    }
    if ($('#edit_tag3').is(":checked")){
        selectedTags+='@'+(allTags[2]);
    }
    let detail = $("#edit_detail").val();
    if (!detail || detail == ''){
        detail = "UNNAMED DETAIL";
    }

    const newdata = {'event_id':eid, 'add_id':uid, 'add_title':title,'add_date':date,'add_time':time,'add_tag':selectedTags,'add_detail':detail, 'token':token};
    console.log(newdata);
    fetch("editEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(newdata),
        headers: { 'content-type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //console.log(data.success ? "You've Registered!" : 'You were not Registered!${data.message}');
        console.log(data.success ? "You've edited Event!" : `Editing failed!${data.message}`);
        updateEventByHidden();
        //alert(data.success ? "You've Edited Event!!" : `Editing failed!${data.message}`);
        //alert(`${data.message}`);
        modalEdit.style.display = "block";
    })
    .catch(err => console.error(err));
    //updateEventByHidden();
}

function deleteEventAjax(eid) {
    console.log("Clicked Delete Event JS");
    let uid = $('#hidden-id').val();
    let token = $('#hidden-token').val();

    //console.log(eid+uid+token);
    const ddata = {'event_id':eid, 'user_id':uid, 'token':token};
    //console.log("Delete event: ".ddata);
    fetch("deleteEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(ddata),
        headers: { 'content-type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })

    .then(function(data) {
        //console.log(data.success ? "You've Registered!" : 'You were not Registered!${data.message}');
        console.log(data.success ? "You've deleted Event!" : `Delete failed!${data.message}`);
        updateEventByHidden();
        //alert(data.success ? "You've Deleted Event!!" : `Delete failed!${data.message}`);
        //alert(`${data.message}`);
    })
    .catch(err => console.error(err));

}

function shareEventAjax(eid, sid) {
    console.log("Clicked Share Event JS");
    let username = $('#hidden-username').val();
    let uid = $('#hidden-id').val();
    let token = $('#hidden-token').val();
    console.log(eid+uid+username+sid+token);
    const sharedata = {'event_id':eid, 'user_id':uid, 'share_id':sid, 'token':token};
    console.log(sharedata);

    fetch("shareEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(sharedata),
        headers: { 'content-type': 'application/json' }
    })
    .then(function(response) {
        return response.json();
    })

    .then(function(data) {
        //console.log(data.success ? "You've Registered!" : 'You were not Registered!${data.message}');
        console.log(data.success ? "You've shared Event!" : `Sharing failed!${data.message}`);
        //alert(data.success ? "You've shared Event!!" : `Sharing failed!${data.message}`);
        //alert(`${data.message}`);
    })
    .catch(err => console.error(err));
    updateEventByHidden();
}

function updateClickDate(){
    let currs = document.getElementsByClassName("curr");
    for (let i = 0; i < currs.length; i++) {
        currs[i].addEventListener("click", setZero, false);
        currs[i].addEventListener('click', function(){
            day = currs[i].textContent;
            showEventAjax();
        }, false);
    }
    let nexts = document.getElementsByClassName("next");
    for (let i = 0; i < nexts.length; i++) {
        nexts[i].addEventListener("click", setNext, false);
        nexts[i].addEventListener('click', function(){
            day = nexts[i].textContent;
            console.log("DDDDDDD: "+nexts[i].value);
            showEventAjax();
        }, false);
        // nexts[i].addEventListener("click", showEventAjax(), false);
        
        //day = nexts[i].value;
    }
    let prevs = document.getElementsByClassName("prev");
    for (let i = 0; i < prevs.length; i++) {
        prevs[i].addEventListener("click", setPrev, false);
        prevs[i].addEventListener('click', function(){
            day = prevs[i].textContent;
            console.log("DDDDDDD: "+prevs[i].value);
            showEventAjax();
        }, false);
        //day = prevs[i].value;
        // prevs[i].addEventListener("click", setPrev, false);
        // prevs[i].addEventListener("click", showEventAjax(), false);
        //day = prevs[i].value;
    }

    function setNext(event) {
        isThisMonth = 1;
    }
    function setPrev(event) {
        isThisMonth = -1;
    }
    function setZero(event) {
        isThisMonth = 0;
    }
}

function updateMonth(rawDate, isThisMonth){
    
    const words = rawDate.split('-');
    let year = words[0];
    let mon = parseInt(words[1]);
    if (mon == 0 && isThisMonth == -1) mon = 12;
    else if (mon == 11 && isThisMonth == 1) mon = 1;
    else mon = mon+1+isThisMonth;
    rawDate = year+"-"+String(mon).padStart(2, '0');
    //console.log("UPDATEMONGTH: "+rawDate);
    return rawDate;
}
updateClickDate();