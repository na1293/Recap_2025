document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 1;
    const body = document.querySelector("body");

    // 1️⃣ Bảng màu cực chill cho từng giai đoạn
    const stageThemes = {
        1: "linear-gradient(0deg, #0f2027, #203a43, #2c5364)",
        2: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        3: "linear-gradient(135deg, #141E30, #243B55)",
        4: "linear-gradient(135deg, #4b8059, #3663a3, #301c80)",
        5: "linear-gradient(135deg, #98ab0c, #b0334e, #3380b0)",
        6: "linear-gradient(135deg, #8c1515,#f2b705,#c62828)",
        7: "linear-gradient(135deg, #db56c3, #568fdb, #5b3bc4)",
        8: "linear-gradient(135deg, #373b44, #4286f4, #373b44)",
        9: "linear-gradient(135deg, #731e05, #bdb157, #9c4e77)",
        10: "linear-gradient(135deg, #654ea3, #eaafc8, #654ea3)",
        11: "linear-gradient(135deg, #263ad4, #7253c9, #9c8bcc)",
        12: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        13: "linear-gradient(135deg, #1f4037, #99f2c8, #1f4037)",
        14: "linear-gradient(135deg, #8360c3, #2ebf91, #8360c3)",
        15: "radial-gradient(circle at bottom, #d9d96c 0%, black 80%, black 100%)",
        16: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fad0c4)",
        17: "linear-gradient(135deg, #a18cd1, #fbc2eb, #a6c0fe)",
        18: "linear-gradient(135deg, #f6d365, #fda085, #f6d365)",
        19: "linear-gradient(135deg, #89f7fe, #66a6ff, #89f7fe)",
        20: "linear-gradient(135deg, #c3cfe2, #c3cfe2)"
    };

    // Khởi tạo style ban đầu
    body.style.transition = "background 1s ease";
    body.style.background = stageThemes[currentStep];

    // 2️⃣ Giải phóng hàm nextStage ra Global để onclick ở HTML gọi được
    window.nextStage = function () {
        const currentElem = document.getElementById(`stage${currentStep}`);
        const nextElem = document.getElementById(`stage${currentStep + 1}`);

        if (!nextElem) {
            console.log("Hết stage rồi bạn ơi! 🎉");
            return;
        }

        // Ẩn stage cũ
        if (currentElem) {
            currentElem.classList.remove('active');
            currentElem.classList.add('exit');
        }

        // Tăng step và đổi màu nền
        currentStep++;
        body.style.background = stageThemes[currentStep] || "#000";

        // Hiện stage mới
        nextElem.classList.add('active');

        // Check xem có phải stage tự động không
        handleAutoLogic(nextElem);
    };

    // 3️⃣ Logic xử lý thanh progress và tự động chuyển cảnh
    function handleAutoLogic(element) {
        if (element.getAttribute('data-type') === 'auto') {
            const duration = parseInt(element.getAttribute('data-time')) || 3000;
            const progressBar = element.querySelector('.progress-bar');

            if (progressBar) {
                // Reset thanh progress về 0 ngay lập tức
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                
                // Dùng setTimeout để trình duyệt kịp nhận diện việc reset trước khi chạy tiếp
                setTimeout(() => {
                    progressBar.style.transition = `width ${duration}ms linear`;
                    progressBar.style.width = '100%';
                }, 50);
            }

            // Tự động chuyển stage sau khoảng thời gian duration
            setTimeout(() => {
                // Kiểm tra nếu stage vẫn đang active thì mới chuyển (tránh lỗi bấm tay nhanh hơn máy)
                if (element.classList.contains('active')) {
                    window.nextStage();
                }
            }, duration);
        }
    }

    // 4️⃣ Kiểm tra stage đầu tiên khi vừa load trang
    const firstStage = document.getElementById(`stage${currentStep}`);
    if (firstStage) {
        firstStage.classList.add('active');
        handleAutoLogic(firstStage);
    }
});