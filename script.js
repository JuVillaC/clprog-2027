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