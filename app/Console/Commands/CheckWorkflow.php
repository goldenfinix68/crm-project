<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Workflow;
use App\Models\WorkflowItem;
use App\Models\Contact;
use App\Models\User;
use App\Models\Text;
use Carbon\Carbon;
use DB;
use App\Jobs\SendText;

class CheckWorkflow extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:check-workflow-item';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add to queue workflow item that is scheduled within 5 minutes';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
		$now = Carbon::now();
		$workflowItems = WorkflowItem::where(DB::raw('trigger_at - INTERVAL 5 MINUTE'), '<=', $now)
			->where('queue_lock', false)
			->get();
		if ($workflowItems) {
			foreach ($workflowItems as $workflowItem) {
                $workflow = $workflowItem->workflow;
                $timeStartSeconds = Carbon::parse($workflowItem->trigger_at)->diffInSeconds($now);
                foreach($workflowItem->contactIds as $id){
                    $contact = Contact::find($id);
                    $user = User::find($workflow->userId);
                    if(!empty($contact)){
                        $message = $this->replace_text($workflow->message, $contact);

                        $text = new Text();
                        $text->from = $user->mobileNumbers->first();
                        $text->to = '[' . $contact->mobile . ']';
                        $text->message = $message;
                        $text->type = 'SMS';
                        $text->status = 'queued';
                        $text->isFromApp = true;
                        $text->workflowItemId = $workflowItem->id;
                        $text->save();

                        SendText::dispatch($text)->delay(now()->addSeconds($timeStartSeconds + 1));
                    }
                }
                $workflowItem->queue_lock = true;
                $workflowItem->save();


			}
		}
		$this->info('workflowItems FOUND: ' . $workflowItems->count());
		$this->info('DONE');
    }
    
    private function replace_text($message, $contact) {
         // Use a regular expression to match placeholders like {{column_name}}
        $pattern = '/\{\{(\w+)\}\}/';

        // Use preg_replace_callback to replace each placeholder with its corresponding value
        $replacedText = preg_replace_callback($pattern, function ($matches) use ($contact) {
            $columnName = $matches[1]; // Extract the column name from the placeholder
            return $contact->{$columnName}; // Replace with the value from the database record
        }, $message);

        return $replacedText;
    }
}
