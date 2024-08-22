<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function parent()
    {
        return $this->belongsTo(Publication::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Publication::class, 'parent_id');
    }
}
