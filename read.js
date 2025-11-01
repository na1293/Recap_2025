document.addEventListener("DOMContentLoaded", function() {
    function read(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                const result = document.getElementById("result");

                if (!Array.isArray(data)) {
                    result.innerHTML = "<p>❌ File không đúng định dạng!</p>";
                    return;
                }

                const totalVideos = data.length;
                const videoCount = {};
                const channelCount = {};

                data.forEach(item => {
                    const title = item.title || "Không có tiêu đề";
                    const videoUrl = item.titleUrl || "#";
                    const channel = item.subtitles?.[0]?.name || "Không rõ kênh";

                    videoCount[videoUrl] = videoCount[videoUrl] || { title, titleUrl: videoUrl, count: 0 };
                    videoCount[videoUrl].count++;
                    channelCount[channel] = (channelCount[channel] || 0) + 1;
                });

                const topVideos = Object.values(videoCount)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 50);

                const topChannels = Object.entries(channelCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 50);

                const firstVideo = topVideos[0] || { title: "—", titleUrl: "#", count: 0 };
                const firstChannel = topChannels[0] || ["—", 0];

                // Helper to build a 2-column table (name | count)
                function buildTwoColTable(headers, rowsHtml) {
                    return `
                        <table class="recap-table" style="width:100%;border-collapse:collapse;">
                            <thead>
                                <tr>
                                    <th style="text-align:left;padding:8px;border-bottom:1px solid rgba(0,0,0,0.1)">${headers[0]}</th>
                                    <th style="text-align:right;padding:8px;border-bottom:1px solid rgba(0,0,0,0.1);width:120px">${headers[1]}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    `;
                }

                const topVideosRows = topVideos.map(v =>
                    `<tr>
                        <td style="padding:8px;border-bottom:1px dashed rgba(0,0,0,0.05)"><a href="${v.titleUrl}" target="_blank" rel="noopener noreferrer">${v.title}</a></td>
                        <td style="padding:8px;text-align:right;border-bottom:1px dashed rgba(0,0,0,0.05)"><strong>${v.count.toLocaleString()}</strong></td>
                    </tr>`
                ).join('');

                const topChannelsRows = topChannels.map(([name, count]) =>
                    `<tr>
                        <td style="padding:8px;border-bottom:1px dashed rgba(0,0,0,0.05)">${name}</td>
                        <td style="padding:8px;text-align:right;border-bottom:1px dashed rgba(0,0,0,0.05)"><strong>${count.toLocaleString()}</strong></td>
                    </tr>`
                ).join('');

                result.innerHTML = `
                    <div class="recap-step" id="step1">
                        <h2>✨ Năm nay bạn đã xem...</h2>
                        <p><strong>${totalVideos.toLocaleString()}</strong> video!</p>
                    </div>

                    <div class="recap-step" id="step2">
                        <h2>📺 Bạn xem video nhiều nhất là...</h2>
                        <p><a href="${firstVideo.titleUrl}" target="_blank" rel="noopener noreferrer">${firstVideo.title}</a> — <strong>${firstVideo.count.toLocaleString()}</strong> lần!</p>
                    </div>

                    <div class="recap-step" id="step3">
                        <h2>🔥 Top video bạn xem lại nhiều nhất</h2>
                        ${buildTwoColTable(['Video', 'Lượt xem'], topVideosRows || '<tr><td colspan="2" style="padding:8px">Không có dữ liệu</td></tr>')}
                    </div>

                    <div class="recap-step" id="step4">
                        <h2>📡 Bạn xem kênh nhiều nhất là...</h2>
                        <p><strong>${firstChannel[0]}</strong> — <strong>${(firstChannel[1]||0).toLocaleString()}</strong> lần!</p>
                    </div>

                    <div class="recap-step" id="step5">
                        <h2>🎬 Top kênh bạn xem nhiều nhất</h2>
                        ${buildTwoColTable(['Kênh', 'Lượt xem'], topChannelsRows || '<tr><td colspan="2" style="padding:8px">Không có dữ liệu</td></tr>')}
                    </div>
                `;

                // Reveal animation (giữ nguyên logic cũ)
                const steps = result.querySelectorAll('.recap-step');
                steps.forEach((el, i) => {
                    el.classList.remove('show');
                    setTimeout(() => el.classList.add('show'), i * 1500);
                });

            } catch (err) {
                document.getElementById("result").innerHTML = "<p>⚠️ Lỗi khi đọc file JSON.</p>";
                console.error(err);
            }
        };
        reader.readAsText(file);
    }

    document.getElementById("fileInput").addEventListener("change", e => {
        const file = e.target.files[0];
        if (file) read(file);
    });
});
