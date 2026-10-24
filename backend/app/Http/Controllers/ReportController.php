<?php

namespace App\Http\Controllers;

use App\Models\MarketHotspot;
use App\Models\Report;
use App\Models\ReportMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    /**
     * Show the 5-step Report Wizard (100% Free)
     */
    public function create()
    {
        $hotspots = MarketHotspot::orderBy('name')->get();
        return view('report', compact('hotspots'));
    }

    /**
     * Store Report in MySQL Database
     */
    public function store(Request $request)
    {
        $input = $request->all();
        if (isset($input['is_anonymous'])) {
            $input['is_anonymous'] = filter_var($input['is_anonymous'], FILTER_VALIDATE_BOOLEAN);
        } else {
            $input['is_anonymous'] = true;
        }
        if (isset($input['is_priority'])) {
            $input['is_priority'] = filter_var($input['is_priority'], FILTER_VALIDATE_BOOLEAN);
        } else {
            $input['is_priority'] = false;
        }
        $request->merge($input);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'category' => 'required|string|max:64',
            'state' => 'required|string|max:64',
            'market' => 'required|string|max:255',
            'issue' => 'required|string|max:255',
            'details' => 'nullable|string',
            'price' => 'nullable|string|max:64',
            'contact' => 'nullable|string|max:255',
            'is_anonymous' => 'nullable',
            'is_priority' => 'nullable',
            'evidence.*' => 'nullable|file|mimes:jpeg,png,jpg,webp,mp4,mov|max:20480',
        ]);

        // Generate unique reference ID (e.g. EIE-NG-847291)
        do {
            $refId = 'EIE-NG-' . mt_rand(100000, 999999);
        } while (Report::where('reference_id', $refId)->exists());

        $isPriority = $request->boolean('is_priority', false);
        $isAnonymous = $request->boolean('is_anonymous', true);
        if ($request->filled('contact')) {
            $isAnonymous = false;
        }

        // Determine risk level based on category / issue
        $riskLevel = 'medium';
        $categoryLower = strtolower($validated['category']);
        if (Str::contains($categoryLower, ['medicine', 'pharmaceutical', 'drug', 'baby', 'chemical', 'food'])) {
            $riskLevel = 'high';
        }

        $report = Report::create([
            'reference_id' => $refId,
            'product_name' => $validated['name'],
            'brand' => $validated['brand'] ?? null,
            'category' => $validated['category'],
            'state' => $validated['state'],
            'market_address' => $validated['market'],
            'issue_type' => $validated['issue'],
            'details' => $validated['details'] ?? null,
            'purchase_price' => $validated['price'] ?? null,
            'reporter_contact' => $validated['contact'] ?? null,
            'is_anonymous' => $isAnonymous,
            'status' => 'received',
            'risk_level' => $riskLevel,
            'is_priority' => $isPriority,
        ]);

        // Increment hotspot count for this state
        MarketHotspot::where('state', $validated['state'])->increment('incident_count');

        // Handle uploaded evidence files
        if ($request->hasFile('evidence')) {
            foreach ($request->file('evidence') as $file) {
                $ext = strtolower($file->getClientOriginalExtension());
                $type = in_array($ext, ['mp4', 'mov', 'webm']) ? 'video' : 'image';
                $path = $file->store('evidence', 'public');

                ReportMedia::create([
                    'report_id' => $report->id,
                    'file_path' => $path,
                    'file_type' => $type,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return redirect()->route('report.success', ['reference' => $refId])
            ->with('status', "Your incident has been securely recorded to the Fake9ja registry under tracking ID: {$refId}");
    }

    /**
     * Show Report Submission Confirmation / Receipt
     */
    public function success($reference)
    {
        $report = Report::with('media')->where('reference_id', $reference)->firstOrFail();
        return view('report-success', compact('report'));
    }
}
