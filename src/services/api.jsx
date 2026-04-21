const API = 'http://127.0.0.1:8000/api';

const req = async (method, path, body = null, token = null) => {
  const headers = {
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Ne pas forcer Content-Type si FormData (pour upload fichier)
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body
        ? (body instanceof FormData ? body : JSON.stringify(body))
        : null,
    });

    const raw = await res.text();
    if (!raw) return { success: false, message: `Réponse vide (${res.status})`, status: res.status };

    let data;
    try { data = JSON.parse(raw); }
    catch { return { success: false, message: `Réponse non-JSON (${res.status})`, status: res.status }; }

    return data;
  } catch (err) {
    return { success: false, message: `Erreur réseau : ${err.message}` };
  }
};

export const authAPI = {
  register: (data)  => req('POST', '/auth/register', data),
  login:    (data)  => req('POST', '/auth/login', data),
  logout:   (token) => req('POST', '/auth/logout', null, token),
  me:       (token) => req('GET',  '/auth/me', null, token),
};

export const serviceAPI = {
  list: () => req('GET', '/services'),
};

export const barberAPI = {
  list:  ()                    => req('GET', '/barbers'),
  slots: (id, date, serviceId) => req('GET', `/barbers/${id}/slots?date=${date}&service_id=${serviceId}`),
};

export const bookingAPI = {
  list:       (token)          => req('GET',  '/bookings', null, token),
  create:     (data, token)    => req('POST', '/bookings', data, token),
  cancel:     (id, token)      => req('POST', `/bookings/${id}/cancel`, null, token),
  adminGetAll:(params, token)  => req('GET',  '/admin/bookings', params, token),
};

export const userAPI = {
  profile:        (token)       => req('GET', '/user', null, token),
  update:         (data, token) => req('PUT', '/user', data, token),
  changePassword: (data, token) => req('PUT', '/user/password', data, token),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminAPI = {
  getServices:   (token)            => req('GET',    '/admin/services', null, token),
  createService: (data, token)      => req('POST',   '/admin/services', data, token),
  updateService: (id, data, token)  => req('PUT',    `/admin/services/${id}`, data, token),
  deleteService: (id, token)        => req('DELETE', `/admin/services/${id}`, null, token),
};
