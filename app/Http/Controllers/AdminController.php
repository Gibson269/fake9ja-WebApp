<?php

namespace App\Http\Controllers;

use App\Models\BrandWatch;
use App\Models\MarketHotspot;
use App\Models\Report;
use App\Models\ReportMedia;
use App\Models\VideoTestimony;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        // Enforce admin login authentication
        if (!session('fake9ja_admin_logged')) {
            return view('admin-login');
        }

        $status = $request->input('status', 'all');
        $search = trim($request->input('search', ''));
        $category = $request->input('category', 'all');
        $risk = $request->input('risk_level', 'all');

        $query = Report::with('media')->latest();

        if ($status !== 'all' && !empty($status)) {
            $query->where('status', $status);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('reference_id', 'like', "%{$search}%")
                  ->orWhere('market_address', 'like', "%{$search}%")
                  ->orWhere('state', 'like', "%{$search}%")
                  ->orWhere('issue_type', 'like', "%{$search}%");
            });
        }

        if ($category !== 'all' && !empty($category)) {
            $query->where('category', $category);
        }

        if ($risk !== 'all' && !empty($risk)) {
            $query->where('risk_level', $risk);
        }

        $reports = $query->paginate(15)->withQueryString();

        $stats = [
            'total' => Report::count(),
            'pending' => Report::where('status', 'received')->count(),
            'under_review' => Report::where('status', 'under_review')->count(),
            'verified_fake' => Report::where('status', 'verified_fake')->count(),
            'verified_original' => Report::where('status', 'verified_original')->count(),
            'escalated' => Report::where('status', 'escalated')->count(),
            'high_risk' => Report::where('risk_level', 'high')->count(),
            'brands_count' => BrandWatch::count(),
            'testimonies_count' => VideoTestimony::count(),
        ];

        $hotspots = MarketHotspot::orderByDesc('incident_count')->take(5)->get();

        $videoTestimonies = VideoTestimony::orderBy('sort_order', 'asc')->latest()->get();

        $states = [
            'Abia', 'Abuja (FCT)', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
            'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
            'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
            'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
        ];

        $categories = [
            'Pharmaceuticals & Drugs',
            'Baby Formula & Nutrition',
            'Cosmetics & Skincare',
            'Packaged Foods & Drinks',
            'Electronics & Cables',
            'Auto Parts & Brake Pads',
            'Spirits & Alcoholic Drinks',
            'Building Materials',
            'Agricultural Inputs',
            'Personal Care & Hygiene',
            'Other Consumer Goods',
        ];

        $defects = [
            'Spelling or Printing Errors on Box',
            'No NAFDAC / SONCAP Number',
            'Strange Smell, Texture, or Color',
            'Tampered or Missing Security Foil/Seal',
            'Suspiciously Cheap / Extreme Discount',
            'Physical Health Reaction or Illness Caused',
            'Inoperative / Defective Out of Box',
            'Adulterated or Toxic Chemical Content',
            'Other Blatant Counterfeit Defect'
        ];

        return view('admin', compact(
            'reports', 
            'stats', 
            'status', 
            'search', 
            'category', 
            'risk', 
            'hotspots', 
            'videoTestimonies',
            'states', 
            'categories', 
            'defects'
        ));
    }

    public function login(Request $request)
    {
        $email = trim(strtolower($request->input('email', '')));
        $password = trim($request->input('password', ''));

        if ($email === 'admin@fake9ja.ng' && ($password === 'admin123' || $password === 'admin9ja2026')) {
            session(['fake9ja_admin_logged' => true]);
            return redirect()->route('admin.index')->with('success', 'Welcome Chief Inspector. Access granted to Fake9ja Command.');
        }

        return back()->with('error', 'Access Denied: Invalid Chief Inspector credentials. Only authorized administrators can access.');
    }

    public function logout()
    {
        session()->forget('fake9ja_admin_logged');
        return redirect()->route('admin.index')->with('success', 'Logged out of Inspector Desk.');
    }

    public function updateStatus(Request $request, $id)
    {
        if (!session('fake9ja_admin_logged')) {
            return redirect()->route('admin.index');
        }

        $report = Report::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:received,under_review,verified_fake,verified_original,escalated',
            'reviewer_note' => 'nullable|string',
            'risk_level' => 'nullable|in:low,medium,high',
        ]);

        $report->status = $validated['status'];
        if (isset($validated['reviewer_note']) && !empty($validated['reviewer_note'])) {
            $report->reviewer_note = $validated['reviewer_note'];
        }
        if (isset($validated['risk_level'])) {
            $report->risk_level = $validated['risk_level'];
        }
        $report->save();

        $statusLabel = strtoupper(str_replace('_', ' ', $report->status));
        return back()->with('success', "Report #{$report->reference_id} ('{$report->product_name}') marked as {$statusLabel}");
    }

    public function storeProduct(Request $request)
    {
        if (!session('fake9ja_admin_logged')) {
            return redirect()->route('admin.index');
        }

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
            'status' => 'required|in:received,under_review,verified_fake,verified_original,escalated',
            'risk_level' => 'required|in:low,medium,high',
            'is_priority' => 'nullable|boolean',
            'evidence.*' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,mp4,mov|max:20480',
        ]);

        do {
            $refId = 'EIE-NG-' . mt_rand(100000, 999999);
        } while (Report::where('reference_id', $refId)->exists());

        $isPriority = $request->boolean('is_priority', false);

        $report = Report::create([
            'reference_id' => $refId,
            'product_name' => $validated['product_name'],
            'brand' => $validated['brand'] ?? null,
            'category' => $validated['category'],
            'state' => $validated['state'],
            'market_address' => $validated['market_address'],
            'issue_type' => $validated['issue_type'],
            'details' => $validated['details'] ?? 'Direct Entry by Fake9ja Chief Inspector Desk.',
            'reviewer_note' => $validated['reviewer_note'] ?? 'Official Inspector entry recorded in registry.',
            'purchase_price' => $validated['purchase_price'] ?? null,
            'reporter_contact' => 'Fake9ja Chief Inspector Desk',
            'is_anonymous' => false,
            'status' => $validated['status'],
            'risk_level' => $validated['risk_level'],
            'is_priority' => $isPriority,
        ]);

        // Increment hotspot count for this state
        MarketHotspot::where('state', $validated['state'])->increment('incident_count');

        // Handle uploaded images/evidence files
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

        $readableStatus = strtoupper(str_replace('_', ' ', $report->status));
        return redirect()->route('admin.index')->with('success', "New product '{$report->product_name}' (#{$report->reference_id}) added successfully with status: {$readableStatus}!");
    }

    public function updateProduct(Request $request, $id)
    {
        if (!session('fake9ja_admin_logged')) {
            return redirect()->route('admin.index');
        }

        $report = Report::findOrFail($id);

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
            'status' => 'required|in:received,under_review,verified_fake,verified_original,escalated',
            'risk_level' => 'required|in:low,medium,high',
            'is_priority' => 'nullable|boolean',
            'evidence.*' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,mp4,mov|max:20480',
        ]);

        $report->product_name = $validated['product_name'];
        $report->brand = $validated['brand'] ?? null;
        $report->category = $validated['category'];
        $report->state = $validated['state'];
        $report->market_address = $validated['market_address'];
        $report->issue_type = $validated['issue_type'];
        $report->details = $validated['details'];
        $report->reviewer_note = $validated['reviewer_note'];
        $report->purchase_price = $validated['purchase_price'] ?? null;
        $report->status = $validated['status'];
        $report->risk_level = $validated['risk_level'];
        $report->is_priority = $request->boolean('is_priority', false);
        $report->save();

        // Handle newly uploaded evidence files if any
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

        $readableStatus = strtoupper(str_replace('_', ' ', $report->status));
        return redirect()->route('admin.index')->with('success', "Dossier #{$report->reference_id} ('{$report->product_name}') successfully updated! Status: {$readableStatus}");
    }

    public function destroyProduct(Request $request, $id)
    {
        if (!session('fake9ja_admin_logged')) {
            return redirect()->route('admin.index');
        }

        $report = Report::findOrFail($id);
        $refId = $report->reference_id;
        $name = $report->product_name;

        // Delete associated media files
        foreach ($report->media as $media) {
            $filePath = storage_path('app/public/' . $media->file_path);
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
            $media->delete();
        }

        $report->delete();

        return redirect()->route('admin.index')->with('success', "Case Dossier #{$refId} ('{$name}') deleted successfully.");
    }

    public function deleteMedia(Request $request, $id)
    {
        if (!session('fake9ja_admin_logged')) {
            return redirect()->route('admin.index');
        }

        $media = ReportMedia::findOrFail($id);
        $filePath = storage_path('app/public/' . $media->file_path);
        if (file_exists($filePath)) {
            @unlink($filePath);
        }
        $media->delete();

        return back()->with('success', 'Media evidence photo removed.');
    }

    public function publishFake(Request $request)
    {
        return $this->storeProduct($request);
    }

    public function storeTestimony(Request $request)
    {
        if (!session('fake9ja_admin_logged')) {
            return redirect()->route('admin.index');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'platform' => 'required|string',
            'source_url' => 'required|string',
            'author_name' => 'nullable|string',
            'author_handle' => 'nullable|string',
            'location' => 'nullable|string',
            'quote' => 'nullable|string',
            'summary' => 'nullable|string',
            'ai_feature' => 'nullable|string',
            'tag' => 'nullable|string',
            'duration' => 'nullable|string',
            'video_file' => 'nullable|file|mimes:mp4,mov,avi,webm,mkv|max:102400',
        ]);

        $embedUrl = null;
        $localVideoUrl = null;
        $sourceUrl = $validated['source_url'];

        // If local organic video was uploaded
        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('testimonies', 'public');
            $localVideoUrl = '/storage/' . $path;
            $validated['platform'] = 'Organic';
        }

        // Auto-extract embed url for YouTube
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i', $sourceUrl, $matches)) {
            $embedUrl = 'https://www.youtube-nocookie.com/embed/' . $matches[1];
        }

        VideoTestimony::create([
            'title' => $validated['title'],
            'platform' => $validated['platform'],
            'source_url' => $sourceUrl,
            'embed_url' => $embedUrl,
            'local_video_url' => $localVideoUrl,
            'thumbnail_url' => $request->input('thumbnail_url') ?: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
            'author_name' => $validated['author_name'] ?: 'Citizen Sentinel',
            'author_handle' => $validated['author_handle'] ?: '@citizen_sentinel',
            'location' => $validated['location'] ?: 'National Markets, Nigeria',
            'quote' => $validated['quote'],
            'summary' => $validated['summary'],
            'ai_feature' => $validated['ai_feature'] ?: 'AI Forensic Verification Verified',
            'tag' => $validated['tag'] ?: 'Citizen Video Alert',
            'duration' => $validated['duration'] ?: '2:30',
            'is_active' => true,
            'sort_order' => VideoTestimony::count() + 1,
        ]);

        return back()->with('success', 'New Video Testimony / Evidence published to the Landing Page!');
    }

    public function destroyTestimony($id)
    {
        if (!session('fake9ja_admin_logged')) {
            return redirect()->route('admin.index');
        }

        $testimony = VideoTestimony::findOrFail($id);
        if ($testimony->local_video_url) {
            $clean = ltrim(preg_replace('#^/storage/#', '', $testimony->local_video_url), '/');
            $filePath = storage_path('app/public/' . $clean);
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }
        $testimony->delete();

        return back()->with('success', 'Video testimony removed.');
    }
}
