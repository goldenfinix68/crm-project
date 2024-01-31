<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Workflow;
use App\Models\WorkflowItem;
use App\Models\Contact;
use App\Models\CustomField;
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
		$workflowItems = WorkflowItem::where('queue_lock', false)
            // ->where(DB::raw('trigger_at - INTERVAL 5 MINUTE'), '<=', $now)
			->get();
		if ($workflowItems) {
			foreach ($workflowItems as $workflowItem) {
                $workflow = $workflowItem->workflow;
                $timeStartSeconds = Carbon::parse($workflowItem->trigger_at)->diffInSeconds($now);
                foreach($workflowItem->contactIds as $id){
                    $contact = Contact::find($id);
                    $user = User::find($workflow->userId);
                    if(!empty($contact)){

                        $customField = CustomField::find($workflow->phoneTypeCustomFieldId);
                        $number = isset($contact->fields[$customField->fieldName]) ? $contact->fields[$customField->fieldName] : false;
                        
                        if(!empty($number)){
                            $message = $this->replacePlaceholders($workflow->message, $contact->fields);
                            $spunContents = $this->spinContent($message);
                            $message = $spunContents[array_rand($spunContents)];
                            $text = new Text();
                            $text->from = $user->number->mobileNumber;
                            $text->to = $number;
                            $text->message = $message;
                            $text->type = 'SMS';
                            $text->status = 'queued';
                            $text->isFromApp = true;
                            $text->workflowItemId = $workflowItem->id;
                            $text->save();

                            SendText::dispatch($text)->delay(now()->addSeconds($timeStartSeconds + 1));
                        }

                    }
                }
                $workflowItem->queue_lock = true;
                $workflowItem->save();


			}
		}
		$this->info('workflowItems FOUND: ' . $workflowItems->count());
		$this->info('DONE');
    }
    
    private function replacePlaceholders($text, $data)
    {
        // Define a callback function to replace placeholders with values
        $replaceCallback = function ($matches) use ($data) {
            $key = trim($matches[1]);
            return isset($data[$key]) ? $data[$key] : '';
        };

        // Replace dynamic placeholders (e.g., {{firstName}})
        $text = preg_replace_callback('/{{\s*([^\s}]+)\s*}}/', $replaceCallback, $text);

        // Replace dynamic placeholders with options (e.g., [green|blue|yellow])
        $text = preg_replace_callback('/\[(.*?)\]/', function ($matches) {
            $options = explode('|', $matches[1]);
            $randomIndex = array_rand($options);
            return $options[$randomIndex];
        }, $text);

        return $text;
    }
    
    private function spinContent($content) {
        // Use a regular expression to find and replace the spin syntax
        $pattern = '/\[([^\[\]]+)\]/';
    
        preg_match_all($pattern, $content, $matches);
    
        // If there are matches, generate all possible spun versions
        if ($matches) {
            $allSpunVersions = [];
    
            $generateSpunVersions = function ($currentContent, $currentIndex) use (&$generateSpunVersions, &$allSpunVersions, $matches, $pattern) {
                if ($currentIndex === count($matches[0])) {
                    $allSpunVersions[] = $currentContent;
                    return;
                }
    
                $options = explode('|', $matches[1][$currentIndex]);
                foreach ($options as $option) {
                    $newContent = preg_replace($pattern, $option, $currentContent, 1);
                    $generateSpunVersions($newContent, $currentIndex + 1);
                }
            };
    
            $generateSpunVersions($content, 0);
            return $allSpunVersions;
        }
    
        // If there are no matches, return the original content
        return [$content];
    }
    
}
