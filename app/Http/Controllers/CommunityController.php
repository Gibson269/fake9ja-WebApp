<?php

namespace App\Http\Controllers;

use App\Models\MarketHotspot;
use App\Models\Report;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with('media')->latest();

        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', 'like', "%{$request->category}%");
        }

        if ($request->filled('state') && $request->state !== 'All') {
            $query->where('state', $request->state);
        }

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('product_name', 'like', "%{$term}%")
                  ->orWhere('brand', 'like', "%{$term}%")
                  ->orWhere('market_address', 'like', "%{$term}%")
                  ->orWhere('reference_id', 'like', "%{$term}%");
            });
        }

        $reports = $query->paginate(12)->withQueryString();
        $hotspots = MarketHotspot::orderByDesc('incident_count')->get();

        $selectedCategory = $request->input('category', 'All');
        $selectedState = $request->input('state', 'All');
        $selectedStatus = $request->input('status', 'All');
        $searchQuery = $request->input('search', '');

        return view('community', compact(
            'reports',
            'hotspots',
            'selectedCategory',
            'selectedState',
            'selectedStatus',
            'searchQuery'
        ));
    }
}
