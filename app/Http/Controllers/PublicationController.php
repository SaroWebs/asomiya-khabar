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
        $pb = $query->with(['parent', 'children'])->get();
        return response()->json($pb);
    }

    public function active_item()
    {
        $query = Publication::query();
        $query->where('active', 1);
        $pb = $query->with(['parent', 'children'])->first();
        if ($pb) {
            return response()->json($pb, 200);
        }
        return response()->json($pb, 400);
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
        $request->validate([
            'code' => 'required'
        ]);
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
    public function update(Request $request, Publication $publication)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Publication $publication)
    {
        //
    }
}
