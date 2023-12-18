<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\User;
use App\Models\CustomField;
use App\Models\CustomFieldValue;
use App\Models\ContactType;
use Auth;
use DB;

class CustomFieldValuesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        DB::beginTransaction();

        try {
            $fields = $request->fields;
            if($request->customableType == "contact"){
                if($request->customableId){
                    $record = Contact::find($request->customableId);
                    if(empty($record)){
                        abort(404);
                    }
                }
                else{
                    $record = new Contact();
                    $record->userId = $this->getMainUserId();
                    $record->save();
                }
                // if(!empty($fields['mobile'])){
                //     $verify = CustomFieldValue::with(['customField'])
                //     ->where('value', $fields['mobile'])
                //     ->where('customableType', 'contact')
                //     ->whereHas('customField', function ($query) {
                //         $query->where('type', 'mobile');
                //     })
                //     ->first();
                //     if(!empty($verify) && $verify->customableId != $record->id){
                //         $existingContact = Contact::find($verify->customableId);
                //         if(!empty($existingContact)){
                //             abort(400, "Mobile number is already associated with " . $existingContact->fields['firstName'] . ' ' . $existingContact->fields['lastName']);
                //         }
                //     }
                // }
            }
            $user = Auth::user();
            foreach($fields as $key => $value){
                $customField = CustomField::where('fieldName', $key)
                    ->where('customFieldSectionType', $request->customableType)
                    ->where('userId', $user->id)
                    ->first();
                $this->createOrUpdateCustomFieldValue($record->id, $customField, $request->customableType, $value);
            }
            DB::commit();
            return response()->json(['message' => "Success"], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            // Something went wrong, so we'll roll back the transaction
            
            $statusCode = $e->getCode();
            if (!is_numeric($statusCode) || $statusCode < 100 || $statusCode >= 600) {
                // If the HTTP status code is invalid, you can use a default 500 Internal Server Error
                $statusCode = 500;
            }

            return response()->json(['message' => $e->getMessage()], $statusCode);

        }
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
