sap.ui.define([
	"./util/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.perezjquim.ytc.pwa.controller.CropNDownload", {

		API_BASE_URL: "https://perezjquim-ytc.herokuapp.com",

		onPrepareVideo: async function() {
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

				oResponses.forEach(async function(oResponse) {
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

						oBlobModel.setData(oBlobData);
					}
				});

				this.setBusy(false);

			} catch (oException) {
				this.setBusy(false);
				console.warn(oException);
				this.toast(oException);
			}
		},

		onParamChanged: async function(oEvent) {

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

					const oVideoInfoModel = this.getModel("video_info");

					if (sVideoUrl) {

						const oMiscModel = this.getModel("misc");
						oMiscModel.setProperty("/is_fetching_video_info", true);

						const sTimestamp = new Date().getTime();

						const sVideoInfoUrl = `${this.API_BASE_URL}/get-video-info?url=${sVideoUrl}&=${sTimestamp}`;

						try {
							const oResponse = await fetch(sVideoInfoUrl);

							if (oResponse.ok) {
								const oVideoInfo = await oResponse.json();
								oVideoInfoModel.setData(oVideoInfo);

								// setting video duration as default end time
								var sDuration = oVideoInfo.duration;
								if (sDuration.length > 5) {
									sDuration = sDuration.substr(sDuration.length - 5);
								}
								const oPromptModel = this.getModel("prompt");
								oPromptModel.setProperty("/end_time", sDuration);
							} else {
								oVideoInfoModel.setData({});
							}

						} catch (oException) {
							console.warn(oException);
							oVideoInfoModel.setData({});
						}

						oMiscModel.setProperty("/is_fetching_video_info", false);
					} else {
						oVideoInfoModel.setData({});
					}
					break;

				default:
					break;
			}
		},

		onPressDownload: function(oEvent) {

			const oSource = oEvent.getSource();
			const oContext = oSource.getBindingContext("video_blobs");
			const sFilename = oContext.getProperty("file_name");
			const sBlobUrl = oContext.getProperty("blob_url");

			const oAnchor = document.createElement('a');
			oAnchor.setAttribute('href', sBlobUrl);
			oAnchor.setAttribute('download', sFilename);
			oAnchor.click();
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