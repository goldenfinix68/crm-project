<?php

namespace App\Http\Controllers\Api;

use App\Models\Contact;
use App\Models\ContactUpdate;
use App\Models\ContactFavorite;
use App\Models\ContactTableColumn;
use App\Http\Controllers\Controller;
use App\Models\ContactFile;
use App\Models\ContactLog;
use App\Models\Text;
use App\Models\Deal;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Str;
use Auth;
use Carbon\Carbon;
use League\Csv\Reaer;
use App\Models\CustomField;
use App\Models\CustomFieldValue;
use App\Models\GSheetCrawl;
use DB;
use \Exception;
use App\Jobs\ProcessContactImportGSheet;

class ContactsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $userId = $this->getMainUserId();
        $filters = json_decode($request->filters);
     
        // Start with a base query
        $contactsQuery = Contact::where('userId', $userId);
     
        // Apply each filter
        $operator = $filters->conditionalOperator;
        $eloquentCondition = $filters->conditionalOperator == "or" ? "orWhereHas": "whereHas";
        
        $contactsQuery->where(function ($query) use ($filters, $eloquentCondition) {
            foreach ($filters->conditions as $filter) {
                $key = $filter->key;
                $condition = $filter->condition;
                $value = $filter->value;
     
                // Construct the column name from the filter's key
                $columnName = $filter->column->value;
     
                // Apply the filter based on the condition
                switch ($condition) {
                    case 'contains':
                        $query->{$eloquentCondition}('customFieldValues', function ($q) use ($value) {
                            $q->where('value', 'like', "%$value%");
                        });
                        break;
                    case 'notContains':
                        $query->{$eloquentCondition}('customFieldValues', function ($q) use ($value) {
                            $q->where('value', 'not like', "%$value%");
                        });
                        break;
                    case 'equals':
                        $query->{$eloquentCondition}('customFieldValues', function ($q) use ($value) {
                            $q->where('value', '=', $value);
                        });
                        break;
                    case 'startsWith':
                        $query->{$eloquentCondition}('customFieldValues', function ($q) use ($value) {
                            $q->where('value', 'like', "$value%");
                        });
                        break;
                    case 'endsWith':
                        $query->{$eloquentCondition}('customFieldValues', function ($q) use ($value) {
                            $q->where('value', 'like', "%$value");
                        });
                        break;
                    case 'empty':
                        $query->{$eloquentCondition}('customFieldValues', function ($q) use ($value) {
                            $q->where('value', '');
                        });
                        break;
                }
            }
        });
        
        
        // $contacts = $contactsQuery->orderBy('asdasd')->get();
        // Apply pagination to contacts query
        $contacts = $contactsQuery->paginate($request->input('page_size', 10));
     
        return response()->json([
            'success' => true,
            'data' => $contacts,
        ], 200);
    }
    
     

    public function filteredContacts(Request $request)
    {

        $data = [];
        $contacts = Contact::where('userId', $this->getMainUserId());

        if(!empty($request->filters)){

        }


        $contacts = $contacts
        ->limit(100)
        ->get();

        // dd($contacts->customFieldValues);
        return response()->json($contacts, 200);

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
    // public function store(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'firstName' => 'required',
    //         'lastName' => 'required',
    //         'ownerId' => 'required',
    //     ]);

    //     $data = $request->all();

    //     if (isset($data['tags'])) {
    //         $data['tags'] = json_encode($data['tags']);
    //     }


    //     $contact = Contact::updateOrCreate([
    //         'id' => isset($data['id']) ? $data['id'] : null], 
    //         array_merge($data, [
    //             'userId' => $this->getMainUserId(), 
    //         ])
    //     );


    //     return response()->json($contact, 200);
    // }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $contact = Contact::with(['type', 'deals', 'deal'])->find($id);
        $contact->wall = $contact->wall();

        // if (empty($contact)) {
        //     abort(404);
        // }

        return response()->json($contact, 200);
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
        $from = Contact::find($id);
        $contact = Contact::updateOrCreate(
            ['id' => $id],
            $request->all()
        );

        foreach ($request->all() as $key => $value) {
            if ($key != "id" && $key != "typeId" && $from->{$key} != $contact->{$key}) {
                $update = new ContactUpdate();
                $update->userId = Auth::id();
                $update->contactId = $id;
                
                if($key == 'defaultMobileNumber'){
                    $update->from = $from->defaultMobileNumber ?? "";
                    $update->to = $contact->defaultMobileNumber;
                    $update->title = "Default Mobile Number Updated";
                }
                else{
                    $update->from = $from->{$key};
                    $update->to = $contact->{$key};
                    $update->title = Str::title(Str::camel($key)) . " Updated";
                }
                $update->save();
            }
        }

        return response()->json($contact, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete_contacts(Request $request)
    {
        foreach ($request->contactId as $id) {
            $contact = Contact::find($id);
            
            $contact->customFieldValues->delete();

            $data = $contact->delete();
        }
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
    public function cloneContact(Request $request)
    {
        // Find the original contact
        $contact = Contact::where('id', $request->contactId)->first();
        // Check if the contact exists
        if (empty($contact)) {
            abort(404);
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Clone the contact
            $clonedContact = $contact->replicate();
            $clonedContact->clonedFrom = $contact->id;
            $clonedContact->save();
            
            // Clone the fields related to the original contact
            foreach ($contact->customFieldValues as $field) {
                $clonedField = $field->replicate();
                $customField = $clonedField->customField;
                
                if($customField->fieldName == 'lastName'){
                    $cloneCount = Contact::where('clonedFrom', $contact->id)->count();
                    $clonedField->value = $clonedField->value . "(clone ".$cloneCount.")";
                }
                if($customField->fieldName == 'mobile'){
                    $clonedField->value = "*" . $clonedField->value . "*";
                }
                $clonedField->customableId = $clonedContact->id;
                $clonedField->save();
            }

            // Commit the transaction
            DB::commit();

            // Return success response
            return response()->json([
                'success' => true,
                'data' => $clonedContact,
            ]);

        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            dd($e);
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'Failed to clone contact.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function merge_contacts(Request $request)
    {


        error_log('asdasd' . json_encode($request->id));
        $user = auth()->user();


        $contactData = $request->data;

        $contactData['ownerId'] = $user->id;
        if (isset($contactData['tags'])) {
            if (is_array($contactData['tags'])) {
                $contactData['tags'] = json_encode($contactData['tags']);
            }
        }


        error_log(json_encode($contactData));


        $contact = Contact::create($contactData);

        if ($contact) {
            $deletedContacts = [];
            foreach ($request->id as $key => $value) {
                $deletedContacts[] =  Contact::find($value)->delete();
            }
        }



        return response()->json(['deleted' => $deletedContacts, 'added' =>  $contact], 200);
    }

    public function favorite(Request $request)
    {
        $data = ContactFavorite::updateOrCreate(
            ['user_id' => auth()->user()->id, 'name' => $request->name],
            ['user_id' => auth()->user()->id, 'name' => $request->name]
        );
        return response()->json(['success' => true, 'data' => $data], 200);
    }
    public function del_favorite(Request $request)
    {
        $data = ContactFavorite::where('user_id', auth()->user()->id)->where('name', $request->name)->delete();
        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function get_favorite(Request $request)
    {
        $contact_favorite = ContactFavorite::where('user_id', auth()->user()->id)->get();
        return response()->json($contact_favorite, 200);
    }
    public function activity_log(Request $request)
    {
        $activity_log = ContactLog::create($request->except('dateTime'));
        return response()->json($activity_log, 200);
    }
    public function add_files(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "File not saved",
        ];

        $category =  $request->category;

        if ((int) $request->files_count !== 0) {
            for ($i = 0; $i < $request->files_count; $i++) {
                $file = $request->file('files_' . $i);

                if ($file) {
                    $file_name =  $file->getClientOriginalName();
                    $file_size = $this->bytesToHuman($file->getSize());
                    $fileFilePath = Str::random(10)  . '.' . $file->getClientOriginalExtension();
                    $fileFilePathNew = $file->storeAs('uploads/files', $fileFilePath, 'public');

                    $file_url = $file->storeAs(
                        'public/files',
                        time() . '_' . $file_name
                    );

                    $file_url = str_replace('public/files/', '', $file_url);
                    ContactFile::create([
                        'contact_id' => $request->contact_id,
                        'file_size' => $file_size,
                        'file_name' => $file_name,
                        'file_url' => 'storage/' . $fileFilePathNew,
                        'uploaded_by' => auth()->user()->id
                    ]);
                }
            }



            $ret = [
                "success" => true,
                "message" => "Files saved successfully"
            ];
        }

        return response()->json($ret, 200);
    }

    // public function save_column_setting(Request $request)
    // {
    //     $data = ContactTableColumn::updateOrCreate(['user_id' => auth()->user()->id],
    //         [ 
    //         'table_columns' => $request->table_columns,
    //         // 'user_id' => $request->user_id
            
    //     ],
           
    //     );
    //     return response()->json(['success' => true, 'data' => $data], 200);
    // }

    // public function get_contacts_table_column(Request $request)
    // {
    //     return [];
    //     $contacts_table_column= ContactTableColumn::where('user_id', auth()->user()->id)->get();
    //     return response()->json($contacts_table_column, 200);
    // }

    // public function delete_contacts_table_column(Request $request)
    // {
    //     $data = ContactTableColumn::where('user_id',auth()->user()->id)->delete();
    
    //     return response()->json([
    //         'success' => true,
    //         'data' => $data 
    //     ]);
    // }
    public function bulkContactImportGSheet(Request $request)
{
        // Validate the presence of the required 'gSheetId' parameter
        $spreadsheetId = $request->gSheedId;
        $user = Auth::user();
        if (empty($spreadsheetId)) {
            return response()->json(['error' => 'The "gSheetId" parameter is required.'], 400);
        }
        // Dispatch the job to process the data asynchronously
        $mainUser = $user->mainUser;

        dispatch(new \App\Jobs\ProcessContactImportGSheet($spreadsheetId, $mainUser, $user, $request->roorAutoresponderId));

        if($request->isAddToQueue){
            $crawl = GSheetCrawl::where('mainUserId', $mainUser->id)->first();
            if(empty($crawl)){
                $crawl = new GSheetCrawl;
            }
            $crawl->mainUserId = $mainUser->id;
            $crawl->gSheetId = $spreadsheetId;
            $crawl->interval = $request->interval;
            $crawl->last_trigger = Carbon::now();
            $crawl->save();
        }
        else{
            GSheetCrawl::where('mainUserId', $mainUser->id)->delete();
        }

        // Return a response indicating that the job has been dispatched
        return response()->json(['message' => 'Data processing job has been dispatched.']);
    }
    
    public function bulkContactImportCsv(Request $request)
    {
        if (!empty($request->csvData) && !empty($request->columnMappings)) {
            $data = $request->csvData;
            $mapping = $request->columnMappings;

            $result = [];
            foreach ($data as $record) {
                DB::beginTransaction();

                $contact = new Contact();
                $contact->userId = $this->getMainUserId();
                $contact->save();

                $continue = true;
                foreach ($mapping as $sourceColumn => $targetColumn) {
                    if($continue){
                        try {
                            $customField = CustomField::find($targetColumn);

                            // if($customField->fieldName == 'mobile'){
                            //     $verify = $this->getContactByMobile($record[$sourceColumn]);
                            //     if(!empty($verify) && $verify->customableId != $contact->id){
                            //         $continue = false;
                            //         DB::rollBack();
                            //         break;
                            //     }
                            // }
                            if($customField->type == 'tag'){
                                $record[$sourceColumn] = [$record[$sourceColumn]];
                            }
                            $this->createOrUpdateCustomFieldValue($contact->id, $customField, 'contact', $record[$sourceColumn]);
                        }
                        catch (Exception $e) {
                            $continue = false;
                            DB::rollBack();
                            break;
                        } 
                    }
                }
                if($continue){
                    $result[] = [
                        'contactName' => $contact->fields['firstName'] . ' ' . $contact->fields['lastName']
                    ];
    
                    DB::commit();
                }
            }
            
            return response()->json(['result' => $result], 200);
           
        }
        return response()->json(['message' => 'No file uploaded'], 400);
    }
    
    public function bulkUpdateField(Request $request)
    {
        
        if(empty($request->contactIds)){
            abort(404);
        }
        $customField = CustomField::find($request->customField['id']);

        foreach($request->contactIds as $id){
            $value = $request->fieldValue;
            if($customField->type == "tag" && !empty($request->action)){
                $contact = Contact::find($id);
                $curValue = json_decode($contact->fields[$customField->fieldName."lookupIds"]);
                if(!empty($curValue)){
                    $curValue = (array) $curValue;
                    if($request->action == "add"){
                        $value = array_merge($curValue, $value);
                        $value = array_unique($value);
                    }
                    elseif ($request->action == "remove"){
                        $value = array_diff($curValue, $value);
                    }
                }

                // if(!empty($request->phoneFieldStatus)){
                //     $fieldValue = CustomFieldValue::find($contact->fields[$customField->fieldName."Id"]);
                //     $customFieldValuesController = new CustomFieldValue();
                //     $customFieldValuesController->updateStatus($fieldValue, $request->phoneFieldStatus);
                // }
            }

            $this->createOrUpdateCustomFieldValue($id, $customField, 'contact', $value);
        }
        
        return response()->json(['message' => "Success"], 200);
    }
}
