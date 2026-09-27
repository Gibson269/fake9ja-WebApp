<?php

namespace App\Http\Controllers;

use App\Models\MarketHotspot;
use App\Models\Report;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $totalReports = Report::count();
        $verifiedCount = Report::whereIn('status', ['verified_fake', 'verified_original'])->count();
        $highRiskCount = Report::where('risk_level', 'high')->count();
        $hotspotsCount = MarketHotspot::count();

        $recentReports = Report::with('media')
            ->latest()
            ->take(8)
            ->get();

        $hotspots = MarketHotspot::orderByDesc('incident_count')
            ->take(6)
            ->get();

        $tickerAlerts = Report::latest()
            ->take(5)
            ->get();

        return view('home', compact(
            'totalReports',
            'verifiedCount',
            'highRiskCount',
            'hotspotsCount',
            'recentReports',
            'hotspots',
            'tickerAlerts'
        ));
    }
}
