<!DOCTYPE html>
<html lang="en" class="scroll-smooth" x-data="appThemeManager()" :class="{ 'dark': darkMode }">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Immediate synchronous theme detection to default to Dark Mode -->
    <script>
        (function() {
            try {
                var saved = localStorage.getItem('fake9ja_theme') || localStorage.getItem('fake9ja-theme');
                // Default is DARK — only go light if user explicitly chose light
                if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                } else {
                    document.documentElement.classList.add('dark');
                }
            } catch (e) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>
    <title>@yield('title', 'Fake9ja | Nigeria\'s Free Citizen Counterfeit Detection & Consumer Protection Radar')</title>
    <meta name="description" content="Report and track fake products, counterfeit medicines, cosmetics, and adulterated goods in Nigerian markets. 100% Free public consumer protection intelligence.">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (Play CDN with custom theme config) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#ecfdf5',
                            100: '#d1fae5',
                            200: '#a7f3d0',
                            300: '#6ee7b7',
                            400: '#34d399',
                            500: '#10b981',
                            600: '#059669',
                            700: '#047857',
                            800: '#065f46',
                            900: '#064e3b',
                            950: '#022c22',
                        },
                        nggreen: '#008751',
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        heading: ['"Outfit"', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <style>
        [x-cloak] { display: none !important; }
        html.theme-transitioning,
        html.theme-transitioning *,
        html.theme-transitioning *:before,
        html.theme-transitioning *:after {
            transition: background-color 0.25s ease, border-color 0.25s ease, color 0.2s ease !important;
            transition-delay: 0s !important;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .dark .glass-panel {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(51, 65, 85, 0.6);
        }
        .emerald-glow {
            box-shadow: 0 0 35px -5px rgba(16, 185, 129, 0.35);
        }
        .radar-sweep {
            animation: radar 4s linear infinite;
        }
        @keyframes radar {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
    <script>
        function appThemeManager() {
            return {
                darkMode: document.documentElement.classList.contains('dark'),
                mobileMenu: false,
                toggleTheme() {
                    document.documentElement.classList.add('theme-transitioning');
                    this.darkMode = !this.darkMode;
                    if (this.darkMode) {
                        document.documentElement.classList.add('dark');
                        try { 
                            localStorage.setItem('fake9ja_theme', 'dark');
                            localStorage.setItem('fake9ja-theme', 'dark');
                        } catch(e){}
                    } else {
                        document.documentElement.classList.remove('dark');
                        try { 
                            localStorage.setItem('fake9ja_theme', 'light');
                            localStorage.setItem('fake9ja-theme', 'light');
                        } catch(e){}
                    }
                    setTimeout(() => {
                        document.documentElement.classList.remove('theme-transitioning');
                    }, 300);
                }
            };
        }
    </script>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col transition-colors duration-300">

    <!-- Top Citizen Alert Ribbon -->
    <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-emerald-200 text-xs py-2 px-4 border-b border-emerald-800/40 relative z-50">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div class="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
                    100% Free Public Good
                </span>
                <span class="text-slate-300 hidden sm:inline">Citizen Protection:</span>
                <span class="text-white font-medium truncate">No fees, zero charges. Protecting Nigeria from counterfeit goods & fake medicines.</span>
            </div>
            <div class="flex items-center gap-4 text-[11px] shrink-0">
                <a href="{{ route('track.index') }}" class="hover:text-white transition flex items-center gap-1 font-medium">
                    <i data-lucide="crosshair" class="w-3.5 h-3.5 text-emerald-400"></i> Track Case
                </a>
                <!-- <span class="text-slate-600">|</span>
                <a href="{{ route('admin.index') }}" class="hover:text-emerald-400 transition flex items-center gap-1 text-slate-300">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Inspector Desk
                </a> -->
            </div>
        </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="sticky top-0 z-40 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <!-- Brand Logo -->
            <a href="{{ route('home') }}" class="flex items-center gap-3 group">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition transform">
                    <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                        <i data-lucide="shield-alert" class="w-6 h-6 text-emerald-400 relative z-10"></i>
                        <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm"></div>
                    </div>
                </div>
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white">
                            Fake<span class="text-emerald-600 dark:text-emerald-400">9ja</span>
                        </span>
                        <span class="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Radar
                        </span>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 tracking-wide font-medium">National Counterfeit Defense</p>
                </div>
            </a>

            <!-- Desktop Navigation Links -->
            <nav class="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600 dark:text-slate-300">
                <a href="{{ route('home') }}" class="px-3.5 py-2 rounded-xl hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition {{ request()->routeIs('home') ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40' : '' }}">
                    Home
                </a>
                <a href="{{ route('community.index') }}" class="px-3.5 py-2 rounded-xl hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition {{ request()->routeIs('community.index') ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40' : '' }}">
                    Incident Radar
                </a>
                <a href="{{ route('track.index') }}" class="px-3.5 py-2 rounded-xl hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition {{ request()->routeIs('track.index') ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40' : '' }}">
                    Track Case
                </a>
                <a href="{{ route('brand-protection.index') }}" class="px-3.5 py-2 rounded-xl hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition {{ request()->routeIs('brand-protection.index') ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40' : '' }}">
                    Brand Sentinel
                </a>
            </nav>

            <!-- Actions (Theme Toggle & Report Button) -->
            <div class="flex items-center gap-3">
                <!-- Theme Switcher -->
                <button type="button" @click="toggleTheme()" 
                        class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                        title="Toggle Dark/Light Mode">
                    <span x-show="!darkMode" class="flex items-center">
                        <i data-lucide="moon" class="w-4 h-4"></i>
                    </span>
                    <span x-show="darkMode" class="flex items-center" x-cloak>
                        <i data-lucide="sun" class="w-4 h-4 text-amber-400"></i>
                    </span>
                </button>

                <!-- Primary Report Button (100% Free) -->
                <a href="{{ route('report.create') }}" 
                   class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition transform hover:-translate-y-0.5">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    <span>Report Fake (Free)</span>
                </a>

                <!-- Mobile Menu Button -->
                <button @click="mobileMenu = !mobileMenu" class="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                    <i data-lucide="menu" class="w-5 h-5" x-show="!mobileMenu"></i>
                    <i data-lucide="x" class="w-5 h-5" x-show="mobileMenu" x-cloak></i>
                </button>
            </div>
        </div>

        <!-- Mobile Drawer -->
        <div x-show="mobileMenu" x-cloak class="md:hidden border-t border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
            <a href="{{ route('home') }}" class="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">Home</a>
            <a href="{{ route('community.index') }}" class="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">Incident Radar</a>
            <a href="{{ route('track.index') }}" class="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">Track Status</a>
            <a href="{{ route('brand-protection.index') }}" class="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">Brand Sentinel</a>
            <a href="{{ route('admin.index') }}" class="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">Inspector Desk</a>
            <div class="pt-2">
                <a href="{{ route('report.create') }}" class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i> Report Counterfeit (Free)
                </a>
            </div>
        </div>
    </header>

    <!-- Flash Notifications -->
    @if(session('status') || session('success'))
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 shadow-sm">
                <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-500 shrink-0"></i>
                <div class="text-sm font-medium">
                    {{ session('status') ?? session('success') }}
                </div>
            </div>
        </div>
    @endif

    @if(session('error') || $errors->any())
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-200 flex items-start gap-3 shadow-sm">
                <i data-lucide="alert-octagon" class="w-5 h-5 text-red-500 shrink-0 mt-0.5"></i>
                <div class="text-sm">
                    @if(session('error'))
                        <p class="font-medium">{{ session('error') }}</p>
                    @endif
                    @if($errors->any())
                        <ul class="list-disc pl-5 mt-1 space-y-0.5">
                            @foreach($errors->all() as $err)
                                <li>{{ $err }}</li>
                            @endforeach
                        </ul>
                    @endif
                </div>
            </div>
        </div>
    @endif

    <!-- Main Dynamic Content -->
    <main class="flex-1">
        @yield('content')
    </main>

    <!-- National Consumer Protection Footer -->
    <footer class="bg-slate-900 border-t border-slate-800 text-slate-400 mt-20 pt-16 pb-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
                <!-- Col 1: Identity & Mission -->
                <div class="space-y-4 md:col-span-1">
                    <div class="flex items-center gap-2">
                        <div class="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                            <i data-lucide="shield-alert" class="w-5 h-5 text-white"></i>
                        </div>
                        <span class="font-heading font-black text-2xl text-white">Fake<span class="text-emerald-400">9ja</span></span>
                    </div>
                    <p class="text-sm text-slate-400 leading-relaxed">
                        Nigeria's premier citizen-powered counterfeit detection, market surveillance, and consumer protection network.
                    </p>
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-xs text-emerald-300 font-semibold">
                        <i data-lucide="award" class="w-3.5 h-3.5"></i> 100% Free Public Initiative
                    </div>
                </div>

                <!-- Col 2: Fast Navigation -->
                <div class="space-y-3">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">Radar & Tools</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="{{ route('home') }}" class="hover:text-emerald-400 transition">Overview</a></li>
                        <li><a href="{{ route('report.create') }}" class="hover:text-emerald-400 transition">Report Counterfeit Product</a></li>
                        <li><a href="{{ route('community.index') }}" class="hover:text-emerald-400 transition">Market Hotspots Radar</a></li>
                        <li><a href="{{ route('track.index') }}" class="hover:text-emerald-400 transition">Track Investigation Code</a></li>
                        <li><a href="{{ route('brand-protection.index') }}" class="hover:text-emerald-400 transition">Free Brand Sentinel Registry</a></li>
                    </ul>
                </div>

                <!-- Col 3: Key Monitored Markets -->
                <div class="space-y-3">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">Tracked Hubs</h3>
                    <ul class="space-y-2 text-sm text-slate-400">
                        <li>Alaba International Market (Lagos)</li>
                        <li>Idumota & Balogun (Lagos Island)</li>
                        <li>Ariaria International Market (Aba)</li>
                        <li>Onitsha Main Market (Anambra)</li>
                        <li>Sabon Gari Market (Kano)</li>
                        <li>Bodija & Dugbe (Ibadan)</li>
                    </ul>
                </div>

                <!-- Col 4: Official Regulatory Helplines -->
                <div class="space-y-3">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">Regulatory Escalation</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        Urgent health hazards and counterfeit drugs are forwarded to official regulatory enforcement:
                    </p>
                    <div class="space-y-2 text-xs">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span class="text-slate-300 font-medium">NAFDAC:</span> 0800-1-NAFDAC
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span class="text-slate-300 font-medium">FCCPC Consumer Line:</span> 0805-888-0130
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span class="text-slate-300 font-medium">SON Toll Free:</span> 0800-4357-766
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Copyright & Disclaimer -->
            <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                <p>&copy; {{ date('Y') }} Fake9ja Defense Network. Built for Nigerian Citizens & Lawful Brands. Free forever.</p>
                
            </div>
        </div>
    </footer>

    <!-- Init Lucide Icons -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    </script>
    @stack('scripts')
</body>
</html>
