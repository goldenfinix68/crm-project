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
        $fields = CustomField::where('userId', $this->getMainUserId())
            ->where('isActive', true)
            ->orderByRaw('CAST(`sort` AS UNSIGNED)');


        if(!empty($request->type)){
            $fields = $fields->where('customFieldSectionType', $request->type);
        }

        
        return $fields->get();
    }

    public function inactiveFields(Request $request)
    {
        $inactiveFields =  CustomField::where('userId', $this->getMainUserId())
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

        $data = $request->all();
        $mainUserId = $this->getMainUserId();

        $checkDuplicate = CustomField::where('label', $data['label'])->where('userId', $mainUserId)->count();

        if(!empty($checkDuplicate)){
            return response()->json([
                'success' => false,
                'message' => "Duplicate label. Label should be unique."
            ], 422);
        }
        
        //check highest sort
        $highestSort = CustomField::where('customFieldSectionId', $data['customFieldSectionId'])->orderByRaw('CAST(`sort` AS UNSIGNED) DESC')->first();
        
        $highestTableSort = CustomField::where('customFieldSectionId', $data['customFieldSectionId'])->orderByRaw('CAST(`tableSort` AS UNSIGNED) DESC')->first();
        
        $sort = 1;
        if(!empty($data['sort'])){
            $sort = $data['sort'];
        }
        else if(!empty($highestSort)){
            $sort = $highestSort->sort + 1;
        }

        $tableSort = 1;
        if(!empty($data['tableSort'])){
            $tableSort = $data['tableSort'];
        }
        else if(!empty($highestSort)){
            $tableSort = $highestTableSort->tableSort + 1;
        }
        
        $section = CustomFieldSection::find($data['customFieldSectionId']);

        $customField = CustomField::updateOrCreate(
            ['id' => isset($data['id'])? $data['id'] : null],
            array_merge($data, [
                'userId' => $mainUserId, 
                'sort' => $sort,
                'tableSort' => $tableSort,
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
        $customField = CustomField::find($id);

        if(empty($customField)){
            abort(404);
        }

        if($this->getMainUserId() != $customField->section->userId){
            abort(401, 'Unauthorized');
        }
        $customField->isActive = false;
        $customField->save();
        
        return response()->json("Success", 200);
    }
    
    public function sort(Request $request)
    {
        foreach($request->all() as $index => $data){
            $customField = CustomField::find($data['id']);
            if(!empty($customField) && $customField->section->userId == $this->getMainUserId()){
                $customField->sort = $index+1;
                $customField->save();
            }
        }

        return response()->json("Success", 200);
    }
    
    public function tableFieldsSort(Request $request)
    {
        
        CustomField::where('userId', $this->getMainUserId())->update(['tableSort' => 0, 'isDisplayTable' => false]);

        foreach($request->selected as $index => $data){
            $customField = CustomField::find($data['id']);
            if(!empty($customField) && $customField->section->userId == $this->getMainUserId()){
                $customField->tableSort = $index+1;
                $customField->isDisplayTable = true;
                $customField->save();
            }
        }

        return response()->json("Success", 200);
    }
    
    public function restore(Request $request)
    {
        $customField = CustomField::find($request->id);

        if(empty($customField)){
            abort(404);
        }

        if($this->getMainUserId() != $customField->section->userId){
            abort(401, 'Unauthorized');
        }
        $customField->customFieldSectionId = $request->customFieldSectionId;
        $customField->isActive = true;
        $customField->save();
        
        return response()->json("Success", 200);
    }
}
