<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Dispatch;
use App\Models\Publication;
use Illuminate\Http\Request;

class DispatchController extends Controller
{
    public function get_data(Request $request)
    {
        $query = Dispatch::query();
        if ($request->has('publication_id')) {
            $query->where('publication_id', $request->publication_id);
        } else {
            return response()->json([]); // Return empty array if publication_id is not provided
        }

        if ($request->has('search')) {
            $query->where('id', 'like', '%' . $request->input('search') . '%')
                ->orWhere('bill_id', 'like', '%' . $request->input('search') . '%')
                ->orWhereHas('agent', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->input('search') . '%');
                });
        }

        $dispatches = $query->with(['publication','agent'])->get();
        return response()->json($dispatches);
    }

    public function data_by_publication(Request $request, Publication $publication)
    {
        $query = Dispatch::query()
            ->where('publication_id', $publication->id);
    
        // Handle search parameter
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('id', 'like', '%' . $searchTerm . '%')
                  ->orWhere('bill_id', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('agent', function ($q) use ($searchTerm) {
                      $q->where('name', 'like', '%' . $searchTerm . '%');
                  });
            });
        }
    
        // Handle daily dispatches (exact date)
        if ($request->has('exact_date')) {
            $exactDate = Carbon::parse($request->input('exact_date'))->startOfDay();
            $query->whereDate('date', '=', $exactDate);
        }
        else {
            // Handle date filters for non-daily dispatches
            if ($request->has('from_date') || $request->has('to_date')) {
                $fromDate = $request->has('from_date') ? Carbon::parse($request->input('from_date'))->startOfDay() : null;
                $toDate = $request->has('to_date') ? Carbon::parse($request->input('to_date'))->endOfDay() : null;
    
                if ($fromDate && $toDate) {
                    $query->whereBetween('date', [$fromDate, $toDate]);
                } elseif ($fromDate) {
                    $query->where('date', '>=', $fromDate);
                } elseif ($toDate) {
                    $query->where('date', '<=', $toDate);
                }
            }
        }
    
        // Fetch and return dispatches with related publication and agent
        $dispatches = $query->with(['publication', 'agent'])->get();
    
        return response()->json($dispatches);
    }
    
    

    public function store(Request $request) // New method for storing dispatch data
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'free_copies' => 'required|integer',
            'paid_copies' => 'required|integer',
            'packets' => 'required|integer',
            'returned' => 'required|integer',
            'bill_id' => 'nullable|string',
            'billded_copies' => 'required|integer',
            'rate' => 'required|numeric',
            'commission_rate' => 'required|numeric',
            'credit_notes' => 'nullable|string',
            'agent_id' => 'required|exists:agents,id',
            'publication_id' => 'required|exists:publications,id',
        ]);

        Dispatch::create($validatedData); // Create a new dispatch entry
        return response()->json(['message' => 'Dispatch entry created successfully'], 201);
    }

    public function update(Request $request, Dispatch $dispatch)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'free_copies' => 'nullable|integer',
            'paid_copies' => 'nullable|integer',
            'packets' => 'nullable|integer',
            'returned' => 'nullable|integer',
            'bill_id' => 'nullable|string',
            'billded_copies' => 'nullable|integer',
            'rate' => 'nullable|numeric',
            'commission_rate' => 'required|numeric',
            'credit_notes' => 'nullable|string',
            'agent_id' => 'required|exists:agents,id',
            'publication_id' => 'required|exists:publications,id',
        ]);

        $dispatch->update($validatedData); // Update the existing dispatch entry
        return response()->json(['message' => 'Dispatch entry updated successfully'], 200);
    }

    public function destroy(Dispatch $dispatch)
    {
        $dispatch->delete(); // Delete the specified dispatch entry
        return response()->json(['message' => 'Dispatch entry deleted successfully'], 200);
    }
}
