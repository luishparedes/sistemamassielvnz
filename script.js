document.addEventListener("DOMContentLoaded", () => {
  const panelPrincipal = document.getElementById("panelPrincipal");
  const panelMovimientos = document.getElementById("panelMovimientos");
  const verMovimientosBtn = document.getElementById("verMovimientos");
  const volverPrincipalBtn = document.getElementById("volverPrincipal");
  const form = document.getElementById("ventasForm");
  const reiniciarSemanaBtn = document.getElementById("reiniciarSemana");
  const copiarPortapapelesBtn = document.getElementById("copiarPortapapeles");
  const movimientosTable = document.getElementById("movimientosTable").getElementsByTagName("tbody")[0];

  let acumuladoSemanal = 0;
  let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

  // Mostrar movimientos guardados
  function mostrarMovimientos() {
    movimientosTable.innerHTML = "";
    movimientos.forEach((mov, index) => {
      const row = movimientosTable.insertRow();
      row.innerHTML = `
        <td>Día ${index + 1}</td>
        <td>${mov.totalDia.toFixed(2)}</td>
        <td>${mov.reinversion.toFixed(2)}</td>
        <td>${mov.gastos.toFixed(2)}</td>
        <td>${mov.sueldo.toFixed(2)}</td>
        <td>${mov.ahorro.toFixed(2)}</td>
      `;
    });
  }

  // Navegar a la pantalla de movimientos
  verMovimientosBtn.addEventListener("click", () => {
    panelPrincipal.style.display = "none";
    panelMovimientos.style.display = "block";
    mostrarMovimientos();
  });

  // Volver al panel principal
  volverPrincipalBtn.addEventListener("click", () => {
    panelMovimientos.style.display = "none";
    panelPrincipal.style.display = "block";
  });

  // Guardar y calcular
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener valores
    const tasaDolar = parseFloat(document.getElementById("tasaDolar").value) || 1;
    const fondoCaja = parseFloat(document.getElementById("fondoCaja").value) || 0;
    const pagoMovil = parseFloat(document.getElementById("pagoMovil").value) || 0;
    const biopago = parseFloat(document.getElementById("biopago").value) || 0;
    const pos = parseFloat(document.getElementById("pos").value) || 0;
    const comisionPos = parseFloat(document.getElementById("comisionPos").value) || 0;
    const zelle = parseFloat(document.getElementById("zelle").value) || 0;
    const creditoBs = parseFloat(document.getElementById("creditoBs").value) || 0;
    const creditoUsd = parseFloat(document.getElementById("creditoUsd").value) || 0;
    const pagoProveedores = parseFloat(document.getElementById("pagoProveedores").value) || 0;

    // Calcular comisión POS
    const comision = pos * (comisionPos / 100);
    const posNeto = pos - comision;

    // Convertir USD a Bs
    const zelleBs = zelle * tasaDolar;
    const creditoUsdBs = creditoUsd * tasaDolar;

    // Calcular total del día
    const totalDia = pagoMovil + biopago + posNeto + zelleBs + creditoBs + creditoUsdBs;
    acumuladoSemanal += totalDia;

    // Calcular distribución
    const reinversion = totalDia * 0.5;
    const gastos = totalDia * 0.3;
    const sueldo = totalDia * 0.2;
    const ahorro = sueldo * 0.1; // 10% del sueldo como ahorro

    // Calcular fondo de caja final
    const fondoFinal = fondoCaja + totalDia - pagoProveedores;

    // Guardar movimiento
    const movimiento = {
      totalDia,
      reinversion,
      gastos,
      sueldo,
      ahorro,
    };
    movimientos.push(movimiento);
    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    // Mostrar resultados
    document.getElementById("totalDia").textContent = totalDia.toFixed(2);
    document.getElementById("acumuladoSemanal").textContent = acumuladoSemanal.toFixed(2);
    document.getElementById("reinversion").textContent = reinversion.toFixed(2);
    document.getElementById("gastos").textContent = gastos.toFixed(2);
    document.getElementById("sueldo").textContent = sueldo.toFixed(2);
    document.getElementById("ahorro").textContent = ahorro.toFixed(2);
    document.getElementById("fondoFinal").textContent = fondoFinal.toFixed(2);

    // Actualizar tabla de movimientos
    mostrarMovimientos();
  });

  // Reiniciar semana
  reiniciarSemanaBtn.addEventListener("click", () => {
    if (confirm("¿Estás seguro de reiniciar la semana? Esto borrará todos los datos.")) {
      localStorage.removeItem("movimientos");
      movimientos = [];
      acumuladoSemanal = 0;
      mostrarMovimientos();
      document.getElementById("acumuladoSemanal").textContent = "0.00";
      alert("Semana reiniciada. Copia la información antes de reiniciar.");
    }
  });

  // Copiar al portapapeles
  copiarPortapapelesBtn.addEventListener("click", () => {
    const texto = movimientos.map((mov, index) => `
      Día ${index + 1}:
      Total: ${mov.totalDia.toFixed(2)} Bs
      Reinversión: ${mov.reinversion.toFixed(2)} Bs
      Gastos: ${mov.gastos.toFixed(2)} Bs
      Sueldo: ${mov.sueldo.toFixed(2)} Bs
      Ahorro: ${mov.ahorro.toFixed(2)} Bs
    `).join("\n");

    navigator.clipboard.writeText(texto)
      .then(() => alert("Información copiada al portapapeles."))
      .catch(() => alert("Error al copiar al portapapeles."));
  });
});
