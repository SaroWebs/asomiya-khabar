<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        // User::create([
        //     'name' => 'Administrator',
        //     'email' => 'admin@khabar.com',
        //     'email_verified_at' => now(),
        //     'password' => Hash::make('admin123'),
        //     'active' => 1,
        // ]);

        // Seed states
        // $states = json_decode(file_get_contents(resource_path('js/Data/states.json')), true);
        // foreach ($states as $state) {
        //     \App\Models\State::create([
        //         'code' => $state['code'],
        //         'name' => $state['name'],
        //         'country' => $state['country'],
        //     ]);
        // }

        // // Seed districts
        // $districts = json_decode(file_get_contents(resource_path('js/Data/districts.json')), true);
        // foreach ($districts as $district) {
        //     \App\Models\District::create([
        //         'state_code' => $district['state_code'],
        //         'district_code' => $district['district_code'],
        //         'name' => $district['name'],
        //     ]);
        // }  

        
    }
}
