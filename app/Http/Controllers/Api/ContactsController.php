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

class ContactsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */


    public function index(Request $request)
    {

        $currentWeekStart = Carbon::now()->startOfWeek();
        $currentWeekEnd = Carbon::now()->endOfWeek();
        $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();
        $lastWeekEnd = Carbon::now()->subWeek()->endOfWeek();
        $startOfDay = Carbon::now()->startOfDay();
        $endOfDay = Carbon::now()->endOfDay();

        $data = [];
        $contacts = Contact::with(['customFieldValues', 'customFieldValues.customField'])
            // ->where('id', 1)
            // ->whereHas('customFieldValues', function ($query) {
            //     $query->where('value', 'qweqweqwe');
            // })
            ->get();
        // dd($contacts->customFieldValues);
        return response()->json([
            'success' => true,
            'data' => $contacts
        ], 200);


        // $data = Contact::select([
        //     'contacts.*',
        //     \DB::raw("(SELECT CONCAT(users.firstName, ' ', users.lastName)) as `owner`"),
        // ])
        //     ->where('ownerId', Auth::id())
        //     ->leftJoin('users', 'users.id', '=', 'contacts.ownerId')
        //     ->leftJoin('contact_types', 'contact_types.id', '=', 'contacts.typeId')
        //     ->with(['type']);

        // if (isset($request->filter)) {
        //     if ($request->filter == "new-last-week") {
        //         $data = $data->whereBetween('contacts.created_at', [$lastWeekStart, $lastWeekEnd]);
        //     }
        //     if ($request->filter == "new-this-week") {
        //         $data = $data->whereBetween('contacts.created_at', [$currentWeekStart, $currentWeekEnd]);
        //     }
        //     if ($request->filter == "recent-modified-contact") {
        //         $data = $data->whereBetween('contacts.updated_at', [$startOfDay, $endOfDay]);
        //     }
        // }

        // if (isset($request->search)) {
        //     $data = $data->where(function ($q) use ($request) {
        //         $q->orWhere('id', 'LIKE', "%{$request->search}%");
        //     });
        // }

        // if ($request->sort_order != '') {
        //     $data->orderBy($request->sort_field, $request->sort_order == 'ascend' ? 'asc' : 'desc');
        // } else {
        //     $data->orderBy('id', 'desc');
        // }

        // if (isset($request->pageSize)) {
        //     $data = $data->paginate($request->pageSize);
        // } else {
        //     $data = $data->get();
        // }

        // $data = $data->map(function ($q) {
        //     if ($q->tags) {
        //         $q->tags = json_decode($q->tags);
        //     }
        //     return $q;
        // });

        // return response()->json([
        //     'success' => true,
        //     'data' => $data
        // ], 200);
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
            'ownerId' => 'required',
        ]);

        $data = $request->all();

        if (isset($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }


        $contact = Contact::updateOrCreate(['id' => isset($data['id']) ? $data['id'] : null], $data);


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
        $contact = Contact::with(['type', 'deals'])->find($id);

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
                
                if($key == 'defaultMobileNumberId'){
                    $update->from = $from->defaultMobile ? $from->defaultMobile->mobileNumber : "";
                    $update->to = $contact->defaultMobile->mobileNumber;
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
        //

        foreach ($request->contactId as $id) {

            $data = Contact::find($id)->delete();
        }
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
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

    public function save_column_setting(Request $request)
    {
        $data = ContactTableColumn::updateOrCreate(['user_id' => auth()->user()->id],
            [ 
            'table_columns' => $request->table_columns,
            // 'user_id' => $request->user_id
            
        ],
           
        );
        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function get_contacts_table_column(Request $request)
    {
        return [];
        $contacts_table_column= ContactTableColumn::where('user_id', auth()->user()->id)->get();
        return response()->json($contacts_table_column, 200);
    }

    public function delete_contacts_table_column(Request $request)
    {
        $data = ContactTableColumn::where('user_id',auth()->user()->id)->delete();
    
        return response()->json([
            'success' => true,
            'data' => $data 
        ]);
    }

    public function bulkContactImportCsv(Request $request)
    {
        if (!empty($request->csvData) && !empty($request->columnMappings)) {
            $data = $request->csvData;
            $mapping = $request->columnMappings;

            $result = [];
            
            foreach ($data as $record) {
                $contactData = new Contact();
                $dealData = new Deal();
                $activityData = new Activity();
            
                foreach ($mapping as $sourceColumn => $targetColumn) {
                    if (strpos($targetColumn['mergeField'], "contact.") !== false) {
                        $column = preg_replace('/{{contact\.|\}}/', '', $targetColumn['mergeField']);
                        $contactData->{$column} = $record[$sourceColumn];
                    }
                    if (strpos($targetColumn['mergeField'], "deal.") !== false) {
                        $column = preg_replace('/{{deal\.|\}}/', '', $targetColumn['mergeField']);
                        $dealData->{$column} = $record[$sourceColumn];
                    }
                    if (strpos($targetColumn['mergeField'], "activity.") !== false) {
                        $column = preg_replace('/{{activity\.|\}}/', '', $targetColumn['mergeField']);
                        $activityData->{$column} = $record[$sourceColumn];
                    }
                }
                //save if required fields are present
                $isContactSuccess = false;
                if(!empty($contactData->firstName) && !empty($contactData->lastName)){
                    $contactData->ownerId = Auth::id();
                    $isContactSuccess =$contactData->save();
                    
                }
                $isActivitySuccess = false;
                if(!empty($contactData) && !empty($activityData->title)){
                    $activityData->ownerId = Auth::id();
                    $activityData->contact_id = $contactData->id;
                    $isActivitySuccess = $contactData->save();
                    
                }
                $isDealSuccess = false;
                if(!empty($contactData) && !empty($dealData->title)){
                    $dealData->owner = Auth::id();
                    $dealData->contactId = $contactData->id;
                    $isDealSuccess = $contactData->save();
                    
                }
                $result[] = [
                    'contactName' => $contactData->firstName . ' ' . $contactData->lastName,
                    'isContactSuccess' => $isContactSuccess,
                    'isActivitySuccess' => $isActivitySuccess,
                    'isDealSuccess' => $isDealSuccess,
                ];
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
        $customField = $request->customField;
        $value = $request->fieldValue;
        foreach($request->contactIds as $id){
            
            $fieldValue = CustomFieldValue::where('customableId', $id)->where('customFieldId', $customField['id'])->first();

            if(empty($fieldValue)){
                $fieldValue = new CustomFieldValue();
            }

            $fieldValue->customableId = $id;
            $fieldValue->customableType = 'contact';
            $fieldValue->customFieldId = $customField['id'];

            if($customField['type'] == "userLookup" || $customField['type'] == "contactLookup"){
                if($customField['type'] == "userLookup"){
                    $data = User::whereIn('id', $value)
                    ->selectRaw('CONCAT(firstName, " ", lastName) as full_name')
                    ->pluck('full_name')
                    ->implode(', ');
                }
                else{
                    $data = "";
                    $contacts = Contact::with(['customFieldValues', 'customFieldValues.customField'])
                    ->whereIn('id', $value)
                    ->get();

                    foreach($contacts as $index => $contact){
                        $customFields = $contact->fields();
                        $data = $data . ($index == 0 ? "" : ", ") . $customFields['firstName'] . ' ' . $customFields['lastName'];
                    }
                }
                $fieldValue->lookupIds = json_encode($value);
                $fieldValue->value =  $data;
            }
            else{
                if($customField['type'] == "multiSelect"){
                    $fieldValue->value = json_encode($value);
                }
                else{
                    $fieldValue->value =  $value;
                }
                $fieldValue->lookupIds = null;
            }
            $fieldValue->save();
        }
        
        return response()->json(['message' => "Success"], 200);
    }
}
