<!DOCTYPE html>
<html lang="en" class="scroll-smooth" x-data="adminThemeManager()" :class="{ 'dark': darkMode }">
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
    <title>@yield('title', 'Chief Inspector Command Desk | Fake9ja Admin')</title>
    <meta name="description" content="Fake9ja Chief Inspector Command & Forensic Triage Dashboard.">

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
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .dark .glass-panel {
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(51, 65, 85, 0.6);
        }
        .emerald-glow {
            box-shadow: 0 0 25px -4px rgba(16, 185, 129, 0.3);
        }
        /* Custom scrollbar for admin panels */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(100, 116, 139, 0.4);
            border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.7);
        }
    </style>
    <script>
        function adminThemeManager() {
            return {
                darkMode: document.documentElement.classList.contains('dark'),
                sidebarOpen: false,
                toggleTheme() {
                    document.documentElement.classList.add('theme-transitioning');
                    this.darkMode = !this.darkMode;
                    if (this.darkMode) {
                        document.documentElement.classList.add('dark');
                        try { localStorage.setItem('fake9ja_theme', 'dark'); } catch(e){}
                    } else {
                        document.documentElement.classList.remove('dark');
                        try { localStorage.setItem('fake9ja_theme', 'light'); } catch(e){}
                    }
                    setTimeout(() => {
                        document.documentElement.classList.remove('theme-transitioning');
                    }, 300);
                }
            };
        }
    </script>
