<?php

namespace Tests\Feature;

use App\Models\BrandWatch;
use App\Models\Report;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Fake9jaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_report_to_database(): void
    {
        $payload = [
            'name' => 'Fake Panadol Extra (Paracetamol 500mg)',
            'brand' => 'GSK Panadol',
            'category' => 'Medicines',
            'state' => 'Lagos',
            'market' => 'Oshodi Drug Market',
            'issue' => 'Flaking foil blister, missing NAFDAC batch',
            'price' => '₦450',
            'details' => 'Tablet disintegrated into powder on light touch.',
            'contact' => 'shopper@test.ng',
            'is_anonymous' => false,
            'is_priority' => true,
        ];

        $response = $this->postJson('/api/reports', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('reports', [
            'product_name' => 'Fake Panadol Extra (Paracetamol 500mg)',
            'state' => 'Lagos',
            'market_address' => 'Oshodi Drug Market',
            'purchase_price' => '₦450',
        ]);
    }

    public function test_can_submit_quick_intake_report_with_3_core_data(): void
    {
        // 3 core data: Product Type, Purchased Location, Amount Paid for it
        $payload = [
            'product_type' => 'Cosmetics & Skincare',
            'purchased_location' => 'Balogun Market, Lagos Island',
            'amount_paid' => '₦3,200',
        ];

        $response = $this->postJson('/api/reports', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('reports', [
            'category' => 'Cosmetics & Skincare',
            'market_address' => 'Balogun Market, Lagos Island',
            'purchase_price' => '₦3,200',
        ]);
    }

    public function test_can_track_report_by_reference(): void
    {
        $report = Report::create([
            'reference_id' => 'EIE-NG-998877',
            'product_name' => 'Counterfeit Perfume',
            'category' => 'Cosmetics',
            'state' => 'Abuja',
            'market_address' => 'Wuse II Market',
            'issue_type' => 'Pungent chemical odor',
            'purchase_price' => '₦8,000',
            'status' => 'under_review',
            'risk_level' => 'medium',
        ]);

        $response = $this->getJson('/api/reports/track/EIE-NG-998877');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'reference_id' => 'EIE-NG-998877',
                'product_name' => 'Counterfeit Perfume',
            ]);
    }

    public function test_can_validate_welcome30_coupon(): void
    {
        $response = $this->postJson('/api/coupons/validate', ['code' => 'WELCOME30']);

        $response->assertStatus(200)
            ->assertJson([
                'valid' => true,
                'discount_percent' => 30,
            ]);
    }

    public function test_can_register_brand_watch_in_database(): void
    {
        $payload = [
            'brand_name' => 'Nestle Milo',
            'company_name' => 'Nestle Nigeria Plc',
            'email' => 'brand-protection@ng.nestle.com',
            'phone' => '+2348030000000',
            'monitored_skus' => 'Milo 500g refill pack, Milo 20g sachets',
        ];

        $response = $this->postJson('/api/brand-watches', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('brand_watches', [
            'brand_name' => 'Nestle Milo',
            'email' => 'brand-protection@ng.nestle.com',
        ]);
    }

    public function test_admin_can_authenticate_with_credentials(): void
    {
        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@fake9ja.ng',
            'password' => 'admin123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'token',
                'user' => ['name', 'email', 'role'],
            ]);
    }

    public function test_admin_login_rejects_invalid_password(): void
    {
        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@fake9ja.ng',
            'password' => 'wrongpass',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_admin_can_create_and_delete_market_hotspot(): void
    {
        $createRes = $this->postJson('/api/admin/hotspots', [
            'name' => 'Alaba Rago Market',
            'state' => 'Lagos',
            'risk_level' => 'high',
            'incident_count' => 15,
        ]);

        $createRes->assertStatus(201)
            ->assertJson(['success' => true]);

        $hotspotId = $createRes->json('data.id');

        $deleteRes = $this->deleteJson("/api/admin/hotspots/{$hotspotId}");
        $deleteRes->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_admin_can_publish_verified_fake_product(): void
    {
        $payload = [
            'product_name' => 'Counterfeit Coartem 20/120mg',
            'brand' => 'Novartis',
            'category' => 'Medicines',
            'state' => 'Kano',
            'market_address' => 'Sabon Gari Market, Line 2',
            'issue_type' => 'Missing Scratch PIN & Fake NAFDAC Stamp',
            'details' => 'Spectroscopic lab test confirmed 0% artemether.',
            'reviewer_note' => 'Official Public Hazard Advisory: Dispose immediately.',
            'purchase_price' => '₦1,800',
            'risk_level' => 'high',
        ];

        $response = $this->postJson('/api/admin/publish-fake', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonFragment([
                'product_name' => 'Counterfeit Coartem 20/120mg',
                'status' => 'verified_fake',
                'risk_level' => 'high',
            ]);

        $this->assertDatabaseHas('reports', [
            'product_name' => 'Counterfeit Coartem 20/120mg',
            'status' => 'verified_fake',
            'state' => 'Kano',
        ]);
    }
}

