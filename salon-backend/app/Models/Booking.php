<?php

namespace App\Models;

use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_id',
        'barber_id',
        'booking_date',
        'booking_time',
        'price_at_booking',
        'status',
        'note',
    ];

    protected $casts = [
        'booking_date'     => 'date:Y-m-d',
        'price_at_booking' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function barber()
    {
        return $this->belongsTo(Barber::class);
    }

    /**
     * Delete bookings that have expired (past date, or today but past time).
     */
    public static function deleteExpired()
    {
        // On considère un rendez-vous comme "supprimable" seulement s'il est passé depuis plus de 10 minutes
        $graceTime = now()->subMinutes(10);
        
        $today = $graceTime->format('Y-m-d');
        $currentTime = $graceTime->format('H:i:s');

        // Supprimer les réservations des jours passés (avant aujourd'hui par rapport au graceTime)
        // OU celles d'aujourd'hui dont l'heure de début est passée depuis plus de 10 min
        self::where('booking_date', '<', $today)
            ->orWhere(function ($query) use ($today, $currentTime) {
                $query->where('booking_date', '=', $today)
                      ->where('booking_time', '<', $currentTime);
            })
            ->delete();
    }
}
