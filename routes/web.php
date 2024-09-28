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
use App\Http\Controllers\AgentController;
use App\Http\Controllers\CirculationRouteController;
use App\Http\Controllers\ConsumerController;
use App\Http\Controllers\DispatchController;
use App\Http\Controllers\SubscriberController;

Route::controller(PagesController::class)->group(function () {
    Route::get('/', 'welcome');
});

Route::middleware('auth')->group(function () {
    Route::controller(PagesController::class)->group(function () {
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::get('/master/agents', 'master_agents');
        Route::get('/master/consumers', 'master_consumers');
        Route::get('/master/subscribers', 'master_subscribers');
        Route::get('/master/publications', 'master_publications');
        Route::get('/master/locations', 'master_locations');
        // tasks
        Route::get('/task/dispatch-entry', 'dispatchEntry');
        Route::get('/task/label-printing', 'labelPrinting');
        Route::get('/task/print-order', 'printOrder');
        Route::get('/task/challan', 'challanGeneration');
        Route::get('/task/dispatch-checklist', 'dispatchChecklist');
        Route::get('/task/unsold-return-entry', 'unsoldReturnEntry');
        // register
        Route::get('/register/sales-register', 'salesRegister');
    });

    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });


    Route::controller(LocationController::class)->group(function () {
        Route::post('/location/create', 'store');
        Route::delete('/location/{location}', 'destroy');
        Route::put('/location/update/{location}', 'update');
    });


    Route::controller(CirculationRouteController::class)->group(function () {
        Route::post('/c-route/create', 'store');
        Route::delete('/c-route/{cr}', 'destroy');
    });
    Route::controller(ZoneController::class)->group(function () {
        Route::post('/zone/create', 'store');
    });


    Route::controller(FinSessionController::class)->group(function () {
        //Route::
    });

    Route::controller(EditionController::class)->group(function () {
        Route::post('/edition/{publication}/create', 'store');
        Route::delete('/edition/{edition}', 'destroy');
        Route::patch('/edition/{edition}/update-status', 'updateStatus');
        Route::patch('/edition/{edition}/activate', 'activate');
    });

    Route::controller(PublicationController::class)->group(function () {
        Route::post('/publication/create', 'store');
        Route::delete('/publication/{publication}', 'destroy');
        Route::patch('/publication/{publication}', 'update');
        Route::patch('/publication/{publication}/activate', 'activate');
    });

    Route::controller(AgentController::class)->group(function () {
        Route::post('/agency/create', 'store');
        Route::delete('/agency/{agent}', 'destroy');
        Route::put('/agency/{agent}', 'update');
    });

    Route::controller(ConsumerController::class)->group(function () {
        Route::post('/consumer/create', 'store');
        Route::post('/consumer_type/create', 'type_store');
        Route::delete('/consumer/{consumer}', 'destroy');
        Route::delete('/consumer_type/{consumer_type}', 'type_destroy');
        Route::put('/consumer/{consumer}', 'update');
        Route::put('/consumer_type/{consumer_type}', 'type_update');
    });

    Route::controller(SubscriberController::class)->group(function () {
        Route::post('/subscriber/create', 'store');
        Route::put('/subscriber/{subscriber}', 'update');
        Route::delete('/subscriber/{subscriber}', 'destroy');
    });

    Route::controller(DispatchController::class)->group(function () {
        Route::get('/task-data/dispatches', 'get_data');
        Route::get('/publication/dispatches/{publication}', 'data_by_publication');
        Route::post('/dispatch/store', 'store'); 
        Route::put('/dispatch/update/{dispatch}', 'update');
        Route::delete('/dispatch/{dispatch}', 'destroy');
    });
});







Route::get('/test', function () {
    return Inertia::render('Test');
});

Route::get('/data/users/test', function () {
    return response()->json(User::get());
});


require __DIR__ . '/auth.php';
