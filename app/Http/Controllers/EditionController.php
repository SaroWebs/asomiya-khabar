<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use App\Models\Publication;
use Illuminate\Http\Request;

class EditionController extends Controller
{
    public function api_data(Request $request, Publication $publication) {
        $query = Edition::query();
        $query->where('publication_id', $publication->id);
        $ed = $query->get();
        return response()->json($ed);
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
    public function store(Request $request, Publication $publication)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'address' => 'nullable|string',
            'bill_prefix' => 'nullable|string|max:255',
            'receipt_prefix' => 'nullable|string|max:255',
            'pay_prefix' => 'nullable|string|max:255',
            'dn_prefix' => 'nullable|string|max:255',
            'cn_prefix' => 'nullable|string|max:255',
        ]);

        $edition = $publication->editions()->create($validated);

        return response()->json($edition, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Edition $edition)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Edition $edition)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Edition $edition)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Edition $edition)
    {
        $edition->delete();
        return response()->json(null, 204);
    }

    public function activate(Edition $edition)
    {
        $edition->publication->editions()->where('id', '!=', $edition->id)->update(['active' => 0]);
        $edition->update(['active' => 1]);
        return response()->json($edition, 200);
    }
    public function updateStatus(Request $request, Edition $edition)
    {
        $validated = $request->validate([
            'active' => 'required|boolean',
        ]);

        if ($validated['active']) {
            $edition->publication->editions()->where('id', '!=', $edition->id)->update(['active' => false]);
        }

        $edition->update($validated);

        return response()->json($edition, 200);
    }
}
