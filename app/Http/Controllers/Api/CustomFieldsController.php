<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomField;
use App\Models\CustomFieldSection;
use Illuminate\Support\Facades\Validator;
use Auth;

class CustomFieldsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        if(empty($user)){
            abort(401, 'Unauthorized');
        }

        $fields =  CustomField::where('userId', $user->id)->where('isActive', true)->orderBy('sort');

        if(!empty($request->type)){
            $fields = $fields->where('customFieldSectionType', $request->type);
        }

        
        return $fields->get();
    }

    public function inactiveFields(Request $request)
    {
        $user = auth()->user();
        if(empty($user)){
            abort(401, 'Unauthorized');
        }

        $inactiveFields =  CustomField::where('userId', $user->id)
            ->where('isActive', false)
            ->where('customFieldSectionType', $request->type)
            ->orderBy('updated_at', 'desc')
            ->get();
        
        return $inactiveFields;
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
            'label' => 'required',
            'customFieldSectionId' => 'required',
            'type' => 'required',
        ]);

        $user = Auth::user();
        $data = $request->all();

        //check highest sort
        $highestSort = CustomField::where('customFieldSectionId', $data['customFieldSectionId'])->orderBy('sort', 'desc')->first();

        $sort = 1;
        if(!empty($data['sort'])){
            $sort = $data['sort'];
        }
        else if(!empty($highestSort)){
            $sort = $highestSort->sort + 1;
        }
        
        $section = CustomFieldSection::find($data['customFieldSectionId']);

        $customField = CustomField::updateOrCreate(
            ['id' => isset($data['id'])? $data['id'] : null],
            array_merge($data, [
                'userId' => $user->id, 
                'sort' => $sort,
                'customFieldSectionType' => $section->type,

            ])
        );
        $customField->fieldName = 'custom_field_' . $customField->id;
        $customField->save();

        
        return response()->json($customField, 200);
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
        $customField = CustomField::find($id);

        if(empty($customField)){
            abort(404);
        }

        if(empty($user) || $user->id != $customField->section->userId){
            abort(401, 'Unauthorized');
        }
        $customField->isActive = false;
        $customField->save();
        
        return response()->json("Success", 200);
    }
    
    public function sort(Request $request)
    {
        $user = Auth::user();
        foreach($request->all() as $index => $data){
            $customField = CustomField::find($data['id']);
            if(!empty($customField) && $customField->section->userId == $user->id){
                $customField->sort = $index+1;
                $customField->save();
            }
        }

        return response()->json("Success", 200);
    }
    
    public function restore(Request $request)
    {
        $user = Auth::user();
        $customField = CustomField::find($request->id);

        if(empty($customField)){
            abort(404);
        }

        if(empty($user) || $user->id != $customField->section->userId){
            abort(401, 'Unauthorized');
        }
        $customField->customFieldSectionId = $request->customFieldSectionId;
        $customField->isActive = true;
        $customField->save();
        
        return response()->json("Success", 200);
    }
}
