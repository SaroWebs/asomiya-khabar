<?php

namespace App\Models;

use App\Models\Edition;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
    public function editions()
    {
        return $this->hasMany(Edition::class);
    }
}
