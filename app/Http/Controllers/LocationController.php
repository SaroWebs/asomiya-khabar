<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
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
            'name' => 'required|string|max:255',
            'state_id' => 'required|integer|exists:states,id',
            'district_id' => 'nullable|integer',
            'zone_id' => 'nullable|integer',
        ]);

        try {
            $location = Location::create($validatedData);

            if ($location) {
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
    public function show(Location $location)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'state_id' => 'required|integer|exists:states,id',
            'district_id' => 'nullable|integer',
            'zone_id' => 'nullable|integer',
        ]);

        try {
            $location->updateOrFail($validatedData);
            return response()->json(['message' => 'Location updated successfully'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Failed to update location'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        try {
            $location->deleteOrFail();
            return response()->json(['message' => 'Location deleted successfully'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Failed to delete location'], 500);
        }
    }
}
