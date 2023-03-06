<?php
// login_ajax.php
require_once "database.php";
require_once "function.php";
ini_set("session.cookie_httponly", 1);
session_start();
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
//<!-- const data = {'add_id': id, 'add_username':username,'add_date':date,'add_time':time,
//    'add_tag':selectedTags,'add_detail':detail,'token':token}; -->
$eid = $json_obj['event_id'];
$sid = $json_obj['share_id'];
$token = $json_obj['token'];
$userid = $json_obj['user_id'];

$errorMSG = "Known Error";
if (isset($_SESSION['token']) && isset($_SESSION['user_id'])) {
    if (!hash_equals($token, $_SESSION['token'])) {
        $errorMSG = $token . "Error token. Request forgery detected" . $_SESSION['token'];
        json_error_msg(false, $errorMSG);
        exit;
    }
    if ($userid != $_SESSION['user_id']) {
        $errorMSG = "Session hijack detected" . $_SESSION['user_id'];
        json_error_msg(false, $errorMSG);
        exit;
    }
} else {
    $errorMSG = "Please login first. You are guest account now.";
    json_error_msg(false, $errorMSG);
    exit;
}

//json_error_msg(false, $errorMSG);

// get event information of eventid from db
$stmt = $mysqli->prepare("select uid,title,date,time,tags,detail from event where eid=?");
if (!$stmt) {
    $errorMSG = "Query Prep Failed: %s\n" . $mysqli->error;
    json_error_msg(false, $errorMSG);
}

$stmt->bind_param('i', $eid);

$stmt->execute();
$stmt->bind_result($s_uid, $s_title, $a_date, $s_time, $s_tags, $s_detail);
$stmt->fetch();
$stmt->close();

// insert the shared event into db
$shareinsert = $mysqli->prepare("insert into event (uid,title,date,time,tags,detail) values (?, ?, ?, ?, ?, ?)");
if (!$shareinsert) {
    $errorMSG = "Query Prep Failed: %s\n" . $mysqli->error;
    json_error_msg(false, $errorMSG);
}

$shareinsert->bind_param('isssss', $sid, $s_title, $a_date, $s_time, $s_tags, $s_detail);

$shareinsert->execute();

if (!$shareinsert->errno) {
    $errorMSG = "Success. Share event";
    json_error_msg(true, $errorMSG);
    exit;
} else {
    $errorMSG = "Share event fails";
    json_error_msg(false, $errorMSG);
    exit;
}
$shareinsert->close();
