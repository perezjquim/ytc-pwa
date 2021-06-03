sap.ui.define([

], function() {
	return {
		init: function() {
			const oApplicationCache = window.applicationCache;
			if (oApplicationCache) {
				if (oApplicationCache.status == oApplicationCache.UPDATEREADY) {
					this.onUpdateReady();
				} else {
					oApplicationCache.addEventListener('updateready', this.onUpdateReady.bind(this), false);
				}
			}
		},

		onUpdateReady: function() {
			const sText = this.getText("updating");
			this.toast(sText);

			const iReloadDelay = 2000;
			setTimeout(() => {
				window.location.reload();
			}, iReloadDelay);
		}
	};
});