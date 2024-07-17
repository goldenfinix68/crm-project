<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateContactsView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('
            CREATE VIEW global_search_view AS
            SELECT 
                c.id,
                (
                    SELECT GROUP_CONCAT(cfv.value SEPARATOR \' \')
                    FROM custom_field_values cfv 
                    JOIN custom_fields cf ON cf.id = cfv.customFieldId 
                    WHERE cfv.customableId = c.id 
                    AND (cf.fieldName = \'firstName\' OR cf.fieldName = \'lastName\')
                ) AS fullName,
                CONCAT(\'[\', GROUP_CONCAT(
                    CASE WHEN cf.type IN (\'mobile\', \'phone\') THEN CONCAT(cfv.value) END
                    SEPARATOR \', \'
                ), \']\') AS phoneNumbers,
                MAX(CASE WHEN cf.label IN (\'APN\') THEN cfv.value END) AS apn
            FROM 
                contacts c
            LEFT JOIN custom_field_values cfv ON cfv.customableId = c.id
            LEFT JOIN custom_fields cf ON cf.id = cfv.customFieldId
            GROUP BY c.id;
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('DROP VIEW IF EXISTS global_search_view');
    }
}
