document.addEventListener("DOMContentLoaded", function () {
    const shareBtn = document.getElementById("shareBtn");
    const goalInput = document.getElementById("goalInput");

    shareBtn.addEventListener("click", function () {
        const goalText = goalInput.value.trim();

        if (!goalText) {
            alert("Nhập mục tiêu đi ba 😭!!! Thôi ráng xem lại từ đầu :)");
            return;
        }

        const shareText = `Năm nay, tôi đặt mục tiêu: "${goalText}" 🎯
Cùng nhau cố gắng nhé!
#CountToTet2025
Xem tại https://na1293.github.io/Recap_2025/`;

        if (navigator.share) {
            navigator.share({
                title: "Mục tiêu năm 2025",
                text: shareText,
                url: "https://na1293.github.io/Recap_2025/"
            }).catch(err => console.error("Share fail:", err));
        } else {
            alert("Trình duyệt này không hỗ trợ share 😢");
        }
    });
});
