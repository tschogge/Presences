const presence = new Presence({
		clientId: "1333235846026891264",
	}),
	strings = presence.getStrings({
		play: "presence.playback.playing",
		pause: "presence.playback.paused",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

const enum Assets { // Other default assets can be found at index.d.ts
	Logo = "https://imgur.com/h1yyzU2",
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: Assets.Logo,
		startTimestamp: browsingTimestamp,
	};

	console.log("Is moodle");
	presence.setActivity(presenceData);
});
