@extends('layouts.app')

@section('title', 'Track Case Status | Fake9ja')

@section('content')
<div class="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8 space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            National Case Investigation Pipeline
        </div>
        <h1 class="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Track Incident Investigation
        </h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Enter your EIE-NG reference code to view real-time triage status, forensic review, and regulatory advisory reports.
        </p>
    </div>

    <!-- Search Form -->
    <div class="max-w-xl mx-auto mb-10">
        <form action="{{ route('track.index') }}" method="GET" class="relative flex items-center shadow-lg rounded-2xl">
            <input type="text" name="ref" value="{{ $searchRef }}" placeholder="Enter reference code (e.g. EIE-NG-847291)" required
                   class="w-full pl-12 pr-28 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase font-mono tracking-wider">
            <i data-lucide="crosshair" class="w-5 h-5 text-emerald-500 absolute left-4"></i>
            <button type="submit" class="absolute right-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition">
                Search
            </button>
        </form>
    </div>

    @if($report)
        <!-- Case Details Found -->
        <div class="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
            <!-- Case Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="font-mono text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            {{ $report->reference_id }}
                        </span>
                        <span class="text-xs text-slate-400">Logged {{ $report->created_at ? $report->created_at->format('M d, Y') : 'Recently' }}</span>
                    </div>
                    <h2 class="font-heading font-black text-2xl text-slate-900 dark:text-white mt-2">
                        {{ $report->product_name }}
                    </h2>
                    @if($report->brand)
                        <p class="text-xs text-slate-500 font-medium">Reported Brand: {{ $report->brand }} &bull; Category: {{ $report->category }}</p>
                    @endif
                </div>

                <div class="text-left sm:text-right">
                    @php
                        $statusBadge = match($report->status) {
                            'verified_fake' => ['bg' => 'bg-red-500/20 text-red-500 border-red-500/30', 'label' => 'Verified Counterfeit'],
                            'verified_original' => ['bg' => 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30', 'label' => 'Verified Genuine'],
                            'escalated' => ['bg' => 'bg-purple-500/20 text-purple-400 border-purple-500/30', 'label' => 'Escalated to NAFDAC/FCCPC'],
                            'under_review' => ['bg' => 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', 'label' => 'Forensic Review'],
                            default => ['bg' => 'bg-amber-500/20 text-amber-400 border-amber-500/30', 'label' => 'Incident Received']
                        };
                    @endphp
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border {{ $statusBadge['bg'] }}">
                        <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        {{ $statusBadge['label'] }}
                    </span>
                    <span class="text-[11px] text-slate-400 block mt-1">100% Free Public Verification</span>
                </div>
            </div>

            <!-- Dynamic 4-Stage Status Pipeline -->
            @php
                $stages = [
                    ['title' => 'Incident Logged', 'desc' => 'Logged into Fake9ja registry', 'completed' => true],
                    ['title' => 'Forensic Triage', 'desc' => 'Batch & packaging comparison', 'completed' => in_array($report->status, ['under_review', 'verified_fake', 'verified_original', 'escalated'])],
                    ['title' => 'Lab / Regulatory Cross-Check', 'desc' => 'NAFDAC/SON coordination', 'completed' => in_array($report->status, ['verified_fake', 'verified_original', 'escalated'])],
                    ['title' => 'Final Determination', 'desc' => 'Public market advisory bulletin', 'completed' => in_array($report->status, ['verified_fake', 'verified_original', 'escalated'])],
                ];
            @endphp
            <div>
                <h3 class="font-heading font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                    Investigation Progression
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    @foreach($stages as $idx => $st)
                    <div class="p-4 rounded-2xl border transition {{ $st['completed'] ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200' : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60' }}">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center {{ $st['completed'] ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600' }}">
                                {{ $idx + 1 }}
                            </span>
                            <span class="font-bold text-xs text-slate-900 dark:text-white">{{ $st['title'] }}</span>
                        </div>
                        <p class="text-[11px] leading-tight text-slate-500 dark:text-slate-400">{{ $st['desc'] }}</p>
                    </div>
                    @endforeach
                </div>
            </div>

            <!-- Case Dossier Details -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span class="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px]">Purchase Location</span>
                    <p class="text-slate-900 dark:text-white font-medium">{{ $report->state }} State</p>
                    <p class="text-slate-500">{{ $report->market_address }}</p>
                    @if($report->purchase_price)
                        <p class="text-slate-500 pt-1">Price Paid: <span class="font-semibold text-slate-900 dark:text-white">{{ $report->purchase_price }}</span></p>
                    @endif
                </div>

                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span class="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px]">Reported Flaw</span>
                    <p class="text-slate-900 dark:text-white font-medium">{{ $report->issue_type }}</p>
                    <p class="text-slate-500">{{ $report->details ?: 'No additional notes provided by whistleblower.' }}</p>
                </div>
            </div>

            <!-- Inspector Notes if available -->
            @if($report->reviewer_note)
            <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <span class="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-500"></i>
                    Official Inspector Note
                </span>
                <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {{ $report->reviewer_note }}
                </p>
            </div>
            @endif

            <!-- Photos & Media Evidence -->
            @if($report->media->count() > 0)
            <div>
                <h3 class="font-heading font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Attached Evidence Photos ({{ $report->media->count() }})
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @foreach($report->media as $media)
                        <a href="{{ asset('storage/' . $media->file_path) }}" target="_blank" class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 block hover:opacity-90 transition">
                            @if($media->file_type === 'video')
                                <div class="h-32 bg-slate-900 flex items-center justify-center text-emerald-400">
                                    <i data-lucide="video" class="w-8 h-8"></i>
                                </div>
                            @else
                                <img src="{{ asset('storage/' . $media->file_path) }}" alt="Evidence Photo" class="h-32 w-full object-cover">
                            @endif
                        </a>
                    @endforeach
                </div>
            </div>
            @endif
        </div>
    @elseif($searched)
        <div class="glass-panel p-12 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
            <i data-lucide="file-question" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
            <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white">Reference ID Not Found</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No case matches <strong class="text-slate-700 dark:text-slate-300 font-mono">{{ $searchRef }}</strong>. Check for typing errors or verify your reference format (e.g. EIE-NG-XXXXXX).
            </p>
        </div>
    @else
        <!-- No search yet: Help / Sample view -->
        <div class="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <i data-lucide="info" class="w-10 h-10 text-emerald-500 mx-auto"></i>
            <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white">How Case Tracking Operates</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                When any citizen files a counterfeit report on Fake9ja, a 6-digit reference code is immediately generated. You can check this code anytime from any device to see if laboratory or regulatory action has commenced.
            </p>
            <div class="pt-2">
                <a href="{{ route('community.index') }}" class="text-xs text-emerald-500 hover:underline font-bold">
                    View active community cases on Incident Radar &rarr;
                </a>
            </div>
        </div>
    @endif
</div>
@endsection
