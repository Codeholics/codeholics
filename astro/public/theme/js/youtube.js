document.addEventListener("DOMContentLoaded",
function() {
		const v = document.getElementsByClassName("youtube_video");
    for (let n = 0; n < v.length; n++) {
			// Get parent of video link
			parentEl = v[n].parentNode;
			// Create new child of parent
			const videoDiv = document.createElement("div");
			videoDiv.classList.add("youtube_video");
			// get video id
			const vid = v[n].href.split("=")[1];
			videoDiv.innerHTML = videoThumb(vid);
			videoDiv.onclick = () => {videoIframe(videoDiv, vid);};
			v[n].removeAttribute("target");
			v[n].removeAttribute("href");
			parentEl.replaceChild(videoDiv, v[n]);
    }
});

function videoThumb(id) {
	const thumb = `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg">`;
  const play = '<div class="play"><i class="bi bi-play-circle text-secondary"></i></div>';

	return thumb + play;
}

function videoIframe(el, vid) {
	const iframe = document.createElement("iframe");
	const embed = `https://www.youtube.com/embed/${vid}?autoplay=1`;
	iframe.setAttribute("src", embed);
	iframe.setAttribute("frameborder", "0");
	iframe.setAttribute("allowfullscreen", "1");
	el.innerHTML = "";
	el.appendChild(iframe);
}

