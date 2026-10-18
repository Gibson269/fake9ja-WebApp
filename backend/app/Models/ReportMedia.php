<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportMedia extends Model
{
    use HasFactory;

    protected $table = 'report_media';

    protected $fillable = [
        'report_id',
        'file_path',
        'file_type',
        'file_name',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}
