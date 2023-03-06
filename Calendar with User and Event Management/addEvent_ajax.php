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

$id = $json_obj['add_id'];
$title = $json_obj['add_title'];
$date = $json_obj['add_date'];

// echo "Date is:" . $date;
$time = $json_obj['add_time'];
$tags = $json_obj['add_tag'];
$detail = $json_obj['add_detail'];
$token = $json_obj['token'];

$errorMSG = "Known Error";
if (isset($_SESSION['token']) && isset($_SESSION['user_id'])) {
    //echo $_SESSION['token'] . "UUUU" . isset($_SESSION['user_id']) . "JSON Token" . $token;
    if (!hash_equals($token, $_SESSION['token'])) {
        $errorMSG = $token . "Error token. Request forgery detected" . $_SESSION['token'];
        json_error_msg(false, $errorMSG);
        exit;
    }
    if ($id != $_SESSION['user_id']) {
        $errorMSG = "Session hijack detected" . $_SESSION['user_id'];
        json_error_msg(false, $errorMSG);
        exit;
    }
} else {
    $errorMSG = "Please login first. You are guest account now.";
    json_error_msg(false, $errorMSG);
    exit;
}

// insert from current user into db
$stmt = $mysqli->prepare("insert into event (uid, title,date,time,tags,detail) values (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    $errorMSG = "Query Prep Failed: %s\n" . $mysqli->error;
    json_error_msg(false, $errorMSG);
}

//uid, title,date,time,tags,detail
$stmt->bind_param('isssss', $id, $title, $date, $time, $tags, $detail);

$stmt->execute();

$members = $json_obj['members'];

if (!$stmt->errno) {
    if ($members == '') {
        echo json_encode(array(
            "success" => true,
            "message" => "Sucuess, Event Added To User",
        ));
        exit;
    }
}
$stmt->close();

// Getting ids from the array and perform query on each of them.
$idArray = explode(',', $members);
foreach ($idArray as &$idToCheck) {
// checking
    if ($idToCheck == $id) {
        $errorMSG = "Interrupted ,Can not share Event with yourself";
        json_error_msg(false, $errorMSG);
        exit;
    }
    $checkid = $mysqli->prepare("select * from user where id = ?");
    if (!$checkid) {
        $errorMSG = "User Query Prep Failed: %s\n" . $mysqli->error;
        json_error_msg(false, $errorMSG);
        exit;
    }
    $checkid->bind_param('s', $idToCheck);
    $checkid->execute();
    $result = $checkid->get_result();
    $row = mysqli_num_rows($result);
    if (!$row) {
        $errorMSG = "Incorrect Username: Such UserName Does Not exist!, Interrupted";
        json_error_msg(false, $errorMSG);
        //echo "Cannot create username: ($username), such username already exist";
        exit;
    }

    if ($checkid->errno) {
        echo json_encode(array(
            "success" => false,
            "message" => "Error, Username Does Not Exist",
        ));
        exit;
    }
    $checkid->close();
// Adding
    // insert into db
    $stmt = $mysqli->prepare("insert into event (uid, title,date,time,tags,detail) values (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        $errorMSG = "Query Prep Failed: %s\n" . $mysqli->error;
        json_error_msg(false, $errorMSG);
    }
    $newTitle = "Created by #" . $id . ":  " . $title;
    $stmt->bind_param('isssss', $idToCheck, $newTitle, $date, $time, $tags, $detail);

    $stmt->execute();

    if ($stmt->errno) {
        echo json_encode(array(
            "success" => false,
            "message" => "Insert failed",
        ));
        exit;
    }
    $stmt->close();
}

echo json_encode(array(
    "success" => true,
    "message" => "Sucuess, Event Added To Other Users As Well",
));
exit;
