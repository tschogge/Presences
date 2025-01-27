const iframe = new iFrame();

iframe.on("UpdateData", async () => {
	const video = document.querySelector<HTMLVideoElement>("video");
	if (!isNaN(video?.duration)) {
		iframe.send({
			duration: video.duration,
			currentTime: video.currentTime,
			paused: video.paused,
		});
	}
});
