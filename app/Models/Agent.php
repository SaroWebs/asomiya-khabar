<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'contact_person',
        'phone',
        'fax_no',
        'email',
        'postal_code',
        'address',
        'parent',
        'agency_type_id',
        'location_id',
        'route_id',
        'is_latecity',
    ];

    public function agency_type()
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

    public function dispatches()
    {
        return $this->hasMany(Dispatch::class);
    }

    public function bill()
    {
        return $this->hasMany(Bill::class);
    }
    
}
