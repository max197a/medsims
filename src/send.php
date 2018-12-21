<?php
	$owner_email = "Joseph.isaac@sei-healthcare.com	"; // email
	$headers = "Content-type: text/html; charset=utf-8 \r\n";
	$subject = 'Message from ' . $_SERVER['SERVER_NAME'];
	$messageBody = "";

	if($_POST['name'] != ''){
		$name = substr(htmlspecialchars(trim($_POST['name'])), 0, 100);
		$messageBody .= '<p><strong>Name:</strong> ' . $name . '</p>' . "\r\n";
	}

	if($_POST['mail'] != ''){
		$mail = substr(htmlspecialchars(trim($_POST['mail'])), 0, 100);
		$messageBody .= '<p><strong>Email:</strong> ' . $mail . '</p>' . "\r\n";
	}

	if($_POST['mailConfirm'] != ''){
		$mailConfirm = substr(htmlspecialchars(trim($_POST['mailConfirm'])), 0, 100);
		$messageBody .= '<p><strong>Mail Confirm:</strong> ' . $mailConfirm . '</p>' . "\r\n";
	}

	if($_POST['mess'] != ''){
		$mess = substr(htmlspecialchars(trim($_POST['mess'])), 0, 100);
		$messageBody .= '<p><strong>Message:</strong> ' . $mess . '</p>' . "\r\n";
	}


	try{
		if(!mail($owner_email, $subject, $messageBody, $headers)){
			throw new Exception('mail failed');
		} else {
			echo 'mail sent';
		}
	}catch(Exception $e){
		echo $e->getMessage() ."\n";
	}
?>