<?php

namespace App\Http\Controllers\Api;

use App\Models\Contact;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // return Contact::with('owner')->get();

        $data = Contact::select([
            'contacts.*',
            \DB::raw("(SELECT CONCAT(users.firstName, ' ', users.lastName)) as `owner`"),
        ])
        ->leftJoin('users', 'users.id', '=', 'contacts.ownerId');
        
        if (isset($request->search)) { 
            $data = $data->where(function ($q) use ($request) {
                $q->orWhere('id', 'LIKE', "%$search%");
            });
        }
       
        if ($request->sort_order != '') {
            $data->orderBy($request->sort_field, $request->sort_order == 'ascend' ? 'asc' : 'desc');
        } else {
            $data->orderBy('id', 'desc');
        }

        if (isset($request->pageSize)) {
            $data = $data->paginate($request->pageSize);
        } else {
            $data = $data->get();
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
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
            'firstName' => 'required',
            'lastName' => 'required',
        ]);

        $contact = Contact::create($request->all());

        
        return response()->json($contact, 200);
      
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
        $contact = Contact::updateOrCreate(
            ['id' => $id],
            $request->all()
        );

        return response()->json($contact, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
