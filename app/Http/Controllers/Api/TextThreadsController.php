<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TextThread;
use App\Models\Text;
use App\Models\CustomField;
use Auth;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class TextThreadsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();

        if(empty($user)){
            abort(401, 'Unauthorized');
        }

        $threads =  TextThread::with('labels')->whereIn('userNumber', $this->getMainUserNumbers())->get()->unique('contactNumber');

        foreach($threads as $thread){
            $thread = $this->prepareThreadTexts($thread);
        }
        return $threads->sortByDesc('lastTextId')->values();
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $thread = TextThread::with('labels')->where('id', $id)->first();
        
        if(empty($thread)){
            abort(404, 'Thread not found');
        }

        $thread = $this->prepareThreadTexts($thread);
        return $thread;
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
    public function destroy(Request $request)
    {
        
        foreach($request->threadIds as $id){
            $thread = TextThread::find($id);
            $thread->delete();
        }

        return response()->json(['success' => true]);
    }

    public function assign_label(Request $request)
    {
        
        foreach($request->threadIds as $id){
            $thread = TextThread::find($id);
            if($request->action == "add"){
                $thread->labels()->syncWithoutDetaching($request->labels);
            }
            else if($request->action == "remove"){
                $thread->labels()->detach($request->labels);
            }
            else {
                $thread->labels()->sync($request->labels);
            }
        }

        return response()->json(['success' => true]);

    }
    
    public function mark_texts_seen(Request $request)
    {
        $thread = TextThread::find($request->threadId);

        if (!$thread) {
            return response()->json(['error' => 'Thread not found'], 404);
        }

        // Update all texts for the contact where seen_at is null
        $threads = TextThread::where('contactNumber', $thread->contactNumber)->get();
        foreach($threads as $threa){
            Text::where('threadId', $threa->id)
            ->where(function($query) {
                $query->whereNull('seen_at')
                    ->orWhere('seen_at', ''); // Empty string condition
            })
            ->update(['seen_at' => Carbon::now()]);
        } 

        return response()->json(['success' => true]);
    }
    
    public function addTag(Request $request)
    {
        $threads = TextThread::whereIn('id', $request->threadIds)->get();

        $customField = CustomField::find($request->customField['id']);

        if (!$threads || !$customField) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $value = $request->{$customField->fieldName};

        if($value){
            foreach($threads as $thread){
                $contact = $thread->contact;
                if(!empty($contact)){
                    $existingValues = $contact['fields'][$customField->fieldName.'lookupIds'];
                    if(!empty($existingValues)){
                        $value = array_merge($value, json_decode($existingValues));
                    }
                    $this->createOrUpdateCustomFieldValue($contact->id, $customField, 'contact', $value);
                }
            }
        }

        return response()->json(['success' => true]);
    }

    private function prepareThreadTexts($thread){
        $datas = TextThread::with('texts')->where('contactNumber', $thread->contactNumber)->get();

        $mergedTexts = collect();
        foreach($datas as $data){
            $mergedTexts = $mergedTexts->merge($data->texts);
        }
        $thread->texts = $mergedTexts->sortByDesc('id')->values();
        $thread->lastTextId = $thread->texts[0]->id;

        return $thread;
    }
}
