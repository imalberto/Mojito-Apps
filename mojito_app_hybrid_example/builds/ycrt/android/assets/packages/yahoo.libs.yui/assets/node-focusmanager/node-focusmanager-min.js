YUI.add("node-focusmanager",function(b){var j="activeDescendant",l="id",i="disabled",n="tabIndex",e="focused",a="focusClass",q="circular",c="UI",f="key",g=j+"Change",o="host",p={37:true,38:true,39:true,40:true},m={"a":true,"button":true,"input":true,"object":true},h=b.Lang,k=b.UA,d=function(){d.superclass.constructor.apply(this,arguments);};d.ATTRS={focused:{value:false,readOnly:true},descendants:{getter:function(r){return this.get(o).all(r);}},activeDescendant:{setter:function(v){var t=h.isNumber,s=b.Attribute.INVALID_VALUE,r=this._descendantsMap,y=this._descendants,x,u,w;if(t(v)){x=v;u=x;}else{if((v instanceof b.Node)&&r){x=r[v.get(l)];if(t(x)){u=x;}else{u=s;}}else{u=s;}}if(y){w=y.item(x);if(w&&w.get("disabled")){u=s;}}return u;}},keys:{value:{next:null,previous:null}},focusClass:{},circular:{value:true}};b.extend(d,b.Plugin.Base,{_stopped:true,_descendants:null,_descendantsMap:null,_focusedNode:null,_lastNodeIndex:0,_eventHandlers:null,_initDescendants:function(){var y=this.get("descendants"),r={},w=-1,v,u=this.get(j),x,s,t=0;if(h.isUndefined(u)){u=-1;}if(y){v=y.size();for(t=0;t<v;t++){x=y.item(t);if(w===-1&&!x.get(i)){w=t;}if(u<0&&parseInt(x.getAttribute(n,2),10)===0){u=t;}if(x){x.set(n,-1);}s=x.get(l);if(!s){s=b.guid();x.set(l,s);}r[s]=t;}if(u<0){u=0;}x=y.item(u);if(!x||x.get(i)){x=y.item(w);u=w;}this._lastNodeIndex=v-1;this._descendants=y;this._descendantsMap=r;this.set(j,u);if(x){x.set(n,0);}}},_isDescendant:function(r){return(r.get(l) in this._descendantsMap);},_removeFocusClass:function(){var s=this._focusedNode,t=this.get(a),r;if(t){r=h.isString(t)?t:t.className;}if(s&&r){s.removeClass(r);}},_detachKeyHandler:function(){var s=this._prevKeyHandler,r=this._nextKeyHandler;if(s){s.detach();}if(r){r.detach();}},_preventScroll:function(r){if(p[r.keyCode]&&this._isDescendant(r.target)){r.preventDefault();}},_fireClick:function(s){var r=s.target,t=r.get("nodeName").toLowerCase();if(s.keyCode===13&&(!m[t]||(t==="a"&&!r.getAttribute("href")))){r.simulate("click");}},_attachKeyHandler:function(){this._detachKeyHandler();var u=this.get("keys.next"),s=this.get("keys.previous"),t=this.get(o),r=this._eventHandlers;if(s){this._prevKeyHandler=b.on(f,b.bind(this._focusPrevious,this),t,s);}if(u){this._nextKeyHandler=b.on(f,b.bind(this._focusNext,this),t,u);}if(k.opera){r.push(t.on("keypress",this._preventScroll,this));}if(!k.opera){r.push(t.on("keypress",this._fireClick,this));}},_detachEventHandlers:function(){this._detachKeyHandler();var r=this._eventHandlers;if(r){b.Array.each(r,function(s){s.detach();});this._eventHandlers=null;}},_attachEventHandlers:function(){var u=this._descendants,r,s,t;if(u&&u.size()){r=this._eventHandlers||[];s=this.get(o).get("ownerDocument");if(r.length===0){r.push(s.on("focus",this._onDocFocus,this));r.push(s.on("mousedown",this._onDocMouseDown,this));r.push(this.after("keysChange",this._attachKeyHandler));r.push(this.after("descendantsChange",this._initDescendants));r.push(this.after(g,this._afterActiveDescendantChange));t=this.after("focusedChange",b.bind(function(v){if(v.newVal){this._attachKeyHandler();t.detach();}},this));r.push(t);}this._eventHandlers=r;}},_onDocMouseDown:function(u){var w=this.get(o),r=u.target,v=w.contains(r),t,s=function(y){var x=false;if(!y.compareTo(w)){x=this._isDescendant(y)?y:s.call(this,y.get("parentNode"));}return x;};if(v){t=s.call(this,r);if(t){r=t;}else{if(!t&&this.get(e)){this._set(e,false);this._onDocFocus(u);}}}if(v&&this._isDescendant(r)){this.focus(r);}else{if(k.webkit&&this.get(e)&&(!v||(v&&!this._isDescendant(r)))){this._set(e,false);this._onDocFocus(u);}}},_onDocFocus:function(w){var u=this._focusTarget||w.target,s=this.get(e),v=this.get(a),t=this._focusedNode,r;if(this._focusTarget){this._focusTarget=null;}if(this.get(o).contains(u)){r=this._isDescendant(u);if(!s&&r){s=true;}else{if(s&&!r){s=false;}}}else{s=false;}if(v){if(t&&(!t.compareTo(u)||!s)){this._removeFocusClass();}if(r&&s){if(v.fn){u=v.fn(u);u.addClass(v.className);}else{u.addClass(v);}this._focusedNode=u;}}this._set(e,s);},_focusNext:function(s,t){var r=t||this.get(j),u;if(this._isDescendant(s.target)&&(r<=this._lastNodeIndex)){r=r+1;if(r===(this._lastNodeIndex+1)&&this.get(q)){r=0;}u=this._descendants.item(r);if(u){if(u.get("disabled")){this._focusNext(s,r);}else{this.focus(r);}}}this._preventScroll(s);},_focusPrevious:function(s,t){var r=t||this.get(j),u;if(this._isDescendant(s.target)&&r>=0){r=r-1;if(r===-1&&this.get(q)){r=this._lastNodeIndex;}u=this._descendants.item(r);if(u){if(u.get("disabled")){this._focusPrevious(s,r);}else{this.focus(r);}}}this._preventScroll(s);},_afterActiveDescendantChange:function(r){var s=this._descendants.item(r.prevVal);if(s){s.set(n,-1);}s=this._descendants.item(r.newVal);if(s){s.set(n,0);}},initializer:function(r){this.start();},destructor:function(){this.stop();this.get(o).focusManager=null;},focus:function(r){if(h.isUndefined(r)){r=this.get(j);}this.set(j,r,{src:c});var s=this._descendants.item(this.get(j));if(s){s.focus();if(k.opera&&s.get("nodeName").toLowerCase()==="button"){this._focusTarget=s;}}},blur:function(){var r;if(this.get(e)){r=this._descendants.item(this.get(j));if(r){r.blur();this._removeFocusClass();}this._set(e,false,{src:c});}},start:function(){if(this._stopped){this._initDescendants();this._attachEventHandlers();this._stopped=false;}},stop:function(){if(!this._stopped){this._detachEventHandlers();this._descendants=null;this._focusedNode=null;this._lastNodeIndex=0;this._stopped=true;}},refresh:function(){this._initDescendants();if(!this._eventHandlers){this._attachEventHandlers();}}});d.NAME="nodeFocusManager";d.NS="focusManager";b.namespace("Plugin");b.Plugin.NodeFocusManager=d;},"@VERSION@",{requires:["attribute","node","plugin","node-event-simulate","event-key","event-focus"]});
