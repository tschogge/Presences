const presence = new Presence({
		clientId: "1324071536017149973",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

const enum Assets {
	SushiLogo = "https://cdn.rcd.gg/PreMiD/websites/S/Sushi%20Scan/assets/0.png",
	SushiBrowsing = "https://cdn.rcd.gg/PreMiD/websites/S/Sushi%20Scan/assets/1.png",
	SushiReading = "https://cdn.rcd.gg/PreMiD/websites/S/Sushi%20Scan/assets/2.png",
	SushiSelecting = "https://cdn.rcd.gg/PreMiD/websites/S/Sushi%20Scan/assets/3.png",
}

class Comic {
	title: string;
	fullTitle: string;
	pageUrl: string;
	catalogueUrl: string;
}

let comic: Comic | undefined;

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		startTimestamp: browsingTimestamp,
		largeImageKey: Assets.SushiLogo,
		smallImageKey: Assets.SushiLogo,
		smallImageText: "Sushi Scan",
		type: ActivityType.Watching,
		name: "Sushi Scan !",
	};

	if (onOther()) {
		presenceData.details = "Browsing Sushi Scan";
		presenceData.state = document.title.split("-")[0].trim();

		presenceData.largeImageKey = Assets.SushiBrowsing;

		await presence.setActivity(presenceData);
		return;
	}

	await updateComic();

	if (onComicPage()) {
		presenceData.name = comic.title;

		presenceData.details = `${comic.fullTitle}`;
		presenceData.state = "Reading";

		presenceData.largeImageKey = Assets.SushiReading;
		presenceData.largeImageText = comic.title;

		delete presenceData.smallImageKey;
		delete presenceData.smallImageText;

		await presence.setActivity(presenceData);
		return;
	}

	if (onComicCatalogue()) {
		presenceData.name = comic.title;

		presenceData.details = comic.title;
		presenceData.state = "Selecting a chapter";

		presenceData.largeImageKey = Assets.SushiSelecting;
		presenceData.largeImageText = comic.title;

		await presence.setActivity(presenceData);
		return;
	}

	await presence.setActivity();
});

function path(): string {
	return window.location.pathname;
}

function onComicPage() {
	return !!document.querySelector(".chapterbody");
}

function onComicCatalogue() {
	return /^\/catalogue\/[a-zA-Z0-9-]+(\/|)$/i.test(path());
}

function onOther() {
	return [!onComicPage(), !onComicCatalogue()].reduce((a, b) => a && b);
}

function getSplitPath() {
	let a = path().split("-chapitre-");
	if (a.length > 1) return a;

	a = path().split("-volume-");
	if (a.length > 1) return a;
}

function getName(): string {
	return getSplitPath()[0].substring(1).trim();
}

const detailsCache: { [key: string]: Comic } = {};
async function getDetails(): Promise<Comic | null> {
	let doc: Document, url: string;

	if (onComicPage()) {
		const name = getName();
		if (detailsCache[name]) return detailsCache[name];

		url = `https://sushiscan.net/catalogue/${getName()}`;
		const resp = await fetch(url),
			respBody = await resp.text();

		doc = new DOMParser().parseFromString(respBody, "text/html");
	} else if (onComicCatalogue()) {
		url = `https://sushiscan.net${path()}`;
		doc = document;
	} else return null;

	const comic: Comic = {
		title: doc.querySelector(".entry-title").textContent,
		fullTitle: document.querySelector(".entry-title").textContent,
		pageUrl: `https://sushiscan.net${path()}`,
		catalogueUrl: url,
	};
	if (onComicPage() && !detailsCache[getName()])
		detailsCache[getName()] = comic;

	return comic;
}

async function updateComic() {
	comic = await getDetails();
}
