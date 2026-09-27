<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BrandWatch;
use App\Models\MarketHotspot;
use App\Models\Report;
use App\Models\ReportMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class Fake9jaController extends Controller
{
    /**
     * Get Public Incident Reports
     */
    public function getReports(Request $request)
    {
        $query = Report::with('media')->latest();

        if ($request->filled('category') && $request->category !== 'All') {
            $query->where('category', 'like', "%{$request->category}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('state') && $request->state !== 'All') {
            $query->where('state', $request->state);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('product_name', 'like', "%{$s}%")
                  ->orWhere('market_address', 'like', "%{$s}%")
                  ->orWhere('reference_id', 'like', "%{$s}%")
                  ->orWhere('brand', 'like', "%{$s}%");
            });
        }

        $reports = $query->take(50)->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'reference_id' => $r->reference_id,
                'product_name' => $r->product_name,
                'brand' => $r->brand,
                'category' => $r->category,
                'state' => $r->state,
                'market_address' => $r->market_address,
                'issue_type' => $r->issue_type,
                'details' => $r->details,
                'purchase_price' => $r->purchase_price,
                'reporter_contact' => $r->is_anonymous ? 'Anonymous Citizen' : $r->reporter_contact,
                'is_anonymous' => (bool)$r->is_anonymous,
                'status' => $r->status,
                'risk_level' => $r->risk_level,
                'is_priority' => (bool)$r->is_priority,
                'reviewer_note' => $r->reviewer_note,
                'coupon_used' => $r->coupon_used ?? null,
                'media_count' => $r->media->count(),
                'media_urls' => $r->media->map(fn($m) => '/storage/' . $m->file_path),
                'created_at' => $r->created_at ? $r->created_at->diffForHumans() : 'Just now',
            ];
        });

        return response()->json(['data' => $reports]);
    }

    /**
     * Submit a New Incident Report (100% Free Public Citizen Intelligence)
     */
    public function storeReport(Request $request)
    {
        // Normalize quick report aliases if provided
        $input = $request->all();
        if (empty($input['name']) && !empty($input['product_name'])) {
            $input['name'] = $input['product_name'];
        }
        if (empty($input['name']) && !empty($input['product_type'])) {
            $input['name'] = $input['product_type'];
        }
        if (empty($input['category']) && !empty($input['product_type'])) {
            $input['category'] = $input['product_type'];
        }
        if (empty($input['market']) && !empty($input['purchased_location'])) {
            $input['market'] = $input['purchased_location'];
        }
        if (empty($input['price']) && !empty($input['amount_paid'])) {
            $input['price'] = $input['amount_paid'];
        }
        if (empty($input['state'])) {
            $input['state'] = 'Lagos';
        }
        if (empty($input['issue'])) {
            $input['issue'] = 'Suspected Counterfeit / Price Discrepancy';
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
            'is_anonymous' => 'nullable|boolean',
            'is_priority' => 'nullable|boolean',
        ]);

        // Generate unique reference ID
        do {
            $refId = 'EIE-NG-' . mt_rand(100000, 999999);
        } while (Report::where('reference_id', $refId)->exists());

        $isPriority = filter_var($request->input('is_priority', false), FILTER_VALIDATE_BOOLEAN);

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
            'is_anonymous' => $request->has('contact') && !empty($request->contact) ? false : true,
            'status' => 'received',
            'risk_level' => Str::contains(strtolower($validated['category']), ['medicine', 'pharmaceutical', 'drug', 'baby']) ? 'high' : 'medium',
            'is_priority' => $isPriority,
        ]);

        // Update Market Hotspot count if matching market exists
        MarketHotspot::where('state', $validated['state'])->increment('incident_count');

        // Handle File Uploads (images or video clips from either 'files' or 'evidence')
        $uploadedFiles = [];
        if ($request->hasFile('files')) {
            $uploadedFiles = $request->file('files');
        } elseif ($request->hasFile('evidence')) {
            $uploadedFiles = $request->file('evidence');
        }
        if (!is_array($uploadedFiles)) {
            $uploadedFiles = [$uploadedFiles];
        }

        foreach ($uploadedFiles as $file) {
            if (!$file || !is_object($file)) continue;
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

        $report->load('media');

        return response()->json([
            'success' => true,
            'reference_id' => $report->reference_id,
            'message' => 'Incident successfully logged to Fake9ja database. Free case reference generated.',
            'report' => [
                'id' => $report->id,
                'reference_id' => $report->reference_id,
                'product_name' => $report->product_name,
                'brand' => $report->brand,
                'category' => $report->category,
                'state' => $report->state,
                'market_address' => $report->market_address,
                'issue_type' => $report->issue_type,
                'details' => $report->details,
                'purchase_price' => $report->purchase_price,
                'reporter_contact' => $report->is_anonymous ? 'Anonymous Citizen' : $report->reporter_contact,
                'is_anonymous' => (bool)$report->is_anonymous,
                'status' => $report->status,
                'risk_level' => $report->risk_level,
                'is_priority' => (bool)$report->is_priority,
                'media_count' => $report->media->count(),
                'media_urls' => $report->media->map(fn($m) => '/storage/' . $m->file_path),
                'created_at' => $report->created_at ? $report->created_at->diffForHumans() : 'Just now',
            ],
        ], 201);
    }

    /**
     * Track a Report by Reference ID
     */
    public function trackReport($referenceId)
    {
        $clean = strtoupper(trim($referenceId));
        $report = Report::with('media')->where('reference_id', $clean)->first();

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Reference ID not found in Fake9ja registry.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'report' => [
                'id' => $report->id,
                'reference_id' => $report->reference_id,
                'product_name' => $report->product_name,
                'brand' => $report->brand,
                'category' => $report->category,
                'state' => $report->state,
                'market_address' => $report->market_address,
                'issue_type' => $report->issue_type,
                'details' => $report->details,
                'purchase_price' => $report->purchase_price,
                'is_anonymous' => (bool)$report->is_anonymous,
                'status' => $report->status,
                'risk_level' => $report->risk_level,
                'is_priority' => (bool)$report->is_priority,
                'reviewer_note' => $report->reviewer_note,
                'created_at' => $report->created_at ? $report->created_at->format('d M Y, h:i A') : 'Recently',
                'updated_at' => $report->updated_at ? $report->updated_at->format('d M Y, h:i A') : 'Recently',
                'media_count' => $report->media->count(),
                'media_urls' => $report->media->map(fn($m) => '/storage/' . $m->file_path),
            ],
        ]);
    }

    /**
     * Store Free Brand Watch Registration
     */
    public function storeBrandWatch(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:64',
            'monitored_skus' => 'nullable|string|max:500',
        ]);

        $watch = BrandWatch::create([
            'brand_name' => $validated['brand_name'],
            'company_name' => $validated['company_name'] ?? $validated['brand_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'monitored_skus' => $validated['monitored_skus'] ?? 'All SKUs',
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Free Brand Protection registered. Your company will receive immediate alerts for counterfeit detections.',
            'data' => $watch,
        ], 201);
    }

    /**
     * Validate Promo / Coupon Code (e.g. WELCOME30)
     */
    public function validateCoupon(Request $request)
    {
        $code = strtoupper(trim($request->input('code', '')));
        if ($code === 'WELCOME30') {
            return response()->json([
                'valid' => true,
                'code' => 'WELCOME30',
                'discount_percent' => 30,
                'description' => '30% Official Launch Discount for Priority Verification & Brand Watch',
                'message' => '🎉 WELCOME30 applied! 30% discount has been applied.',
            ]);
        }

        return response()->json([
            'valid' => false,
            'code' => $code,
            'discount_percent' => 0,
            'description' => 'Invalid coupon',
            'message' => 'Coupon code not recognized or has expired.',
        ], 422);
    }

    /**
     * Get Hotspots & Leaderboard
     */
    public function getHotspots()
    {
        $hotspots = MarketHotspot::orderByDesc('incident_count')->get();
        return response()->json(['data' => $hotspots]);
    }

    /**
     * Admin Stats & Velocity
     */
    public function getAdminStats()
    {
        $totalReports = Report::count();
        $highRisk = Report::where('risk_level', 'high')->count();
        $verified = Report::whereIn('status', ['verified_fake', 'verified_original'])->count();
        $openReports = Report::whereIn('status', ['received', 'under_review'])->count();

        return response()->json([
            'stats' => [
                ['label' => 'Total Reports', 'value' => (string)$totalReports, 'change' => '100% Free Public Good'],
                ['label' => 'Open Triage', 'value' => (string)$openReports, 'change' => 'Active Queue'],
                ['label' => 'High Risk Alerts', 'value' => (string)$highRisk, 'change' => 'NAFDAC/SON Priority'],
                ['label' => 'Verified Decisions', 'value' => (string)$verified, 'change' => 'Public Bulletins'],
            ],
        ]);
    }

    /**
     * Admin Update Report Status
     */
    public function updateReportStatus(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        $status = $request->input('status');
        $note = $request->input('note');

        if ($status) {
            $report->status = $status;
        }
        if ($note) {
            $report->reviewer_note = $note;
        }

        $report->save();

        return response()->json([
            'success' => true,
            'message' => "Report #{$report->reference_id} status updated to {$report->status}.",
            'report' => $report,
        ]);
    }

    /**
     * Admin Authentication Login
     */
    public function adminLogin(Request $request)
    {
        $email = trim($request->input('email', ''));
        $password = trim($request->input('password', ''));

        // Default inspection chief credentials
        if ($email === 'admin@fake9ja.ng' && ($password === 'admin123' || $password === 'admin9ja2026')) {
            return response()->json([
                'success' => true,
                'token' => 'fake9ja_sec_' . bin2hex(random_bytes(16)),
                'user' => [
                    'name' => 'Dr. Amina Bello',
                    'email' => 'admin@fake9ja.ng',
                    'role' => 'Super Administrator / Chief Inspector',
                    'badge' => 'NAFDAC/SON Liaison',
                ],
                'message' => 'Admin authentication granted. Welcome to Fake9ja Intelligence Command.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid admin credentials. Use admin@fake9ja.ng and admin123.',
        ], 401);
    }

    /**
     * Admin Delete Report
     */
    public function deleteReport($id)
    {
        $report = Report::find($id);
        if (!$report) {
            $report = Report::where('reference_id', $id)->first();
        }
        if (!$report) {
            return response()->json(['success' => false, 'message' => 'Report not found.'], 404);
        }

        $report->delete();

        return response()->json([
            'success' => true,
            'message' => "Report #{$report->reference_id} deleted successfully.",
        ]);
    }

    /**
     * Get All Brand Watches for Admin
     */
    public function getBrandWatches()
    {
        $watches = BrandWatch::latest()->get();
        return response()->json(['data' => $watches]);
    }

    /**
     * Store new Market Hotspot
     */
    public function storeHotspot(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'state' => 'required|string|max:64',
            'risk_level' => 'required|string|in:low,medium,high',
            'incident_count' => 'nullable|integer',
        ]);

        $hotspot = MarketHotspot::create([
            'name' => $validated['name'],
            'state' => $validated['state'],
            'risk_level' => $validated['risk_level'],
            'incident_count' => $validated['incident_count'] ?? 1,
            'trend' => 'up',
        ]);

        return response()->json([
            'success' => true,
            'data' => $hotspot,
            'message' => "Market hotspot '{$hotspot->name}' registered successfully.",
        ], 201);
    }

    /**
     * Delete Market Hotspot
     */
    public function deleteHotspot($id)
    {
        $hotspot = MarketHotspot::findOrFail($id);
        $hotspot->delete();

        return response()->json([
            'success' => true,
            'message' => "Market hotspot removed.",
        ]);
    }

    /**
     * Admin Direct Publishing of Verified Fake Products to Citizen Radar
     */
    public function publishFakeProduct(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'category' => 'required|string|max:64',
            'state' => 'required|string|max:64',
            'market_address' => 'required|string|max:255',
            'issue_type' => 'required|string|max:255',
            'details' => 'nullable|string',
            'reviewer_note' => 'nullable|string',
            'purchase_price' => 'nullable|string|max:64',
            'risk_level' => 'nullable|string|in:low,medium,high',
        ]);

        do {
            $refId = 'EIE-NG-' . mt_rand(100000, 999999);
        } while (Report::where('reference_id', $refId)->exists());

        $report = Report::create([
            'reference_id' => $refId,
            'product_name' => $validated['product_name'],
            'brand' => $validated['brand'] ?? null,
            'category' => $validated['category'],
            'state' => $validated['state'],
            'market_address' => $validated['market_address'],
            'issue_type' => $validated['issue_type'],
            'details' => $validated['details'] ?? 'Official Counterfeit Product Alert published by Fake9ja Chief Inspector Desk.',
            'reviewer_note' => $validated['reviewer_note'] ?? 'Lab forensic assessment: confirmed counterfeit packaging and hazardous adulterated formulation.',
            'purchase_price' => $validated['purchase_price'] ?? null,
            'reporter_contact' => 'Fake9ja Chief Inspector Desk',
            'is_anonymous' => false,
            'status' => 'verified_fake',
            'risk_level' => $validated['risk_level'] ?? 'high',
            'is_priority' => true,
        ]);

        // Market hotspot increment
        MarketHotspot::where('state', $validated['state'])->increment('incident_count');

        // Handle uploaded files
        $uploadedFiles = [];
        if ($request->hasFile('files')) {
            $uploadedFiles = $request->file('files');
        } elseif ($request->hasFile('evidence')) {
            $uploadedFiles = $request->file('evidence');
        }
        if (!is_array($uploadedFiles)) {
            $uploadedFiles = [$uploadedFiles];
        }

        foreach ($uploadedFiles as $file) {
            if (!$file || !is_object($file)) continue;
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

        $report->load('media');

        return response()->json([
            'success' => true,
            'message' => "Verified Fake '{$report->product_name}' published directly to Public Radar! Reference: #{$report->reference_id}",
            'report' => [
                'id' => $report->id,
                'reference_id' => $report->reference_id,
                'product_name' => $report->product_name,
                'brand' => $report->brand,
                'category' => $report->category,
                'state' => $report->state,
                'market_address' => $report->market_address,
                'issue_type' => $report->issue_type,
                'details' => $report->details,
                'reviewer_note' => $report->reviewer_note,
                'purchase_price' => $report->purchase_price,
                'reporter_contact' => $report->reporter_contact,
                'is_anonymous' => false,
                'status' => $report->status,
                'risk_level' => $report->risk_level,
                'is_priority' => (bool)$report->is_priority,
                'media_count' => $report->media->count(),
                'media_urls' => $report->media->map(fn($m) => '/storage/' . $m->file_path),
                'created_at' => 'Just now',
            ],
        ], 201);
    }
}

