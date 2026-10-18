<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Reports Table (100% Free Public Citizen Intelligence)
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('reference_id', 32)->unique();
            $table->string('product_name');
            $table->string('brand')->nullable();
            $table->string('category', 64);
            $table->string('state', 64);
            $table->string('market_address');
            $table->string('issue_type');
            $table->text('details')->nullable();
            $table->string('purchase_price', 64)->nullable();
            $table->string('reporter_contact')->nullable();
            $table->boolean('is_anonymous')->default(true);
            $table->string('status', 32)->default('received'); // received, under_review, verified_fake, verified_original, escalated
            $table->string('risk_level', 16)->default('medium'); // low, medium, high
            $table->boolean('is_priority')->default(false);
            $table->text('reviewer_note')->nullable();
            $table->timestamps();
        });

        // Report Media Table
        Schema::create('report_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained('reports')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('file_type', 16)->default('image'); // image, video
            $table->string('file_name')->nullable();
            $table->timestamps();
        });

        // Free Brand Protection Registrations
        Schema::create('brand_watches', function (Blueprint $table) {
            $table->id();
            $table->string('brand_name');
            $table->string('company_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('monitored_skus')->nullable();
            $table->string('status', 32)->default('active');
            $table->timestamps();
        });

        // Market Hotspots Table
        Schema::create('market_hotspots', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('state', 64);
            $table->integer('incident_count')->default(0);
            $table->string('risk_level', 16)->default('medium');
            $table->string('trend', 16)->default('up');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_hotspots');
        Schema::dropIfExists('brand_watches');
        Schema::dropIfExists('report_media');
        Schema::dropIfExists('reports');
    }
};
