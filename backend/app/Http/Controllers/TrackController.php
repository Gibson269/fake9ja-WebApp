<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    public function index(Request $request, $reference = null)
    {
        $searchRef = $reference ?? $request->input('ref');
        $report = null;
        $searched = false;

        if ($searchRef) {
            $searched = true;
            $cleanRef = strtoupper(trim($searchRef));
            $report = Report::with('media')->where('reference_id', $cleanRef)->first();
        }

        return view('track', compact('report', 'searchRef', 'searched'));
    }
}
