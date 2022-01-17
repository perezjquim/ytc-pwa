//@ui5-bundle com/perezjquim/ytc/pwa/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"com/perezjquim/ytc/pwa/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device"],function(t,i){"use strict";return t.extend("com.perezjquim.ytc.pwa.Component",{metadata:{manifest:"json"},init:function(){t.prototype.init.apply(this,arguments);this.getRouter().initialize()}})});
},
	"com/perezjquim/ytc/pwa/controller/App.controller.js":function(){sap.ui.define(["./util/BaseController","sap/ui/core/routing/History","sap/ui/core/Fragment","sap/ui/util/Storage","sap/ui/Device","./util/SWHelper"],function(t,e,n,o,s,i){"use strict";return t.extend("com.perezjquim.ytc.pwa.controller.App",{onInit:function(t){const e=new i(this);e.init()},onHomeButtonPress:function(t){const e=t.getSource();const n=e.getParent();const o=n.getSideContent();const s=o.getItem();const i=s.getItems();const c=i.find(function(t){const e=t.getKey();return e=="Home"});s.fireItemSelect({item:c})},onMenuButtonPress:function(t){const e=t.getSource();const n=e.getParent();const o=n.getSideExpanded();n.setSideExpanded(!o)},onNavigationItemSelect:function(t){const e=t.getParameter("item");const n=e.getKey();this.navTo(n);const o=s.system.phone;if(o){const e=t.getSource();const n=e.getParent();n.setSideExpanded(false)}},onNavButtonPress:function(t){this.navBack()}})});
},
	"com/perezjquim/ytc/pwa/controller/CropNDownload.controller.js":function(){sap.ui.define(["./util/BaseController"],function(t){"use strict";return t.extend("com.perezjquim.ytc.pwa.controller.CropNDownload",{API_BASE_URL:"http://localhost:8000",onPressDownload:async function(){this.setBusy(true);const t=this.getModel("prompt");const e=t.getProperty("/split");var o=[];try{const s=decodeURIComponent(t.getProperty("/url"));const i=t.getProperty("/start_time");const c=t.getProperty("/end_time");if(e){const e=new Date(`1970-01-01 00:${i}`);const a=new Date(`1970-01-01 00:${c}`);const r=t.getProperty("/split_interval");const l=new Date(`1970-01-01 00:${r}`);const d=Number(l.getMinutes());const u=Number(l.getSeconds());while(true){const t=`${e.getMinutes()}:${e.getSeconds()}`;e.setMinutes(e.getMinutes()+d);e.setSeconds(e.getSeconds()+u);var n="";if(e.getTime()<=a.getTime()){n=`${e.getMinutes()}:${e.getSeconds()}`;o.push(await this._downloadVideo(s,t,n))}else{n=`${a.getMinutes()}:${a.getSeconds()}`;o.push(await this._downloadVideo(s,t,n));break}}}else{o.push(await this._downloadVideo(s,i,c))}const a=await Promise.all(o);a.forEach(async function(t){if(t.ok){const e=t.headers.get("content-disposition").split("filename=")[1].split(";")[0];const o=await t.blob();const n=new Blob([o],{type:"application/octet-stream"});if(window.navigator.msSaveBlob){window.navigator.msSaveBlob(n,e)}else{const t=window.URL.createObjectURL(n);const o=document.createElement("a");o.setAttribute("href",t);o.setAttribute("download",e);o.click()}}else{throw new Error("Response NOK")}});this.setBusy(false)}catch(t){this.setBusy(false);console.warn(t);this.toast(t)}},onUrlChanged:async function(){const t=this.getModel("prompt");const e=decodeURIComponent(t.getProperty("/url"));if(e){const t=this.getModel("misc");t.setProperty("/is_fetching_video_info",true);const o=(new Date).getTime();const n=`${this.API_BASE_URL}/get-video-info?url=${e}&=${o}`;try{const t=await fetch(n);const e=this.getModel("video_info");if(t.ok){const o=await t.json();e.setData(o)}else{e.setData({})}}catch(t){console.warn(t)}t.setProperty("/is_fetching_video_info",false)}},_downloadVideo:function(t,e,o){const n=(new Date).getTime();const s={url:t,start_time:e,end_time:o};const i=new URLSearchParams(s);const c=decodeURIComponent(i.toString());const a=`${this.API_BASE_URL}/crop-video?${c}&=${n}`;return fetch(a)}})});
},
	"com/perezjquim/ytc/pwa/controller/Home.controller.js":function(){sap.ui.define(["./util/BaseController"],function(e){"use strict";return e.extend("com.perezjquim.ytc.pwa.controller.Home",{})});
},
	"com/perezjquim/ytc/pwa/controller/util/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/ui/core/BusyIndicator","sap/m/MessageToast"],function(t,e,o,n){"use strict";return t.extend("com.perezjquim.ytc.pwa.controller.util.BaseController",{toast:function(t){n.show(t)},setBusy:function(t){if(t){o.show(0)}else{o.hide()}},getModel:function(t){const e=this.getOwnerComponent();const o=e.getModel(t);return o},attachPatternMatched(t,e){const o=this.getOwnerComponent();const n=o.getRouter();const s=n.getRoute(t);s.attachPatternMatched(e)},getConfig:function(t){const e=this.getModel("config");const o=e.getProperty(`/${t}`);return o},navTo:function(t,e,o){const n=this.getOwnerComponent();const s=n.getRouter();return s.navTo(t,e,o)},getText:function(t){const e=this.getModel("i18n");const o=e.getResourceBundle();const n=o.getText(t);return n},navBack:function(){const t=e.getInstance();const o=t.getPreviousHash();if(o){window.history.go(-1)}else{this.navTo("Home",{},true)}},getStorage:function(){return window.localStorage},clearModel:function(t){const e=this.getModel(t);const o=e.getData();for(var n in o){o[n]=""}e.setData(o)}})});
},
	"com/perezjquim/ytc/pwa/controller/util/SWHelper.js":function(){sap.ui.define(["sap/ui/base/Object"],function(e){return e.extend("com.perezjquim.ytc.pwa.controller.util.SWHelper",{_oController:null,constructor:function(e){this._oController=e},init:function(){this._cleanup();this._registerSW();window.addEventListener("beforeunload",this._cleanup.bind(this))},_registerSW:function(){if(navigator.serviceWorker){navigator.serviceWorker.register("/sw.js")}},_cleanup:function(){if(navigator.serviceWorker){navigator.serviceWorker.getRegistrations().then(function(e){for(let r of e){r.unregister()}})}}})});
},
	"com/perezjquim/ytc/pwa/i18n/i18n.properties":'appTitle=YTC\nappDescription=YTC\n\nHome=Home\nCropNDownload=Crop+Download\nurl=YT URL\nstart_time=Start time (XX:XX)\nend_time=End time (XX:XX)\ndownload=Download\n\nvideo_info=Video information\ntitle=Title\nauthor=Uploaded by\nthumbnail=Thumbnail\nduration=Duration\n\nsplit=Split',
	"com/perezjquim/ytc/pwa/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"com.perezjquim.ytc.pwa","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{}},"sap.ui":{"technology":"UI5","icons":{"icon":"images/icon.png","favIcon":"images/icon.png","phone":"images/icon.png","phone@2":"images/icon.png","tablet":"images/icon.png","tablet@2":"images/icon.png"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"com.perezjquim.ytc.pwa.view.App","type":"XML","async":true},"dependencies":{"minUI5Version":"1.52.16","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"com.perezjquim.ytc.pwa.i18n.i18n"}},"prompt":{"type":"sap.ui.model.json.JSONModel","uri":"model/prompt.json"},"navigation":{"type":"sap.ui.model.json.JSONModel","uri":"model/navigation.json"},"misc":{"type":"sap.ui.model.json.JSONModel","uri":"model/misc.json"},"video_info":{"type":"sap.ui.model.json.JSONModel"}},"resources":{},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"controlId":"app","viewPath":"com.perezjquim.ytc.pwa.view","controlAggregation":"pages"},"routes":[{"name":"Home","pattern":"","target":["Home"]},{"name":"CropNDownload","pattern":"CropNDownload","target":["CropNDownload"]}],"targets":{"Home":{"viewType":"XML","transition":"slide","controlAggregation":"pages","viewName":"Home"},"CropNDownload":{"viewType":"XML","transition":"slide","controlAggregation":"pages","viewName":"CropNDownload"}}}}}',
	"com/perezjquim/ytc/pwa/sw.js":function(){self.addEventListener("fetch",function(e){});
},
	"com/perezjquim/ytc/pwa/view/App.view.xml":'<mvc:View \n    controllerName="com.perezjquim.ytc.pwa.controller.App"\n    xmlns="sap.m"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:tnt="sap.tnt"><tnt:ToolPage><tnt:header><f:ShellBar \n            \thomeIcon="./images/icon.png" \n            \thomeIconPressed="onHomeButtonPress" \n                showMenuButton="true"                 \n            \tmenuButtonPressed="onMenuButtonPress" \n                showNavButton="true"\n                navButtonPressed="onNavButtonPress"\n            \ttitle="{i18n>appTitle}"/></tnt:header><tnt:sideContent><tnt:SideNavigation \n            \texpanded="false" \n            \titemSelect="onNavigationItemSelect" \n            \tselectedKey="{navigation>/selected}"><tnt:NavigationList \n                \titems="{navigation>/items}"><tnt:NavigationListItem \n                    \ticon="{navigation>icon}" \n                    \tkey="{navigation>key}" \n                    \ttext="{ path: \'navigation>key\', formatter: \'.getText\' }"/></tnt:NavigationList></tnt:SideNavigation></tnt:sideContent><tnt:mainContents><App \n            \tid="app"/></tnt:mainContents></tnt:ToolPage></mvc:View>',
	"com/perezjquim/ytc/pwa/view/CropNDownload.view.xml":'<mvc:View \n    controllerName="com.perezjquim.ytc.pwa.controller.CropNDownload" \n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:mvc="sap.ui.core.mvc"><Page \n    \ttitle="{i18n>CropNDownload}"><f:SimpleForm \n            visible="{= ${misc>/is_fetching_video_info} || !!${video_info>/author} }"\n            busy="{misc>/is_fetching_video_info}"><f:content><Label text="{i18n>title}"/><Text text="{video_info>/title}"/><Label text="{i18n>author}"/><Text text="{video_info>/author}"/><Label text="{i18n>thumbnail}"/><Image height="20vh" src="{video_info>/thumbnail_url}"/><Label text="{i18n>duration}" /><Text text="{video_info>/duration}"/></f:content></f:SimpleForm><f:SimpleForm \n        \teditable="true"><f:content><Label text="{i18n>url}"/><Input value="{prompt>/url}" change="onUrlChanged"/><Label text="{i18n>start_time}"/><MaskInput mask="TT:TT" placeholderSymbol="_" value="{prompt>/start_time}"><rules><MaskInputRule maskFormatSymbol="T" regex="[0-9]"/></rules></MaskInput><Label text="{i18n>end_time}"/><MaskInput mask="TT:TT" placeholderSymbol="_" value="{prompt>/end_time}"><rules><MaskInputRule maskFormatSymbol="T" regex="[0-9]"/></rules></MaskInput><Label text="{i18n>split}"/><HBox justifyContent="SpaceBetween"><CheckBox selected="{prompt>/split}"/><MaskInput visible="{prompt>/split}" mask="TT:TT" placeholderSymbol="_" value="{prompt>/split_interval}"><rules><MaskInputRule maskFormatSymbol="T" regex="[0-9]"/></rules></MaskInput></HBox><Label text="{i18n>download}"/><HBox justifyContent="SpaceBetween"><Button \n                    \ticon="sap-icon://download" \n                    \tpress="onPressDownload"\n                    \ttype="Emphasized" /></HBox></f:content></f:SimpleForm></Page></mvc:View>',
	"com/perezjquim/ytc/pwa/view/Home.view.xml":'<mvc:View \n    controllerName="com.perezjquim.ytc.pwa.controller.Home" \n    xmlns="sap.m"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc"><Page \n        title="{i18n>Home}"><f:GridContainer  \n            items="{ \n                path: \'navigation>/items\', \n                filters:\n                [\n                    { path: \'key\', operator: \'NE\', value1: \'Home\' }\n                ]\n            }"><f:items><GenericTile \n                    class="sapUiSmallMargin"\n                    header="{ path: \'navigation>key\', formatter: \'.getText\' }"\n                    press=".navTo(${ path: \'navigation>key\' })"><layoutData><f:GridContainerItemLayoutData minRows="2" columns="2" /></layoutData><TileContent><ImageContent src="{navigation>icon}" /></TileContent></GenericTile></f:items></f:GridContainer></Page></mvc:View>'
}});
