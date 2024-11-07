sap.ui.define([
	"./util/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("com.perezjquim.ytc.pwa.controller.CropNDownload", {

		API_BASE_URL: "https://perezjquim-ytc.herokuapp.com",

		onPrepareVideo: async function () {
			this.setBusy(true);

			const oWizard = this.byId("ytc-wizard");

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

						if (oTime.getTime() < oEndTime.getTime()) {
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

				const oBlobModel = this.getModel("video_blobs");
				var oBlobData = [];

				oResponses.forEach(async function (oResponse) {
					if (oResponse.ok) {
						const sFilename = oResponse.headers.get('content-disposition').split('filename=')[1].split(';')[0];
						const oFileData = await oResponse.blob();

						const oBlob = new Blob([oFileData], {
							type: 'application/octet-stream'
						});

						const sBlobUrl = window.URL.createObjectURL(oBlob);
						oBlobData = oBlobData.concat([{
							"file_name": sFilename,
							"blob_url": sBlobUrl
						}]);

						oBlobData.sort((a, b) => a["file_name"] > b["file_name"] ? 1 : -1);

						oBlobModel.setData(oBlobData);
					} else {
						const sErrorMsg = await oResponse.text();
						console.warn(sErrorMsg);
						this.toast(sErrorMsg);
						oWizard.previousStep();
					}
				}.bind(this));

			} catch (oException) {
				console.warn(oException);
				this.toast(oException);
				oWizard.previousStep();
			}

			this.setBusy(false);
		},

		onParamChanged: async function (oEvent) {

			const oWizard = this.byId("ytc-wizard");
			oWizard.previousStep();

			const oBlobModel = this.getModel("video_blobs");
			oBlobModel.setData([]);

			const oSource = oEvent.getSource();
			const oBinding = oSource.getBinding("value") || oSource.getBinding("selected");
			const sProperty = oBinding.getPath();

			switch (sProperty) {

				case "/url":
					const oPromptModel = this.getModel("prompt");
					const sVideoUrl = decodeURIComponent(oPromptModel.getProperty("/url"));

					if (sVideoUrl) {
						//noop
					} else {
						oVideoInfoModel.setData({});
					}
					break;

				default:
					break;
			}
		},

		onPressDownload: function (oEvent) {

			const oSource = oEvent.getSource();
			const oContext = oSource.getBindingContext("video_blobs");
			const sFilename = oContext.getProperty("file_name");
			const sBlobUrl = oContext.getProperty("blob_url");

			const oAnchor = document.createElement('a');
			oAnchor.setAttribute('href', sBlobUrl);
			oAnchor.setAttribute('download', sFilename);
			oAnchor.click();

		},

		prepareIframeContent: function (sVideoUrl) {
			if (sVideoUrl) {
				const oUrl = new URL(sVideoUrl);
				const sVideoId = oUrl.searchParams.get('v');
				return `<iframe 
					src='https://www.youtube.com/embed/${sVideoId}'
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				/>`;
			}
		},

		_downloadVideo: async function (sVideoUrl, sStartTime, sEndTime) {

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