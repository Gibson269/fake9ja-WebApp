<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin Login | Fake9ja</title>
    <style>
        :root {
            color-scheme: dark;
            font-family: "Segoe UI", Arial, sans-serif;
            background: #07110f;
            color: #f4f8f6;
            font-synthesis: none;
            text-rendering: optimizeLegibility;
        }
        * { box-sizing: border-box; }
        body {
            min-height: 100vh;
            margin: 0;
            display: grid;
            place-items: center;
            padding: 24px;
            background: radial-gradient(ellipse at 50% 0%, #123328 0%, #07110f 58%);
        }
        main {
            width: min(100%, 400px);
            padding: clamp(24px, 7vw, 36px);
            border: 1px solid #263b34;
            border-radius: 18px;
            background: #0d1915;
            box-shadow: 0 24px 70px #0007;
        }
        .mark {
            width: 48px;
            height: 48px;
            display: grid;
            place-items: center;
            margin: 0 auto 18px;
            border: 1px solid #28664d;
            border-radius: 14px;
            color: #67e0a5;
            font-size: 23px;
        }
        header { margin-bottom: 26px; text-align: center; }
        h1 { margin: 0; font-size: 25px; letter-spacing: 0; }
        header p { margin: 8px 0 0; color: #a8b7b0; font-size: 13px; line-height: 1.6; }
        .error {
            margin-bottom: 18px;
            padding: 12px 14px;
            border: 1px solid #773b3b;
            border-radius: 10px;
            background: #351c1c;
            color: #ffc4c4;
            font-size: 13px;
            line-height: 1.5;
        }
        .field { margin-top: 17px; }
        label { display: block; margin-bottom: 7px; color: #d7e1dc; font-size: 12px; font-weight: 700; }
        input {
            width: 100%;
            height: 46px;
            padding: 0 13px;
            border: 1px solid #34473f;
            border-radius: 10px;
            outline: none;
            background: #07110f;
            color: #f4f8f6;
            font: inherit;
            font-size: 14px;
        }
        input::placeholder { color: #788a82; }
        input:focus { border-color: #38b878; box-shadow: 0 0 0 3px #38b8782b; }
        button {
            width: 100%;
            min-height: 46px;
            margin-top: 22px;
            border: 0;
            border-radius: 10px;
            background: #16834f;
            color: white;
            font: inherit;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
        }
        button:hover { background: #1b9b60; }
        button:focus-visible, a:focus-visible { outline: 3px solid #67e0a5; outline-offset: 3px; }
        footer { margin-top: 22px; padding-top: 18px; border-top: 1px solid #263b34; text-align: center; }
        a { color: #a8b7b0; font-size: 12px; text-decoration: none; }
        a:hover { color: #67e0a5; }
    </style>
</head>
<body>
    <main>
        <header>
            <div class="mark" aria-hidden="true">&#9678;</div>
            <h1>Admin Login</h1>
            <p>Only verified administrators with authorized credentials can access this page.</p>
        </header>

        @if(session('error'))
            <div class="error" role="alert">{{ session('error') }}</div>
        @endif

        <form action="{{ route('admin.login.submit') }}" method="POST">
            @csrf
            <div class="field">
                <label for="email">Inspector Email</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="email">
            </div>
            <div class="field">
                <label for="password">Security Password</label>
                <input id="password" type="password" name="password" required autocomplete="current-password" placeholder="Enter your password">
            </div>
            <button type="submit">Login</button>
        </form>

        <footer>
            <a href="{{ route('home') }}">Return to Citizen Public Radar</a>
        </footer>
    </main>
</body>
</html>
