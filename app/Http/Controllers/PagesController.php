<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Agent;
use App\Models\State;
use App\Models\Location;
use App\Models\AgencyType;
use App\Models\CirculationRoute;

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
        $agents = Agent::where('parent', null)->with('agency_type')->get();
        $agencyTypes = AgencyType::all();
        $locations = Location::all();
        $routes = CirculationRoute::with(['fromLocation', 'toLocation'])->get()->map(function ($route) {
            $route->name = $route->fromLocation->name . ' - ' . $route->toLocation->name;
            return $route;
        });

        return Inertia::render('Master/Agents/index', [
            'agents' => $agents,
            'agencyTypes' => $agencyTypes,
            'locations' => $locations,
            'routes' => $routes,
        ]);
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
