// La fecha objetivo: 20 de noviembre de 2027 a las 15:00 hrs (Primer Día del Festival)
const concertDate = new Date("November 20, 2027 15:00:00").getTime();

const updateCountdown = setInterval(() => {
    const now = new Date().getTime();
    const gap = concertDate - now;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    document.getElementById("days").innerText = d < 10 ? "0" + d : d;
    document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
    document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
    document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;

    // Cuando llegue la fecha del evento
    if (gap <= 0) {
        clearInterval(updateCountdown);
        // Cambiamos el mensaje para que tenga sentido con el día del concierto
        document.getElementById("countdown").innerHTML = "<h2 class='font-oswald text-danger display-4'>¡LA MAGIA HA COMENZADO!</h2>";
    }
}, 1000);

/* =========================================
BASE DE DATOS SUPABASE (BAAS)
========================================= */
// Importamos la librería de Supabase directamente desde internet
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Conectamos con tus credenciales
const supabaseUrl = 'https://lymhxsgqqjstcqrmffue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bWh4c2dxcWpzdGNxcm1mZnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MTM4MzksImV4cCI6MjA5MTE4OTgzOX0.BUejpGMvI-OvWoPdL7BMRAElsDJJHR8GC5_w-dmjhtA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Atrapamos el formulario
const formulario = document.getElementById('form-contacto');

formulario.addEventListener('submit', async function(evento) {
    // 1. Evitamos que la página se recargue inmediatamente
    evento.preventDefault();

    // 2. Trampa para Bots (Honeypot) - Detener si está lleno
    const botField = document.getElementById('honeypot').value;
    if (botField !== "") {
        console.warn("Bot detectado.");
        return; 
    }

    // 3. Recolectamos y LIMPIAMOS los datos antes de enviar
    const formData = new FormData(formulario);
    const nombreRaw = formData.get('nombre').trim();
    const emailRaw = formData.get('email').trim();
    const mensajeRaw = formData.get('mensaje').trim();

    // 4. VALIDACIONES DE SEGURIDAD Y LÓGICA
    if (nombreRaw.length < 2) {
        alert("El nombre es demasiado corto.");
        return;
    }

    if (mensajeRaw.length < 10) {
        alert("Por favor, escribe un mensaje un poco más detallado.");
        return;
    }

    // 5. SANITIZACIÓN (Crear el objeto limpio)
    const cleanData = {
        nombre: nombreRaw.replace(/<[^>]*>?/gm, ''),
        email: emailRaw,
        motivo: formData.get('motivo'),
        mensaje: mensajeRaw.replace(/<[^>]*>?/gm, '')
    };

    // 6. PREPARAR EL BOTÓN (FEEDBACK VISUAL)
    const boton = formulario.querySelector('button[type="submit"]');
    const textoOriginal = boton.innerHTML;
    boton.innerHTML = 'Enviando mensaje...';
    boton.disabled = true;

    // 7. ENVIAR LOS DATOS LIMPIOS A SUPABASE
    const { data, error } = await supabase
        .from('mensajes')
        .insert([cleanData]); // <-- IMPORTANTE: Enviamos cleanData, no datosUsuario

    // 8. RESULTADO
    if (error) {
        console.error("Error al enviar:", error);
        alert("Los dioses del metal no nos dejaron enviar el mensaje. Intenta de nuevo.");
    } else {
        alert("¡Mensaje recibido! Nos pondremos en contacto pronto.");
        formulario.reset(); 
    }

    // 9. RESTAURAR BOTÓN
    boton.innerHTML = textoOriginal;
    boton.disabled = false;
});