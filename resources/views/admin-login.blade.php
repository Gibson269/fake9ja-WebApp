@extends('layouts.app')

@section('title', 'Restricted Inspector Login | Fake9ja Command')

@section('content')
<div class="min-h-[80vh] flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <div class="text-center mb-6">
            <div class="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center mb-3">
                <i data-lucide="shield-alert" class="w-6 h-6"></i>
            </div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200 dark:border-emerald-800">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Restricted Admin Command Gate
            </div>
            <h1 class="font-heading font-black text-2xl text-slate-900 dark:text-white">
                Chief Inspector Login
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Only verified administrators with authorized credentials can access this page.
            </p>
        </div>

        @if(session('error'))
            <div class="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 flex items-center gap-2">
                <i data-lucide="alert-triangle" class="w-4 h-4 shrink-0"></i>
                <span>{{ session('error') }}</span>
            </div>
        @endif

        <div class="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <span class="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Official Chief Inspector Key:</span>
            <div class="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                <div>Email: <strong class="text-slate-900 dark:text-white">admin@fake9ja.ng</strong></div>
                <div>Password: <strong class="text-slate-900 dark:text-white">admin123</strong></div>
            </div>
        </div>

        <form action="{{ route('admin.login.submit') }}" method="POST" class="space-y-4">
            @csrf
            <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Inspector Email</label>
                <div class="relative">
                    <input type="email" name="email" required placeholder="admin@fake9ja.ng"
                           class="w-full h-11 pl-4 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Security Password</label>
                <div class="relative">
                    <input type="password" name="password" required placeholder="••••••••••••"
                           class="w-full h-11 pl-4 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
                </div>
            </div>

            <button type="submit" class="w-full h-11 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20 cursor-pointer mt-2">
                Unlock Inspector Command Desk →
            </button>
        </form>

        <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <a href="{{ route('home') }}" class="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white">
                ← Return to Citizen Public Radar
            </a>
        </div>
    </div>
</div>
@endsection
