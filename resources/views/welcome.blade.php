<!DOCTYPE html>
<html>
<head>
    <title>Speed Lead</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.18.0/font/bootstrap-icons.css" rel="stylesheet">

    <script>
        window.TELNYX_USERNAME = "{{ env('TELNYX_USERNAME') }}";
        window.TELNYX_PASSWORD = "{{ env('TELNYX_PASSWORD') }}";
    </script>
</head>
<body style="margin: 0">
    <div id="app"></div>

    @vite('resources/js/app.tsx')
</body>
</html>