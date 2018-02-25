<?php
if(isset($_POST['recipientEmail'])) {


	// EDIT THE 2 LINES BELOW AS REQUIRED
	$email_to = $_POST['recipientEmail'];
	$email_from = $_POST['userEmail'];
	$email_subject = "MAMEM Dashboard Help requested";
	$email_content = $_POST['emailContent'];

	function died($error) {
		// your error code can go here
		echo "We are very sorry, but there were error(s) found with the form you submitted. ";
		echo "These errors appear below.<br /><br />";
		echo $error."<br /><br />";
		die();
	}


	// validation expected data exists
	if(!isset($_POST['recipientEmail']) ||
	   !isset($_POST['userEmail']) ||
	   !isset($_POST['emailContent']))
	{
		died('We are sorry, but there appears to be a problem with the form you submitted.');
	}

	function clean_string($string) {
		$bad = array("content-type","bcc:","to:","cc:","href");
		return str_replace($bad,"",$string);
	}

	$email_message = '';
	$email_message .= "From: ".$email_from."\n";
	$email_message .= "Message: ".$email_content."\n";

	// create email headers
	$headers = 'From: '.$email_from."\r\n".
	           'Reply-To: '.$email_from."\r\n" .
	           'X-Mailer: PHP/' . phpversion();

	mail($email_to, $email_subject, $email_message, $headers);
	?>

    <!-- include your own success html here -->
    Thank you for contacting us. We will be in touch with you very soon.
<?php } ?>