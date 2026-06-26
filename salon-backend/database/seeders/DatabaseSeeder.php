<?php

namespace Database\Seeders;

use App\Models\Barber;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Utilisateurs ────────────────────────────────────────
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name'  => 'User',
            'email'      => 'admin@titsiouine.ma',
            'phone'      => '0612345678',
            'password'   => Hash::make('admin1234'),
            'role'       => 'admin',
        ]);

        $client1 = User::create([
            'first_name' => 'Demo',
            'last_name'  => 'Client',
            'email'      => 'demo@titsiouine.ma',
            'phone'      => '0687654321',
            'password'   => Hash::make('demo1234'),
            'role'       => 'client',
        ]);

        $client2 = User::create([
            'first_name' => 'Oussama',
            'last_name'  => 'Kh',
            'email'      => 'oussamakh71@icloud.com',
            'phone'      => '0600000000',
            'password'   => Hash::make('password123'),
            'role'       => 'client',
        ]);

        // ─── Barbiers ─────────────────────────────────────────────
        $hicham  = Barber::create(['name' => 'Hicham',  'specialty' => 'Master Barber',       'experience' => 10]);
        $youssef = Barber::create(['name' => 'Youssef', 'specialty' => 'Spécialiste barbe',   'experience' => 7]);
        $amine   = Barber::create(['name' => 'Amine',   'specialty' => 'Coupe & style',       'experience' => 5]);

        // ─── Services ─────────────────────────────────────────────
        $coupeClassique = Service::create([
            'name'             => 'Coupe Classique',
            'description'      => 'Coupe de cheveux classique avec finitions soignées.',
            'price'            => 80,
            'duration_minutes' => 30,
            'photo'            => 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
        ]);

        $tailleBarbe = Service::create([
            'name'             => 'Taille de Barbe',
            'description'      => 'Taille et entretien de la barbe avec serviette chaude.',
            'price'            => 60,
            'duration_minutes' => 20,
            'photo'            => 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
        ]);

        $coupeBarbe = Service::create([
            'name'             => 'Coupe + Barbe',
            'description'      => 'Formule complète coupe de cheveux et taille de barbe.',
            'price'            => 120,
            'duration_minutes' => 50,
            'photo'            => 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
        ]);

        $shampoing = Service::create([
            'name'             => 'Shampoing & Soin',
            'description'      => 'Shampoing professionnel avec soin hydratant.',
            'price'            => 40,
            'duration_minutes' => 20,
            'photo'            => 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
        ]);

        $rasage = Service::create([
            'name'             => 'Rasage Traditionnel',
            'description'      => 'Rasage au rasoir droit avec mousse chaude et serviette.',
            'price'            => 70,
            'duration_minutes' => 30,
            'photo'            => 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
        ]);

        // ─── Réservation exemple ──────────────────────────────────
        Booking::create([
            'user_id'          => $client1->id,
            'service_id'       => $coupeClassique->id,
            'barber_id'        => $hicham->id,
            'booking_date'     => now()->addDays(2)->format('Y-m-d'),
            'booking_time'     => '10:00',
            'price_at_booking' => $coupeClassique->price,
            'status'           => 'confirmé',
            'note'             => null,
        ]);

        $this->command->info('✅ Seeder terminé !');
        $this->command->info('   Admin : admin@titsiouine.ma / admin1234');
        $this->command->info('   Client: demo@titsiouine.ma / demo1234');
    }
}
