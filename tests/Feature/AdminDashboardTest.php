<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\ReportMedia;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_dashboard_when_logged_in(): void
    {
        $response = $this->withSession(['fake9ja_admin_logged' => true])
            ->get('/admin');

        $response->assertStatus(200);
        $response->assertSee('Inspector Command Overview');
        $response->assertSee('Add New Product / Incident');
        $response->assertSee('Product Incident Registry');
    }

    public function test_admin_can_add_product_with_image_and_status(): void
    {
        Storage::fake('public');

        $image = UploadedFile::fake()->image('counterfeit_sample.jpg');

        $payload = [
            'product_name' => 'Fake Postinor-2 Emergency Contraceptive',
            'brand' => 'Gedeon Richter',
            'category' => 'Pharmaceuticals & Drugs',
            'state' => 'Lagos',
            'market_address' => 'Idumota Drug Market, Line 5',
            'issue_type' => 'Spelling or Printing Errors on Box',
            'details' => 'Packaging printed in faint cyan with blurry logo.',
            'reviewer_note' => 'Confirmed counterfeit batch. Immediate alert issued.',
            'purchase_price' => '₦1,200',
            'status' => 'verified_fake',
            'risk_level' => 'high',
            'is_priority' => 1,
            'evidence' => [$image],
        ];

        $response = $this->withSession(['fake9ja_admin_logged' => true])
            ->post('/admin/products', $payload);

        $response->assertRedirect('/admin');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('reports', [
            'product_name' => 'Fake Postinor-2 Emergency Contraceptive',
            'brand' => 'Gedeon Richter',
            'status' => 'verified_fake',
            'risk_level' => 'high',
            'state' => 'Lagos',
        ]);

        $created = Report::where('product_name', 'Fake Postinor-2 Emergency Contraceptive')->first();
        $this->assertNotNull($created);
        $this->assertEquals(1, $created->media()->count());
    }

    public function test_admin_can_update_product_details_and_status(): void
    {
        $report = Report::create([
            'reference_id' => 'EIE-NG-112233',
            'product_name' => 'Dubious Malt Drink',
            'category' => 'Packaged Foods & Drinks',
            'state' => 'Ogun',
            'market_address' => 'Sango Ota Market',
            'issue_type' => 'Strange Smell, Texture, or Color',
            'status' => 'received',
            'risk_level' => 'medium',
        ]);

        $updatePayload = [
            'product_name' => 'Adulterated Malt Drink with Chemical Odor',
            'brand' => 'Unknown Bogus Bottler',
            'category' => 'Packaged Foods & Drinks',
            'state' => 'Ogun',
            'market_address' => 'Sango Ota Market, Lane 2',
            'issue_type' => 'Adulterated or Toxic Chemical Content',
            'details' => 'Whistleblower noticed pungent chemical odor.',
            'reviewer_note' => 'Lab analysis detected toxic solvents.',
            'purchase_price' => '₦350',
            'status' => 'verified_fake',
            'risk_level' => 'high',
        ];

        $response = $this->withSession(['fake9ja_admin_logged' => true])
            ->post("/admin/products/{$report->id}/update", $updatePayload);

        $response->assertRedirect('/admin');

        $report->refresh();
        $this->assertEquals('Adulterated Malt Drink with Chemical Odor', $report->product_name);
        $this->assertEquals('verified_fake', $report->status);
        $this->assertEquals('high', $report->risk_level);
        $this->assertEquals('Lab analysis detected toxic solvents.', $report->reviewer_note);
    }

    public function test_admin_can_delete_product(): void
    {
        $report = Report::create([
            'reference_id' => 'EIE-NG-998877',
            'product_name' => 'Test Dummy Product',
            'category' => 'Other Consumer Goods',
            'state' => 'Kano',
            'market_address' => 'Kurmi Market',
            'issue_type' => 'Other Blatant Counterfeit Defect',
            'status' => 'received',
        ]);

        $response = $this->withSession(['fake9ja_admin_logged' => true])
            ->post("/admin/products/{$report->id}/delete");

        $response->assertRedirect('/admin');
        $this->assertDatabaseMissing('reports', ['id' => $report->id]);
    }
}
