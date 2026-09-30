<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoTestimony extends Model
{
    use HasFactory;

    protected $table = 'video_testimonies';

    protected $fillable = [
        'title',
        'platform',
        'source_url',
        'embed_url',
        'local_video_url',
        'thumbnail_url',
        'author_name',
        'author_handle',
        'location',
        'quote',
        'summary',
        'ai_feature',
        'tag',
        'duration',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
