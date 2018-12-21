/*!@license
 * Infragistics.Web.ClientUI Util functions 17.2.609
 *
 * Copyright (c) 2011-2018 Infragistics Inc.
 *
 * util functions that extend the jQuery  namespace
 * if something is not already available in jQuery, please add it here.
 *
 * http://www.infragistics.com/
 *
 * Depends on:
 * jquery-1.9.1.js
 * modernizr.js (Optional)
 * infragistics.util.js
 * infragistics.util.jquery.js
 *
 */
(function(factory){if(typeof define==="function"&&define.amd){define(["jquery","jquery-ui","./infragistics.util","./infragistics.util.jquery"],factory)}else{factory(jQuery)}})(function($){$.ig=$.ig||{_isNamespace:true};window.$ig=window.$ig||$.ig;$.ig.util.jqueryFlagsCache={};$.ig.util.jqueryCreateFlags=function(flags){var object=$.ig.util.jqueryFlagsCache[flags]={},i,length;flags=flags.split(/\s+/);for(i=0,length=flags.length;i<length;i++){object[flags[i]]=true}return object};$.ig.util.jqueryCallbacks=function(flags){flags=flags?$.ig.util.jqueryFlagsCache[flags]||$.ig.util.jqueryCreateFlags(flags):{};var self,list=[],stack=[],memory,fired,firing,firingStart,firingLength,firingIndex,add=function(args){var i,length,elem,type;for(i=0,length=args.length;i<length;i++){elem=args[i];type=$.type(elem);if(type==="array"){add(elem)}else if(type==="function"){if(!flags.unique||!self.has(elem)){list.push(elem)}}}},fire=function(context,args){args=args||[];memory=!flags.memory||[context,args];fired=true;firing=true;firingIndex=firingStart||0;firingStart=0;firingLength=list.length;for(;list&&firingIndex<firingLength;firingIndex++){if(list[firingIndex].apply(context,args)===false&&flags.stopOnFalse){memory=true;break}}firing=false;if(list){if(!flags.once){if(stack&&stack.length){memory=stack.shift();self.fireWith(memory[0],memory[1])}}else if(memory===true){self.disable()}else{list=[]}}};self={add:function(){if(list){var length=list.length;add(arguments);if(firing){firingLength=list.length}else if(memory&&memory!==true){firingStart=length;fire(memory[0],memory[1])}}return this},remove:function(){if(list){var args=arguments,argIndex=0,argLength=args.length;for(;argIndex<argLength;argIndex++){for(var i=0;i<list.length;i++){if(args[argIndex]===list[i]){if(firing){if(i<=firingLength){firingLength--;if(i<=firingIndex){firingIndex--}}}list.splice(i--,1);if(flags.unique){break}}}}}return this},has:function(fn){if(list){var i=0,length=list.length;for(;i<length;i++){if(fn===list[i]){return true}}}return false},empty:function(){list=[];return this},disable:function(){list=stack=memory=undefined;return this},disabled:function(){return!list},lock:function(){stack=undefined;if(!memory||memory===true){self.disable()}return this},locked:function(){return!stack},fireWith:function(context,args){if(stack){if(firing){if(!flags.once){stack.push([context,args])}}else if(!(flags.once&&memory)){fire(context,args)}}return this},fire:function(){self.fireWith(this,arguments);return this},fired:function(){return!!fired}};return self};$.ig.util.jqueryDeferred=function(func){var deferred,doneList=$.ig.util.jqueryCallbacks("once memory"),failList=$.ig.util.jqueryCallbacks("once memory"),progressList=$.ig.util.jqueryCallbacks("memory"),state="pending",lists={resolve:doneList,reject:failList,notify:progressList},promise={done:doneList.add,fail:failList.add,progress:progressList.add,state:function(){return state},isResolved:doneList.fired,isRejected:failList.fired,then:function(doneCallbacks,failCallbacks,progressCallbacks){deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);return this},always:function(){deferred.done.apply(deferred,arguments).fail.apply(deferred,arguments);return this},pipe:function(fnDone,fnFail,fnProgress){return $.ig.util.jqueryDeferred(function(newDefer){$.each({done:[fnDone,"resolve"],fail:[fnFail,"reject"],progress:[fnProgress,"notify"]},function(handler,data){var fn=data[0],action=data[1],returned;if($.isFunction(fn)){deferred[handler](function(){returned=fn.apply(this,arguments);if(returned&&$.isFunction(returned.promise)){returned.promise().then(newDefer.resolve,newDefer.reject,newDefer.notify)}else{newDefer[action+"With"](this===deferred?newDefer:this,[returned])}})}else{deferred[handler](newDefer[action])}})}).promise()},promise:function(obj){if(obj===undefined||obj===null){obj=promise}else{for(var key in promise){obj[key]=promise[key]}}return obj}},key;deferred=promise.promise({});for(key in lists){deferred[key]=lists[key].fire;deferred[key+"With"]=lists[key].fireWith}deferred.done(function(){state="resolved"},failList.disable,progressList.lock).fail(function(){state="rejected"},doneList.disable,progressList.lock);if(func){func.call(deferred,deferred)}return deferred};$.ig.util.checkDeferred=function(){$.ig.util.deferredDefined=!!($.Deferred!==undefined&&$.Deferred().state)};$.ig.util.deferred=function(){if($.ig.util.deferredDefined===undefined){$.ig.util.checkDeferred()}if($.ig.util.deferredDefined){return $.Deferred()}else{return $.ig.util.jqueryDeferred()}};$.ig.util.ajax=function(url,contentType,data,method,requestOptions){var deferred=$.ig.util.deferred();var isCrossDomain;if(requestOptions&&"isCrossDomain"in requestOptions){isCrossDomain=requestOptions.isCrossDomain}else{isCrossDomain=$.support.cors}var xhrObj=function(rOptions){var xhr=new XMLHttpRequest;if(isCrossDomain&&!("withCredentials"in xhr||rOptions&&"withCredentials"in rOptions&&rOptions.withCredentials)&&typeof XDomainRequest!==undefined){xhr=new XDomainRequest;xhr.getResponseHeader=function(){return null};xhr.setRequestHeader=function(){xhr.status=200};xhr.getAllResponseHeaders=function(){return null};xhr.onload=function(){xhr.readyState=4;xhr.status=200;xhr.statusText="success";xhr.getAllResponseHeaders=function(){};xhr.onreadystatechange()};xhr.onerror=function(){xhr.readyState=4;xhr.status=0;xhr.statusText="error";xhr.getAllResponseHeaders=function(){};xhr.onreadystatechange()};xhr.ontimeout=function(){xhr.readyState=4;xhr.status=0;xhr.statusText="timeout";xhr.getAllResponseHeaders=function(){};xhr.onreadystatechange()};xhr.onprogress=function(){}}return xhr}(requestOptions);var xhrFields;if("withCredentials"in xhrObj&&requestOptions&&"withCredentials"in requestOptions&&requestOptions.withCredentials){xhrFields={withCredentials:true}}var beforeSend=function(jqXHR,options){if(requestOptions){if($.isFunction(requestOptions.beforeSend)){jqXHR.setRequestHeader("Content-Type",contentType);requestOptions.beforeSend.call(this,jqXHR,options,requestOptions)}}};$.ajax({crossDomain:isCrossDomain?true:false,isLocal:false,url:url,contentType:contentType,data:data,type:method,dataType:"text",xhrFields:xhrFields,beforeSend:beforeSend,xhr:function(){return xhrObj},success:function(responce){deferred.resolve(responce)},error:function(jqXHR,textStatus,errorThrown){deferred.reject(errorThrown)}});return deferred.promise()}});