<?php

namespace App\Models;

use App\Models\Zone;
use App\Models\State;
use App\Models\District;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Location extends Model
{
    use HasFactory;
    protected $guarded=[];

    function district() {
        return $this->belongsTo(District::class);
    }

    function zone() {
        return $this->belongsTo(Zone::class);
    }
    function state() {
        return $this->belongsTo(State::class);
    }
}
