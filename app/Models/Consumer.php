<?php

namespace App\Models;

use App\Models\Location;
use App\Models\ConsumerType;
use App\Models\CirculationRoute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Consumer extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function circulation_route() {
        return $this->belongsTo(CirculationRoute::class);
    }
    public function location() {
        return $this->belongsTo(Location::class);
    }
    public function consumer_type() {
        return $this->belongsTo(ConsumerType::class);
    }
}
