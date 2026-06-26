<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;

/**
 * Alias pour les routes /api/admin/services
 * Délègue tout au ServiceController existant.
 */
class AdminServiceController extends ServiceController
{
    // Hérite de : index(), store(), update(), destroy()
    // Toutes les méthodes sont déjà présentes dans ServiceController
}
