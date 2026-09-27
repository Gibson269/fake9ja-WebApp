@extends('layouts.admin')

@section('title', 'Chief Inspector Command Desk | Fake9ja')

@section('content')
<div x-data="{
    addModalOpen: false,
    detailModalOpen: false,
    activeTab: 'dossier',
    activeReport: null,
    zoomImage: null,
    previewAddImages: [],
    previewUpdateImages: [],

    openDetails(report, tab = 'dossier') {
        this.activeReport = report;
        this.activeTab = tab;
        this.detailModalOpen = true;
        this.previewUpdateImages = [];
        $nextTick(() => {
            if (window.lucide) window.lucide.createIcons();
        });
    },

    closeDetails() {
        this.detailModalOpen = false;
        this.activeReport = null;
        this.previewUpdateImages = [];
    },

    openAddModal() {
        this.addModalOpen = true;
        this.previewAddImages = [];
        $nextTick(() => {
            if (window.lucide) window.lucide.createIcons();
        });
    },

    handleAddFileChange(event) {
        const files = Array.from(event.target.files);
        this.previewAddImages = files.map(file => ({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            url: URL.createObjectURL(file),
            type: file.type
        }));
    },

    handleUpdateFileChange(event) {
        const files = Array.from(event.target.files);
        this.previewUpdateImages = files.map(file => ({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            url: URL.createObjectURL(file),
            type: file.type
        }));
    },

    getStatusBadge(status) {
        switch(status) {
            case 'verified_fake':
                return { label: 'Verified Counterfeit', bg: 'bg-red-500/20 text-red-400 border-red-500/40', dot: 'bg-red-500' };
            case 'verified_original':
                return { label: 'Verified Genuine', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dot: 'bg-emerald-500' };
            case 'escalated':
                return { label: 'Escalated to NAFDAC', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/40', dot: 'bg-purple-500' };
            case 'under_review':
                return { label: 'Under Forensic Review', bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40', dot: 'bg-cyan-500' };
            default:
                return { label: 'Pending Triage', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', dot: 'bg-amber-500' };
        }
    }
}" 
@open-add-product-modal.window="openAddModal()"
class="space-y-6">

    <!-- Top Dashboard Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Inspection & Forensic Triage Command Desk
            </div>
            <h1 class="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                Inspector Command Overview
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage citizen dossiers, register verified or suspicious products with packaging evidence, and determine registry verdicts.
            </p>
        </div>

        <div class="flex items-center gap-3">
            <button type="button" @click="openAddModal()"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition transform active:scale-95">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Add New Product / Incident</span>
            </button>
        </div>
    </div>

    <!-- Executive Stats Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <!-- Total -->
        <a href="{{ route('admin.index') }}" 
           class="glass-panel p-4 rounded-2xl border transition hover:border-slate-400 dark:hover:border-slate-700 group {{ !request()->has('status') || request('status') === 'all' ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-800' }}">
            <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Dossiers</span>
                <i data-lucide="layers" class="w-4 h-4 text-slate-400 group-hover:text-slate-200"></i>
            </div>
            <span class="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">{{ $stats['total'] }}</span>
            <span class="text-[10px] text-slate-500 block mt-1">All submissions</span>
        </a>

        <!-- Pending -->
        <a href="{{ route('admin.index', ['status' => 'received']) }}" 
           class="glass-panel p-4 rounded-2xl border transition hover:border-amber-400/60 group {{ request('status') === 'received' ? 'border-amber-500/60 ring-1 ring-amber-500/30' : 'border-slate-200 dark:border-slate-800' }}">
            <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider text-amber-500">Pending Triage</span>
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            </div>
            <span class="font-heading font-black text-2xl sm:text-3xl text-amber-500">{{ $stats['pending'] }}</span>
            <span class="text-[10px] text-slate-500 block mt-1">Awaiting review</span>
        </a>

        <!-- Under Review -->
        <a href="{{ route('admin.index', ['status' => 'under_review']) }}" 
           class="glass-panel p-4 rounded-2xl border transition hover:border-cyan-400/60 group {{ request('status') === 'under_review' ? 'border-cyan-500/60 ring-1 ring-cyan-500/30' : 'border-slate-200 dark:border-slate-800' }}">
            <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider text-cyan-500">Forensics</span>
                <i data-lucide="flask-conical" class="w-4 h-4 text-cyan-400"></i>
            </div>
            <span class="font-heading font-black text-2xl sm:text-3xl text-cyan-500">{{ $stats['under_review'] }}</span>
            <span class="text-[10px] text-slate-500 block mt-1">In active analysis</span>
        </a>

        <!-- Confirmed Fakes -->
        <a href="{{ route('admin.index', ['status' => 'verified_fake']) }}" 
           class="glass-panel p-4 rounded-2xl border transition hover:border-red-400/60 group {{ request('status') === 'verified_fake' ? 'border-red-500/60 ring-1 ring-red-500/30' : 'border-slate-200 dark:border-slate-800' }}">
            <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider text-red-500">Confirmed Fakes</span>
                <i data-lucide="shield-alert" class="w-4 h-4 text-red-400"></i>
            </div>
            <span class="font-heading font-black text-2xl sm:text-3xl text-red-500">{{ $stats['verified_fake'] }}</span>
            <span class="text-[10px] text-slate-500 block mt-1">Publicly flagged</span>
        </a>

        <!-- Verified Genuine -->
        <a href="{{ route('admin.index', ['status' => 'verified_original']) }}" 
           class="glass-panel p-4 rounded-2xl border transition hover:border-emerald-400/60 group {{ request('status') === 'verified_original' ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-800' }}">
            <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Genuine Cleared</span>
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
            </div>
            <span class="font-heading font-black text-2xl sm:text-3xl text-emerald-500">{{ $stats['verified_original'] }}</span>
            <span class="text-[10px] text-slate-500 block mt-1">Authentic certified</span>
        </a>

        <!-- Escalated -->
        <a href="{{ route('admin.index', ['status' => 'escalated']) }}" 
           class="glass-panel p-4 rounded-2xl border transition hover:border-purple-400/60 group {{ request('status') === 'escalated' ? 'border-purple-500/60 ring-1 ring-purple-500/30' : 'border-slate-200 dark:border-slate-800' }}">
            <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider text-purple-500">Escalated</span>
                <i data-lucide="siren" class="w-4 h-4 text-purple-400"></i>
            </div>
            <span class="font-heading font-black text-2xl sm:text-3xl text-purple-500">{{ $stats['escalated'] }}</span>
            <span class="text-[10px] text-slate-500 block mt-1">NAFDAC / FCCPC</span>
        </a>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <!-- Status Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            @php
                $statusTabs = [
                    'all' => ['label' => 'All Dossiers', 'count' => $stats['total']],
                    'received' => ['label' => 'Pending Queue', 'count' => $stats['pending']],
                    'under_review' => ['label' => 'Under Review', 'count' => $stats['under_review']],
                    'verified_fake' => ['label' => 'Verified Fakes', 'count' => $stats['verified_fake']],
                    'verified_original' => ['label' => 'Verified Genuine', 'count' => $stats['verified_original']],
                    'escalated' => ['label' => 'Escalated Cases', 'count' => $stats['escalated']],
                ];
            @endphp
            @foreach($statusTabs as $k => $info)
                <a href="{{ route('admin.index', array_merge(request()->query(), ['status' => $k, 'page' => 1])) }}"
                   class="px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 {{ ($status === $k) || ($k === 'all' && empty($status)) ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' }}">
                    <span>{{ $info['label'] }}</span>
                    <span class="px-1.5 py-0.2 rounded-full text-[10px] {{ ($status === $k) || ($k === 'all' && empty($status)) ? 'bg-white/25 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300' }}">
                        {{ $info['count'] }}
                    </span>
                </a>
            @endforeach
        </div>

        <!-- Search & Filter Form -->
        <form action="{{ route('admin.index') }}" method="GET" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            @if(request()->filled('status'))
                <input type="hidden" name="status" value="{{ request('status') }}">
            @endif

            <!-- Search input -->
            <div class="lg:col-span-2 relative">
                <input type="text" name="search" value="{{ $search }}"
                       placeholder="Search by product name, ref ID, brand, location..."
                       class="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
            </div>

            <!-- Category filter -->
            <div>
                <select name="category" onchange="this.form.submit()"
                        class="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500">
                    <option value="all">All Categories</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat }}" {{ $category === $cat ? 'selected' : '' }}>{{ $cat }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Risk filter -->
            <div>
                <select name="risk_level" onchange="this.form.submit()"
                        class="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500">
                    <option value="all">All Risk Levels</option>
                    <option value="high" {{ $risk === 'high' ? 'selected' : '' }}>High Risk</option>
                    <option value="medium" {{ $risk === 'medium' ? 'selected' : '' }}>Medium Risk</option>
                    <option value="low" {{ $risk === 'low' ? 'selected' : '' }}>Low Risk</option>
                </select>
            </div>

            <!-- Submit & Reset -->
            <div class="flex items-center gap-2">
                <button type="submit" class="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5">
                    <i data-lucide="filter" class="w-3.5 h-3.5"></i>
                    <span>Filter</span>
                </button>
                @if(!empty($search) || $category !== 'all' || $risk !== 'all' || (request()->filled('status') && request('status') !== 'all'))
                    <a href="{{ route('admin.index') }}" class="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition" title="Clear Filters">
                        <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Products / Cases Table -->
    <div class="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
                <h2 class="font-heading font-black text-base text-slate-900 dark:text-white">
                    Product Incident Registry
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                    Showing {{ $reports->firstItem() ?? 0 }} - {{ $reports->lastItem() ?? 0 }} of {{ $reports->total() }} dossiers
                </p>
            </div>

            <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-slate-400">Page {{ $reports->currentPage() }} of {{ $reports->lastPage() ?: 1 }}</span>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                        <th class="py-3.5 px-5">Reference & Date</th>
                        <th class="py-3.5 px-5">Product & Category</th>
                        <th class="py-3.5 px-5">Evidence</th>
                        <th class="py-3.5 px-5">Market Location</th>
                        <th class="py-3.5 px-5">Risk</th>
                        <th class="py-3.5 px-5">Status</th>
                        <th class="py-3.5 px-5 text-right">Inspector Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                    @forelse($reports as $r)
                    <!-- Hidden JSON data script to safely pass report to Alpine -->
                    <script id="report-data-{{ $r->id }}" type="application/json">
                        {!! json_encode($r) !!}
                    </script>

                    <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <!-- Ref & Date -->
                        <td class="py-3.5 px-5">
                            <span class="font-mono font-bold text-slate-900 dark:text-white block">{{ $r->reference_id }}</span>
                            <span class="text-[11px] text-slate-400">{{ $r->created_at ? $r->created_at->diffForHumans() : 'Recently' }}</span>
                        </td>

                        <!-- Product & Category -->
                        <td class="py-3.5 px-5 max-w-xs">
                            <button type="button" 
                                    @click="openDetails(JSON.parse(document.getElementById('report-data-{{ $r->id }}').textContent))"
                                    class="text-left font-bold text-slate-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition line-clamp-1">
                                {{ $r->product_name }}
                            </button>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{{ $r->category }}</span>
                                @if($r->brand)
                                    <span class="text-slate-400">&bull;</span>
                                    <span class="text-[11px] text-slate-400 truncate">{{ $r->brand }}</span>
                                @endif
                            </div>
                        </td>

                        <!-- Evidence Thumbnail count -->
                        <td class="py-3.5 px-5">
                            @if($r->media && $r->media->count() > 0)
                                <button type="button"
                                        @click="openDetails(JSON.parse(document.getElementById('report-data-{{ $r->id }}').textContent), 'dossier')"
                                        class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:border-emerald-500 border border-transparent transition"
                                        title="View attached evidence photos">
                                    <i data-lucide="image" class="w-3.5 h-3.5 text-emerald-500"></i>
                                    <span>{{ $r->media->count() }} photo{{ $r->media->count() > 1 ? 's' : '' }}</span>
                                </button>
                            @else
                                <span class="text-[11px] text-slate-400 italic">No media</span>
                            @endif
                        </td>

                        <!-- Location -->
                        <td class="py-3.5 px-5">
                            <span class="font-semibold text-slate-800 dark:text-slate-200 block">{{ $r->state }}</span>
                            <span class="text-[11px] text-slate-400 line-clamp-1">{{ $r->market_address }}</span>
                        </td>

                        <!-- Risk / Priority -->
                        <td class="py-3.5 px-5">
                            <div class="flex items-center gap-1.5">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase {{ $r->risk_level === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ($r->risk_level === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30') }}">
                                    {{ $r->risk_level }}
                                </span>
                                @if($r->is_priority)
                                    <span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500 text-white" title="Fast-Track High Hazard">
                                        PRIORITY
                                    </span>
                                @endif
                            </div>
                        </td>

                        <!-- Current Status -->
                        <td class="py-3.5 px-5">
                            @php
                                $badge = match($r->status) {
                                    'verified_fake' => ['bg' => 'bg-red-500/10 text-red-500 border-red-500/30', 'label' => 'Verified Fake', 'dot' => 'bg-red-500'],
                                    'verified_original' => ['bg' => 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', 'label' => 'Genuine', 'dot' => 'bg-emerald-500'],
                                    'escalated' => ['bg' => 'bg-purple-500/10 text-purple-400 border-purple-500/30', 'label' => 'Escalated', 'dot' => 'bg-purple-500'],
                                    'under_review' => ['bg' => 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', 'label' => 'Reviewing', 'dot' => 'bg-cyan-500'],
                                    default => ['bg' => 'bg-amber-500/10 text-amber-500 border-amber-500/30', 'label' => 'Pending', 'dot' => 'bg-amber-500']
                                };
                            @endphp
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border {{ $badge['bg'] }}">
                                <span class="w-1.5 h-1.5 rounded-full {{ $badge['dot'] }}"></span>
                                <span>{{ $badge['label'] }}</span>
                            </span>
                        </td>

                        <!-- Fast Action Verdict Buttons & View Details Button -->
                        <td class="py-3.5 px-5 text-right whitespace-nowrap">
                            <div class="flex items-center justify-end gap-1.5">
                                <!-- VIEW & MODIFY DETAILS BUTTON: DOES NOT OPEN A NEW TAB! -->
                                <button type="button" 
                                        @click="openDetails(JSON.parse(document.getElementById('report-data-{{ $r->id }}').textContent))"
                                        class="px-2.5 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                                        title="View Details & Modify Case">
                                    <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                                    <span>Details & Edit</span>
                                </button>

                                <!-- Fast-Action: Verify Fake -->
                                <form action="{{ route('admin.reports.status', $r->id) }}" method="POST" class="inline">
                                    @csrf
                                    <input type="hidden" name="status" value="verified_fake">
                                    <input type="hidden" name="reviewer_note" value="Packaging discrepancies confirmed. High counterfeit signature.">
                                    <button type="submit" 
                                            class="px-2 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition {{ $r->status === 'verified_fake' ? 'opacity-40 pointer-events-none' : '' }}" 
                                            title="Quick Mark: Verified Fake">
                                        Fake
                                    </button>
                                </form>

                                <!-- Fast-Action: Verify Original -->
                                <form action="{{ route('admin.reports.status', $r->id) }}" method="POST" class="inline">
                                    @csrf
                                    <input type="hidden" name="status" value="verified_original">
                                    <input type="hidden" name="reviewer_note" value="Verified with manufacturer authorized batch records. Authentic.">
                                    <button type="submit" 
                                            class="px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition {{ $r->status === 'verified_original' ? 'opacity-40 pointer-events-none' : '' }}" 
                                            title="Quick Mark: Genuine">
                                        Genuine
                                    </button>
                                </form>

                                <!-- Fast-Action: Escalate -->
                                <form action="{{ route('admin.reports.status', $r->id) }}" method="POST" class="inline">
                                    @csrf
                                    <input type="hidden" name="status" value="escalated">
                                    <input type="hidden" name="reviewer_note" value="High public health hazard flagged. Forwarded to regulatory desk.">
                                    <button type="submit" 
                                            class="px-2 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] transition {{ $r->status === 'escalated' ? 'opacity-40 pointer-events-none' : '' }}" 
                                            title="Quick Mark: Escalate to NAFDAC">
                                        Escalate
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="py-12 text-center text-slate-400">
                            <div class="max-w-sm mx-auto space-y-3">
                                <i data-lucide="package-search" class="w-10 h-10 text-slate-500 mx-auto"></i>
                                <h3 class="font-heading font-bold text-sm text-slate-800 dark:text-slate-200">No Dossiers Found</h3>
                                <p class="text-xs text-slate-500">There are no product reports matching your current filter criteria.</p>
                                <button type="button" @click="openAddModal()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-1.5">
                                    <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                                    <span>Add First Product</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination Bar -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            {{ $reports->links() }}
        </div>
    </div>


    <!-- ========================================================================= -->
    <!-- MODAL 1: ADD NEW PRODUCT / INCIDENT (WITH EVIDENCE IMAGE UPLOADS) -->
    <!-- ========================================================================= -->
    <div x-show="addModalOpen" x-cloak 
         class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
         @keydown.escape.window="addModalOpen = false">
        
        <div class="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
             @click.away="addModalOpen = false">
            
            <!-- Modal Header -->
            <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/50 dark:bg-slate-900/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                        <i data-lucide="shield-plus" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h2 class="font-heading font-black text-lg text-slate-900 dark:text-white">
                            Add New Product / Incident Dossier
                        </h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                            Upload evidence photos, set market intelligence, and determine initial triage status.
                        </p>
                    </div>
                </div>

                <button @click="addModalOpen = false" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Modal Form -->
            <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data" class="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
                @csrf

                <!-- Basic Product Information -->
                <div class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Product Name <span class="text-red-500">*</span>
                            </label>
                            <input type="text" name="product_name" required placeholder="e.g. Lonart DS Tablets 80/480mg"
                                   class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        </div>

                        <div>
                            <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Brand / Purported Manufacturer
                            </label>
                            <input type="text" name="brand" placeholder="e.g. Bliss GVS Pharma Ltd"
                                   class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Category <span class="text-red-500">*</span>
                            </label>
                            <select name="category" required
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                <option value="">Select Category</option>
                                @foreach($categories as $cat)
                                    <option value="{{ $cat }}">{{ $cat }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Purchase Price (if applicable)
                            </label>
                            <input type="text" name="purchase_price" placeholder="e.g. ₦3,500"
                                   class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        </div>
                    </div>
                </div>

                <!-- Market & Location Information -->
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                    <span class="font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        Market Location & Geotag
                    </span>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Nigerian State <span class="text-red-500">*</span>
                            </label>
                            <select name="state" required
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                <option value="">Select State</option>
                                @foreach($states as $st)
                                    <option value="{{ $st }}">{{ $st }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Market Address / Stall Line <span class="text-red-500">*</span>
                            </label>
                            <input type="text" name="market_address" required placeholder="e.g. Head Bridge Market, Drug Line 4, Onitsha"
                                   class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        </div>
                    </div>
                </div>

                <!-- Defect & Status Determinations -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Counterfeit Defect Observed <span class="text-red-500">*</span>
                        </label>
                        <select name="issue_type" required
                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="">Select Flaw Type</option>
                            @foreach($defects as $df)
                                <option value="{{ $df }}">{{ $df }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Status Determination <span class="text-red-500">*</span>
                        </label>
                        <select name="status" required
                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="verified_fake" selected>Verified Fake (Confirmed Counterfeit)</option>
                            <option value="under_review">Under Review (Active Forensics)</option>
                            <option value="received">Received (Pending Queue)</option>
                            <option value="verified_original">Verified Genuine (Certified Authentic)</option>
                            <option value="escalated">Escalated to NAFDAC/FCCPC</option>
                        </select>
                    </div>

                    <div>
                        <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Risk Level <span class="text-red-500">*</span>
                        </label>
                        <select name="risk_level" required
                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="high" selected>High (Direct Health/Safety Risk)</option>
                            <option value="medium">Medium (Economic/Quality Hazard)</option>
                            <option value="low">Low (Minor Non-compliance)</option>
                        </select>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <input type="checkbox" name="is_priority" id="add_is_priority" value="1" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                    <label for="add_is_priority" class="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                        Mark as High Hazard Priority Case (Fast-Tracked on radar)
                    </label>
                </div>

                <!-- Text Details -->
                <div class="space-y-4">
                    <div>
                        <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Inspection & Incident Description
                        </label>
                        <textarea name="details" rows="3" placeholder="Explain the counterfeit signature, batch anomalies, chemical discrepancies, or whistleblower experience..."
                                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
                    </div>

                    <div>
                        <label class="block font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
                            Official Chief Inspector Reviewer Note / Advisory
                        </label>
                        <textarea name="reviewer_note" rows="2" placeholder="Official Lab verdict or market advisory bulletin..."
                                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
                    </div>
                </div>

                <!-- MULTI-IMAGE EVIDENCE UPLOAD -->
                <div class="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <i data-lucide="image" class="w-4 h-4"></i>
                            Attach Evidence Images / Packaging Photos
                        </span>
                        <span class="text-[10px] text-slate-400">JPG, PNG, WEBP (Max 20MB)</span>
                    </div>

                    <input type="file" name="evidence[]" multiple accept="image/*,video/*"
                           @change="handleAddFileChange($event)"
                           class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer">

                    <!-- Live Image Previews -->
                    <div x-show="previewAddImages.length > 0" class="pt-2">
                        <span class="text-[11px] font-bold text-slate-400 block mb-2">Selected Files to Upload (<span x-text="previewAddImages.length"></span>):</span>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <template x-for="(img, idx) in previewAddImages" :key="idx">
                                <div class="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 group bg-slate-900">
                                    <template x-if="img.type && img.type.includes('video')">
                                        <div class="h-24 flex items-center justify-center text-emerald-400 font-mono text-[10px]">
                                            <span>VIDEO FILE</span>
                                        </div>
                                    </template>
                                    <template x-if="!img.type || !img.type.includes('video')">
                                        <img :src="img.url" class="h-24 w-full object-cover">
                                    </template>
                                    <div class="p-1 bg-slate-950/80 text-[10px] text-slate-300 truncate" x-text="img.name"></div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Submit Buttons -->
                <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button type="button" @click="addModalOpen = false" 
                            class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 transition transform active:scale-95 flex items-center gap-2">
                        <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                        <span>Publish Product to Registry</span>
                    </button>
                </div>
            </form>
        </div>
    </div>


    <!-- ========================================================================= -->
    <!-- MODAL 2: PRODUCT DOSSIER DETAILS, MODIFICATIONS & ACTIONS (IN-PAGE!) -->
    <!-- ========================================================================= -->
    <div x-show="detailModalOpen" x-cloak 
         class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
         @keydown.escape.window="closeDetails()">
        
        <div class="relative w-full max-w-4xl glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6"
             @click.away="closeDetails()">

            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/60 dark:bg-slate-900/60">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                        <i data-lucide="file-text" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800"
                                  x-text="activeReport ? activeReport.reference_id : ''">
                            </span>
                            <span class="text-xs text-slate-400" x-text="activeReport && activeReport.created_at ? new Date(activeReport.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''"></span>
                        </div>
                        <h2 class="font-heading font-black text-xl text-slate-900 dark:text-white truncate max-w-md"
                            x-text="activeReport ? activeReport.product_name : ''">
                        </h2>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button @click="closeDetails()" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>

            <!-- Tab Switcher (Dossier View vs Modify Details & Status) -->
            <div class="px-6 border-b border-slate-200 dark:border-slate-800 flex gap-4 text-xs font-bold bg-slate-50 dark:bg-slate-950/40">
                <button type="button" @click="activeTab = 'dossier'"
                        :class="activeTab === 'dossier' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 py-3 font-black' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-3'">
                    1. Inspection Dossier & Photos
                </button>
                <button type="button" @click="activeTab = 'modify'"
                        :class="activeTab === 'modify' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 py-3 font-black' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-3'">
                    2. Edit Details & Update Status
                </button>
            </div>

            <!-- Modal Body Content -->
            <div class="p-6 max-h-[75vh] overflow-y-auto text-xs space-y-6">

                <!-- ================= TAB 1: DOSSIER VIEW ================= -->
                <div x-show="activeTab === 'dossier'" class="space-y-6">
                    <!-- Status & Determination Banner -->
                    <div class="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                         :class="{
                             'bg-red-500/10 border-red-500/30 text-red-400': activeReport && activeReport.status === 'verified_fake',
                             'bg-emerald-500/10 border-emerald-500/30 text-emerald-400': activeReport && activeReport.status === 'verified_original',
                             'bg-purple-500/10 border-purple-500/30 text-purple-400': activeReport && activeReport.status === 'escalated',
                             'bg-cyan-500/10 border-cyan-500/30 text-cyan-400': activeReport && activeReport.status === 'under_review',
                             'bg-amber-500/10 border-amber-500/30 text-amber-400': activeReport && activeReport.status === 'received'
                         }">
                        <div>
                            <span class="text-[10px] font-bold uppercase tracking-wider block opacity-70">Current Registry Status</span>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="font-heading font-black text-lg text-slate-900 dark:text-white capitalize"
                                      x-text="activeReport ? activeReport.status.replace('_', ' ') : ''">
                                </span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                                      :class="activeReport && activeReport.risk_level === 'high' ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'"
                                      x-text="activeReport ? activeReport.risk_level + ' risk' : ''">
                                </span>
                            </div>
                        </div>

                        <!-- One-Click Quick Status Changes directly in Dossier -->
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-[10px] text-slate-400 font-semibold mr-1">Quick Action:</span>
                            <!-- Mark Fake -->
                            <form :action="'/admin/reports/' + (activeReport ? activeReport.id : '') + '/status'" method="POST" class="inline">
                                @csrf
                                <input type="hidden" name="status" value="verified_fake">
                                <input type="hidden" name="reviewer_note" value="Packaging discrepancies confirmed. High counterfeit signature.">
                                <button type="submit" class="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition">
                                    Mark Fake
                                </button>
                            </form>
                            <!-- Mark Genuine -->
                            <form :action="'/admin/reports/' + (activeReport ? activeReport.id : '') + '/status'" method="POST" class="inline">
                                @csrf
                                <input type="hidden" name="status" value="verified_original">
                                <input type="hidden" name="reviewer_note" value="Verified with manufacturer authorized batch records. Authentic.">
                                <button type="submit" class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition">
                                    Mark Genuine
                                </button>
                            </form>
                            <!-- Mark Reviewing -->
                            <form :action="'/admin/reports/' + (activeReport ? activeReport.id : '') + '/status'" method="POST" class="inline">
                                @csrf
                                <input type="hidden" name="status" value="under_review">
                                <input type="hidden" name="reviewer_note" value="Transferred to active forensic examination queue.">
                                <button type="submit" class="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[10px] transition">
                                    Set Reviewing
                                </button>
                            </form>
                            <!-- Mark Escalate -->
                            <form :action="'/admin/reports/' + (activeReport ? activeReport.id : '') + '/status'" method="POST" class="inline">
                                @csrf
                                <input type="hidden" name="status" value="escalated">
                                <input type="hidden" name="reviewer_note" value="High public health hazard flagged. Forwarded to regulatory desk.">
                                <button type="submit" class="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] transition">
                                    Escalate
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Dossier Core Details Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                            <span class="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">Product & Manufacturer</span>
                            <div>
                                <p class="text-sm font-bold text-slate-900 dark:text-white" x-text="activeReport ? activeReport.product_name : ''"></p>
                                <p class="text-emerald-500 font-medium" x-text="activeReport ? activeReport.category : ''"></p>
                                <p class="text-slate-400" x-text="activeReport && activeReport.brand ? 'Purported Brand: ' + activeReport.brand : 'Brand: Unspecified'"></p>
                            </div>
                            <div class="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                                <span class="text-slate-400">Amount Paid:</span>
                                <span class="font-semibold text-slate-800 dark:text-slate-200" x-text="activeReport && activeReport.purchase_price ? activeReport.purchase_price : 'Not specified'"></span>
                            </div>
                        </div>

                        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                            <span class="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">Purchase Geolocation & Whistleblower</span>
                            <div>
                                <p class="text-sm font-bold text-slate-900 dark:text-white" x-text="activeReport ? activeReport.state + ' State' : ''"></p>
                                <p class="text-slate-400" x-text="activeReport ? activeReport.market_address : ''"></p>
                            </div>
                            <div class="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                                <span class="text-slate-400">Reporter:</span>
                                <span class="font-semibold text-slate-800 dark:text-slate-200" x-text="activeReport && activeReport.reporter_contact ? activeReport.reporter_contact : (activeReport && activeReport.is_anonymous ? 'Anonymous Whistleblower' : 'Public Incident')"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Defect & Citizen Experience -->
                    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span class="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">Observed Flaw & Whistleblower Findings</span>
                        <p class="font-bold text-slate-900 dark:text-white" x-text="activeReport ? activeReport.issue_type : ''"></p>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line" 
                           x-text="activeReport && activeReport.details ? activeReport.details : 'No whistleblower notes provided.'"></p>
                    </div>

                    <!-- Inspector Note -->
                    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                        <span class="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                            Official Inspector Forensic Determination Note
                        </span>
                        <p class="text-slate-800 dark:text-slate-200 leading-relaxed font-medium" 
                           x-text="activeReport && activeReport.reviewer_note ? activeReport.reviewer_note : 'No official reviewer note published yet.'"></p>
                    </div>

                    <!-- Attached Evidence Photos Gallery -->
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-heading font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                Attached Packaging Evidence (<span x-text="activeReport && activeReport.media ? activeReport.media.length : 0"></span>)
                            </h3>
                            <button type="button" @click="activeTab = 'modify'" class="text-xs text-emerald-500 hover:underline font-bold">
                                + Upload more photos
                            </button>
                        </div>

                        <template x-if="activeReport && activeReport.media && activeReport.media.length > 0">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <template x-for="(media, idx) in activeReport.media" :key="media.id">
                                    <div class="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 group bg-slate-950">
                                        <template x-if="media.file_type === 'video'">
                                            <div class="h-36 flex flex-col items-center justify-center text-emerald-400 gap-2">
                                                <i data-lucide="video" class="w-8 h-8"></i>
                                                <a :href="'/storage/' + media.file_path" target="_blank" class="text-[10px] underline font-mono text-emerald-300">Play Video</a>
                                            </div>
                                        </template>
                                        <template x-if="media.file_type !== 'video'">
                                            <div>
                                                <img :src="'/storage/' + media.file_path" 
                                                     @click="zoomImage = '/storage/' + media.file_path"
                                                     class="h-36 w-full object-cover cursor-pointer hover:scale-105 transition duration-300">
                                                <button type="button"
                                                        @click="zoomImage = '/storage/' + media.file_path"
                                                        class="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition"
                                                        title="Zoom photo">
                                                    <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
                                                </button>
                                            </div>
                                        </template>

                                        <!-- Delete Media Button -->
                                        <form :action="'/admin/media/' + media.id + '/delete'" 
                                              method="POST"
                                              onsubmit="return confirm('Remove this evidence image?')"
                                              class="absolute top-2 right-2">
                                            @csrf
                                            <button type="submit" class="p-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white shadow" title="Delete image">
                                                <i data-lucide="trash-2" class="w-3 h-3"></i>
                                            </button>
                                        </form>
                                    </div>
                                </template>
                            </div>
                        </template>

                        <template x-if="!activeReport || !activeReport.media || activeReport.media.length === 0">
                            <div class="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-400">
                                <i data-lucide="image-off" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
                                <p class="text-xs">No media evidence submitted with this report.</p>
                                <button type="button" @click="activeTab = 'modify'" class="mt-2 text-xs text-emerald-500 font-bold hover:underline">
                                    Upload evidence packaging photos now &rarr;
                                </button>
                            </div>
                        </template>
                    </div>

                    <!-- Footer Action in Tab 1 -->
                    <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <button type="button" @click="activeTab = 'modify'" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                            <span>Modify Details & Status &rarr;</span>
                        </button>
                        <button type="button" @click="closeDetails()" class="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs">
                            Close
                        </button>
                    </div>
                </div>

                <!-- ================= TAB 2: IN-PLACE MODIFICATION FORM ================= -->
                <div x-show="activeTab === 'modify'" class="space-y-6">
                    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                        <div>
                            <span class="font-bold text-xs block">Edit Dossier & Update Status</span>
                            <span class="text-[11px] opacity-80">Make modifications to submitted data, update reviewer note, change status, or upload additional photos.</span>
                        </div>
                    </div>

                    <form :action="'/admin/products/' + (activeReport ? activeReport.id : '') + '/update'" 
                          method="POST" enctype="multipart/form-data" class="space-y-5">
                        @csrf

                        <!-- Product Name & Brand -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Product Name <span class="text-red-500">*</span>
                                </label>
                                <input type="text" name="product_name" required :value="activeReport ? activeReport.product_name : ''"
                                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Brand / Manufacturer
                                </label>
                                <input type="text" name="brand" :value="activeReport ? activeReport.brand : ''"
                                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            </div>
                        </div>

                        <!-- Category & Price -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Category <span class="text-red-500">*</span>
                                </label>
                                <select name="category" required
                                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                    @foreach($categories as $cat)
                                        <option value="{{ $cat }}" :selected="activeReport && activeReport.category === '{{ $cat }}'">{{ $cat }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Purchase Price
                                </label>
                                <input type="text" name="purchase_price" :value="activeReport ? activeReport.purchase_price : ''"
                                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            </div>
                        </div>

                        <!-- State & Market Location -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Nigerian State <span class="text-red-500">*</span>
                                </label>
                                <select name="state" required
                                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                    @foreach($states as $st)
                                        <option value="{{ $st }}" :selected="activeReport && activeReport.state === '{{ $st }}'">{{ $st }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Market Address / Stall <span class="text-red-500">*</span>
                                </label>
                                <input type="text" name="market_address" required :value="activeReport ? activeReport.market_address : ''"
                                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            </div>
                        </div>

                        <!-- Defect, Status & Risk -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Issue / Flaw <span class="text-red-500">*</span>
                                </label>
                                <select name="issue_type" required
                                        class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                    @foreach($defects as $df)
                                        <option value="{{ $df }}" :selected="activeReport && activeReport.issue_type === '{{ $df }}'">{{ $df }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                    Status Verdict <span class="text-red-500">*</span>
                                </label>
                                <select name="status" required
                                        class="w-full px-3 py-2 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                    <option value="received" :selected="activeReport && activeReport.status === 'received'">Received (Pending Queue)</option>
                                    <option value="under_review" :selected="activeReport && activeReport.status === 'under_review'">Under Review (Active Forensics)</option>
                                    <option value="verified_fake" :selected="activeReport && activeReport.status === 'verified_fake'">Verified Fake (Confirmed Counterfeit)</option>
                                    <option value="verified_original" :selected="activeReport && activeReport.status === 'verified_original'">Verified Genuine (Authentic)</option>
                                    <option value="escalated" :selected="activeReport && activeReport.status === 'escalated'">Escalated to NAFDAC/FCCPC</option>
                                </select>
                            </div>

                            <div>
                                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Risk Priority <span class="text-red-500">*</span>
                                </label>
                                <select name="risk_level" required
                                        class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                    <option value="high" :selected="activeReport && activeReport.risk_level === 'high'">High Risk</option>
                                    <option value="medium" :selected="activeReport && activeReport.risk_level === 'medium'">Medium Risk</option>
                                    <option value="low" :selected="activeReport && activeReport.risk_level === 'low'">Low Risk</option>
                                </select>
                            </div>
                        </div>

                        <!-- Details & Reviewer Note -->
                        <div class="space-y-4">
                            <div>
                                <label class="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Citizen Findings / Defect Description
                                </label>
                                <textarea name="details" rows="3" :value="activeReport ? activeReport.details : ''"
                                          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
                            </div>

                            <div>
                                <label class="block font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
                                    Official Inspector Reviewer Note / Public Advisory
                                </label>
                                <textarea name="reviewer_note" rows="3" :value="activeReport ? activeReport.reviewer_note : ''"
                                          placeholder="Enter official verdict note, lab assessment details, or regulatory instructions..."
                                          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
                            </div>
                        </div>

                        <!-- Upload Additional Photos -->
                        <div class="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                            <span class="font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                                Add More Evidence Photos to Dossier
                            </span>
                            <input type="file" name="evidence[]" multiple accept="image/*,video/*"
                                   @change="handleUpdateFileChange($event)"
                                   class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer">

                            <!-- Live preview of new photos to add -->
                            <div x-show="previewUpdateImages.length > 0" class="pt-2">
                                <span class="text-[11px] font-bold text-slate-400 block mb-2">New Files to Attach (<span x-text="previewUpdateImages.length"></span>):</span>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <template x-for="(img, idx) in previewUpdateImages" :key="idx">
                                        <div class="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 group bg-slate-900">
                                            <template x-if="img.type && img.type.includes('video')">
                                                <div class="h-24 flex items-center justify-center text-emerald-400 font-mono text-[10px]">VIDEO</div>
                                            </template>
                                            <template x-if="!img.type || !img.type.includes('video')">
                                                <img :src="img.url" class="h-24 w-full object-cover">
                                            </template>
                                            <div class="p-1 bg-slate-950/80 text-[10px] text-slate-300 truncate" x-text="img.name"></div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Buttons -->
                        <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                            <!-- Delete report button -->
                            <button type="button" 
                                    @click="if(confirm('Are you sure you want to permanently delete dossier #' + activeReport.reference_id + '? This action cannot be undone.')) { document.getElementById('delete-report-form').submit(); }"
                                    class="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 font-bold text-xs transition flex items-center gap-1.5">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                <span>Delete Dossier</span>
                            </button>

                            <div class="flex items-center gap-3">
                                <button type="button" @click="activeTab = 'dossier'" 
                                        class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                    Back to Dossier
                                </button>
                                <button type="submit" 
                                        class="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 transition transform active:scale-95 flex items-center gap-2">
                                    <i data-lucide="save" class="w-4 h-4"></i>
                                    <span>Save Modifications</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    <!-- Hidden Delete Form -->
                    <form id="delete-report-form" :action="'/admin/products/' + (activeReport ? activeReport.id : '') + '/delete'" method="POST" class="hidden">
                        @csrf
                    </form>
                </div>
            </div>
        </div>
    </div>


    <!-- ========================================================================= -->
    <!-- MODAL 3: FULLSCREEN IMAGE LIGHTBOX -->
    <!-- ========================================================================= -->
    <div x-show="zoomImage" x-cloak 
         class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
         @click="zoomImage = null"
         @keydown.escape.window="zoomImage = null">
        <button class="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full bg-white/10">
            <i data-lucide="x" class="w-6 h-6"></i>
        </button>
        <img :src="zoomImage" class="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl">
    </div>

</div>
@endsection
