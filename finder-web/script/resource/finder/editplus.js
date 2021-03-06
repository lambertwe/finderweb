(function() {
    var EventUtil = {};

    EventUtil.bind = function(object, handler) {
        return function(event) {
            return handler.call(object, (event || window.event));
        };
    };

    EventUtil.fire = function(element, type, bubbles, cancelable) {
        if(document.createEvent) {
            var event = document.createEvent("Event");
            event.initEvent(type, bubbles !== undefined ? bubbles : true, cancelable !== undefined ? cancelable : false);
            element.dispatchEvent(event);
        }
        else if(document.createEventObject) {
            var event = document.createEventObject();
            element.fireEvent("on" + type, event);
        }
        else if(typeof(element["on" + type]) == "function") {
            element["on" + type]();
        }
    };

    EventUtil.addListener = function(target, type, handler) {
        var a = type.split(",");

        for(var i = 0; i < a.length; i++) {
            if(target.attachEvent) {
                target.attachEvent("on" + a[i], handler);
            }
            else if(target.addEventListener) {
                target.addEventListener(a[i], handler, false);
            }
            else {
                target["on" + a[i]] = handler;
            }
        }
    };

    EventUtil.removeListener = function(target, type, handler) {
        if(target.detachEvent) {
            target.detachEvent("on" + type, handler);
        }
        else if(target.removeEventListener) {
            target.removeEventListener(type, handler, false);
        }
        else {
            target["on" + type] = null;
        }
    };

    EventUtil.cancel = function(event) {
        if(event == null) {
            return false;
        }

        if(event.stop) {
            event.stop();
        }
        else if(event.stopPropagation()) {
            event.stopPropagation();
        }
        else {
            event.cancelBubble = true;
        }

        if(event.preventDefault) {
            event.preventDefault();
        }

        event.cancel = true;
        event.returnValue = false;
        return false;
    };

    var TabPanel = function(args) {
        var options = (args || {});

        if(typeof(options.container) == "string") {
            this.container = document.getElementById(options.container);
        }
        else {
            this.container = options.container;
        }

        this.listeners = [];
        this.create();
    };

    TabPanel.prototype.getContainer = function() {
        return this.container;
    };

    TabPanel.prototype.create = function() {
        var self = this;
        var container = this.getContainer();
        var parent = jQuery(container);
        var labelWrap = parent.children("div.tab-label-wrap");

        labelWrap.find("ul").unbind();
        labelWrap.find("ul").click(function(event) {
            var target = (event.target || event.srcElement);
            var nodeName = target.nodeName.toUpperCase();
            var label = jQuery(target).closest("li.tab-label");

            if(nodeName == "SPAN" && target.className == "close") {
                self.close(label.get(0));
                return;
            }

            if(label.size() > 0) {
                self.active(label.get(0));
            }
        });

        labelWrap.find("span.add").click(function() {
            self.add();
        });

        var first = labelWrap.find("ul li.tab-label:eq(0)");

        if(first.size() > 0) {
            this.active(first);
        }
    };

    TabPanel.prototype.on = function(name, listener) {
        this.listeners.push({"name": name, "listener": listener});
    };

    TabPanel.prototype.removeListener = function(listener) {
        for(var i = 0; i < this.listeners.length; i++) {
            var item = this.listeners[i].listener;

            if(item == listener) {
                this.listeners.splice(i, 1);
                return item;
            }
        }
        return null;
    };

    TabPanel.prototype.trigger = function(name) {
        for(var i = 0; i < this.listeners.length; i++) {
            var item = this.listeners[i];

            if(item.name == name) {
                var handler = this.listeners[i].listener;
                handler.apply(this);
            }
        }
    };

    TabPanel.prototype.setUserObject = function(src, object) {
        var label = null;

        if(typeof(src) == "string") {
            label = this.getLabel(tabId);
        }
        else {
            label = src;
        }

        if(label == null) {
            return null;
        }

        if(object == null) {
            label.removeAttribute("data-object");
        }
        else {
            label.setAttribute("data-object", JSON.stringify(object));
        }
        return null;
    };

    TabPanel.prototype.getUserObject = function(src) {
        var label = null;

        if(typeof(src) == "string") {
            label = this.getLabel(tabId);
        }
        else {
            label = src;
        }

        if(label == null) {
            return null;
        }

        var json = label.getAttribute("data-object");

        if(json != null) {
            try {
                return JSON.parse(json);
            }
            catch(e) {
            }
        }
        return null;
    };

    TabPanel.prototype.append = function(opts) {
        if(opts.id == null) {
            return;
        }

        var self = this;
        var container = this.getContainer();
        var label = document.createElement("li");
        var panel = document.createElement("div");
        var span = document.createElement("span");

        label.className = "tab-label";
        panel.className = "tab-panel";
        span.className = "label";
        span.appendChild(document.createTextNode(opts.title));

        if(opts.tooltips != null) {
            span.setAttribute("title", opts.tooltips);
        }

        label.appendChild(span);

        if(opts.closeable == true) {
            var btn = document.createElement("span");
            btn.className = "close";
            label.appendChild(btn);
        }

        if(typeof(opts.content) == "string") {
            panel.innerHTML = opts.content;
        }
        else {
            panel.appendChild(opts.content);
        }

        if(opts.userObject != null) {
            this.setUserObject(label, opts.userObject);
        }

        label.setAttribute("tabId", opts.id);
        panel.setAttribute("tabId", opts.id);

        jQuery(container).children("div.tab-label-wrap").children("ul").append(label);
        jQuery(container).children("div.tab-panel-wrap").append(panel);
        var current = this.getActiveLabel();

        if(current == null || opts.active != false) {
            this.active(label);
        }
        return panel;
    };

    TabPanel.prototype.close = function(ele) {
        this.remove(ele);
    };

    TabPanel.prototype.remove = function(ele) {
        var src = jQuery(ele);
        var index = src.index();
        var tabId = src.attr("tabId");
        var container = src.closest("div.tab-label-wrap").siblings("div.tab-panel-wrap");
        var active = src.hasClass("tab-active");
        var other = null;

        if(active == true) {
            var size = src.parent().children("li").size();

            if((index + 1) < size) {
                other = src.parent().children("li:eq(" + (index + 1) + ")");
            }
            else if(index > 0) {
                other = src.parent().children("li:eq(" + (index - 1) + ")");
            }
        }

        src.remove();
        container.children("div.tab-panel[tabId=" + tabId + "]").remove();

        if(other != null && other.size() > 0) {
            this.active(other.get(0));
        }
        else {
            this.trigger("change");
        }
    };

    TabPanel.prototype.active = function(ele) {
        if(typeof(ele) == "string") {
            var label = this.getLabel(ele);
            return this.active(label);
        }

        var src = jQuery(ele);
        var tabId = src.attr("tabId");
        var container = src.closest("div.tab-label-wrap").siblings("div.tab-panel-wrap");

        if(tabId == null || tabId == undefined) {
            return;
        }

        src.closest("ul").find("li.tab-label").removeClass("tab-active");
        src.addClass("tab-active");

        container.children("div.tab-panel").hide();
        container.children("div.tab-panel[tabId=" + tabId + "]").each(function() {
            this.style.display = "block";
        });

        if(tabId != this.currentId) {
            this.trigger("change");
        }
        this.currentId = tabId;
    };

    TabPanel.prototype.show = function(tabId) {
    };

    TabPanel.prototype.size = function() {
        var container = this.getContainer();
        return jQuery(container).children("div.tab-label-wrap").find("ul li.tab-label").size();
    };

    TabPanel.prototype.getLabel = function(tabId) {
        var container = this.getContainer();
        var eles = jQuery(container).children("div.tab-label-wrap").find("ul li.tab-label[tabId=" + tabId + "]");

        if(eles.size() > 0) {
            return eles.get(0);
        }
        return null;
    };

    TabPanel.prototype.getPanel = function(tabId) {
        var container = this.getContainer();
        var eles = jQuery(container).children("div.tab-panel-wrap").find("div.tab-panel[tabId=" + tabId + "]");

        if(eles.size() > 0) {
            return eles.get(0);
        }
        return null;
    };

    TabPanel.prototype.getLabelList = function() {
        var container = this.getContainer();
        var eles = jQuery(container).children("div.tab-label-wrap").find("ul li.tab-label");
        var list = [];

        eles.each(function() {
            list.push(this);
        });
        return list;
    };

    TabPanel.prototype.getPanelList = function() {
        var container = this.getContainer();
        var eles = jQuery(container).children("div.tab-panel-wrap").find("div.tab-panel");
        var list = [];

        eles.each(function() {
            list.push(this);
        });
        return list;
    };

    TabPanel.prototype.getActiveLabel = function() {
        var container = this.getContainer();
        var eles = jQuery(container).children("div.tab-label-wrap").find("ul li.tab-active");

        if(eles.size() > 0) {
            return eles.get(0);
        }
        return null;
    };

    TabPanel.prototype.getActivePanel = function() {
        var e = this.getActiveLabel();

        if(e != null) {
            return this.getPanel(e.getAttribute("tabId"));
        }
        return null;
    };

    /*
     * $RCSfile: Class.js,v $
     * $Revision: 1.1 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var Config = {};
    Config.setCookie = function(cookie) {
        var expires = "";
        if(cookie.value == null) {
            cookie.value = "";
            cookie.expires = -1;
        }

        if(cookie.expires != null) {
            var date = null;
            if(typeof(cookie.expires) == "number") {
                date = new Date();
                date.setTime(date.getTime() + cookie.expires * 1000);
            }
            else if(cookie.expires.toUTCString != null) {
                date = cookie.expires;
            }
            expires = "; expires=" + date.toUTCString();
        }

        var path = cookie.path ? "; path=" + (cookie.path) : "";
        var domain = cookie.domain ? "; domain=" + (cookie.domain) : "";
        var secure = cookie.secure ? "; secure" : "";
        document.cookie = [cookie.name, "=", (cookie.value != null ? encodeURIComponent(cookie.value) : ""), expires, path, domain, secure].join("");
    };

    Config.getCookie = function(name) {
        var value = null;
        if(document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(';');
            for(var i = 0; i < cookies.length; i++) {
                var cookie = StringUtil.trim(cookies[i]);
                if(cookie.substring(0, name.length + 1) == (name + "=")) {
                    value = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return value;
    };

    Config.getVariable = function(name, defaultValue) {
        var value = null;

        if(typeof(window.localStorage) != "undefined") {
            value = window.localStorage[name];
        }
        return (value != null ? value : defaultValue);
    };

    Config.setVariable = function(name, value) {
        if(typeof(window.localStorage) != "undefined") {
            window.localStorage[name] = value;
        }
    };

    Config.getObject = function(name, defaultValue) {
        var value = this.getVariable(name, null);

        if(value != null && value != undefined) {
            try {
                return JSON.parse(value);
            }
            catch(e) {
            }
        }
        return defaultValue;
    };

    var EditPlus = {};
    var tabPanel = null;

    EditPlus.getEditor = function(tabId) {
        var e = tabPanel.getPanel(tabId);
        var iframe = jQuery(e).find("iframe");

        if(iframe.size() > 0) {
            return iframe.get(0).contentWindow.ACEditor;
        }
    };

    EditPlus.getActiveEditor = function() {
        var e = tabPanel.getActivePanel();
        var iframe = jQuery(e).find("iframe");

        if(iframe.size() > 0) {
            return iframe.get(0).contentWindow.ACEditor;
        }
    };

    EditPlus.getEditorList = function() {
        var result = [];
        var list = tabPanel.getPanelList();

        for(var i = 0; i < list.length; i++) {
            var iframe = jQuery(list[i]).find("iframe");

            if(iframe.size() > 0) {
                var editor = iframe.get(0).contentWindow.ACEditor;
                result.push(editor);
            }
        }
        return result;
    };

    EditPlus.each = function(handler) {
        var list = this.getEditorList();

        for(var i = 0; i < list.length; i++) {
            var editor = list[i];
            var flag = handler(editor);

            if(flag == false) {
                break;
            }
        }
    };

    EditPlus.open = function(host, workspace, path) {
        if(this.support != true) {
            return;
        }

        var list = tabPanel.getLabelList();

        for(var i = 0; i < list.length; i++) {
            var userObject = tabPanel.getUserObject(list[i]);

            if(userObject == null) {
                continue;
            }

            if(userObject.host == host && userObject.workspace == workspace && userObject.path == path) {
                tabPanel.active(list[i]);
                return;
            }
        }

        if(this.id == null) {
            this.id = 1;
        }
        else {
            this.id = this.id + 1;
        }

        var tabId = this.id;
        var title = this.getName(path);
        var userObject = {"host": host, "workspace": workspace, "path": path};
        var iframe = document.createElement("iframe");
        iframe.frameborder = "0";
        iframe.scrolling = "auto";
        iframe.style.cssText = "position: relative; top: 0px; left: 0px; width: 100%; height: 100%; border: 0px solid #ffffff; background-color: transparent; overflow: hidden;";
        iframe.src = EditPlus.getURL("finder.edit", host, workspace, path) + "#tabId=" + tabId;
        iframe.onload = function() {
            EditPlus.focus();
        };

        var opts = {"id": tabId, "title": title, "tooltips": path, "content": iframe, "userObject": userObject, "active": true, "closeable": true};
        tabPanel.append(opts);
    };

    EditPlus.reload = function() {
        var editor = this.getActiveEditor();

        if(editor == null) {
            return;
        }

        if(editor.hasChange() == false) {
            editor.reload();
            return;
        }

        if(window.confirm("文件已经被修改，确定放弃修改并重新加载吗？")) {
            editor.reload();
            return;
        }
    };

    EditPlus.save = function() {
        var editor = this.getActiveEditor();

        if(editor != null) {
            editor.save();
        }
    };

    EditPlus.setTitle = function(id, title) {
        this.setLabel({"id": id, "title": title, "tooltips": title});
    };

    EditPlus.setLabel = function(label) {
        var e = tabPanel.getLabel(label.id);

        if(e == null) {
            return;
        }

        var span = jQuery(e).find("span.label");

        if(label.title != null) {
            span.html(label.title);
        }

        if(label.tooltips != null) {
            span.attr("title", label.tooltips);
        }
    };

    EditPlus.getURL = function(action, host, workspace, path) {
        var params = [];
        params[params.length] = "?action=" + action;
        params[params.length] = "host=" + encodeURIComponent(host);
        params[params.length] = "workspace=" + encodeURIComponent(workspace);
        params[params.length] = "path=" + encodeURIComponent(path);
        return params.join("&");
    };

    EditPlus.getName = function(path) {
        if(path != null && path.length > 0) {
            var c = null;
            var i = path.length - 1;

            for(; i > -1; i--) {
                c = path.charAt(i);

                if(c == "/" || c == "\\" || c == ":") {
                    break;
                }
            }
            return path.substring(i + 1);
        }
        return "";
    };

    EditPlus.getConfig = function() {
        var object = Config.getObject("ace_config", null);
        var config = {
            "fontSize": "13px",
            "theme": "twilight",
            "showGutter": true,
            "showInvisibles": true,
            "wrap": "free",
            "enableBasicAutocompletion": true,
            "enableSnippets": true,
            "enableLiveAutocompletion": true
        };

        if(object != null) {
            for(var name in object) {
                if(object[name] != null) {
                    config[name] = object[name];
                }
            }
        }
        return config;
    };

    EditPlus.setConfig = function(name, value) {
        var config = this.getConfig();
        config[name] = value;
        Config.setVariable("ace_config", JSON.stringify(config));
    };

    EditPlus.setOption = function(name, value) {
        EditPlus.setConfig(name, value);

        EditPlus.each(function(editor) {
            editor.setOption(name, value);
        });
    };

    EditPlus.setFontSize = function(fontSize) {
        EditPlus.each(function(editor) {
            editor.setFontSize(fontSize);
        });
    };

    EditPlus.setTheme = function(theme) {
        EditPlus.each(function(editor) {
            editor.setTheme("ace/theme/" + theme);
        });
    };

    EditPlus.setMode = function(mode) {
        EditPlus.each(function(editor) {
            editor.session.setMode("ace/mode/" + mode);
        });
    };

    EditPlus.resize = function() {
        EditPlus.each(function(editor) {
            editor.resize();
        });
    };

    EditPlus.focus = function() {
        var editor = this.getActiveEditor();

        if(editor != null) {
            editor.focus();
        }
    };

    EditPlus.check = function() {
        var editor = this.getActiveEditor();

        if(editor != null) {
            editor.check();
        }
    };

    EditPlus.undo = function() {
        var editor = this.getActiveEditor();

        if(editor != null) {
            editor.undo();
        }
    };

    EditPlus.redo = function() {
        var editor = this.getActiveEditor();

        if(editor != null) {
            editor.redo();
        }
    };

    EditPlus.destroy = function() {
        var editor = this.getActiveEditor();

        if(editor != null) {
            editor.destroy();
        }
    };

    EditPlus.exec = function(name) {
        var editor = this.getActiveEditor();

        if(editor != null) {
            var args = [];

            for(var i = 1; i < arguments.length; i++) {
                args[args.length] = arguments[i];
            }
            editor.exec(name, args);
        }
    };

    EditPlus.error = function(status, message) {
        var editor = this.getActiveEditor();

        if(editor != null) {
            editor.setReadOnly(true);
        }
        alert(message);
    };

    jQuery(function() {
        tabPanel = new TabPanel({"container": "tab-panel-container"});

        var setDialogTitle = function(title) {
            if(window == window.parent) {
                return;
            }

            if(typeof(window.parent.FrameDialog) == "undefined") {
                return;
            }

            if(title == null) {
                title = "ACE Editor - Powered by FinderWeb";
            }
            window.parent.FrameDialog.setTitle(window.componentId, title);
        };

        tabPanel.close = function(label) {
            var tabId = label.getAttribute("tabId");
            var editor = EditPlus.getEditor(tabId);

            if(editor.hasChange() == false) {
                this.remove(label);
                return;
            }

            if(window.confirm("文件内容已经被修改，确定关闭吗？")) {
                this.remove(label);
                return;
            }
        };

        tabPanel.on("change", function() {
            var label = this.getActiveLabel();

            /**
             * 全部被关闭
             */
            if(label == null) {
                setDialogTitle(null);
                return;
            }

            var userObject = this.getUserObject(label);

            if(userObject == null) {
                return;
            }

            EditPlus.focus();
            EditPlus.check();
            setDialogTitle(userObject.host + "@" + userObject.workspace + "/" + userObject.path);
            jQuery(window).trigger("resize");
        });
    });

    jQuery(function() {
        jQuery(window).resize(function() {
            jQuery(".resize-d").each(function() {
                var offset = jQuery(this).offset();
                var clientHeight = document.documentElement.clientHeight;
                var offsetBottom = this.getAttribute("offset-bottom");

                if(offsetBottom != null) {
                    offsetBottom = parseInt(offsetBottom);
                }

                if(isNaN(offsetBottom)) {
                    offsetBottom = 0;
                }

                var height = clientHeight - offset.top - offsetBottom;
                jQuery(this).css("height", height + "px");
            });
        });
    });

    window.Config = Config;
    window.EditPlus = EditPlus;
    window.EventUtil = EventUtil;
})();

