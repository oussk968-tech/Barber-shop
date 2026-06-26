<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BarberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable FK checks, truncate for clean state, then insert
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('barbers')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        DB::table('barbers')->insert([
            [
                'id' => 1,
                'name' => 'Hicham',
                'specialty' => 'Master Barber',
                'experience' => 10,
                'created_at' => '2026-04-20 23:44:46',
                'updated_at' => '2026-04-20 23:44:46',
            ],
            [
                'id' => 2,
                'name' => 'Youssef',
                'specialty' => 'Spécialiste barbe',
                'experience' => 7,
                'created_at' => '2026-04-20 23:44:46',
                'updated_at' => '2026-04-20 23:44:46',
            ],
            [
                'id' => 3,
                'name' => 'Amine',
                'specialty' => 'Coupe & style',
                'experience' => 5,
                'created_at' => '2026-04-20 23:44:46',
                'updated_at' => '2026-04-20 23:44:46',
            ],
        ]);
    }
}
