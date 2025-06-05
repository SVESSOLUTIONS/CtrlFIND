<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UserSubscriptions;


class checkSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:subscriptions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        \Log::info("Cron is working fine!");
        $subscriptions =  UserSubscriptions::where(['status' => 'ACTIVE'])->get();
        foreach ($subscriptions as $subscription) {
            if($subscription->expires_at !== null) {
                if($subscription->expired()) {
                 $subscription->status = 'EXPIRE';
                 $subscription->save();
                }
             }else{
                 $subscription->status = 'EXPIRE';
                 $subscription->save();
             }
        }
    }
}
