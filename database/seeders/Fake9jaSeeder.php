<?php

namespace Database\Seeders;

use App\Models\BrandWatch;
use App\Models\MarketHotspot;
use App\Models\Report;
use Illuminate\Database\Seeder;

class Fake9jaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Hotspots
        $hotspots = [
            ['name' => 'Balogun Market, Lagos Island', 'state' => 'Lagos', 'incident_count' => 184, 'risk_level' => 'high', 'trend' => 'up'],
            ['name' => 'Sabon Gari Market, Kano', 'state' => 'Kano', 'incident_count' => 142, 'risk_level' => 'high', 'trend' => 'up'],
            ['name' => 'Computer Village, Ikeja', 'state' => 'Lagos', 'incident_count' => 119, 'risk_level' => 'medium', 'trend' => 'stable'],
            ['name' => 'Ariaria International Market, Aba', 'state' => 'Abia', 'incident_count' => 97, 'risk_level' => 'high', 'trend' => 'up'],
            ['name' => 'Onitsha Main Market', 'state' => 'Anambra', 'incident_count' => 163, 'risk_level' => 'high', 'trend' => 'up'],
            ['name' => 'Wuse Market, Abuja', 'state' => 'FCT Abuja', 'incident_count' => 68, 'risk_level' => 'medium', 'trend' => 'down'],
            ['name' => 'Ladipo Auto Spare Parts Market', 'state' => 'Lagos', 'incident_count' => 88, 'risk_level' => 'high', 'trend' => 'up'],
            ['name' => 'Mile 3 Market, Port Harcourt', 'state' => 'Rivers', 'incident_count' => 52, 'risk_level' => 'medium', 'trend' => 'stable'],
        ];

        foreach ($hotspots as $h) {
            MarketHotspot::firstOrCreate(['name' => $h['name']], $h);
        }

        // 2. Seed Free Public Reports
        $sampleReports = [
            [
                'reference_id' => 'EIE-NG-248193',
                'product_name' => 'Amatem Forte Softgel / Tablets',
                'brand' => 'Amatem',
                'category' => 'Medicines',
                'state' => 'Kano',
                'market_address' => 'Sabon Gari Market, Kano',
                'issue_type' => 'Fake NAFDAC & Blurred Batch Code',
                'details' => 'Purchased blister pack with missing hologram seal and unverifiable scratch PIN.',
                'purchase_price' => '₦2,400',
                'reporter_contact' => null,
                'is_anonymous' => true,
                'status' => 'verified_fake',
                'risk_level' => 'high',
                'is_priority' => true,
                'reviewer_note' => 'Confirmed clone batch. Chemical inspection confirmed adulterated active pharmaceutical ingredient (API).',
            ],
            [
                'reference_id' => 'EIE-NG-248192',
                'product_name' => 'FloraPure Radiance Body Lotion',
                'brand' => 'FloraPure',
                'category' => 'Cosmetics',
                'state' => 'Lagos',
                'market_address' => 'Balogun Market, Lagos Island',
                'issue_type' => 'Tampered Cap & Chemical Odour',
                'details' => 'The inner seal looked re-glued with hot glue and caused severe rash after one test patch.',
                'purchase_price' => '₦4,800',
                'reporter_contact' => null,
                'is_anonymous' => true,
                'status' => 'under_review',
                'risk_level' => 'medium',
                'is_priority' => false,
                'reviewer_note' => 'Sample collected for pH and mercury screening.',
            ],
            [
                'reference_id' => 'EIE-NG-248191',
                'product_name' => 'Total Quartz 9000 Engine Oil (5L)',
                'brand' => 'TotalEnergies',
                'category' => 'Automotive',
                'state' => 'Lagos',
                'market_address' => 'Ladipo Auto Spare Parts Market, Mushin',
                'issue_type' => 'Cloned QR Code & Thin Viscosity',
                'details' => 'QR code redirected to a deceptive lookalike website instead of totalenergies.ng.',
                'purchase_price' => '₦22,000',
                'reporter_contact' => 'auto-mech@lagos.ng',
                'is_anonymous' => false,
                'status' => 'verified_fake',
                'risk_level' => 'high',
                'is_priority' => true,
                'reviewer_note' => 'Recycled motor oil packaged in counterfeit branded plastic containers.',
            ],
            [
                'reference_id' => 'EIE-NG-248190',
                'product_name' => 'Golden Penny Semovita 10kg',
                'brand' => 'Golden Penny',
                'category' => 'Food & drinks',
                'state' => 'FCT Abuja',
                'market_address' => 'Wuse Market, Abuja',
                'issue_type' => 'Discolored Grains & Chalky Smell',
                'details' => 'Bag stitching was single-thread instead of standard factory twin-stitch.',
                'purchase_price' => '₦7,200',
                'reporter_contact' => null,
                'is_anonymous' => true,
                'status' => 'received',
                'risk_level' => 'low',
                'is_priority' => false,
                'reviewer_note' => null,
            ],
            [
                'reference_id' => 'EIE-NG-248189',
                'product_name' => 'Oraimo 20000mAh Power Bank',
                'brand' => 'Oraimo',
                'category' => 'Electronics',
                'state' => 'Lagos',
                'market_address' => 'Computer Village, Ikeja',
                'issue_type' => 'Counterfeit Hologram & Overheating',
                'details' => 'Weighed 140g less than original unit and battery swelled on initial charge.',
                'purchase_price' => '₦14,500',
                'reporter_contact' => 'ikeja-shopper@gmail.com',
                'is_anonymous' => false,
                'status' => 'under_review',
                'risk_level' => 'medium',
                'is_priority' => false,
                'reviewer_note' => 'Serial number matched duplicate sequence flagged in Ikeja.',
            ],
            [
                'reference_id' => 'EIE-NG-248188',
                'product_name' => 'Hollandia Evaporated Milk (Carton)',
                'brand' => 'CHI Limited',
                'category' => 'Food & drinks',
                'state' => 'Rivers',
                'market_address' => 'Mile 3 Market, Port Harcourt',
                'issue_type' => 'Altered Expiry Stamp',
                'details' => 'Expiry date had double laser printing over faded original 2024 date.',
                'purchase_price' => '₦16,000',
                'reporter_contact' => null,
                'is_anonymous' => true,
                'status' => 'received',
                'risk_level' => 'low',
                'is_priority' => false,
                'reviewer_note' => null,
            ],
        ];

        foreach ($sampleReports as $rep) {
            Report::firstOrCreate(['reference_id' => $rep['reference_id']], $rep);
        }

        // 3. Free brand watch monitoring
        BrandWatch::firstOrCreate(
            ['brand_name' => 'Amatem Pharmaceuticals'],
            [
                'company_name' => 'Amatem Health Nigeria Ltd',
                'email' => 'compliance@amatem.ng',
                'phone' => '08021234567',
                'monitored_skus' => 'Amatem Softgel, Amatem Forte, Amatem Susp.',
                'status' => 'active',
            ]
        );
    }
}
