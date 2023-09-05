<?php

namespace App\Http\Controllers\Api;

use App\Models\Contact;
use App\Models\ContactUpdate;
use App\Models\ContactFavorite;
use App\Http\Controllers\Controller;
use App\Models\ContactLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Str;
use Auth;
use Carbon\Carbon;

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

        $data = Contact::select([
            'contacts.*',
            \DB::raw("(SELECT CONCAT(users.firstName, ' ', users.lastName)) as `owner`"),
        ])
            ->leftJoin('users', 'users.id', '=', 'contacts.ownerId');

        if (isset($request->filter)) {
            if ($request->filter == "new-last-week") {
                $data = $data->whereBetween('contacts.created_at', [$lastWeekStart, $lastWeekEnd]);
            }
            if ($request->filter == "new-this-week") {
                $data = $data->whereBetween('contacts.created_at', [$currentWeekStart, $currentWeekEnd]);
            }
            if ($request->filter == "recent-modified-contact") {
                $data = $data->whereBetween('contacts.updated_at', [$startOfDay, $endOfDay]);
            }
        }

        if (isset($request->search)) {
            $data = $data->where(function ($q) use ($request) {
                $q->orWhere('id', 'LIKE', "%{$request->search}%");
            });
        }

        if ($request->sort_order != '') {
            $data->orderBy($request->sort_field, $request->sort_order == 'ascend' ? 'asc' : 'desc');
        } else {
            $data->orderBy('id', 'desc');
        }

        if (isset($request->pageSize)) {
            $data = $data->paginate($request->pageSize);
        } else {
            $data = $data->get();
        }

        $data = $data->map(function ($q) {
            if ($q->tags) {
                $q->tags = json_decode($q->tags);
            }
            return $q;
        });

        return response()->json([
            'success' => true,
            'data' => $data
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
        $validator = Validator::make($request->all(), [
            'firstName' => 'required',
            'lastName' => 'required',
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
        $contact = Contact::with(['type'])->find($id);

        if (empty($contact)) {
            abort(404);
        }

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
                $update->title = Str::title(Str::camel($key)) . " Updated";
                $update->from = $from->{$key};
                $update->to = $contact->{$key};
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
}
