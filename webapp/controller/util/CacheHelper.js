sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	return Object.extend({
		_oController: null,
		constructor: function(oController) {
			this._oController = oController;
		},
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
			const sText = this._oController.getText("updating");
			this._oController.toast(sText);

			const iReloadDelay = 2000;
			setTimeout(() => {
				window.location.reload();
			}, iReloadDelay);
		}
	});
});