</head>
<body class="bg-slate-100 dark:bg-[#070d18] text-slate-800 dark:text-slate-100 font-sans antialiased min-h-screen flex transition-colors duration-300">

    <!-- Mobile Sidebar Backdrop -->
    <div x-show="sidebarOpen" x-cloak @click="sidebarOpen = false" 
         class="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"></div>

    <!-- Admin Left Sidebar -->
    <aside :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
           class="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out">
        
        <!-- Sidebar Brand Header -->
        <div class="h-20 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
            <a href="{{ route('admin.index') }}" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shadow-emerald-500/20">
                    <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                        <i data-lucide="shield-alert" class="w-5 h-5 text-emerald-400 relative z-10"></i>
                        <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-xs"></div>
                    </div>
                </div>
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="font-heading font-black text-xl tracking-tight text-white">
                            Fake<span class="text-emerald-400">9ja</span>
                        </span>
                        <span class="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ADMIN
                        </span>
                    </div>
                    <p class="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Command Portal</p>
                </div>
            </a>

            <!-- Close button for mobile -->
            <button @click="sidebarOpen = false" class="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <!-- Sidebar Quick Action Button -->
        <div class="p-4 border-b border-slate-800/60">
            <button type="button" @click="$dispatch('open-add-product-modal')"
                    class="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition transform active:scale-95">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Add New Product</span>
            </button>
        </div>

        <!-- Sidebar Navigation Links -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
            <!-- Section: Primary Queues -->
            <div>
                <p class="px-3 mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Inspection Queues
                </p>
                <div class="space-y-1">
                    <a href="{{ route('admin.index') }}" 
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition {{ !request()->has('status') || request('status') === 'all' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white' }}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-400"></i>
                            <span>All Dossiers</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                            {{ $stats['total'] ?? 0 }}
                        </span>
                    </a>

                    <a href="{{ route('admin.index', ['status' => 'received']) }}" 
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition {{ request('status') === 'received' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white' }}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="inbox" class="w-4 h-4 text-amber-400"></i>
                            <span>Pending Triage</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {{ $stats['pending'] ?? 0 }}
                        </span>
                    </a>

                    <a href="{{ route('admin.index', ['status' => 'under_review']) }}" 
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition {{ request('status') === 'under_review' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white' }}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="flask-conical" class="w-4 h-4 text-cyan-400"></i>
                            <span>Under Review</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            {{ $stats['under_review'] ?? 0 }}
                        </span>
                    </a>
                </div>
            </div>

            <!-- Section: Forensic Determinations -->
            <div>
                <p class="px-3 mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Determinations
                </p>
                <div class="space-y-1">
                    <a href="{{ route('admin.index', ['status' => 'verified_fake']) }}" 
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition {{ request('status') === 'verified_fake' ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-semibold' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white' }}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="alert-octagon" class="w-4 h-4 text-red-400"></i>
                            <span>Confirmed Fakes</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            {{ $stats['verified_fake'] ?? 0 }}
                        </span>
                    </a>

                    <a href="{{ route('admin.index', ['status' => 'verified_original']) }}" 
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition {{ request('status') === 'verified_original' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white' }}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="check-check" class="w-4 h-4 text-emerald-400"></i>
                            <span>Verified Genuine</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {{ $stats['verified_original'] ?? 0 }}
                        </span>
                    </a>

                    <a href="{{ route('admin.index', ['status' => 'escalated']) }}" 
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition {{ request('status') === 'escalated' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white' }}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="siren" class="w-4 h-4 text-purple-400"></i>
                            <span>Escalated to NAFDAC</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            {{ $stats['escalated'] ?? 0 }}
                        </span>
                    </a>
                </div>
            </div>

            <!-- Section: System Links -->
            <div>
                <p class="px-3 mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Live Surveillance
                </p>
                <div class="space-y-1">
                    <a href="{{ route('community.index') }}" target="_blank"
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 transition">
                        <div class="flex items-center gap-3">
                            <i data-lucide="map-pin" class="w-4 h-4 text-slate-400"></i>
                            <span>Market Hotspots Radar</span>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-500"></i>
                    </a>

                    <a href="{{ route('brand-protection.index') }}" target="_blank"
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 transition">
                        <div class="flex items-center gap-3">
                            <i data-lucide="shield-check" class="w-4 h-4 text-slate-400"></i>
                            <span>Brand Sentinel</span>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-500"></i>
                    </a>

                    <a href="{{ route('home') }}" target="_blank"
                       class="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 transition">
                        <div class="flex items-center gap-3">
                            <i data-lucide="globe" class="w-4 h-4 text-emerald-400"></i>
                            <span>View Public Radar</span>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-500"></i>
                    </a>
                </div>
            </div>
        </nav>

        <!-- Sidebar Inspector Footer & Profile -->
        <div class="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    CI
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold text-white truncate">Chief Inspector</span>
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    <p class="text-[11px] text-slate-400 truncate">admin@fake9ja.ng</p>
                </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <!-- Theme Toggle -->
                <button type="button" @click="toggleTheme()"
                        class="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition flex items-center gap-1.5 text-[11px]"
                        title="Toggle Dark / Light Mode">
                    <span x-show="darkMode" class="flex items-center gap-1.5">
                        <i data-lucide="sun" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>Dark</span>
                    </span>
                    <span x-show="!darkMode" class="flex items-center gap-1.5" x-cloak>
                        <i data-lucide="moon" class="w-3.5 h-3.5 text-slate-300"></i>
                        <span>Light</span>
                    </span>
                </button>

                <!-- Logout Form -->
                <form action="{{ route('admin.logout') }}" method="POST" class="inline">
                    @csrf
                    <button type="submit" class="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-[11px] font-bold flex items-center gap-1.5 transition">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        <span>Exit</span>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-72">
        
        <!-- Admin Top Navigation Bar -->
        <header class="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <!-- Mobile Sidebar Toggle -->
                <button @click="sidebarOpen = true" class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>

                <!-- Breadcrumbs -->
                <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                    <span class="font-bold text-slate-800 dark:text-slate-200">Inspector Command</span>
                    <span>/</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-medium">
                        @if(request('status') === 'received')
                            Pending Triage Queue
                        @elseif(request('status') === 'under_review')
                            Forensic Lab Review
                        @elseif(request('status') === 'verified_fake')
                            Confirmed Counterfeits
                        @elseif(request('status') === 'verified_original')
                            Verified Genuine Catalog
                        @elseif(request('status') === 'escalated')
                            Regulatory Escalations
                        @else
                            Case Registry & Overview
                        @endif
                    </span>
                </div>
            </div>

            <!-- Topbar Actions -->
            <div class="flex items-center gap-3">
                <!-- System status badge -->
                <div class="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Registry Live Sync</span>
                </div>

                <!-- Add New Product Button -->
                <button type="button" @click="$dispatch('open-add-product-modal')"
                        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition transform active:scale-95">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                    <span class="hidden sm:inline">Add Product</span>
                </button>

                <!-- Theme switch in header -->
                <button type="button" @click="toggleTheme()" 
                        class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition"
                        title="Toggle Dark/Light Mode">
                    <span x-show="darkMode" class="flex items-center">
                        <i data-lucide="sun" class="w-4 h-4 text-amber-400"></i>
                    </span>
                    <span x-show="!darkMode" class="flex items-center" x-cloak>
                        <i data-lucide="moon" class="w-4 h-4"></i>
                    </span>
                </button>
            </div>
        </header>

        <!-- Flash Notifications -->
        @if(session('success') || session('status'))
            <div class="p-4 mx-4 sm:mx-8 mt-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 shadow-sm">
                <div class="flex items-center gap-3">
                    <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-500 shrink-0"></i>
                    <span class="text-xs font-semibold">{{ session('success') ?? session('status') }}</span>
                </div>
                <button @click="$el.parentElement.remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        @endif

        @if(session('error') || (isset($errors) && $errors->any()))
            <div class="p-4 mx-4 sm:mx-8 mt-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 flex items-center justify-between gap-3 shadow-sm">
                <div class="flex items-center gap-3">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-red-500 shrink-0"></i>
                    <div class="text-xs">
                        @if(session('error'))
                            <p class="font-semibold">{{ session('error') }}</p>
                        @endif
                        @if(isset($errors) && $errors->any())
                            <ul class="list-disc list-inside space-y-0.5 mt-1 font-medium">
                                @foreach($errors->all() as $err)
                                    <li>{{ $err }}</li>
                                @endforeach
                            </ul>
                        @endif
                    </div>
                </div>
                <button @click="$el.parentElement.remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        @endif

        <!-- Page Main Content Slot -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8">
            @yield('content')
        </main>
    </div>

    <!-- Initialize Lucide icons on Alpine changes & DOM load -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
        document.addEventListener('alpine:initialized', () => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    </script>
</body>
</html>
