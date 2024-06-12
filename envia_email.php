<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    $to = "mateusvicentin8@gmail.com"; 
    $headers = "From: $name <$email>";
    $message_body = "Assunto: $subject\n\n$message";


    if (mail($to, $subject, $message_body, $headers)) {
        echo "Obrigado por entrar em contato, $name. Sua mensagem foi enviada com sucesso!";
    } else {
        echo "Desculpe, ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.";
    }
} else {
    exit();
}
?>
