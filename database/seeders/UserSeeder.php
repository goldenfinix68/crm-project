<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $userData = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'username' => 'admin',
                'email' => 'admin@test.com',
                'password' => 'Admin123!',
                'role' => 'Super Admin',
                'status' => 2

            ],
        ];

        \App\Models\User::truncate();
        foreach ($userData as $key => $row) {
            $user = \App\Models\User::create(
                [
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name'],
                    'email' => $row['email'],
                    'password' => bcrypt($row['password']),
                    // 'username' => $row['username'],
                    // 'role' => $row['role'],
                    // 'status' => $row['status'],
                ],
            );
        }
    }
}
