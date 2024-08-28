<?php

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ZoneController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\EditionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\FinSessionController;
use App\Http\Controllers\PublicationController;

Route::controller(PagesController::class)->group(function () {
    Route::get('/', 'welcome');
});

Route::middleware('auth')->group(function () {
    Route::controller(PagesController::class)->group(function () {
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::get('/master/agents', 'master_agents');
        Route::get('/master/sub-agents', 'master_subagents');
        Route::get('/master/consumers', 'master_consumers');
        Route::get('/master/publications', 'master_publications');
        Route::get('/master/locations', 'master_locations');
    });

    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });


    Route::controller(LocationController::class)->group(function(){
        Route::post('/location/create', 'store');
        Route::delete('/location/{location}', 'destroy');
        Route::put('/location/update/{location}', 'update');
    });

    
    Route::controller(ZoneController::class)->group(function(){
        Route::post('/zone/create', 'store');
    });


    Route::controller(FinSessionController::class)->group(function(){
        //Route::
    });

    Route::controller(EditionController::class)->group(function(){
        Route::post('/edition/{publication}/create', 'store');
        Route::delete('/edition/{edition}', 'destroy');
        Route::patch('/edition/{edition}/update-status', 'updateStatus');
        Route::patch('/edition/{edition}/activate', 'activate');
    });

    Route::controller(PublicationController::class)->group(function(){
        Route::post('/publication/create', 'store');
        Route::delete('/publication/{publication}', 'destroy');
        Route::patch('/publication/{publication}', 'update');
        Route::patch('/publication/{publication}/activate', 'activate');
    });
    
});







Route::get('/test', function () {
    return Inertia::render('Test');
});

Route::get('/data/users/test', function () {
    return response()->json(User::get());
});


require __DIR__ . '/auth.php';
