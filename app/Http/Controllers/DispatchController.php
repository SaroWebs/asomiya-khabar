<?php

namespace App\Http\Controllers;

use App\Models\Dispatch;
use Illuminate\Http\Request;

class DispatchController extends Controller
{
    public function get_data(Request $request)
    {
        $query = Dispatch::query();
        if ($request->has('publication_id')) {
            $query->where('publication_id', $request->input('publication_id'));
        }

        if ($request->has('agent_id')) {
            $query->where('agent_id', $request->input('agent_id'));
        }

        $dispatches = $query->get();
        return response()->json($dispatches);
    }
}
