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
                $record->save();
            }
        }
        $user = Auth::user();
        foreach($fields as $key => $value){
            $customField = CustomField::where('fieldName', $key)
                ->where('customFieldSectionType', $request->customableType)
                ->where('userId', $user->id)
                ->first();
            $this->createOrUpdateValue($record->id, $customField, $request->customableType, $value);
        }
        return response()->json(['message' => "Success"], 200);
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

    public function quickUpdate(Request $request)
    {
        
        if(empty($request->fields)){
            abort(404);
        }
        foreach($request->fields as $field){
            
            $fieldValue = CustomFieldValue::find($field['customFieldValueId']);
            $customField = $fieldValue->customField;
            $value = $field[$customField->fieldName];
            
            $this->createOrUpdateValue($fieldValue->customableId, $customField, $fieldValue->customableType, $value);
        }
        
        return response()->json(['message' => "Success"], 200);
    }

    
    public function createOrUpdateValue($customableId, $customField, $customableType, $value)
    {
        $fieldValue = CustomFieldValue::where('customableId', $customableId)->where('customFieldId', $customField->id)->first();
        if(empty($fieldValue)){
            $fieldValue = new CustomFieldValue();
        }

        $fieldValue->customableId = $customableId;
        $fieldValue->customableType = $customableType;
        $fieldValue->customFieldId = $customField->id;

        if($customField->type == "userLookup" || $customField->type == "contactLookup" || $customField->type == "contactTypeLookup"){
            //convert if type not multiple

            if($customField->type == "userLookup"){
                $data = User::whereIn('id', $value)
                ->selectRaw('CONCAT(firstName, " ", lastName) as full_name')
                ->pluck('full_name')
                ->implode(', ');
            }
            if($customField->type == "contactTypeLookup"){
                $data = ContactType::whereIn('id', $value)
                ->select('name')
                ->pluck('name')
                ->implode(', ');
            }
            else{
                $data = "";
                $contacts = Contact::with(['customFieldValues', 'customFieldValues.customField'])
                ->whereIn('id', $value)
                ->get();

                foreach($contacts as $index => $contact){
                    $customFields = $contact->fields;
                    $data = $data . ($index == 0 ? "" : ", ") . $customFields['firstName'] . ' ' . $customFields['lastName'];
                }
            }
            $fieldValue->lookupIds = json_encode($value);
            $fieldValue->value =  $data;
        }
        else{
            if($customField->type == "multiSelect"){
                $fieldValue->value = json_encode($value);
            }
            else{
                $fieldValue->value =  $value;
            }
            $fieldValue->lookupIds = null;
        }
        $fieldValue->save();
    }

}
