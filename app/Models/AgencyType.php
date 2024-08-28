<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgencyType extends Model
{
    use HasFactory;
    protected $guarded=[];
    public function agents()
    {
        return $this->hasMany(Agent::class);
    }
}
