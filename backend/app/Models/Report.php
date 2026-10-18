<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_id',
        'product_name',
        'brand',
        'category',
        'state',
        'market_address',
        'issue_type',
        'details',
        'purchase_price',
        'reporter_contact',
        'is_anonymous',
        'status',
        'risk_level',
        'is_priority',
        'reviewer_note',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'is_priority' => 'boolean',
    ];

    public function media()
    {
        return $this->hasMany(ReportMedia::class);
    }
}
