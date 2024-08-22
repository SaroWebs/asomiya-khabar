<?php

namespace App\Http\Controllers;

use App\Models\FinSession;
use Illuminate\Http\Request;

class FinSessionController extends Controller
{
    public function api_data() {
        $f_s = FinSession::get();
        return response()->json($f_s);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(FinSession $finSession)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinSession $finSession)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinSession $finSession)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FinSession $finSession)
    {
        //
    }
}
