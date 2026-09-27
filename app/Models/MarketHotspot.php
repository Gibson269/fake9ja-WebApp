<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketHotspot extends Model
{
    use HasFactory;

    protected $table = 'market_hotspots';

    protected $fillable = [
        'name',
        'state',
        'incident_count',
        'risk_level',
        'trend',
    ];
}
