<?php

namespace Database\Seeders;

use App\Models\Conservation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin2434'),
            'is_admin' => true
        ]);
        User::factory()->create([
            'name' => 'hassan',
            'email' => 'hassan@example.com',
            'password' => bcrypt('hassan2434'),
        ]);
        User::factory(10)->create();

        for($i= 0; $i < 5; $i++){
            $group = Group::factory()->create([
                'owner_id' => 1,
            ]);
            $users = User::inRandomOrder()->limit(rand(2,5))->pluck('id');
            $group->users()->attach(array_unique([1, ...$users]));
        }

        Message::factory(1000)->create();

        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();
        $conservations = $messages->groupBy(function($message){
            return collect([$message->sender_id, $message->receiver_id])->sort()->implode('-');
        })->map(function ($groupMessages){
            return [
                'user_id2' =>  $groupMessages->first()->receiver_id,
                'user_id1' =>  $groupMessages->first()->sender_id,
                'last_message_id' =>  $groupMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conservation::insertOrIgnore($conservations->toArray());
    }
}