(function() {
    EditPlus.support = false;

    jQuery(function() {
        if(typeof(ace) == "undefined") {
            var e = document.createElement("div");
            e.id = "message-panel";
            e.className = "widget-mask";
            e.style.display = "block";
            e.innerHTML = "<div class=\"message-panel\"><h1>Error</h1><p>缺少系统组件，请先安装ACE文本编辑组件。</p></div>";
            document.body.appendChild(e);
            return;
        }
        EditPlus.support = true;
    });

    jQuery(function() {
        if(EditPlus.support != true) {
            jQuery("#menu-bar div.menu-item").addClass("disabled");
            jQuery("#tab-panel-container").hide();
            return;
        }
    });

    jQuery(function() {
        if(EditPlus.support != true) {
            return;
        }

        /**
         * save
         */
        jQuery("#menu-save").click(function() {
            EditPlus.save();
        });

        /**
         * reload
         */
        jQuery("#menu-reload").click(function() {
            EditPlus.reload();
        });

        /**
         * undo
         */
        jQuery("#menu-undo").click(function() {
            EditPlus.undo();
        });

        /**
         * redo
         */
        jQuery("#menu-redo").click(function() {
            EditPlus.redo();
        });

        /**
         * gotoline
         */
        jQuery("#menu-jump").click(function() {
            EditPlus.exec("gotoline");
        });

        /**
         * find
         */
        jQuery("#menu-find").click(function() {
            EditPlus.exec("find");
        });

        /**
         * replace
         */
        jQuery("#menu-replace").click(function() {
            EditPlus.exec("replace");
        });
    });

    /**
     * 菜单全局支持
     */
    jQuery(function() {
        if(EditPlus.support != true) {
            return;
        }

        jQuery("div.menu-mask").click(function() {
            jQuery(this).hide();
            jQuery("#menu-bar div.menu-item").removeClass("selected");
        });

        jQuery("#menu-bar div.menu-item").click(function() {
            if(jQuery(this).hasClass("disabled")) {
                return;
            }

            jQuery("div.widget-mask").hide();
            jQuery("#menu-bar div.menu-item").removeClass("selected");
        });
    });

    /**
     * 视图菜单
     */
    jQuery(function() {
        if(EditPlus.support != true) {
            return;
        }

        var b = [];
        var views = ["showGutter", "showInvisibles", "|", "enableBasicAutocompletion", "enableSnippets", "enableLiveAutocompletion"];

        for(var i = 0; i < views.length; i++) {
            var name = views[i];

            if(name == "|") {
                b[b.length] = "<li class=\"line\" unselectable=\"on\"></li>";
                continue;
            }

            b[b.length] = "<li class=\"item\" command=\"" + name + "\" unselectable=\"on\">";
            b[b.length] = "<span class=\"icon\"></span>";
            b[b.length] = "<a class=\"command\" title=\"" + name + "\">" + name + "</a>";
            b[b.length] = "</li>";
        }

        jQuery("#contextmenu-view ul.menu").html(b.join(""));

        jQuery("#menu-view").click(function() {
            var position = jQuery(this).position();

            jQuery(this).addClass("selected");
            jQuery("#contextmenu-view").closest("div.widget-mask").show();
            jQuery("#contextmenu-view").css({"left": position.left + "px"}).show();
        });

        jQuery("#contextmenu-view").click(function(event) {
            var src = (event.srcElement || event.target);
            var item = jQuery(src).closest("li.item");

            if(item.size() < 1) {
                return;
            }

            var name = item.attr("command");
            var value = item.hasClass("checked");

            if(value != true) {
                value = true;
                item.addClass("checked");
            }
            else {
                value = false;
                item.removeClass("checked");
            }
            EditPlus.setOption(name, value);
        });
    });

    /**
     * 字体菜单
     */
    jQuery(function() {
        if(EditPlus.support != true) {
            return;
        }

        var b = [];
        var fonts = ["12", "13", "14", "15", "16", "18", "20", "22", "24", "26", "28", "30", "32"];

        for(var i = 0; i < fonts.length; i++) {
            var name = fonts[i];
            b[b.length] = "<li class=\"item\" command=\"" + name + "px\" unselectable=\"on\">";
            b[b.length] = "<span class=\"icon\"></span>";
            b[b.length] = "<a class=\"command\" title=\"" + name + "\">" + name + "px</a>";
            b[b.length] = "</li>";
        }

        jQuery("#contextmenu-font ul.menu").html(b.join(""));

        jQuery("#menu-font").click(function() {
            var position = jQuery(this).position();

            jQuery(this).addClass("selected");
            jQuery("#contextmenu-font").closest("div.widget-mask").show();
            jQuery("#contextmenu-font").css({"left": position.left + "px"}).show();
        });

        jQuery("#contextmenu-font").click(function(event) {
            var src = (event.srcElement || event.target);
            var item = jQuery(src).closest("li.item");

            if(item.size() < 1) {
                return;
            }

            jQuery("#contextmenu-font ul.menu li").removeClass("checked");
            item.addClass("checked");

            var fontSize = item.attr("command");
            EditPlus.setConfig("fontSize", fontSize);
            EditPlus.setFontSize(fontSize);
        });
    });

    /**
     * 主题菜单
     */
    jQuery(function() {
        if(EditPlus.support != true) {
            return;
        }

        var b = [];
        var themes = [
            "ambiance",
            "chaos",
            "chrome",
            "clouds",
            "clouds_midnight",
            "cobalt",
            "crimson_editor",
            "dawn",
            "dracula",
            "dreamweaver",
            "eclipse",
            "github",
            "gob",
            "gruvbox",
            "idle_fingers",
            "iplastic",
            "katzenmilch",
            "kr_theme",
            "kuroir",
            "merbivore",
            "merbivore_soft",
            "monokai",
            "mono_industrial",
            "pastel_on_dark",
            "solarized_dark",
            "solarized_light",
            "sqlserver",
            "terminal",
            "textmate",
            "tomorrow",
            "tomorrow_night",
            "tomorrow_night_blue",
            "tomorrow_night_bright",
            "tomorrow_night_eighties",
            "twilight",
            "vibrant_ink",
            "xcode"
        ];

        for(var i = 0; i < themes.length; i++) {
            var name = themes[i];
            b[b.length] = "<li class=\"item\" command=\"" + name + "\" unselectable=\"on\">";
            b[b.length] = "<span class=\"icon\"></span>";
            b[b.length] = "<a class=\"command\" title=\"" + name + "\">" + name + "</a>";
            b[b.length] = "</li>";
        }

        jQuery("#contextmenu-theme ul.menu").html(b.join(""));

        jQuery("#menu-theme").click(function() {
            var position = jQuery(this).position();
            var height = jQuery(window).height() - position.top - 60;

            jQuery(this).addClass("selected");
            jQuery("#contextmenu-theme").closest("div.widget-mask").show();
            jQuery("#contextmenu-theme ul.menu").css("marginTop", "24px");
            jQuery("#contextmenu-theme").css({"left": position.left + "px", "height": height + "px"}).show();
        });

        jQuery("#contextmenu-theme").click(function(event) {
            var src = (event.srcElement || event.target);
            var item = jQuery(src).closest("li.item");

            if(item.size() < 1) {
                return false;
            }

            jQuery("#contextmenu-theme ul.menu li").removeClass("checked");
            item.addClass("checked");

            var theme = item.attr("command");
            EditPlus.setConfig("theme", theme);
            EditPlus.setTheme(theme);
            return false;
        });

        /**
         * 菜单滚动
         */
        var timer = null;

        jQuery("#contextmenu-theme div.scroll-up").mouseover(function() {
            if(timer != null) {
                clearTimeout(timer);
            }

            var handler = function() {
                var delta = 26;
                var marginTop = parseInt(jQuery("#contextmenu-theme ul.menu").css("marginTop"));

                if(marginTop >= 26) {
                    return;
                }

                jQuery("#contextmenu-theme ul.menu").css("marginTop", Math.min(marginTop + 26, 26));
                timer = setTimeout(arguments.callee, 60);
            };
            timer = setTimeout(handler, 60);
        });

        jQuery("#contextmenu-theme div.scroll-down").mouseover(function() {
            if(timer != null) {
                clearTimeout(timer);
            }

            var handler = function() {
                var delta = 26;
                var height = jQuery("#contextmenu-theme").height();
                var menuHeight = jQuery("#contextmenu-theme ul.menu").height();
                var marginTop = parseInt(jQuery("#contextmenu-theme ul.menu").css("marginTop"));
                var offset = Math.min(menuHeight + marginTop - height + 26, 26);

                if(offset <= 0) {
                    return;
                }

                jQuery("#contextmenu-theme ul.menu").css("marginTop", marginTop - offset);
                timer = setTimeout(arguments.callee, 60);
            };
            timer = setTimeout(handler, 60);
        });

        /**
         * 取消滚动
         */
        jQuery("#contextmenu-theme div.scroll-up").mouseout(function() {
            if(timer != null) {
                clearTimeout(timer);
            }
            jQuery(this).css("backgroundColor", "rgba(255, 255, 255, 0.9)");
        });

        jQuery("#contextmenu-theme div.scroll-down").mouseout(function() {
            if(timer != null) {
                clearTimeout(timer);
            }
            jQuery(this).css("backgroundColor", "rgba(255, 255, 255, 0.9)");
        });

        /*
         * 1.7.2版本的jQuery不支持没有滚动条元素的mousewheel事件
         * 
        jQuery("#contextmenu-theme").bind("mousewheel", function(event, delta, deltaX, deltaY) {
            var wheelDelta = (event.wheelDelta || event.detail);
            console.log("wheelDelta: " + delta);
        });
        */

        EventUtil.addListener(document.getElementById("contextmenu-theme"), "mousewheel", function(event) {
            var delta = 26;
            var wheelDelta = (event.wheelDelta || event.detail);

            if(wheelDelta > 0) {
                var marginTop = parseInt(jQuery("#contextmenu-theme ul.menu").css("marginTop"));

                if(marginTop >= 26) {
                    return;
                }
                jQuery("#contextmenu-theme ul.menu").css("marginTop", Math.min(marginTop + 26, delta));
            }
            else {
                var height = jQuery("#contextmenu-theme").height();
                var menuHeight = jQuery("#contextmenu-theme ul.menu").height();
                var marginTop = parseInt(jQuery("#contextmenu-theme ul.menu").css("marginTop"));
                var offset = Math.min(menuHeight + marginTop - height + 26, delta);

                if(offset <= 0) {
                    return;
                }
                jQuery("#contextmenu-theme ul.menu").css("marginTop", marginTop - offset);
            }
        });
    });

    /**
     * 显示初始化配置项
     */
    jQuery(function() {
        if(EditPlus.support != true) {
            return;
        }

        var config = EditPlus.getConfig();
        var views = ["showGutter", "showInvisibles", "enableBasicAutocompletion", "enableSnippets", "enableLiveAutocompletion"];

        var setChecked = function(id, list) {
            for(var i = 0; i < list.length; i++) {
                var name = list[i];
                var value = config[name];

                if(value == true) {
                    jQuery("#" + id + " ul.menu li[command=" + name + "]").addClass("checked");
                }
            }
        };

        jQuery("#contextmenu-font ul.menu li[command=" + config.fontSize + "]").addClass("checked");
        jQuery("#contextmenu-theme ul.menu li[command=" + config.theme + "]").addClass("checked");
        setChecked("contextmenu-view", views);
    });
})();

