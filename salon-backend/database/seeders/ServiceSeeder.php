<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'id' => 1,
                'name' => 'Coupe Classique',
                'description' => 'Coupe de cheveux classique avec finitions soignées.',
                'price' => '50.00',
                'duration_minutes' => 30,
                'photo' => 'http://127.0.0.1:8000/storage/services/service_1777116021_69eca375efc57.webp',
                'created_at' => '2026-04-20 23:44:46',
                'updated_at' => '2026-06-15 18:37:11',
            ],
            [
                'id' => 2,
                'name' => 'Taille de Barbe',
                'description' => 'Rasage et modelage au rasoir droit. Technique traditionnelle premium.',
                'price' => '30.00',
                'duration_minutes' => 20,
                'photo' => 'http://127.0.0.1:8000/storage/services/service_1777116226_69eca4421ee45.webp',
                'created_at' => '2026-04-20 23:44:46',
                'updated_at' => '2026-06-08 14:26:37',
            ],
            [
                'id' => 4,
                'name' => 'Shampoing & Soin',
                'description' => 'Shampoing professionnel avec soin hydratant.',
                'price' => '40.00',
                'duration_minutes' => 20,
                'photo' => '/storage/services/service_1778611617_6a0375a1d16c2.webp',
                'created_at' => '2026-04-20 23:44:46',
                'updated_at' => '2026-05-12 18:46:58',
            ],
            [
                'id' => 8,
                'name' => 'coloration',
                'description' => 'Coloration & technique : reflets, brillance et respect du cheveu. Produits pro pour colorer, décolorer et sublimer vos cheveux facilement.',
                'price' => '99.00',
                'duration_minutes' => 50,
                'photo' => '/storage/services/service_1778611769_6a0376398aa3e.webp',
                'created_at' => '2026-04-22 08:59:39',
                'updated_at' => '2026-05-12 18:49:29',
            ],
            [
                'id' => 9,
                'name' => 'Coupe + Barbe + Shampoing & Soin',
                'description' => 'pack de coiffure pour les homme Coupe + Barbe + Shampoing & Soin',
                'price' => '300.00',
                'duration_minutes' => 60,
                'photo' => '/storage/services/service_1778612014_6a03772e6710f.webp',
                'created_at' => '2026-04-22 09:21:37',
                'updated_at' => '2026-05-12 18:53:34',
            ],
        ];

        foreach ($data as $item) {
            DB::table('services')->updateOrInsert(
                ['id' => $item['id']],
                $item
            );
        }
    }
}
