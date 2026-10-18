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
        Schema::create('video_testimonies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('platform', 32)->default('YouTube'); // YouTube, Instagram, TikTok, Facebook, X, Organic
            $table->text('source_url');
            $table->text('embed_url')->nullable();
            $table->text('local_video_url')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->string('author_name')->default('Citizen Sentinel');
            $table->string('author_handle')->nullable();
            $table->string('location')->default('National Markets, Nigeria');
            $table->text('quote')->nullable();
            $table->text('summary')->nullable();
            $table->text('ai_feature')->nullable();
            $table->string('tag')->default('Citizen Alert');
            $table->string('duration', 32)->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_testimonies');
    }
};
