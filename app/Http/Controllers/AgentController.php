<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\Request;
use App\Models\AgencyType;
use App\Models\Location;
use App\Models\CirculationRoute;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AgentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $agents = Agent::with('agencyType')->where('parent', '')->get();
        $agencyTypes = AgencyType::all();
        $locations = Location::all();
        $routes = CirculationRoute::all();

        return Inertia::render('Master/Agents/Index', [
            'agents' => $agents,
            'agencyTypes' => $agencyTypes,
            'locations' => $locations,
            'routes' => $routes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'contact_person' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:255',
                'fax_no' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'postal_code' => 'nullable|string|max:255',
                'address' => 'nullable|string',
                'parent' => 'nullable|exists:agents,id',
                'agency_type_id' => 'required|exists:agency_types,id',
                'location_id' => 'required|exists:locations,id',
                'route_id' => 'required|exists:circulation_routes,id',
                'is_latecity' => 'boolean',
            ]);

            $agent = Agent::create($validated);

            return response()->json(['success' => 'Agent created successfully.', 'agent' => $agent], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create agent: ' . $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Agent $agent)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Agent $agent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Agent $agent)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'contact_person' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:255',
                'fax_no' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'postal_code' => 'nullable|string|max:255',
                'address' => 'nullable|string',
                'parent' => 'nullable|exists:agents,id',
                'agency_type_id' => 'required|exists:agency_types,id',
                'location_id' => 'required|exists:locations,id',
                'route_id' => 'required|exists:circulation_routes,id',
                'is_latecity' => 'boolean',
            ]);

            $agent->update($validated);

            return response()->json(['success' => 'Agent updated successfully.', 'agent' => $agent], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update agent: ' . $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agent $agent)
    {
        try {
            $agent->delete();
            return response()->json(['success' => 'Agent deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete agent: ' . $e->getMessage()], 400);
        }
    }


    /**
     * Get all agents for API.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function api_data()
    {
        try {
            $agents = Agent::where('parent', null)->with(['agency_type', 'parent', 'location', 'route'])->get();
            return response()->json($agents);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch agents: ' . $e->getMessage()], 500);
        }
    }
}
