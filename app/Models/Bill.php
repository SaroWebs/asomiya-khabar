<?php

namespace App\Models;

use App\Models\Agent;
use App\Models\Dispatch;
use App\Models\Publication;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bill extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function publication()
    {
        return $this->belongsTo(Publication::class, 'publication_id');
    }

    public function dispatch()
    {
        return $this->hasMany(Dispatch::class, 'billid');
    }
}
