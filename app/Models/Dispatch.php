<?php

namespace App\Models;

use App\Models\Agent;
use App\Models\Publication;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Dispatch extends Model
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

    public function bill()
    {
        return $this->belongsTo(Bill::class, 'billid');
    }
}
