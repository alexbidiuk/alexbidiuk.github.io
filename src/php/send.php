<?php
  include 'config.php';

  if(empty($_POST)) {
    exit();
  };
  require_once './mail/PHPMailerAutoload.php';

  $sent = false;
  $errors = Array();

  function checkEmail($email, $errors) {
    $error = array(
      'target' => 'email',
      'title' => 'Wrong email',
      'text' => false
    );
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $error['text'] = 'Incorrect email!';
    };
    if(strlen($email) == 0) {
      $error['text'] = 'Enter your email';
    };
    if($error['text']) {
      array_push($errors, $error);
    };
    return $errors;
  };

  function checkMessage($message, $errors, $min_length = 15) {
    $error = array(
      'target' => 'message',
      'title' => 'Wrong message',
      'text' => false
    );
    if(strlen($message) <= $min_length) {
      $error['text'] = 'Message must be longer than '.$min_length.' chars!';
    }
    if(strlen($message) == 0) {
      $error['text'] = 'Enter your message';
    }
    if($error['text']) {
      array_push($errors, $error);
    }
    return $errors;
  }

  $type = $_POST['type'];
  $email = $_POST['email'];
  $msg = $_POST['message'];
  $errors = checkEmail($email, $errors);


  $errors = checkMessage($msg, $errors);
  $subject = 'Creato: message from '.$email;
  $message = $subject.'<br>Message: '.$msg;
  $response = 'Message sent';

  if(count($errors)) {
    $json_data = array(
      'type' => $type,
      'sent' => $sent,
      'errors' => $errors
    );
    echo json_encode($json_data);
    exit();
  }

  $mail = new PHPMailer;

  $mail->isSMTP();                                      // Set mailer to use SMTP
  $mail->Host = $mail_host;                             // Specify main and backup SMTP servers
  $mail->SMTPAuth = true;                               // Enable SMTP authentication
  $mail->Username = $username;                          // SMTP username
  $mail->Password = $password;                          // SMTP password
  $mail->SMTPSecure = 'ssl';                            // Enable SSL encryption, `tsl` also accepted
  $mail->Port = $mail_port;                             // TCP port to connect to

  $mail->setFrom($admin, $admin);
  $mail->addAddress($admin);                            // Add a recipient
  $mail->addReplyTo($email);

  $mail->isHTML(true);                                  // Set email format to HTML

  $mail->Subject = $subject;
  $mail->Body    = $message;
  $mail->AltBody = $message;

  if(!$mail->send()) {
    $error = array(
      'target' => 'submit',
      'title' => 'Server error',
      'text' => 'Something went wrong'
    );
    array_push($errors, $error);
  }
  else {
    $sent = true;
  }
  $json_data = array(
    'type' => $type,
    'sent' => $sent,
    'errors' => $errors
  );
  echo json_encode($json_data);
?>