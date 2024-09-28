<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Agent;
use App\Models\State;
use App\Models\Location;
use App\Models\AgencyType;
use App\Models\CirculationRoute;
use App\Models\Publication;

class PagesController extends Controller
{
    public function welcome()
    {
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


    public function master_consumers()
    {
        return Inertia::render('Master/Consumers/index');
    }
    public function master_subscribers()
    {
        return Inertia::render('Master/Subscribers/index');
    }

    public function master_publications()
    {
        return Inertia::render('Master/Publications/index');
    }
    public function master_locations()
    {

        return Inertia::render('Master/Locations/index', ['states' => State::get()]);
    }

    public function dispatchEntry()
    {
        return Inertia::render('Tasks/DispatchEntry/index');
    }

    public function labelPrinting()
    {
        return Inertia::render('Tasks/LabelPrint/index');
    }

    public function printOrder()
    {
        // Logic for print order
        return Inertia::render('Tasks/PrintOrder/index');
    }

    public function challanGeneration()
    {
        // Logic for challan generation
    }

    public function dispatchChecklist()
    {
        // Logic for dispatch checklist
    }

    public function unsoldReturnEntry()
    {
        // Logic for unsold return entry
    }


    // register
    public function salesRegister()
    {
        $pb = Publication::with(['editions'])->get();
        $agnt = Agent::with(['dispatches'])->get();
        return Inertia::render('Register/SalesRegister', ['publications' => $pb, 'agents' => $agnt]);
    }
}
