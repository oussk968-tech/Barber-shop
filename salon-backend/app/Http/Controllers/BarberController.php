<?php

namespace App\Http\Controllers;

use App\Models\Barber;
use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BarberController extends Controller
{
    /**
     * GET /api/barbers  (public)
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data'    => Barber::all(),
        ]);
    }

    /**
     * GET /api/barbers/{id}/slots?date=YYYY-MM-DD&service_id=X  (public)
     */
    public function slots(Request $request, $id)
    {
        $request->validate([
            'date'       => 'required|date_format:Y-m-d',
            'service_id' => 'required|integer|exists:services,id',
        ]);

        $barber = Barber::find($id);
        if (! $barber) {
            return response()->json(['success' => false, 'message' => 'Barber not found'], 404);
        }

        $service = Service::find($request->service_id);
        if (! $service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }
        $reqDuration = $service->duration_minutes;

        // Créneaux disponibles de 09:00 à 22:00 par tranches de 30 min
        $allSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
            '20:00', '20:30', '21:00', '21:30', '22:00',
        ];

        // Récupérer les réservations existantes avec leur durée
        $existingBookings = Booking::with('service')
            ->where('barber_id', $id)
            ->where('booking_date', $request->date)
            ->where('status', '!=', 'annulé')
            ->get();

        $slotsData = [];
        foreach ($allSlots as $time) {
            $start = Carbon::parse($time);
            $end = $start->copy()->addMinutes($reqDuration);
            
            $isAvailable = true;
            foreach ($existingBookings as $booking) {
                $bStart = Carbon::parse($booking->booking_time);
                $bDuration = $booking->service->duration_minutes ?? 30;
                $bEnd = $bStart->copy()->addMinutes($bDuration);

                // Overlap condition: (Start < BEnd) AND (BStart < End)
                if ($start->lt($bEnd) && $bStart->lt($end)) {
                    $isAvailable = false;
                    break;
                }
            }

            $slotsData[] = [
                'time'      => $time,
                'available' => $isAvailable,
            ];
        }

        return response()->json([
            'success' => true,
            'data'    => $slotsData,
        ]);
    }
}
