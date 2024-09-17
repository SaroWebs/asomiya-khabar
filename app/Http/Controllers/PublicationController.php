<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;

class PublicationController extends Controller
{
    /**
     * Display a listing of the api resource.
     */
    public function api_data(Request $request)
    {
        $query = Publication::query();

        $code = $request->input('code');
        if ($code) $query->where('code', $code);

        $parent = $request->input('parent');
        if ($parent) $query->where('parent_id', $parent);
        $pb = $query->with(['parent', 'children', 'editions'])->get();
        return response()->json($pb);
    }

    public function active_item()
    {
        $query = Publication::query();
        $query->where('active', 1);
        $pb = $query->with(['parent', 'children', 'editions'])->first();
        return response()->json($pb, 200);
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
            'name' => 'required|string',
            'code' => 'nullable|string',
            'frequency' => 'required|integer|min:1',
            'parent_id' => 'nullable|exists:publications,id',
            'supplement' => 'integer|in:0,1',
            'rni_no' => 'nullable|string',
            'davp_code' => 'nullable|string',
            'late_city' => 'integer|in:0,1',
            'mr_code' => 'nullable|string',
            'daily_rate' => 'nullable|numeric|min:0',
            'active' => 'integer|in:0,1',
        ]);

        if ($validatedData['active'] == 1) {
            Publication::query()->update(['active' => 0]);
            $validatedData['active'] = 1;
        }

        $publication = Publication::create($validatedData);

        return response()->json($publication, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Publication $publication)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Publication $publication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function activate(Publication $publication)
    {
        Publication::query()->update(['active' => 0]);

        $publication->update([
            'active' => 1
        ]);
        return response()->json($publication, 200);
    }

    public function update(Request $request, Publication $publication)
    {
        $validatedData = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        if ($validatedData['is_active']) {
            Publication::query()->update(['active' => 0]);
        }

        $publication->update([
            'active' => $validatedData['is_active']
        ]);

        return response()->json($publication, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Publication $publication)
    {
        try {
            $publication->delete();
            return response()->json(['message' => 'Publication deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting publication', 'error' => $e->getMessage()], 500);
        }
    }
}
