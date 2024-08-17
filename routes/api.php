<?php

use App\Models\District;
use App\Models\Location;
use App\Models\State;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/states', function () {
    $states = State::get();
    return response()->json($states);
});

Route::get('/districts', function (Request $request) {
    $s_code = $request->input('state');
    $query = District::query();
    if ($s_code) {
        $query->where('state_code', $s_code);
    }
    return response()->json($query->get());
});

Route::get('/zones', function (Request $request) {
    $s_code = $request->input('state');
    $query = Zone::query();
    if ($s_code) {
        $query->where('state_code', $s_code);
    }
    return response()->json($query->get());
});


Route::get('/locations', function (Request $request) {
    $d_code = $request->input('district');
    $s_code = $request->input('state');
    $query = Location::query();

    if ($d_code) {
        $district = District::where('district_code', $d_code)->first();
        if ($district) $query->where('district_id', $district->id);
    }

    if ($s_code) {
        $districts = District::where('state_code', $s_code)->pluck('id');
        if ($districts->isNotEmpty()){
            $query->whereIn('district_id', $districts);
        }else{
            $st = State::where('code', $s_code)->first();
            $query->where('state_id', $st->id);
        }
    }

    return response()->json($query->with(['district', 'zone', 'state'])->get());
});
