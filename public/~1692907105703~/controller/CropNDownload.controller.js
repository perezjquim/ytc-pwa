sap.ui.define(["./util/BaseController"],function(t){"use strict";return t.extend("com.perezjquim.ytc.pwa.controller.CropNDownload",{API_BASE_URL:"https://perezjquim-ytc.herokuapp.com",onPrepareVideo:async function(){this.setBusy(true);const t=this.byId("ytc-wizard");const e=this.getModel("prompt");const o=e.getProperty("/split");var s=[];try{const c=decodeURIComponent(e.getProperty("/url"));const a=e.getProperty("/start_time");const r=e.getProperty("/end_time");if(o){const t=new Date(`1970-01-01 00:${a}`);const o=new Date(`1970-01-01 00:${r}`);const i=e.getProperty("/split_interval");const d=new Date(`1970-01-01 00:${i}`);const l=Number(d.getMinutes());const u=Number(d.getSeconds());while(true){const e=`${t.getMinutes()}:${t.getSeconds()}`;t.setMinutes(t.getMinutes()+l);t.setSeconds(t.getSeconds()+u);var n="";if(t.getTime()<o.getTime()){n=`${t.getMinutes()}:${t.getSeconds()}`;s.push(await this._downloadVideo(c,e,n))}else{n=`${o.getMinutes()}:${o.getSeconds()}`;s.push(await this._downloadVideo(c,e,n));break}}}else{s.push(await this._downloadVideo(c,a,r))}const d=await Promise.all(s);const l=this.getModel("video_blobs");var i=[];d.forEach(async function(e){if(e.ok){const t=e.headers.get("content-disposition").split("filename=")[1].split(";")[0];const o=await e.blob();const s=new Blob([o],{type:"application/octet-stream"});const n=window.URL.createObjectURL(s);i=i.concat([{file_name:t,blob_url:n}]);i.sort((t,e)=>t["file_name"]>e["file_name"]?1:-1);l.setData(i)}else{const o=await e.text();console.warn(o);this.toast(o);t.previousStep()}}.bind(this))}catch(e){console.warn(e);this.toast(e);t.previousStep()}this.setBusy(false)},onParamChanged:async function(t){const e=this.byId("ytc-wizard");e.previousStep();const o=this.getModel("video_blobs");o.setData([]);const s=t.getSource();const n=s.getBinding("value")||s.getBinding("selected");const i=n.getPath();switch(i){case"/url":const t=this.getModel("prompt");const e=decodeURIComponent(t.getProperty("/url"));const o=this.getModel("video_info");if(e){const s=this.getModel("misc");s.setProperty("/is_fetching_video_info",true);const n=(new Date).getTime();const i=`${this.API_BASE_URL}/get-video-info?url=${e}&=${n}`;try{const e=await fetch(i);if(e.ok){const s=await e.json();o.setData(s);if(!t.getProperty("/end_time")){var c=s.duration;if(c.length>5){c=c.substr(c.length-5)}const t=this.getModel("prompt");t.setProperty("/end_time",c)}}else{o.setData({});const t=await e.text();console.warn(t);this.toast(t)}}catch(t){console.warn(t);o.setData({})}s.setProperty("/is_fetching_video_info",false)}else{o.setData({})}break;default:break}},onPressDownload:function(t){const e=t.getSource();const o=e.getBindingContext("video_blobs");const s=o.getProperty("file_name");const n=o.getProperty("blob_url");const i=document.createElement("a");i.setAttribute("href",n);i.setAttribute("download",s);i.click()},_downloadVideo:async function(t,e,o){const s=(new Date).getTime();const n={url:t,start_time:e,end_time:o};const i=new URLSearchParams(n);const c=decodeURIComponent(i.toString());const a=`${this.API_BASE_URL}/crop-video?${c}&=${s}`;return fetch(a)}})});