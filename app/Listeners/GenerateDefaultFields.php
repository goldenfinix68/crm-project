<?php

namespace App\Listeners;

use App\Events\UserCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\CustomFieldSection;
use App\Models\CustomField;

class GenerateDefaultFields
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\UserCreated  $event
     * @return void
     */
    public function handle(UserCreated $event)
    {
        $user = $event->user;

        $defaultCustomFieldSectionsType = [
            [
                "type" => "contact",
                "sectionName" => "Default",
                "columnLayout" => "two",
            ],
            [
                "type" => "deal",
                "sectionName" => "Default",
                "columnLayout" => "two",
            ],
            [
                "type" => "activity",
                "sectionName" => "Default",
                "columnLayout" => "two",
            ],
        ];
        $defaultCustomFields = [
            [
                "type" => "contact",
                "fieldType" => "text",
                "fieldName" => "firstName",
                "label" => "First Name",
                "isRequired" => true,
            ],
            [
                "type" => "contact",
                "fieldType" => "text",
                "fieldName" => "lastName",
                "label" => "Last Name",
                "isRequired" => true,
            ],
            [
                "type" => "contact",
                "fieldType" => "mobile",
                "fieldName" => "mobile",
                "label" => "Mobile Number",
                "isRequired" => true,
            ],
            [
                "type" => "contact",
                "fieldType" => "phone",
                "fieldName" => "phone",
                "label" => "Phone Number",
                "isRequired" => false,
            ],
            [
                "type" => "contact",
                "fieldType" => "contactTypeLookup",
                "fieldName" => "contactType",
                "label" => "Type",
                "isRequired" => false,
                "associationType" => "single",
            ],
        ];
        foreach($defaultCustomFieldSectionsType as $section){
            $customSection = CustomFieldSection::where('userId', $user->id)
                ->where('name', $section['sectionName'])
                ->where('type', $section['type'])
                ->where('isDefault', true)
                ->first();
            if(empty($customSection)){
                $customSection = new CustomFieldSection();
                $customSection->name = $section['sectionName'];
                $customSection->columnLayout = $section['columnLayout'];
                $customSection->userId = $user->id;
                $customSection->type = $section['type'];
                $customSection->sort = 1;
                $customSection->isDefault = true;
                $customSection->save();
            }

            foreach($defaultCustomFields as $field){
                $isExisting = CustomField::where('userId', $user->id)
                    ->where('fieldName', $field['fieldName'])
                    ->where('type', $field['fieldType'])
                    ->where('isDefault', true)
                    ->first();
                if(empty($isExisting)){
                    $customField = new CustomField();
                    $customField->label = $field['label'];
                    $customField->fieldName = $field['fieldName'];
                    $customField->customFieldSectionId = $customSection->id;
                    $customField->customFieldSectionType = $customSection->type;
                    $customField->type = $field['fieldType'];
                    $customField->sort = 1;
                    $customField->userId = $user->id;
                    $customField->isRequired = $field['isRequired'];
                    $customField->options = $field['options'] ?? null;
                    $customField->associationType = $field['associationType'] ?? null;
                    $customField->fieldName = $field['fieldName'];
                    $customField->isDefault = true;
                    $customField->save();
                }
            }
        }
    }
}
