<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recupera os dados do formulário
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Monta o corpo do e-mail
    $email_body = "Nome: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Assunto: $subject\n";
    $email_body .= "Mensagem:\n$message";

    // Configurações adicionais para o envio do e-mail
    $to = "mateusvicentin8@gmail.com"; // Substitua pelo seu endereço de e-mail
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Envia o e-mail
    if (mail($to, $subject, $email_body, $headers)) {
        // Se o e-mail foi enviado com sucesso, redireciona para uma página de sucesso
        header('Location: obrigado.html'); // Substitua "obrigado.html" pela página que você deseja exibir após o envio do formulário
        exit;
    } else {
        // Se houver um erro no envio do e-mail, redireciona para uma página de erro
        header('Location: erro.html'); // Substitua "erro.html" pela página que você deseja exibir em caso de erro
        exit;
    }
} else {
    // Se o método de requisição não for POST, redireciona para uma página de erro
    header('Location: erro.html');
    exit;
}
?>
