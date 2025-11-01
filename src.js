document.addEventListener("DOMContentLoaded", function() {
        // Target date: đổi nếu cần (hiện là 25 Jan 2026 00:00)
    const TARGET = new Date("2025-12-31T23:59:59");

    // References
    const moEl = document.getElementById('mo');
    const dEl  = document.getElementById('d');
    const hEl  = document.getElementById('h');
    const miEl = document.getElementById('mi');
    const sEl  = document.getElementById('s');
    const afterBox = document.getElementById('afterBox');
    const overlay = document.getElementById('overlay');
    const recapBtn = document.getElementById('recapBtn');

    // helper: pad 2 digits
    const pad = (n) => String(n).padStart(2,'0');

    // compute months properly + remaining time
    function computeParts(now, target){
        if (now >= target) return { months:0, days:0, hours:0, minutes:0, seconds:0, finished:true };

        // total month difference (year*12 + month)
        let months = (target.getFullYear() - now.getFullYear())*12 + (target.getMonth() - now.getMonth());

        // If target day-of-month is less than current day-of-month, we haven't completed the current month yet
        if (target.getDate() < now.getDate()) {
            months -= 1;
        }

        // Build intermediate date by adding months to 'now'
        const interim = new Date(now.getTime());
        interim.setMonth(interim.getMonth() + months);

        // If interim advanced past target (rare because of month-length quirks), adjust back
        while (interim > target) {
            months -= 1;
            interim.setMonth(interim.getMonth() - 1);
        }

        // remainder ms after removing whole months
        let remainderMs = target.getTime() - interim.getTime();

        const days = Math.floor(remainderMs / (1000 * 60 * 60 * 24));
        remainderMs -= days * (1000 * 60 * 60 * 24);

        const hours = Math.floor(remainderMs / (1000 * 60 * 60));
        remainderMs -= hours * (1000 * 60 * 60);

        const minutes = Math.floor(remainderMs / (1000 * 60));
        remainderMs -= minutes * (1000 * 60);

        const seconds = Math.floor(remainderMs / 1000);

        return { months, days, hours, minutes, seconds, finished:false };
    }

    // update loop
    let timerId = null;
    function tick(){
        const now = new Date();
        const p = computeParts(now, TARGET);

        moEl.textContent = p.months;
        dEl.textContent  = p.days;
        hEl.textContent  = pad(p.hours);
        miEl.textContent = pad(p.minutes);
        sEl.textContent  = pad(p.seconds);

        if (p.finished) {
            clearInterval(timerId);
            celebrate();
        }
    }

    // celebration: overlay + show afterBox after delay
    function celebrate(){
        // create a simple celebrate element
        overlay.setAttribute('aria-hidden','false');
        overlay.innerHTML = `
            <div class="celebrate" role="region" aria-live="polite">
                <h2>🎆 Chúc Mừng Năm Mới 2026! 🎇</h2>
            </div>
        `;

        // show afterBox after 3s (overlay remains)
        setTimeout(() => {
            afterBox.style.display = 'flex';
        }, 3000);

        // auto-hide overlay after 8s
        setTimeout(() => {
            overlay.innerHTML = '';
            overlay.setAttribute('aria-hidden','true');
        }, 8000);
    }

    // button behaviour: reload page to restart countdown or show recap — here reload
    recapBtn.addEventListener('click', () => {
        location.reload();
    });

    // start
    tick();
    timerId = setInterval(tick, 1000);
});