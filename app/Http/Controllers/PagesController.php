<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\State;
use Illuminate\Http\Request;

class PagesController extends Controller
{
    public function welcome() {
        return Inertia::render('Welcome');
    }

    public function dashboard()
    {
        return Inertia::render('Dashboard');
    }

    public function master_agents()
    {
        return Inertia::render('Master/Agents/index');
    }

    public function master_subagents()
    {
        return Inertia::render('Master/SubAgents/index');
    }

    public function master_consumers()
    {
        return Inertia::render('Master/Consumers/index'); 
    }
    
    public function master_publications()
    {
        return Inertia::render('Master/Publications/index'); 
    }
    public function master_locations()
    {

        return Inertia::render('Master/Locations/index',['states'=> State::get()]); 
    }
}
