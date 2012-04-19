<?php
$ref = array_key_exists('ref', $_GET) ? $_GET['ref'] : 'content1';
$ajax = array_key_exists('HTTP_X_REQUESTED_WITH', $_SERVER) ? true : false;

if($ref && $ajax) {
  header('Content-type: application/json');
  echo json_encode(array('now' => time()));
  exit();
} ?>

<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="css/style.css">
  <script>document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/,'') + 'js';</script>
</head>
<body>
  <h1>Animated Accordion</h1>
  
  <div class="accordion">
      <h2 id="content1" class="heading">
        <a href="?ref=content1">First header</a>
      </h2>
      <div class="content<?php if($ref !== 'content1'): ?> hidden<?php endif; ?>">First content</div>
      <h2 id="content2" class="heading">
        <a href="?ref=content2">Second header</a>
      </h2>
      <div class="content<?php if($ref !== 'content2'): ?> hidden<?php endif; ?>">Second content</div>
      <h2 id="content3" class="heading">
        <a href="?ref=content3">Third header</a>
      </h2>
      <div class="content<?php if($ref !== 'content3'): ?> hidden<?php endif; ?>">Third content</div>
      <h2 id="content4" class="heading">
        <a href="?ref=content4">Fourth header</a>
      </h2>
      <div class="content<?php if($ref !== 'content4'): ?> hidden<?php endif; ?>">Fourth content</div>
  </div>

  <script src="js/script.js"></script>
</body>
</html>