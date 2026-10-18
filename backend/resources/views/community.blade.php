@extends('layouts.app')

@section('title', 'Community Incident Radar | Fake9ja')

@section('content')
<div class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" x-data="{ selectedReport: null }">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Real-Time Citizen Intelligence Radar
            </div>
            <h1 class="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Public Counterfeit Directory
            </h1>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Browse verified counterfeit reports and ongoing investigations across Nigerian markets.
            </p>
        </div>

        <a href="{{ route('report.create') }}" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition self-start md:self-auto">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Log New Fake (Free)</span>
        </a>
    </div>

    <!-- Filter Bar -->
    <div class="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 mb-8 shadow-sm">
        <form action="{{ route('community.index') }}" method="GET" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            <!-- Search Text -->
            <div class="lg:col-span-4 relative">
                <input type="text" name="search" value="{{ $searchQuery }}" placeholder="Search product, brand, or market..."
                       class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
            </div>

            <!-- State Filter -->
            <div class="lg:col-span-3">
                <select name="state" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    <option value="All" {{ $selectedState === 'All' ? 'selected' : '' }}>All States</option>
                    @php
                    $allStates = [
                        'Abia', 'Abuja (FCT)', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
                        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
                        'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
                        'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
                    ];
                    @endphp
                    @foreach($allStates as $s)
                        <option value="{{ $s }}" {{ $selectedState === $s ? 'selected' : '' }}>{{ $s }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Category Filter -->
            <div class="lg:col-span-3">
                <select name="category" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    <option value="All" {{ $selectedCategory === 'All' ? 'selected' : '' }}>All Categories</option>
                    <option value="Pharmaceuticals" {{ str_contains($selectedCategory, 'Pharmaceutical') ? 'selected' : '' }}>Pharmaceuticals & Drugs</option>
                    <option value="Baby Formula" {{ str_contains($selectedCategory, 'Baby') ? 'selected' : '' }}>Baby Formula & Nutrition</option>
                    <option value="Cosmetics" {{ str_contains($selectedCategory, 'Cosmetic') ? 'selected' : '' }}>Cosmetics & Skincare</option>
                    <option value="Food" {{ str_contains($selectedCategory, 'Food') ? 'selected' : '' }}>Packaged Foods & Drinks</option>
                    <option value="Electronics" {{ str_contains($selectedCategory, 'Electronic') ? 'selected' : '' }}>Electronics & Cables</option>
                    <option value="Auto" {{ str_contains($selectedCategory, 'Auto') ? 'selected' : '' }}>Auto Parts & Brake Pads</option>
                    <option value="Spirits" {{ str_contains($selectedCategory, 'Spirit') ? 'selected' : '' }}>Spirits & Alcoholic Drinks</option>
                    <option value="Building" {{ str_contains($selectedCategory, 'Building') ? 'selected' : '' }}>Building Materials</option>
                </select>
            </div>

            <!-- Filter Buttons -->
            <div class="lg:col-span-2 flex items-center gap-2">
                <button type="submit" class="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white font-bold text-xs transition">
                    Filter
                </button>
                <a href="{{ route('community.index') }}" class="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Clear Filters">
                    Reset
                </a>
            </div>
        </form>
    </div>

    <!-- Main Grid of Reports -->
    @if($reports->count() > 0)
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($reports as $report)
            <div class="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl transition flex flex-col justify-between group">
                <div>
                    <!-- Evidence Photo Banner -->
                    @php
                        $firstMedia = $report->media->first();
                        $mediaUrl = $firstMedia ? asset('storage/' . $firstMedia->file_path) : (
                            str_contains(strtolower($report->category), 'med') || str_contains(strtolower($report->category), 'pharm') ? asset('images/counterfeit-malaria.jpg') :
                            (str_contains(strtolower($report->category), 'cosmetic') || str_contains(strtolower($report->category), 'skin') ? asset('images/counterfeit-cosmetics.jpg') :
                            (str_contains(strtolower($report->category), 'auto') || str_contains(strtolower($report->category), 'oil') ? asset('images/counterfeit-oil.jpg') :
                            asset('images/consumer-vigilance.jpg')))
                        );
                    @endphp
                    <div class="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <img src="{{ $mediaUrl }}" alt="{{ $report->product_name }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                        @if($report->purchase_price)
                            <span class="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-white border border-white/20">
                                {{ $report->purchase_price }}
                            </span>
                        @endif
                        @if($report->media->count() > 1)
                            <span class="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-mono text-white border border-white/20 flex items-center gap-1">
                                <i data-lucide="camera" class="w-3 h-3 text-emerald-400"></i> +{{ $report->media->count() }}
                            </span>
                        @endif
                    </div>

                    <!-- Top Card Status & Category -->
                    <div class="flex items-center justify-between gap-2 mb-3">
                        <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 truncate">
                            {{ $report->category }}
                        </span>
                        
                        @php
                            $statusBadge = match($report->status) {
                                'verified_fake' => ['bg' => 'bg-red-500/10 text-red-500 border-red-500/30', 'label' => 'Verified Fake'],
                                'verified_original' => ['bg' => 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', 'label' => 'Genuine / Cleared'],
                                'escalated' => ['bg' => 'bg-purple-500/10 text-purple-500 border-purple-500/30', 'label' => 'Escalated to NAFDAC'],
                                'under_review' => ['bg' => 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30', 'label' => 'Under Review'],
                                default => ['bg' => 'bg-amber-500/10 text-amber-500 border-amber-500/30', 'label' => 'Received']
                            };
                        @endphp
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border {{ $statusBadge['bg'] }} shrink-0">
                            {{ $statusBadge['label'] }}
                        </span>
                    </div>

                    <!-- Product Name & Brand -->
                    <h3 class="font-heading font-black text-lg text-slate-900 dark:text-white leading-snug mb-1">
                        {{ $report->product_name }}
                    </h3>
                    @if($report->brand)
                        <p class="text-xs text-slate-400 font-medium mb-3">Brand: {{ $report->brand }}</p>
                    @endif

                    <!-- Location & Market -->
                    <div class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 mb-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <i data-lucide="map-pin" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                        <div class="truncate">
                            <span class="font-bold text-slate-900 dark:text-white">{{ $report->state }}:</span>
                            <span class="truncate block">{{ $report->market_address }}</span>
                        </div>
                    </div>

                    <!-- Defect Summary -->
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        <strong class="text-slate-700 dark:text-slate-300">Observed Defect:</strong> {{ $report->issue_type }}. {{ $report->details }}
                    </p>
                </div>

                <!-- Footer Card Info -->
                <div class="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span class="text-slate-400 font-mono text-[11px]">{{ $report->reference_id }}</span>
                    <a href="{{ route('track.index', ['ref' => $report->reference_id]) }}" class="text-emerald-500 hover:text-emerald-600 font-bold flex items-center gap-1">
                        <span>Details</span>
                        <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                    </a>
                </div>
            </div>
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="mt-10">
            {{ $reports->links() }}
        </div>
    @else
        <div class="glass-panel p-12 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
            <i data-lucide="inbox" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
            <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white">No reports match your filters</h3>
            <p class="text-xs text-slate-500 mt-1">Try resetting your state, category, or search term to see more reports.</p>
            <div class="mt-4">
                <a href="{{ route('community.index') }}" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Clear Filters</a>
            </div>
        </div>
    @endif
</div>
@endsection
