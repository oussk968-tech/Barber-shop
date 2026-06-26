<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'id' => 1,
                'first_name' => 'Admin',
                'last_name' => 'Admin',
                'email' => 'admin@titsiouine.ma',
                'phone' => '0624457146',
                'email_verified_at' => null,
                'password' => '$2y$12$iABau2UPlLwiRxuxf5Dv0uu20vgE48YY1QxVISBhNA.6RiHI8DNCi',
                'role' => 'admin',
                'remember_token' => null,
                'created_at' => '2026-04-20 23:44:45',
                'updated_at' => '2026-06-15 18:39:47',
            ],
            [
                'id' => 2,
                'first_name' => 'Hamza',
                'last_name' => 'Client',
                'email' => 'demo@titsiouine.ma',
                'phone' => '0687654321',
                'email_verified_at' => null,
                'password' => '$2y$12$AhktohwgOLhYXKgN99aHC.KEUa7JZWd6/5WvIK.rf91E/G2KzaqRe',
                'role' => 'client',
                'remember_token' => null,
                'created_at' => '2026-04-20 23:44:45',
                'updated_at' => '2026-04-21 17:02:41',
            ],
            [
                'id' => 3,
                'first_name' => 'Oussama',
                'last_name' => 'Kh',
                'email' => 'oussamakh71@icloud.com',
                'phone' => '0600000000',
                'email_verified_at' => null,
                'password' => '$2y$12$oih6plYPWQsdqU70bGbbZ.D/nPRA6QByMSxGcOlQsmK7uEb8Tl1oa',
                'role' => 'client',
                'remember_token' => null,
                'created_at' => '2026-04-20 23:44:46',
                'updated_at' => '2026-04-20 23:44:46',
            ],
            [
                'id' => 4,
                'first_name' => 'Othmane',
                'last_name' => 'alloul',
                'email' => 'oussk968@gmail.com',
                'phone' => '06224457149',
                'email_verified_at' => null,
                'password' => '$2y$12$pIFSWN/3rOREawI9xRTJieDvE7XTptOW2ONMlDVpCv2Xk2H6IWOFy',
                'role' => 'client',
                'remember_token' => null,
                'created_at' => '2026-04-21 01:39:46',
                'updated_at' => '2026-04-29 15:17:49',
            ],
            [
                'id' => 5,
                'first_name' => 'Oussama',
                'last_name' => 'khalidi',
                'email' => 'oussamakhalidi71@gmail.com',
                'phone' => '0624457146',
                'email_verified_at' => null,
                'password' => '$2y$12$yktPGC9Gq9zY6WdUriuKReW5Fn1e4NAv8qMETEiQYFiDy.zr5Q3YG',
                'role' => 'client',
                'remember_token' => null,
                'created_at' => '2026-04-21 21:36:59',
                'updated_at' => '2026-06-11 08:41:41',
            ],
            [
                'id' => 6,
                'first_name' => 'Oussama',
                'last_name' => 'fedoul',
                'email' => 'Oussamafe@gmail.com',
                'phone' => '06218383',
                'email_verified_at' => null,
                'password' => '$2y$12$Hkewj5lPNFCDBWIG4NOnuO62Z.l/pLMEiUqwzd8j5lyJHCZ8e6qx.',
                'role' => 'client',
                'remember_token' => null,
                'created_at' => '2026-04-23 22:14:38',
                'updated_at' => '2026-04-23 22:44:28',
            ],
            [
                'id' => 7,
                'first_name' => 'marwan',
                'last_name' => 'Kh',
                'email' => 'ouss123@gmail.com',
                'phone' => '0632456778',
                'email_verified_at' => null,
                'password' => '$2y$12$j77HMtyT21wGxikNZBwgEu2PAk5LSekhFLDKEfJK2WkIu8TA9QYWy',
                'role' => 'client',
                'remember_token' => null,
                'created_at' => '2026-04-23 23:21:56',
                'updated_at' => '2026-04-23 23:21:56',
            ],
        ];

        foreach ($data as $item) {
            DB::table('users')->updateOrInsert(
                ['id' => $item['id']],
                $item
            );
        }
    }
}
