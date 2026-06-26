<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * GET /api/services  (public)
     */
    public function index()
    {
        $services = Service::all()->map(fn($s) => $this->formatService($s));

        return response()->json([
            'success' => true,
            'data'    => $services,
        ]);
    }

    /**
     * POST /api/services  (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:150',
            'description'      => 'nullable|string',
            'price'            => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            'photo'            => 'nullable|string',
        ]);

        if (!empty($validated['photo']) && str_starts_with($validated['photo'], 'data:image')) {
            try {
                $photoParts = explode(';', $validated['photo']);
                if (count($photoParts) === 2) {
                    $imageType = explode('/', $photoParts[0])[1];
                    $imageBase64 = explode(',', $photoParts[1])[1];
                    $imageName = 'service_' . time() . '_' . uniqid() . '.' . $imageType;
                    \Illuminate\Support\Facades\Storage::disk('public')->put('services/' . $imageName, base64_decode($imageBase64));
                    $validated['photo'] = '/storage/services/' . $imageName;
                }
            } catch (\Exception $e) {
                // Ignore error and fall back
            }
        }

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data'    => $this->formatService($service),
        ], 201);
    }

    /**
     * PUT /api/services/{id}  (admin)
     */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        if (! $service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        $validated = $request->validate([
            'name'             => 'sometimes|string|max:150',
            'description'      => 'sometimes|nullable|string',
            'price'            => 'sometimes|numeric|min:0',
            'duration_minutes' => 'sometimes|integer|min:1',
            'photo'            => 'sometimes|nullable|string',
        ]);

        if (!empty($validated['photo']) && str_starts_with($validated['photo'], 'data:image')) {
            try {
                $photoParts = explode(';', $validated['photo']);
                if (count($photoParts) === 2) {
                    $imageType = explode('/', $photoParts[0])[1];
                    $imageBase64 = explode(',', $photoParts[1])[1];
                    $imageName = 'service_' . time() . '_' . uniqid() . '.' . $imageType;
                    \Illuminate\Support\Facades\Storage::disk('public')->put('services/' . $imageName, base64_decode($imageBase64));
                    $validated['photo'] = '/storage/services/' . $imageName;
                }
            } catch (\Exception $e) {
                // Ignore error and fall back
            }
        }

        $service->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully',
            'data'    => $this->formatService($service->fresh()),
        ]);
    }

    /**
     * DELETE /api/services/{id}  (admin)
     */
    public function destroy($id)
    {
        $service = Service::find($id);
        if (! $service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully',
            'data'    => $this->formatService($service),
        ]);
    }

    private function formatService(Service $service): array
    {
        $photoUrl = $service->photo;

        // Strip any hardcoded localhost/127.0.0.1 prefix from DB data
        if ($photoUrl) {
            $photoUrl = preg_replace('#^https?://(127\.0\.0\.1(:\d+)?|localhost(:\d+)?)#', '', $photoUrl);
        }

        // Build full URL from the relative /storage/... path
        if ($photoUrl && str_starts_with($photoUrl, '/storage/')) {
            $photoUrl = rtrim(url('/'), '/') . $photoUrl;
        }

        return [
            'id'               => $service->id,
            'name'             => $service->name,
            'description'      => $service->description ?? '',
            'price'            => (int) $service->price,
            'duration'         => $service->duration_minutes . ' min',
            'duration_minutes' => $service->duration_minutes,
            'photo'            => $photoUrl
                ?? 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
        ];
    }
}
