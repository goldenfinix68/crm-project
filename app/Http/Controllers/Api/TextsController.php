<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Text;
use Auth;

class TextsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Text::orderBy('id', 'desc')->get();
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
            'contactId' => 'required',
            'from' => 'required',
            'to' => 'required',
            'message' => 'required',
        ]);
        
        $userId = Auth::id();

        try {
            \Telnyx\Telnyx::setApiKey(env('TELNYX_API_KEY'));

            $response = \Telnyx\Message::Create([
                "from" => env('TELNYX_DEFAULT_FROM'), // Your Telnyx number
                "to" => $request->to,
                "text" => "Hello, World!",
                "messaging_profile_id" => env('TELNYX_PROFILE_ID'),
            ]);
            
            $text = Text::create(array_merge($request->all(), [
                'userId' => $userId, 
                'type'=> 'SMS', 
                'telnyxId' => $response->id,
                'status' => 'queued',
                'telnyxResponse' => json_encode($response),
            ]));

            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
            // Handle any errors here
        }
        
        return response()->json([
            'success' => true,
            'message' => "Text sent"
        ], 200);
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
        //
    }
}
