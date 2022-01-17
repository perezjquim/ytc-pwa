sap.ui.define([
	"./util/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.perezjquim.ytc.pwa.controller.CropNDownload", {

		API_BASE_URL: "https://perezjquim-ytc.herokuapp.com",

		onPressDownload: async function() {
			this.setBusy(true);

			const oPromptModel = this.getModel("prompt");
			const bSplit = oPromptModel.getProperty("/split");

			var oFetchPromises = [];

			try {

				const sVideoUrl = decodeURIComponent(oPromptModel.getProperty("/url"));
				const sStartTime = oPromptModel.getProperty("/start_time");
				const sEndTime = oPromptModel.getProperty("/end_time");

				if (bSplit) {
					const oTime = new Date(`1970-01-01 00:${sStartTime}`);
					const oEndTime = new Date(`1970-01-01 00:${sEndTime}`);

					const sSplitInterval = oPromptModel.getProperty("/split_interval");
					const oSplitInterval = new Date(`1970-01-01 00:${sSplitInterval}`);
					const iSplitIntervalMinutes = Number(oSplitInterval.getMinutes());
					const iSplitIntervalSeconds = Number(oSplitInterval.getSeconds());

					while (true) {
						const sInnerBeginTime = `${oTime.getMinutes()}:${oTime.getSeconds()}`;

						oTime.setMinutes(oTime.getMinutes() + iSplitIntervalMinutes);
						oTime.setSeconds(oTime.getSeconds() + iSplitIntervalSeconds);

						var sInnerEndTime = "";

						if (oTime.getTime() <= oEndTime.getTime()) {
							sInnerEndTime = `${oTime.getMinutes()}:${oTime.getSeconds()}`;
							oFetchPromises.push(await this._downloadVideo(sVideoUrl, sInnerBeginTime, sInnerEndTime));
						} else {
							sInnerEndTime = `${oEndTime.getMinutes()}:${oEndTime.getSeconds()}`;
							oFetchPromises.push(await this._downloadVideo(sVideoUrl, sInnerBeginTime, sInnerEndTime));
							break;
						}
					}

				} else {
					oFetchPromises.push(await this._downloadVideo(sVideoUrl, sStartTime, sEndTime));
				}

				const oResponses = await Promise.all(oFetchPromises);

				oResponses.forEach(async function(oResponse) {
					if (oResponse.ok) {
						const sFilename = oResponse.headers.get('content-disposition').split('filename=')[1].split(';')[0];
						const oFileData = await oResponse.blob();

						const oBlob = new Blob([oFileData], {
							type: 'application/octet-stream'
						});
						if (window.navigator.msSaveBlob) {
							window.navigator.msSaveBlob(oBlob, sFilename);
						} else {
							const sBlobUrl = window.URL.createObjectURL(oBlob);
							const oAnchor = document.createElement('a');
							oAnchor.setAttribute('href', sBlobUrl);
							oAnchor.setAttribute('download', sFilename);
							oAnchor.click();
						}

					} else {
						throw new Error("Response NOK");
					}
				});

				this.setBusy(false);

			} catch (oException) {
				this.setBusy(false);
				console.warn(oException);
				this.toast(oException);
			}
		},

		onUrlChanged: async function() {
			const oPromptModel = this.getModel("prompt");
			const sVideoUrl = decodeURIComponent(oPromptModel.getProperty("/url"));

			if (sVideoUrl) {

				const oMiscModel = this.getModel("misc");
				oMiscModel.setProperty("/is_fetching_video_info", true);

				const sTimestamp = new Date().getTime();

				const sVideoInfoUrl = `${this.API_BASE_URL}/get-video-info?url=${sVideoUrl}&=${sTimestamp}`;

				try {
					const oResponse = await fetch(sVideoInfoUrl);

					const oVideoInfoModel = this.getModel("video_info");

					if (oResponse.ok) {
						const oVideoInfo = await oResponse.json();
						oVideoInfoModel.setData(oVideoInfo);
					} else {
						oVideoInfoModel.setData({});
					}

				} catch (oException) {
					console.warn(oException);
				}

				oMiscModel.setProperty("/is_fetching_video_info", false);

			}
		},

		_downloadVideo: function(sVideoUrl, sStartTime, sEndTime) {

			const sTimestamp = new Date().getTime();

			const oPromptData = {
				"url": sVideoUrl,
				"start_time": sStartTime,
				"end_time": sEndTime
			};

			const oSearchParams = new URLSearchParams(oPromptData);
			const sSearchParams = decodeURIComponent(oSearchParams.toString());

			const sDownloadUrl = `${this.API_BASE_URL}/crop-video?${sSearchParams}&=${sTimestamp}`;

			return fetch(sDownloadUrl);
		}

	});
});