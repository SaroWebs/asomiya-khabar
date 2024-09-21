<?php

use App\Models\Zone;
use App\Models\State;
use App\Models\District;
use App\Models\Location;
use App\Models\FinSession;
use App\Models\Publication;
use Illuminate\Http\Request;
use App\Models\CirculationRoute;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ZoneController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\EditionController;
use App\Http\Controllers\ConsumerController;
use App\Http\Controllers\DistrictController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\FinSessionController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\CirculationRouteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::controller(StateController::class)->group(function(){
    Route::get('/states', 'api_data');
});

Route::controller(DistrictController::class)->group(function(){
    Route::get('/districts', 'api_data');
});
Route::controller(ZoneController::class)->group(function(){
    Route::get('/zones', 'api_data');
});

Route::controller(LocationController::class)->group(function(){
    Route::get('/locations', 'api_data');
});

Route::controller(FinSessionController::class)->group(function(){
    Route::get('/fin-session', 'api_data');
    Route::get('/active/finsession', 'active_item');
});

Route::controller(PublicationController::class)->group(function(){
    Route::get('/publications', 'api_data');
    Route::get('/active/publication', 'active_item');
});

Route::controller(EditionController::class)->group(function(){
    Route::get('/publication/{publication}/editions', 'api_data');
});

Route::controller(AgentController::class)->group(function(){
    Route::get('/agents', 'api_data');
    Route::get('/subagents', 'get_subagents');
});
Route::controller(ConsumerController::class)->group(function(){
    Route::get('/consumers', 'api_data');
    Route::get('/consumer/types', 'get_types');
});

Route::controller(CirculationRouteController::class)->group(function(){
    Route::get('/c-routes', 'api_data');
});

Route::controller(SubscriberController::class)->group(function(){
    Route::get('/subscribers', 'api_data');
});
