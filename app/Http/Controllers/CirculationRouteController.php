<?php

namespace App\Http\Controllers;

use App\Models\CirculationRoute;
use Illuminate\Http\Request;

class CirculationRouteController extends Controller
{
    public function api_data(Request $req) {
        $query = CirculationRoute::query();
        if($req->location_id){
            $query
                ->where('from_location', $req->location_id)
                ->orWhere('to_location', $req->location_id)
                ;
        }
        return response()->json($query->get());
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $validatedData = $request->validate([
            'from_location' => 'required|exists:locations,id',
            'to_location' => 'required|exists:locations,id',
        ]);

        try {
            $route = CirculationRoute::create($validatedData);

            if ($route) {
                return response()->json(['message' => 'Added'], 201);
            } else {
                return response()->json(['message' => 'Not added'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CirculationRoute $circulationRoute)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CirculationRoute $circulationRoute)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CirculationRoute $circulationRoute)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CirculationRoute $cr)
    {
        try {
            $cr->delete();
            return response()->json(['message' => 'Deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
