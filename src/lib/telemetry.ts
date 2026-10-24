/**
 * Unified Telemetry & Verification System
 * Portability: PORTABLE_GLOBAL_LINK_V1
 */

export interface TelemetryPayload {
  data: string;
  telemetry: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  };
}

/**
 * Captures location coordinates and passes data safely to the permanent backend link.
 */
export function sendGeolocatedData(payloadString: string) {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }

  console.log("[ETHERNET] Initializing Geolocation Verification...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coordinatePayload: TelemetryPayload = {
        data: payloadString,
        telemetry: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        }
      };

      // Transmitting the package to the permanent backend endpoint
      fetch('/api/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coordinatePayload)
      })
      .then(response => {
        if (!response.ok) throw new Error("Backend link handshake failed");
        return response.json();
      })
      .then(data => {
        console.log("%c[ETHERNET] Payload synchronized successfully:", "color: #10b981; font-weight: bold;", data);
        // Global event to notify UI of successful sync
        window.dispatchEvent(new CustomEvent('nexus-telemetry-sync', { detail: data }));
      })
      .catch(err => {
        console.error("%c[ETHERNET] Transmission error:", "color: #ef4444;", err);
      });
    },
    (error) => {
      console.warn(`[ETHERNET] Location clearance denied or unavailable (Code ${error.code}): ${error.message}`);
      // Fallback for telemetry locking purposes
      window.dispatchEvent(new CustomEvent('nexus-telemetry-sync-failed', { detail: error }));
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}
