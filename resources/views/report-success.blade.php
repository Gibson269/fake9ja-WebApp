@extends('layouts.app')

@section('title', 'Report Logged Successfully | Fake9ja')

@section('content')
<div class="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
    <div class="glass-panel p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 text-center relative overflow-hidden">
        <!-- Success Badge & Icon -->
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
            <i data-lucide="check-check" class="w-10 h-10"></i>
        </div>

        <span class="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Recorded in Fake9ja Registry
        </span>

        <h1 class="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4 mb-2">
            Incident Successfully Logged!
        </h1>

        <p class="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Thank you for being a vigilant citizen. Your report has been stored in the Fake9ja database and assigned a permanent national reference code.
        </p>

        <!-- Tracking Reference Box -->
        <div class="my-8 p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border-2 border-dashed border-emerald-500/50 max-w-md mx-auto"
             x-data="{ copied: false }">
            <span class="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">Your Tracking Reference Code</span>
            <div class="flex items-center justify-center gap-3">
                <span class="font-heading font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {{ $report->reference_id }}
                </span>
                <button @click="navigator.clipboard.writeText('{{ $report->reference_id }}'); copied = true; setTimeout(() => copied = false, 2500)"
                        class="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                        title="Copy to clipboard">
                    <i data-lucide="copy" class="w-4 h-4" x-show="!copied"></i>
                    <i data-lucide="check" class="w-4 h-4 text-emerald-500" x-show="copied" x-cloak></i>
                </button>
            </div>
            <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block" x-show="copied" x-cloak>
                Copied to clipboard!
            </span>
        </div>

        <!-- Report Dossier Snapshot -->
        <div class="text-left bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5 max-w-md mx-auto mb-8">
            <div class="flex justify-between">
                <span class="text-slate-500">Product:</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ $report->product_name }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">Category:</span>
                <span class="text-slate-700 dark:text-slate-300">{{ $report->category }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">Location:</span>
                <span class="text-slate-700 dark:text-slate-300">{{ $report->state }} &bull; {{ $report->market_address }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">Priority Level:</span>
                <span class="font-semibold {{ $report->is_priority ? 'text-emerald-500' : 'text-slate-500' }}">
                    {{ $report->is_priority ? 'Fast-Track (Free Public Good)' : 'Standard Queue' }}
                </span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">Service Fee:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">₦0.00 (Free)</span>
            </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="{{ route('track.index', ['ref' => $report->reference_id]) }}" 
               class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition">
                <i data-lucide="crosshair" class="w-4 h-4"></i>
                <span>Track Case Progress</span>
            </a>
            <a href="{{ route('community.index') }}" 
               class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition">
                <i data-lucide="radar" class="w-4 h-4 text-emerald-500"></i>
                <span>Browse Market Radar</span>
            </a>
        </div>
    </div>
</div>
@endsection
