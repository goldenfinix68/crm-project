<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Filter;
use Illuminate\Support\Facades\Validator;
use Auth;

class FiltersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $filters = Filter::where('userId', $user->id)->orderBy('name', 'asc')->get();

        return $filters;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'filters' => 'required',
        ]);

        $user = Auth::user();
        $data = $request->all();
        
        $filter = Filter::updateOrCreate(
            ['id' => isset($data['id'])? $data['id'] : null],
            array_merge($data, [
                'userId' => $user->id, 
            ])
        );


        
        return response()->json($filter, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $filter = Filter::find($id);
        if(empty($filter)){
            abort(404);
        }
        if($filter->userId != $user->id){
            abort(401);
        }
        
        return $filter->delete();
    }
}
