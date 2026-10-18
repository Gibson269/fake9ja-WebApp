<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandWatch extends Model
{
    use HasFactory;

    protected $table = 'brand_watches';

    protected $fillable = [
        'brand_name',
        'company_name',
        'email',
        'phone',
        'monitored_skus',
        'status',
    ];
}
