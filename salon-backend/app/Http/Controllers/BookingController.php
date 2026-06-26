<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * GET /api/bookings — Réservations de l'utilisateur connecté
     */
    public function index(Request $request)
    {
        Booking::deleteExpired();

        $bookings = Booking::with(['service', 'barber'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($b) => $this->formatBooking($b, $request->user()));

        return response()->json([
            'success' => true,
            'data'    => $bookings,
        ]);
    }

    /**
     * POST /api/bookings — Créer une réservation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id'   => 'required|integer|exists:services,id',
            'barber_id'    => 'required|integer|exists:barbers,id',
            'booking_date' => 'required|date_format:Y-m-d|after_or_equal:today',
            'booking_time' => 'required|date_format:H:i',
            'note'         => 'nullable|string|max:500',
        ]);

        $service = Service::find($validated['service_id']);
        $reqDuration = $service->duration_minutes;

        $start = Carbon::parse($validated['booking_time']);
        $end = $start->copy()->addMinutes($reqDuration);

        // Vérifier si le créneau ou la durée chevauche une autre réservation
        $conflict = Booking::with('service')
            ->where('barber_id', $validated['barber_id'])
            ->where('booking_date', $validated['booking_date'])
            ->where('status', '!=', 'annulé')
            ->get()
            ->contains(function ($b) use ($start, $end) {
                $bStart = Carbon::parse($b->booking_time);
                $bDuration = $b->service->duration_minutes ?? 30;
                $bEnd = $bStart->copy()->addMinutes($bDuration);
                return $start->lt($bEnd) && $bStart->lt($end);
            });

        if ($conflict) {
            return response()->json([
                'success' => false,
                'message' => 'Ce créneau chevauche une autre réservation',
                'errors'  => ['booking_time' => ["Ce créneau n'est pas disponible pour cette durée"]],
            ], 422);
        }

        $booking = Booking::create([
            'user_id'          => $request->user()->id,
            'service_id'       => $validated['service_id'],
            'barber_id'        => $validated['barber_id'],
            'booking_date'     => $validated['booking_date'],
            'booking_time'     => $validated['booking_time'],
            'price_at_booking' => $service->price,
            'status'           => 'confirmé',
            'note'             => $validated['note'] ?? null,
        ]);

        $booking->load(['service', 'barber']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation créée avec succès',
            'data'    => $this->formatBooking($booking, $request->user()),
        ], 201);
    }

    /**
     * POST /api/bookings/{id}/cancel
     */
    public function cancel(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found'], 404);
        }

        $user = $request->user();

        // Seul le propriétaire ou un admin peut annuler
        if ($booking->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas annuler cette réservation',
            ], 403);
        }

        if ($booking->status === 'annulé') {
            return response()->json([
                'success' => false,
                'message' => 'Cette réservation est déjà annulée',
            ], 422);
        }

        $booking->update(['status' => 'annulé']);
        $booking->load(['service', 'barber']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès',
            'data'    => $this->formatBooking($booking, $booking->user),
        ]);
    }

    private function formatBooking(Booking $booking, $user): array
    {
        return [
            'id'               => $booking->id,
            'user_id'          => $booking->user_id,
            'service_id'       => $booking->service_id,
            'barber_id'        => $booking->barber_id,
            'booking_date'     => $booking->booking_date?->format('Y-m-d') ?? $booking->booking_date,
            'booking_time'     => substr($booking->booking_time, 0, 5),
            'price_at_booking' => $booking->price_at_booking,
            'status'           => $booking->status,
            'note'             => $booking->note,
            'created_at'       => $booking->created_at,
            'service'          => $booking->service?->name ?? 'Service',
            'barber'           => $booking->barber?->name ?? 'Coiffeur',
            'clientName'       => trim(($user->first_name ?? 'Client') . ' ' . ($user->last_name ?? '')),
        ];
    }
}
