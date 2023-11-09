<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomFieldSection;
use App\Models\CustomField;
use Illuminate\Support\Facades\Validator;
use Auth;

class CustomFieldSectionsController extends Controller
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

        $sections =  CustomFieldSection::with(['fields'])->where('userId', $this->getMainUserId())->where('type', $request->type)->orderBy('sort')->get();
        
        return $sections;
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
            'columnLayout' => 'required',
            'type' => 'required',
        ]);

        $data = $request->all();

        //check highest sort
        $highestSort = CustomFieldSection::where('userId', $this->getMainUserId())->where('type', $request->type)->orderBy('sort', 'desc')->first();

        $sort = 1;
        if(!empty($data['sort'])){
            $sort = $data['sort'];
        }
        else if(!empty($highestSort)){
            $sort = $highestSort->sort + 1;
        }

        $customFieldSection = CustomFieldSection::updateOrCreate(
            ['id' => isset($data['id'])? $data['id'] : null],
            array_merge($data, [
                'userId' => $this->getMainUserId(), 
                'sort' => $sort,
            ])
        );

        
        return response()->json($customFieldSection, 200);
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
        $section = CustomFieldSection::find($id);

        if(empty($user) || $this->getMainUserId() != $section->userId){
            abort(401, 'Unauthorized');
        }

        $customFields = CustomField::where('customFieldSectionId', $section->id)->update(['isActive' => false]);

        $section->delete();
        
        return response()->json("Success", 200);
    }
    
    public function sort(Request $request)
    {
        foreach($request->all() as $index => $data){
            $section = CustomFieldSection::find($data['id']);
            if(!empty($section) && $section->userId == $this->getMainUserId()){
                $section->sort = $index+1;
                $section->save();
            }
        }

        return response()->json("Success", 200);
    }
}
