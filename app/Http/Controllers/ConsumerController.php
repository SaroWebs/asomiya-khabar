<?php

namespace App\Http\Controllers;

use App\Models\Consumer;
use App\Models\ConsumerType;
use Illuminate\Http\Request;

class ConsumerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function api_data()
    {
        $consumers = Consumer::get();
        return response()->json($consumers);
    }
    
    public function get_types()
    {
        $ct = ConsumerType::get();
        return response()->json($ct);
    }
    
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
            'name' => 'required|string',
            'consumer_type_id' => 'nullable|exists:consumer_types,id',
            'location_id' => 'nullable|exists:locations,id',
            'circulation_route_id' => 'nullable|exists:circulation_routes,id',
            'address' => 'nullable|string',
            'pin' => 'nullable|string',
            'phone' => 'nullable|string',
            'fax' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $consumer = Consumer::create($validatedData);

        return response()->json(['message' => 'Consumer created successfully', 'consumer' => $consumer], 201);
    }
    
    public function type_store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|unique:consumer_types,name'
        ]);

        $consumerType = ConsumerType::create($validatedData);

        return response()->json(['message' => 'Consumer type created successfully', 'consumerType' => $consumerType], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Consumer $consumer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Consumer $consumer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Consumer $consumer)
    {
        //
    }
    public function type_update(Request $request, ConsumerType $consumer_type)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Consumer $consumer)
    {
        //
    }
    public function type_destroy(ConsumerType $consumer_type)
    {
        //
    }
}
