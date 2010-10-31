<?php

$method = strtolower($_SERVER['REQUEST_METHOD']);

require "couchdb.php";
$db = new CouchDB('carbon', 'carboncopy.couchone.com', 80);


if ($method == 'get') {
  $request = preg_replace('/(^\/scores\/?|\/?($|\?.*))/', '', $_SERVER['REQUEST_URI']);
  
  if ($request == 'leaderboard') {
    $limit = ($_GET['limit'] ? $_GET['limit'] : 10);
    $result = $db->view('scores', 'leaderboard', 'limit='.$limit."&descending=true")->getBody(true);
    
    $leaderboard = array();
    
    foreach ($result->rows as $leader) {
      $leader = $leader->value;
      unset($leader->_id);
      unset($leader->_rev);
      if (!isset($leader->name)) { $leader->name = null; }
      $leaderboard[] = $leader;
    }
    
    print json_encode($leaderboard);
  } else {
    $result = $db->view('scores', 'names', 'key="'.$request."\"&descending=true")->getBody(true);
    
    $scores = array();
    
    foreach ($result->rows as $score) {
      $score = $score->value;
      unset($score->_id);
      unset($score->_rev);
      if (!isset($score->name)) { $score->name = null; }
      $scores[] = $score;
    }
    
    print json_encode($scores);
  }
} elseif ($method == 'post') {
  if (!isset($_POST['score'])) { header("400 Bad Request"); print '{"status": "fail", "reason": "score required"}'; die; }
  if (!isset($_POST['rounds'])) { header("400 Bad Request"); print '{"status": "fail", "reason": "rounds required"}'; die; }

  $obj = new stdClass;
  $obj->score = (integer) $_POST['score'];
  $obj->rounds = (integer) $_POST['rounds'];
  if (isset($_POST['name'])) { $obj->name = $_POST['name']; }
  
  $db->update($obj);
  print '{"status": "succeed"}'; die;
}

?>