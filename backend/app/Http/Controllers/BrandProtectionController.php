<?php

namespace App\Http\Controllers;

use App\Models\BrandWatch;
use App\Models\Report;
use Illuminate\Http\Request;

class BrandProtectionController extends Controller
{
    public function index()
    {
        $registeredBrandsCount = BrandWatch::count();
        $totalIncidentsFlagged = Report::whereNotNull('brand')->count();
        $recentRegistered = BrandWatch::latest()->take(6)->get();

        return view('brand-protection', compact('registeredBrandsCount', 'totalIncidentsFlagged', 'recentRegistered'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:64',
            'monitored_skus' => 'nullable|string|max:1000',
        ]);

        BrandWatch::create([
            'brand_name' => $validated['brand_name'],
            'company_name' => $validated['company_name'] ?? $validated['brand_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'monitored_skus' => $validated['monitored_skus'] ?? 'All Catalog SKUs',
            'status' => 'active',
        ]);

        return redirect()->route('brand-protection.index')
            ->with('success', "Brand Watch registered! {$validated['brand_name']} is now protected under Fake9ja Free Brand Sentinel.");
    }
}
