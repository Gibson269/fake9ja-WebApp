@extends('layouts.app')

@section('title', 'Brand Sentinel (100% Free Brand Protection) | Fake9ja')

@section('content')
<div class="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12 space-y-3">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Free Manufacturer Protection &bull; Zero Fees
        </div>
        <h1 class="font-heading font-black text-3xl sm:text-5xl text-slate-900 dark:text-white">
            Fake9ja Brand Sentinel
        </h1>
        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Protect your brand's reputation and consumer trust across Nigerian markets. Register your brand for automatic counterfeit alert dispatches at zero cost.
        </p>
    </div>

    <!-- Free Benefits Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <i data-lucide="bell-ring" class="w-5 h-5"></i>
            </div>
            <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white">Instant Incident Alerts</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Receive instant email dispatch whenever a citizen logs a suspected clone or adulterated batch bearing your brand name.
            </p>
        </div>

        <div class="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                <i data-lucide="map-pinned" class="w-5 h-5"></i>
            </div>
            <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white">Market Cluster Intelligence</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                See exactly which Nigerian wholesale markets (Alaba, Ariaria, Idumota, Onitsha) counterfeiters are distributing your products in.
            </p>
        </div>

        <div class="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <i data-lucide="scale" class="w-5 h-5"></i>
            </div>
            <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white">Regulatory Evidentiary Packs</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Receive organized dossiers with photographic packaging discrepancies ready for NAFDAC and FCCPC enforcement raids.
            </p>
        </div>
    </div>

    <!-- Registration Form (100% FREE) -->
    <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl max-w-3xl mx-auto">
        <div class="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 flex items-center justify-between">
            <div>
                <h2 class="font-heading font-black text-2xl text-slate-900 dark:text-white">Free Brand Registration</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Enroll your company in the national surveillance directory.</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                100% Free
            </span>
        </div>

        <form action="{{ route('brand-protection.store') }}" method="POST" class="space-y-6">
            @csrf

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Brand Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="brand_name" required placeholder="e.g. Dangote, Emzor, Dufil"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Registered Company Entity
                    </label>
                    <input type="text" name="company_name" placeholder="e.g. Emzor Pharmaceuticals Ltd"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Official Legal / Brand Protection Email <span class="text-red-500">*</span>
                    </label>
                    <input type="email" name="email" required placeholder="brandprotection@yourcompany.com"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Direct Phone / WhatsApp
                    </label>
                    <input type="text" name="phone" placeholder="+234 800 XXX XXXX"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    High-Risk SKUs to Monitor
                </label>
                <textarea name="monitored_skus" rows="3" placeholder="List specific product lines, dosages, or packaging sizes most frequently cloned (or leave blank to monitor all products under brand)."
                          class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
            </div>

            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-500 shrink-0"></i>
                <div>
                    <strong class="font-bold">Zero Cost Commitment:</strong> Fake9ja is a free public infrastructure. There are no registration fees, monthly subscription charges, or renewal fees for verified manufacturers.
                </div>
            </div>

            <div class="pt-2">
                <button type="submit" class="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>Activate Free Brand Sentinel</span>
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
