<?php
// Database connection
$host = "localhost";
$username = "root"; // Update if different
$password = ""; // Update if different
$dbname = "kingangitech_db";

$conn = new mysqli($host, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle user signup
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['signup'])) {
    $username = $conn->real_escape_string($_POST['username']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $role = $conn->real_escape_string($_POST['role']);

    $sql = "INSERT INTO users (username, email, password_hash, role) VALUES ('$username', '$email', '$password', '$role')";
    if ($conn->query($sql) === TRUE) {
        echo "Signup successful!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Handle user login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password_hash'])) {
            echo "Login successful! Welcome, " . $user['username'];
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "No account found with this email.";
    }
}

// Handle contact form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact'])) {
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $message = $conn->real_escape_string($_POST['message']);

    $sql = "INSERT INTO messages (name, email, message) VALUES ('$name', '$email', '$message')";
    if ($conn->query($sql) === TRUE) {
        echo "Message sent successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Blog API endpoints
if (isset($_GET['api']) && $_GET['api'] === 'blog') {
    header('Content-Type: application/json');
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // Get all blog posts
        $result = $conn->query("SELECT * FROM blogs ORDER BY created_at DESC");
        $blogs = [];
        while ($row = $result->fetch_assoc()) {
            $blogs[] = $row;
        }
        echo json_encode($blogs);
        exit;
    } elseif ($method === 'POST') {
        // Create new blog post
        $title = $conn->real_escape_string($_POST['title']);
        $content = $conn->real_escape_string($_POST['content']);
        $image = isset($_POST['image']) ? $conn->real_escape_string($_POST['image']) : '';

        $sql = "INSERT INTO blogs (title, content, image, created_at) VALUES ('$title', '$content', '$image', NOW())";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Blog post created']);
        } else {
            echo json_encode(['success' => false, 'message' => $conn->error]);
        }
        exit;
    } elseif ($method === 'PUT') {
        // Update blog post
        parse_str(file_get_contents("php://input"), $put_vars);
        $id = intval($put_vars['id']);
        $title = $conn->real_escape_string($put_vars['title']);
        $content = $conn->real_escape_string($put_vars['content']);
        $image = isset($put_vars['image']) ? $conn->real_escape_string($put_vars['image']) : '';

        $sql = "UPDATE blogs SET title='$title', content='$content', image='$image' WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Blog post updated']);
        } else {
            echo json_encode(['success' => false, 'message' => $conn->error]);
        }
        exit;
    } elseif ($method === 'DELETE') {
        // Delete blog post
        parse_str(file_get_contents("php://input"), $delete_vars);
        $id = intval($delete_vars['id']);

        $sql = "DELETE FROM blogs WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Blog post deleted']);
        } else {
            echo json_encode(['success' => false, 'message' => $conn->error]);
        }
        exit;
    }
}
?>
