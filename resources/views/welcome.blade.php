<!DOCTYPE html>
<html>
<head>
    <title>Speed Lead</title>

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