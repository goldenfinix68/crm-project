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
                'firstName' => 'John',
                'lastName' => 'Doe',
                'username' => 'admin',
                'email' => 'admin@test.com',
                'password' => bcrypt('Admin123!'),
                'role' => 'Super Admin',
                'status' => 2

            ],
        ];

        \App\Models\User::truncate();
        foreach ($userData as $key => $row) {
            $user = \App\Models\User::create(
                [
                    'firstName' => $row['firstName'],
                    'lastName' => $row['lastName'],
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
