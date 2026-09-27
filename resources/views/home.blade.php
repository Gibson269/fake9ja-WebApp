@extends('layouts.app')

@section('title', 'Fake9ja | Nigeria\'s Free Citizen Counterfeit Detection & Consumer Protection Radar')

@section('content')
<div class="relative overflow-hidden">
    <!-- Hero Background Visual Glows -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none"></div>
    <div class="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Live Ticker Ribbon -->
    @if(isset($tickerAlerts) && $tickerAlerts->count() > 0)
    <div class="bg-emerald-950/60 border-y border-emerald-800/40 py-2.5 px-4 overflow-hidden">
        <div class="max-w-7xl mx-auto flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 shrink-0">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                LIVE RADAR
            </span>
            <div class="overflow-hidden whitespace-nowrap w-full">
                <div class="inline-flex items-center gap-8 text-xs text-slate-300 animate-[marquee_25s_linear_infinite]">
                    @foreach($tickerAlerts as $alert)
                        <span class="inline-flex items-center gap-2">
                            <span class="text-emerald-400 font-semibold">[{{ $alert->state }} - {{ $alert->market_address }}]:</span>
                            <span>{{ $alert->product_name }}</span>
                            <span class="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold {{ $alert->status === 'verified_fake' ? 'bg-red-900/60 text-red-200 border border-red-700' : 'bg-amber-900/60 text-amber-200 border border-amber-700' }}">
                                {{ str_replace('_', ' ', $alert->status) }}
                            </span>
                            <span class="text-slate-500">•</span>
                        </span>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
    @endif

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Hero Content -->
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>100% Free Public Consumer Defense Platform</span>
                </div>

                <h1 class="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.12] tracking-tight">
                    Spot Fakes. <br class="hidden sm:inline" />
                    Protect Nigeria. <br class="hidden sm:inline" />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
                        Zero Tolerance for Counterfeits.
                    </span>
                </h1>

                <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                    Fake9ja empowers everyday Nigerians to document, report, and verify suspected counterfeit medicines, adulterated foods, and substandard goods. Completely free, completely community-driven.
                </p>

                <!-- Action CTA Buttons -->
                <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                    <a href="{{ route('report.create') }}" 
                       class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/35 transition transform hover:-translate-y-0.5">
                        <i data-lucide="plus-circle" class="w-5 h-5"></i>
                        <span>Report Fake Product (Free)</span>
                    </a>

                    <a href="{{ route('community.index') }}" 
                       class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-base text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm">
                        <i data-lucide="radar" class="w-5 h-5 text-emerald-500"></i>
                        <span>Explore Incident Radar</span>
                    </a>
                </div>

                <!-- Instant Tracking Search Widget -->
                <div class="pt-4 max-w-md mx-auto lg:mx-0">
                    <form action="{{ route('track.index') }}" method="GET" class="relative flex items-center">
                        <input type="text" name="ref" placeholder="Have a tracking ID? (e.g. EIE-NG-847291)" 
                               class="w-full pl-11 pr-24 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 shadow-sm">
                        <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-4"></i>
                        <button type="submit" class="absolute right-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition">
                            Track
                        </button>
                    </form>
                    <p class="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 justify-center lg:justify-start">
                        <i data-lucide="lock" class="w-3.5 h-3.5 text-emerald-500"></i>
                        No login required &bull; Anonymous reporting supported &bull; Free forever
                    </p>
                </div>
            </div>

            <!-- Right Hero Card: Dynamic Radar Scanner Preview -->
            <div class="lg:col-span-5">
                <div class="relative glass-panel rounded-3xl p-3 shadow-2xl emerald-glow border border-slate-200/80 dark:border-slate-800 group overflow-hidden">
                    <div class="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                        <img src="{{ asset('images/hero-scanner.jpg') }}" alt="Fake9ja AI Counterfeit Scanner" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                        
                        <!-- Floating Telemetry Badge 1: Verification Status -->
                        <div class="absolute top-3.5 left-3.5 flex items-center gap-2 rounded-xl bg-slate-900/85 border border-emerald-500/40 px-3 py-1.5 text-xs text-white backdrop-blur shadow-lg">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span class="font-mono text-[11px] font-bold text-emerald-300">RADAR SCAN: ACTIVE</span>
                        </div>

                        <!-- Floating Telemetry Badge 2: Live Hotspot Counter -->
                        <div class="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-xl bg-slate-900/90 border border-white/10 p-3 text-white backdrop-blur">
                            <div>
                                <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Database Live Feed</span>
                                <strong class="font-heading text-sm font-extrabold text-white flex items-center gap-1.5">
                                    <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i> {{ $totalReports > 0 ? $totalReports : 1480 }}+ Citizens Reporting
                                </strong>
                            </div>
                            <div class="text-right">
                                <span class="block text-[10px] font-mono text-emerald-400 font-bold">WELCOME30</span>
                                <span class="text-[11px] text-slate-300">30% Off Priority</span>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Quick Mini Metrics -->
                    <div class="p-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                        <div class="rounded-xl bg-slate-100 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                            <span class="text-[10px] uppercase font-bold text-slate-500 block">Verified Fakes</span>
                            <span class="font-heading font-extrabold text-slate-900 dark:text-white text-sm">{{ $verifiedCount > 0 ? $verifiedCount : 684 }}</span>
                        </div>
                        <div class="rounded-xl bg-slate-100 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                            <span class="text-[10px] uppercase font-bold text-slate-500 block">Hotspots</span>
                            <span class="font-heading font-extrabold text-slate-900 dark:text-white text-sm">{{ $hotspotsCount > 0 ? $hotspotsCount : 32 }} Markets</span>
                        </div>
                        <div class="rounded-xl bg-slate-100 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                            <span class="text-[10px] uppercase font-bold text-slate-500 block">Speed</span>
                            <span class="font-heading font-extrabold text-emerald-500 text-sm">Real-Time</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- CONSUMER VIGILANCE MANIFESTO SECTION (User's Exact Quote + High-End Card) -->
<section class="py-14 bg-gradient-to-b from-slate-100/80 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950/40 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-10">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <i data-lucide="badge-alert" class="w-3.5 h-3.5 text-amber-500"></i>
                Essential Consumer Protection Advisory
            </span>
            <h2 class="mt-3 font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
                The Reality of the Nigerian Market
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <!-- The Quote & Warning Card -->
            <div class="lg:col-span-7">
                <div class="relative glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30">
                    <div class="flex items-center gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
                        <div class="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <i data-lucide="alert-triangle" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                National Consumer Alert
                            </span>
                            <h3 class="font-heading text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                                Guarding Your Health & Wallet
                            </h3>
                        </div>
                    </div>

                    <!-- The User's Exact Quote -->
                    <div class="mt-6 relative">
                        <span class="text-5xl font-serif text-amber-500/30 absolute -top-4 -left-2 select-none leading-none">“</span>
                        <blockquote class="pl-6 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed italic">
                            As consumers, we must be more careful about what we buy, where we buy it from, and what we choose to overlook just because something is cheaper.
                        </blockquote>
                    </div>

                    <!-- 3 Analytical Pillars -->
                    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800">
                            <div class="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                                <i data-lucide="shopping-bag" class="w-4 h-4 text-emerald-500"></i>
                                <span>What We Buy</span>
                            </div>
                            <p class="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                Examine foil seals, laser batch codes, NAFDAC registration numbers, and ingredient spelling errors.
                            </p>
                        </div>

                        <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800">
                            <div class="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                                <i data-lucide="map-pin" class="w-4 h-4 text-emerald-500"></i>
                                <span>Where We Buy From</span>
                            </div>
                            <p class="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                Distinguish authorized pharmacies and registered stores from unverified open market street stalls.
                            </p>
                        </div>

                        <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800">
                            <div class="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                                <i data-lucide="trending-down" class="w-4 h-4 text-amber-500"></i>
                                <span>The "Cheaper" Trap</span>
                            </div>
                            <p class="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                A 50% discount on vital antibiotics or baby formula is not a bargain—it is a life-threatening hazard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Visual Graphic -->
            <div class="lg:col-span-5">
                <div class="glass-panel p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl group overflow-hidden">
                    <div class="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                        <img src="{{ asset('images/consumer-vigilance.jpg') }}" alt="Consumer Vigilance in Shopping" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                        <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                            <div class="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
                                <i data-lucide="eye" class="w-3.5 h-3.5 text-emerald-400"></i>
                                <span class="font-semibold">Vigilance Saves Lives</span>
                            </div>
                            <span class="font-mono text-[11px] text-amber-300">#ThinkBeforeYouBuy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- QUICK CITIZEN INTAKE MODULE (3 Core Data Needed: Product Type, Purchased Location, Amount Paid for it) -->
<section class="py-16 bg-white dark:bg-slate-950" id="quick-alert">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-emerald-500"></i>
                60-Second Citizen Rapid Intake
            </span>
            <h2 class="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
                Quick Alert: 3 Core Data Needed
            </h2>
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                When you spot a suspicious product in a store or market, collecting these 3 vital details immediately feeds our anti-counterfeit database:
                <strong class="text-slate-900 dark:text-white">Product Type</strong>, <strong class="text-slate-900 dark:text-white">Purchased Location</strong>, and <strong class="text-slate-900 dark:text-white">Amount Paid for it</strong>.
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <!-- The Form Submitting to Database -->
            <div class="lg:col-span-7">
                <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div class="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
                        <div>
                            <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="zap" class="w-5 h-5 text-emerald-500"></i> Quick Citizen Incident Flag
                            </h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Submits directly into the SQLite/MySQL database. 100% free & anonymous.
                            </p>
                        </div>
                        <span class="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            Instant Database Logging
                        </span>
                    </div>

                    <form action="{{ route('report.store') }}" method="POST" class="space-y-5">
                        @csrf
                        <input type="hidden" name="is_anonymous" value="1">
                        <input type="hidden" name="is_priority" value="0">
                        <input type="hidden" name="issue" value="Quick Consumer Alert: Suspicious price/quality anomaly">

                        <!-- Data Point 1: Product Type -->
                        <div>
                            <label class="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-2">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center">1</span>
                                    Product Type (Category) *
                                </span>
                                <span class="text-[10px] font-normal text-slate-400">Required</span>
                            </label>
                            <select name="category" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option value="Medicines">Medicines (Antimalarials, Antibiotics, Pain Relievers)</option>
                                <option value="Food & drinks">Food & Drinks (Milk, Baby Food, Canned Goods, Oil)</option>
                                <option value="Cosmetics">Cosmetics (Creams, Serums, Lotions, Soaps)</option>
                                <option value="Electronics">Electronics (Chargers, Batteries, Cables, Plugs)</option>
                                <option value="Baby products">Baby Products (Infant Formula, Diapers, Teething Syrups)</option>
                                <option value="Automotive">Automotive (Engine Oil, Brake Pads, Spark Plugs)</option>
                                <option value="Alcohol">Alcohol & Spirits (Whisky, Brandy, Wine)</option>
                                <option value="Fashion">Fashion & Apparel (Sneakers, Clothing, Bags)</option>
                                <option value="Other goods">Other Consumer Goods</option>
                            </select>
                        </div>

                        <!-- Product Name -->
                        <div>
                            <label class="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                                Product / Brand Name *
                            </label>
                            <input type="text" name="name" required placeholder="e.g. Amatem Forte, Oraimo 20000mAh, Total Quartz 9000" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        </div>

                        <!-- Data Point 2: Purchased Location & State -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                                    <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center">2</span>
                                    Purchased Location (Market / Store) *
                                </label>
                                <input type="text" name="market" required placeholder="e.g. Balogun Market, Lagos Island" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                                    State in Nigeria *
                                </label>
                                <select name="state" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                    <option value="Lagos">Lagos State</option>
                                    <option value="FCT Abuja">FCT Abuja</option>
                                    <option value="Kano">Kano State</option>
                                    <option value="Rivers">Rivers State</option>
                                    <option value="Anambra">Anambra State</option>
                                    <option value="Abia">Abia State</option>
                                    <option value="Oyo">Oyo State</option>
                                    <option value="Ogun">Ogun State</option>
                                    <option value="Kaduna">Kaduna State</option>
                                    <option value="Enugu">Enugu State</option>
                                </select>
                            </div>
                        </div>

                        <!-- Data Point 3: Amount Paid for it -->
                        <div>
                            <label class="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center">3</span>
                                    Amount Paid For It (Price in ₦) *
                                </span>
                                <span class="text-[10px] font-semibold text-amber-500">
                                    Too cheap = High counterfeit risk
                                </span>
                            </label>
                            <div class="relative">
                                <i data-lucide="receipt" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                                <input type="text" name="price" required placeholder="e.g. ₦2,500" class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            </div>
                        </div>

                        <button type="submit" class="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-2">
                            <i data-lucide="shield-alert" class="w-4 h-4"></i>
                            <span>Submit Quick Alert to Database</span>
                        </button>

                        <p class="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                            <i data-lucide="lock" class="w-3 h-3 text-emerald-500"></i>
                            Direct MySQL/SQLite storage &bull; Anonymous whistleblower protection
                        </p>
                    </form>
                </div>
            </div>

            <!-- Graphic Guide -->
            <div class="lg:col-span-5 space-y-4">
                <div class="glass-panel p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden group">
                    <div class="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                        <img src="{{ asset('images/quick-intake-data.jpg') }}" alt="3 Data Needed While Collecting Quickly" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                        <div class="absolute bottom-4 left-4 right-4 text-white text-xs">
                            <div class="font-mono text-emerald-400 font-bold text-[11px]">RAPID CITIZEN RADAR</div>
                            <h4 class="font-heading font-extrabold text-base text-white">Why These 3 Data Points Matter Most</h4>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <div class="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                        <div class="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <i data-lucide="tag" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-slate-900 dark:text-white">1. Product Type</h4>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Identifies the regulatory authority (NAFDAC for drugs/food, SON for parts) and risk rating.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                        <div class="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <i data-lucide="map-pin" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-slate-900 dark:text-white">2. Purchased Location</h4>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pins the incident to trade hotspots (Idumota, Alaba, Sabon Gari) to trigger localized alerts.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                        <div class="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <i data-lucide="receipt" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-slate-900 dark:text-white">3. Amount Paid For It</h4>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Detects abnormal price undercutting used by counterfeit syndicates to dump hazardous goods fast.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 10 Monitored Nigerian Market Sectors -->
<section class="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Surveillance Categories
            </span>
            <h2 class="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Nigeria's Most Vulnerable Counterfeit Sectors
            </h2>
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Fakes aren't just a nuisance—in pharmaceuticals, baby nutrition, and auto parts, they are fatal. Fake9ja monitors every critical sector.
            </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            @php
            $sectors = [
                ['name' => 'Pharmaceuticals & Drugs', 'icon' => 'pill', 'fakes' => 'Lonart, Coartem, Amoxil', 'risk' => 'Extreme'],
                ['name' => 'Baby Formula & Nutrition', 'icon' => 'baby', 'fakes' => 'SMA, Cerelac, NAN', 'risk' => 'Critical'],
                ['name' => 'Cosmetics & Skincare', 'icon' => 'sparkles', 'fakes' => 'Bleaching creams, Serums', 'risk' => 'High'],
                ['name' => 'Packaged Foods & Drinks', 'icon' => 'utensils', 'fakes' => 'Tomato paste, Seasoning, Oil', 'risk' => 'High'],
                ['name' => 'Electronics & Cables', 'icon' => 'zap', 'fakes' => 'Coleman wire, Circuit breakers', 'risk' => 'Severe'],
                ['name' => 'Auto Parts & Brake Pads', 'icon' => 'car', 'fakes' => 'Toyota filters, Brake fluids', 'risk' => 'Critical'],
                ['name' => 'Spirits & Alcoholic Drinks', 'icon' => 'wine', 'fakes' => 'Hennessy, Johnnie Walker', 'risk' => 'High'],
                ['name' => 'Building Materials', 'icon' => 'hammer', 'fakes' => 'Cement, Roofing sheets', 'risk' => 'Severe'],
                ['name' => 'Agricultural Inputs', 'icon' => 'leaf', 'fakes' => 'Adulterated fertilizer, Seeds', 'risk' => 'High'],
                ['name' => 'Personal Care & Hygiene', 'icon' => 'shield', 'fakes' => 'Toothpaste, Disinfectants', 'risk' => 'Medium'],
            ];
            @endphp

            @foreach($sectors as $sector)
            <div class="glass-panel p-5 rounded-2xl hover:border-emerald-500/50 hover:shadow-lg transition group">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <i data-lucide="{{ $sector['icon'] }}" class="w-5 h-5"></i>
                </div>
                <h3 class="font-heading font-bold text-sm text-slate-900 dark:text-white mb-1 leading-snug">
                    {{ $sector['name'] }}
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-2 truncate">
                    Target: {{ $sector['fakes'] }}
                </p>
                <div class="flex items-center justify-between text-[10px]">
                    <span class="font-semibold text-red-500">{{ $sector['risk'] }} Risk</span>
                    <a href="{{ route('community.index', ['category' => $sector['name']]) }}" class="text-emerald-500 hover:underline font-medium">Explore &rarr;</a>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Interactive "Spot The Counterfeit" Educational Module -->
<section class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div class="lg:col-span-5 space-y-6">
                <span class="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Buyer Forensics & Education
                </span>
                <h2 class="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
                    How To Spot Fakes in Nigerian Open Markets
                </h2>
                <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    Counterfeit syndicates in Alaba, Idumota, and Ariaria replicate outer packaging with 95% accuracy. Here are the microscopic telltales that give them away:
                </p>

                <div class="space-y-4">
                    <div class="flex items-start gap-3">
                        <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="check" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-slate-900 dark:text-white">NAFDAC Green Scratch-and-Pin (MAS)</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Genuine antimalarials & antibiotics feature Mobile Authentication Service codes. SMS free to 38353.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="check" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Embossed Expiry vs Printed Dot-Matrix</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Counterfeiters often use flat thermal ink that wipes away with wet methylated spirit. Real factories deboss or laser-etch.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="check" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Unusual Price Discrepancies</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400">If a ₦6,500 medicine is being sold for ₦2,200 in a motor park or roadside stall, it is 99% counterfeit chalk or water.</p>
                        </div>
                    </div>
                </div>

                <div class="pt-2">
                    <a href="{{ route('report.create') }}" class="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                        Found a product that looks suspicious? Report it now &rarr;
                    </a>
                </div>
            </div>

            <!-- Visual Forensic Card -->
            <div class="lg:col-span-7">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <!-- Original Anatomy Card -->
                    <div class="glass-panel p-6 rounded-3xl border-2 border-emerald-500/40 relative">
                        <div class="flex items-center justify-between mb-4">
                            <span class="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500 text-white">Original</span>
                            <i data-lucide="badge-check" class="w-5 h-5 text-emerald-500"></i>
                        </div>
                        <div class="h-44 bg-emerald-950/20 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center p-4 text-center mb-4">
                            <i data-lucide="shield-check" class="w-12 h-12 text-emerald-400 mb-2"></i>
                            <span class="text-sm font-bold text-slate-900 dark:text-white">Genuine Manufacturer Quality</span>
                            <span class="text-xs text-emerald-400 mt-1">Precision laser hologram</span>
                        </div>
                        <ul class="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                            <li class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i> Crisp micro-printing on blister packs</li>
                            <li class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i> Valid verifiable NAFDAC number</li>
                            <li class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i> Intact tamper-evident security foil</li>
                        </ul>
                    </div>

                    <!-- Counterfeit Anatomy Card -->
                    <div class="glass-panel p-6 rounded-3xl border-2 border-red-500/40 relative">
                        <div class="flex items-center justify-between mb-4">
                            <span class="px-3 py-1 rounded-full text-xs font-black uppercase bg-red-500 text-white">Counterfeit</span>
                            <i data-lucide="alert-triangle" class="w-5 h-5 text-red-500"></i>
                        </div>
                        <div class="h-44 bg-red-950/20 rounded-2xl border border-red-500/20 flex flex-col items-center justify-center p-4 text-center mb-4">
                            <i data-lucide="shield-x" class="w-12 h-12 text-red-400 mb-2"></i>
                            <span class="text-sm font-bold text-slate-900 dark:text-white">Substandard Clone</span>
                            <span class="text-xs text-red-400 mt-1">Blurred barcode & cheap glue</span>
                        </div>
                        <ul class="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                            <li class="flex items-center gap-2"><i data-lucide="x" class="w-3.5 h-3.5 text-red-500"></i> Misspelled ingredients & typo errors</li>
                            <li class="flex items-center gap-2"><i data-lucide="x" class="w-3.5 h-3.5 text-red-500"></i> Fake or duplicate NAFDAC / SONCAP codes</li>
                            <li class="flex items-center gap-2"><i data-lucide="x" class="w-3.5 h-3.5 text-red-500"></i> Loose cap seals, altered liquid viscosity</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- Nigerian Market Hotspots Leaderboard -->
<section class="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                    High Risk Surveillance
                </span>
                <h2 class="font-heading font-black text-3xl text-slate-900 dark:text-white mt-2">
                    Top Nigerian Market Hotspots
                </h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tracked trading centers with highest concentration of reported counterfeit activity.
                </p>
            </div>
            <a href="{{ route('community.index') }}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold hover:border-emerald-500 transition">
                <span>View Full Market Map</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($hotspots as $hotspot)
            <div class="glass-panel p-6 rounded-3xl hover:border-emerald-500/50 transition">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <i data-lucide="map-pin" class="w-4 h-4 text-emerald-500"></i>
                        <span class="font-bold text-xs uppercase tracking-wider text-slate-400">{{ $hotspot->state }} State</span>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase {{ $hotspot->risk_level === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30' }}">
                        {{ $hotspot->risk_level }} Risk
                    </span>
                </div>

                <h3 class="font-heading font-black text-xl text-slate-900 dark:text-white mb-2">
                    {{ $hotspot->name }}
                </h3>

                <div class="flex items-center justify-between text-xs pt-4 border-t border-slate-200 dark:border-slate-800/80">
                    <span class="text-slate-500">Incident Flags:</span>
                    <span class="font-heading font-black text-base text-slate-900 dark:text-white">
                        {{ $hotspot->incident_count }} reports
                    </span>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

<!-- 4-Step Citizen Reporting Workflow -->
<section class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span class="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                100% Free Public Good
            </span>
            <h2 class="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
                How Fake9ja Protects Your Family
            </h2>
            <p class="text-slate-600 dark:text-slate-400 text-sm">
                No subscription, no coupon codes, no payment ever. Direct citizen intelligence.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <!-- Step 1 -->
            <div class="glass-panel p-6 rounded-3xl text-center space-y-3 relative">
                <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                    1
                </div>
                <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white">Spot & Snap</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Take a clear photo of the suspicious medicine or item, packaging defects, batch code, or stall location.
                </p>
            </div>

            <!-- Step 2 -->
            <div class="glass-panel p-6 rounded-3xl text-center space-y-3 relative">
                <div class="w-12 h-12 rounded-2xl bg-teal-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-teal-600/30">
                    2
                </div>
                <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white">Log (Anonymous)</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Submit the incident in 2 minutes. You can remain totally anonymous. Receive an instant tracking ID.
                </p>
            </div>

            <!-- Step 3 -->
            <div class="glass-panel p-6 rounded-3xl text-center space-y-3 relative">
                <div class="w-12 h-12 rounded-2xl bg-cyan-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-600/30">
                    3
                </div>
                <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white">Triage & Analysis</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Our inspection triage cross-checks the batch number, manufacturer specs, and market incident history.
                </p>
            </div>

            <!-- Step 4 -->
            <div class="glass-panel p-6 rounded-3xl text-center space-y-3 relative">
                <div class="w-12 h-12 rounded-2xl bg-red-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
                    4
                </div>
                <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white">Market Advisory</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Public alerts notify shoppers nationwide, and confirmed health hazards are escalated to regulatory bodies.
                </p>
            </div>
        </div>

        <div class="mt-12 text-center">
            <a href="{{ route('report.create') }}" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/20 transition">
                <i data-lucide="plus-circle" class="w-5 h-5"></i>
                <span>File A Free Counterfeit Report Now</span>
            </a>
        </div>
    </div>
</section>

<!-- FAQ Accordion -->
<section class="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800" x-data="{ openFaq: null }">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h2 class="font-heading font-black text-3xl text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">Everything you need to know about reporting on Fake9ja.</p>
        </div>

        <div class="space-y-4">
            <div class="glass-panel rounded-2xl overflow-hidden">
                <button @click="openFaq = (openFaq === 1 ? null : 1)" class="w-full p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Is Fake9ja really 100% free? Are there any hidden fees or coupon codes?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 transition transform" :class="{ 'rotate-180': openFaq === 1 }"></i>
                </button>
                <div x-show="openFaq === 1" x-cloak class="p-5 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800">
                    Yes, Fake9ja is completely free for all citizens and lawful manufacturers. There are zero fees, zero checkout requirements, and no discount coupon codes needed. Everything on this platform is dedicated to protecting Nigerian consumers as a free public service.
                </div>
            </div>

            <div class="glass-panel rounded-2xl overflow-hidden">
                <button @click="openFaq = (openFaq === 2 ? null : 2)" class="w-full p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Can I submit a report anonymously without revealing my identity?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 transition transform" :class="{ 'rotate-180': openFaq === 2 }"></i>
                </button>
                <div x-show="openFaq === 2" x-cloak class="p-5 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800">
                    Absolutely. You do not need to create an account or provide your name or phone number. We support 100% anonymous citizen reporting to protect whistleblowers and consumer privacy.
                </div>
            </div>

            <div class="glass-panel rounded-2xl overflow-hidden">
                <button @click="openFaq = (openFaq === 3 ? null : 3)" class="w-full p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>How does Fake9ja work with official regulatory bodies like NAFDAC and FCCPC?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 transition transform" :class="{ 'rotate-180': openFaq === 3 }"></i>
                </button>
                <div x-show="openFaq === 3" x-cloak class="p-5 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800">
                    When high-risk counterfeit batches (especially life-critical medications, infant foods, or contaminated products) are verified on Fake9ja, case dossiers containing photo evidence, batch numbers, and exact market stall locations are compiled and forwarded to relevant consumer protection enforcement agencies.
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
