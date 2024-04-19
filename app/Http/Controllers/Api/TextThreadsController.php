<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TextThread;
use App\Models\Text;
use App\Models\CustomField;
use App\Models\CustomFieldValue;
use App\Models\Contact;
use Auth;
use DB;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class TextThreadsController extends Controller
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
        $mainUserIds = $this->getMainUserNumbers();

        $label = $request->label;

        $texts = Text::select('threadId')
            ->where('isSuppressed', false)
            ->selectSub('MAX(created_at)', 'latest_created_at') // Subquery to get the latest created_at for each threadId
            ->whereHas('thread', function($query) use ($mainUserIds) {
                $query->whereIn('userNumber', $mainUserIds);
            })
            ->groupBy('threadId') // Group by threadId
            ->orderByDesc('latest_created_at');

            
        if (!empty($request->searchKey)) {
            $texts->where(function($query) use ($request) {
                $query->where('message', 'like', '%' . $request->searchKey . '%')
                    ->orWhereHas('thread', function($query) use ($request) {
                        $query->where('contactNumber', 'like', '%' . $request->searchKey . '%');
                    });
            });
        }
        
        if (!empty($label)) {
            $texts->whereHas('thread.labels', function($query) use ($label) {
                $query->where('name', $label);
            });
        }

        $texts = $texts->paginate($request->input('page_size', 20));

        $data = [];
        foreach($texts->items() as $text){

            $thread = $text->thread;
            $contactId = "";
            $contactName = preg_replace("/^(\d{3})(\d{3})(\d{4})$/", "($1) $2-$3", $thread->contactNumber);
            
            $fieldValue = CustomFieldValue::where('value', $thread->contactNumber)
                ->whereHas('customField', function ($query) {
                    $query->where('type', 'mobile')
                        ->orWhere('type', 'phone');
                })
                ->first();
            
            if(!empty($fieldValue)){
                
                $contactId = $fieldValue->customableId;

                $names = CustomFieldValue::select('value')
                    ->where('customableId', $fieldValue->customableId)
                    ->whereHas('customField', function ($query) {
                        $query->where('fieldName', 'firstName')
                            ->orWhere('fieldName', 'lastName');
                    })
                    ->pluck('value');

                $contactName = $names[0] . " " . $names[1];
            }

            $lastText = $thread->lastText();
            $isLastTextSeen = !empty($lastText->seen_at);
            $createdAt = $lastText->created_at;

            // Check if contactName already exists
            $existingThread = collect($data)->where('contactName', $contactName)->first();

            if ($existingThread) {
                $existingCreatedAt = $existingThread['created_at'];
                // Compare created_at timestamps
                if(strtotime($createdAt) > strtotime($existingCreatedAt)) {
                    $existingThread['lastText'] = $lastText->message;
                    $existingThread['isLastTextSeen'] = $isLastTextSeen;
                    $existingThread['created_at'] = $createdAt;
                    $existingThread['labels'] = $existingThread['labels']->merge($thread->labels)->unique();
                }
            } else {
                $data[] = [
                    'id' => $thread->id,
                    'contactId' => $contactId,
                    'contactName' => $contactName,
                    'isContactSaved' => !empty($contactId),
                    'lastText' => $lastText->message,
                    'isLastTextSeen' => $isLastTextSeen,
                    'created_at' => $createdAt,
                    'labels' => $thread->labels,
                    // 'haveDuplicatePhoneNumbers' => !empty($thread->contact) && !empty($thread->contact->duplicatePhoneNumbers),
                    'haveDuplicatePhoneNumbers' => false,
                
                ];
            }
        }

        // Sort the data by created_at timestamp
        usort($data, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });
        
        $total = $texts->total();

        return response()->json([
            'success' => true,
            'data' => $data,
            'total' => $total,
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        if($request->type == 'contact'){
            $contact = Contact::find($id);
            $threads = TextThread::with('labels')->whereIn('contactNumber', $contact->phoneNumbers)->get();
            $contact->duplicatePhoneNumbers = $contact->getDuplicatePhoneNumbersAttribute();

            $texts = [];

            foreach ($threads as $thread) {
                foreach ($thread->texts as $text) {
                    $texts[] = $text;
                }
            }

            usort($texts, function($a, $b) {
                return strtotime($b['created_at']) - strtotime($a['created_at']);
            });

            $formattedNumbers = [];
            foreach ($contact->phoneNumbers as $phoneNumber) {
                // Format each phone number
                $formattedNumber = preg_replace("/^(\d{3})(\d{3})(\d{4})$/", "($1) $2-$3", $phoneNumber);
                // Add the formatted number to the array
                $formattedNumbers[] = $formattedNumber;
            }
            
            // Implode the formatted numbers into a single string
            $combinedNumbers = implode(", ", $formattedNumbers);
            
            return [
                'texts' => $texts,
                'contact' => $contact,
                'contactName' => $contact->fields['firstName'] . ' ' . $contact->fields['lastName'],
                'phoneNumbers' => $combinedNumbers ,
            ];
        }
        else{
            $thread = TextThread::with(['labels', 'texts'])->where('id', $id)->first();
            
            return [
                'texts' => $thread->texts,
                'contact' => null,
                'contactName' => $thread->contactName,
                'phoneNumbers' => preg_replace("/^(\d{3})(\d{3})(\d{4})$/", "($1) $2-$3", $thread->contactNumber),
            ];
        }

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
            $thread->texts()->delete();
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

        // Update all texts for the contact where seen_at is null
        if($request->type == "contact"){
            $contact = Contact::find($request->id);
            $threads = TextThread::whereIn('contactNumber', $contact->phoneNumbers)->get();
        }
        else{
            $threads = TextThread::where('id', $request->id)->get();
        }
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
}
