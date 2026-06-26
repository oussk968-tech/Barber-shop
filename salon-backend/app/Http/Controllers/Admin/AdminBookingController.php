<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    /**
     * GET /api/admin/bookings — Toutes les réservations (admin)
     */
    public function index(Request $request)
    {
        Booking::deleteExpired();

        $bookings = Booking::with(['user', 'service', 'barber'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($b) => [
                'id'               => $b->id,
                'user_id'          => $b->user_id,
                'service_id'       => $b->service_id,
                'barber_id'        => $b->barber_id,
                'booking_date'     => $b->booking_date?->format('Y-m-d') ?? $b->booking_date,
                'booking_time'     => substr($b->booking_time, 0, 5),
                'price_at_booking' => $b->price_at_booking,
                'status'           => $b->status,
                'note'             => $b->note,
                'created_at'       => $b->created_at,
                'service'          => $b->service?->name ?? 'Service',
                'barber'           => $b->barber?->name ?? 'Coiffeur',
                'clientName'       => trim(
                    ($b->user?->first_name ?? 'Client') . ' ' . ($b->user?->last_name ?? '')
                ),
                'clientPhone'      => $b->user?->phone ?? '',
            ]);

        return response()->json([
            'success' => true,
            'data'    => $bookings,
        ]);
    }

    /**
     * GET /api/admin/dashboard — Statistiques du tableau de bord
     */
    public function dashboard(Request $request)
    {
        Booking::deleteExpired();

        $todayStr = now()->format('Y-m-d');

        // Today's bookings
        $todayBookings = Booking::with(['user', 'service', 'barber'])
            ->where('booking_date', '=', $todayStr)
            ->get();

        // Today's revenue: sum of price_at_booking where status is not 'annulé'
        $todayRevenue = Booking::where('booking_date', '=', $todayStr)
            ->where('status', '!=', 'annulé')
            ->sum('price_at_booking');

        // Overall stats
        $totalBookingsCount = Booking::count();
        $totalRevenue = Booking::where('status', '!=', 'annulé')->sum('price_at_booking');
        
        $totalBarbers = \App\Models\Barber::count();
        $totalServices = \App\Models\Service::count();
        $totalClients = \App\Models\User::where('role', '!=', 'admin')->count();

        // Status counts for today
        $statusCounts = [
            'confirmé'   => Booking::where('booking_date', '=', $todayStr)->where('status', '=', 'confirmé')->count(),
            'en_attente' => Booking::where('booking_date', '=', $todayStr)->where('status', '=', 'en_attente')->count(),
            'annulé'     => Booking::where('booking_date', '=', $todayStr)->where('status', '=', 'annulé')->count(),
        ];

        // Format today's bookings
        $formattedTodayBookings = $todayBookings->map(fn($b) => [
            'id'               => $b->id,
            'user_id'          => $b->user_id,
            'service_id'       => $b->service_id,
            'barber_id'        => $b->barber_id,
            'booking_date'     => $b->booking_date?->format('Y-m-d') ?? $b->booking_date,
            'booking_time'     => substr($b->booking_time, 0, 5),
            'price_at_booking' => $b->price_at_booking,
            'status'           => $b->status,
            'note'             => $b->note,
            'created_at'       => $b->created_at,
            'service'          => $b->service?->name ?? 'Service',
            'barber'           => $b->barber?->name ?? 'Coiffeur',
            'clientName'       => trim(
                ($b->user?->first_name ?? 'Client') . ' ' . ($b->user?->last_name ?? '')
            ),
            'clientPhone'      => $b->user?->phone ?? '',
        ]);

        return response()->json([
            'success' => true,
            'data'    => [
                'today_bookings_count' => $todayBookings->count(),
                'today_revenue'        => (float)$todayRevenue,
                'today_bookings'       => $formattedTodayBookings,
                'stats' => [
                    'total_bookings' => $totalBookingsCount,
                    'total_revenue'  => (float)$totalRevenue,
                    'total_barbers'  => $totalBarbers,
                    'total_services' => $totalServices,
                    'total_clients'  => $totalClients,
                ],
                'status_counts' => $statusCounts,
            ],
        ]);
    }
}

