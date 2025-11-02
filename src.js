document.addEventListener("DOMContentLoaded", function() {
    // --- 1. COUNTDOWN & CELEBRATION LOGIC (Không đổi) ---
    const TARGET = new Date("2025-12-31T23:59:59");

    // References cho Countdown
    const moEl = document.getElementById('mo');
    const dEl = document.getElementById('d');
    const hEl = document.getElementById('h');
    const miEl = document.getElementById('mi');
    const sEl = document.getElementById('s');
    const afterBox = document.getElementById('afterBox');
    // Lưu ý: overlayCelebrate là biến cho Pop-up khi đếm ngược kết thúc (overlay)
    const overlayCelebrate = document.getElementById('overlay'); 
    const recapBtn = document.getElementById('recapBtn');

    // References cho Guide Pop-up
    const guidePopUp = document.getElementById('guidePopUp'); // Container Overlay chính
    const myLink = document.getElementById('myLink');         // Link mở Pop-up
    const hideButton = document.getElementById('hide');       // Nút "Đã hiểu"
    const startLink = document.querySelector('.countdown-title.hide-popup'); // Link "Nhấn vào đây..."
    
    // Local Storage Key
    const GUIDE_KEY = 'hasSeenGuide_2026_v1';
    const HAS_SEEN_GUIDE = localStorage.getItem(GUIDE_KEY);

    // helper: pad 2 digits
    const pad = (n) => String(n).padStart(2,'0');

    // compute months properly + remaining time
    function computeParts(now, target){
        if (now >= target) return { months:0, days:0, hours:0, minutes:0, seconds:0, finished:true };
        let months = (target.getFullYear() - now.getFullYear())*12 + (target.getMonth() - now.getMonth());
        if (target.getDate() < now.getDate()) { months -= 1; }
        const interim = new Date(now.getTime());
        interim.setMonth(interim.getMonth() + months);
        while (interim > target) {
            months -= 1;
            interim.setMonth(interim.getMonth() - 1);
        }
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
        dEl.textContent  = p.days;
        hEl.textContent  = pad(p.hours);
        miEl.textContent = pad(p.minutes);
        sEl.textContent  = pad(p.seconds);

        if (p.finished) {
            clearInterval(timerId);
            celebrate();
        }
    }

    // celebration
    function celebrate(){
        overlayCelebrate.setAttribute('aria-hidden','false');
        overlayCelebrate.innerHTML = `
            <div class="celebrate" role="region" aria-live="polite">
                <h2>🎆 Chúc Mừng Năm Mới 2026! 🎇</h2>
            </div>
        `;
        setTimeout(() => {
            afterBox.style.display = 'flex';
        }, 3000);
        setTimeout(() => {
            overlayCelebrate.innerHTML = '';
            overlayCelebrate.setAttribute('aria-hidden','true');
        }, 8000);
    }

    recapBtn.addEventListener('click', () => {
        location.reload();
    });

    // Start countdown
    tick();
    timerId = setInterval(tick, 1000);

    hideGuidePopUp()
    function hideGuidePopUp(event) {
        if (event) event.preventDefault();
        if (guidePopUp) {
            // Ẩn Pop-up (Dùng display:none vì Pop-up không nằm trong luồng Flex của body)
            guidePopUp.style.display = 'none';
            // Cuộn về phần kết quả (UX mượt)
            const resultEl = document.getElementById('result');
            if (resultEl) {
                resultEl.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }


    // 2.1. Logic Hiển thị Lần Đầu (Local Storage)
    if (guidePopUp) {
        if (HAS_SEEN_GUIDE === 'true') {
            // Đã xem, ẩn đi
            guidePopUp.style.display = 'none';
        } else {
            // Lần đầu, hiển thị Pop-up
            // Dùng 'flex' để căn giữa Pop-up trong Overlay (theo CSS Pop-up căn giữa tuyệt đối)
            guidePopUp.style.display = 'flex';
        }
            // 2.2. Event Listener để Mở Pop-up (Từ link "Làm thế nào...")
        if (myLink && guidePopUp) {
            myLink.addEventListener('click', function(event) {
                event.preventDefault();
                // Mở Pop-up
                guidePopUp.style.display = 'flex'; 
            });
        }

        // 2.3. Event Listener để ĐÓNG Pop-up

        // Nút "Đã hiểu"
        if (hideButton) {
            hideButton.addEventListener('click', hideGuidePopUp);
        }
        
        // Link "Nhấn vào đây để bắt đầu"
        if (startLink) {
            startLink.addEventListener('click', hideGuidePopUp);
        }
    }

});