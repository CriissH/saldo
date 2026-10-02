/**
 * ============================================================
 *  ARRANQUE DE LA APLICACIÓN
 * ------------------------------------------------------------
 *  Este es el último script que se carga. Para este punto ya
 *  están definidas todas las funciones y ya se conectaron todos
 *  los eventos (15-eventos.js), así que acá simplemente se dibuja
 *  la app por primera vez y se chequea si hay una actualización
 *  disponible (no aplica en Android).
 * ============================================================
 */

SaldoLogs.info("arranque", "Comenzando renderizado inicial", {
  version: typeof VERSION_APP === "string" ? VERSION_APP : "desconocida"
});

renderizar();

SaldoLogs.info("arranque", "Renderizado inicial completado");

if (!/Android/i.test(navigator.userAgent)) {
  setTimeout(() => verificarActualizacion(false, false), 1200);
}
