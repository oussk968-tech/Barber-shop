<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('bookings')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        DB::table('bookings')->insert([
            [
                'id' => 14,
                'user_id' => 5,
                'service_id' => 8,
                'barber_id' => 2,
                'booking_date' => '2026-06-20',
                'booking_time' => '20:30:00',
                'price_at_booking' => '99.00',
                'status' => 'confirmé',
                'note' => null,
                'created_at' => '2026-06-15 15:03:34',
                'updated_at' => '2026-06-15 15:03:34',
            ],
        ]);
    }
}
