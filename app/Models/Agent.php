<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;
    protected $guarded=[];
    
    public function agencyType()
    {
        return $this->belongsTo(AgencyType::class);
    }

    public function parent()
    {
        return $this->belongsTo(Agent::class, 'parent');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function route()
    {
        return $this->belongsTo(CirculationRoute::class);
    }
}
