<?php
// Check if the form was submitted via GET method
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve the email from the request
    $email = filter_input(INPUT_GET, 'Email', FILTER_SANITIZE_EMAIL);

    // Validate the email
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // If the email is valid, save it (e.g., to a file)
        $file = 'submissions.csv';
        $entry = $email . "," . date('Y-m-d H:i:s') . "\n";

        // Check if the email was successfully saved
        if (file_put_contents($file, $entry, FILE_APPEND | LOCK_EX)) {
            // Send a notification to the admin's email
            $adminEmail = "admin@example.com"; // Replace with the real admin email address
            $subject = "New Form Submission";
            $message = "A new email was submitted through the form:\n\nEmail: $email\nDate: " . date('Y-m-d H:i:s');
            $headers = "From: no-reply@example.com\r\n" .
                       "Reply-To: no-reply@example.com\r\n" .
                       "Content-Type: text/plain; charset=UTF-8";

            mail($adminEmail, $subject, $message, $headers);

            // Return a success response
            http_response_code(200);
            echo "Thank you! Your submission has been received!";
        } else {
            // Error saving the email
            http_response_code(500);
            echo "Oops! Something went wrong while saving your submission.";
        }
    } else {
        // Invalid email
        http_response_code(400);
        echo "Invalid email address. Please try again.";
    }
} else {
    // Invalid request method
    http_response_code(405);
    echo "Method not allowed. Please submit the form correctly.";
}
?>