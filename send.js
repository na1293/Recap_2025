document.addEventListener("DOMContentLoaded", function() {
    const loi_chuc = document.getElementById("loi-chuc");
    const fileInput = document.getElementById("fileInput");
    const result = document.getElementById("result");
    loi_chuc.addEventListener("click", function() {
        fileInput.click();
    });

    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                if (!Array.isArray(data)) {
                    result.innerHTML = "<p>❌ File không đúng định dạng!</p>";
                    return;
                }
                const messages = data
                    .filter(item => item.commentText)
                    .map(item => item.commentText);
                if (messages.length === 0) {
                    result.innerHTML = "<p>❌ Không tìm thấy lời chúc trong file!</p>";
                    return;
                }
                const randomIndex = Math.floor(Math.random() * messages.length);
                const randomMessage = messages[randomIndex];
                result.innerHTML = `<p>🎉 Lời chúc ngẫu nhiên của bạn: <strong>${randomMessage}</strong></p>`;
            }
            catch (err) {
                result.innerHTML = "<p>⚠️ Lỗi khi đọc file, chỉ chọn JSON TỪ YouTube.</p>";
                console.error(err);
            }
        };
        reader.readAsText(file);
    });
});