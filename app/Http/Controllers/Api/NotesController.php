<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;

use Auth;

class NotesController extends Controller
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
        $userId = Auth::id();

        $validator = Validator::make($request->all(), [
            'contactId' => 'required',
            'note' => 'required',
        ]);
        
        $data = $request->all();
        
        
        $noteContent = $data['notes'];
        
        // Extract image data from HTML content
        preg_match_all('/<img[^>]+src="([^"]+)"[^>]*>/i', $noteContent, $matches);
        $images = $matches[1];
        
        // Store each image on the server and replace the src attribute with the new URL
        foreach ($images as $image) {
            // Check if the image URL is already stored on the server
            if (strpos($image, 'http://') === 0 || strpos($image, 'https://') === 0) {
               //Do nothing
            } else {
                $imageData = explode(',', $image);
                $imageBase64 = $imageData[1];
                $extension = explode(';', explode('/', $imageData[0])[1])[0];
                $imageName = uniqid().'.'.$extension;
                $path = 'uploads/images/'.$imageName;
                file_put_contents(public_path($path), base64_decode($imageBase64));
                
                // Replace image source with URL
                $noteContent = str_replace($image, asset($path), $noteContent);
            }
            
        }
    

        $data['notes'] = $noteContent;
        
        $note = Note::updateOrCreate([
            'id' => isset($data['id'])? $data['id'] : null],
            array_merge($data, [
                'userId' => $userId, 
            ])
        );
        
        return response()->json($note, 200);
    }

    private function getImagePathFromUrl($imageUrl)
    {
        // Extract image path from URL
        $imageUrlParts = explode('/', $imageUrl);
        $imageName = end($imageUrlParts);
        $imagePath = 'uploads/images/' . $imageName;

        // Check if image exists on server
        if (file_exists(public_path($imagePath))) {
            return $imagePath;
        }

        return false;
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
        return Note::find($id)->delete();
    }
}
