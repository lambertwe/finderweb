/*
 * $RCSfile: finder.js,v $
 * $Revision: 1.1 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 * 
 * 该版本做了较大改动:
 * 1. 如果用户没有写权限, 需要写权限的按钮不再显示;
 * 2. 非文本文件不允许使用tail和less功能;
 * 3. 右键菜单美化, 去掉右键菜单的[帮助], 右键菜单有点多, help菜单已有其他地方可以点进去, 所以删除;
 */
(function() {
var FileType = {executors: []};

FileType.icons = {
    "7z":    "rar",
    "aac":   "aac",
    "ace":   "rar",
    "ai":    "ai",
    "air":   "air",
    "apk":   "apk",
    "arj":   "arj",
    "as":    "as",
    "asax":  "asax",
    "ascx":  "ascx",
    "ashx":  "ashx",
    "asm":   "asm",
    "asmx":  "asmx",
    "asp":   "aspx",
    "aspx":  "aspx",
    "avi":   "avi",
    "bat":   "cmd",
    "bin":   "bin",
    "bmp":   "bmp",
    "bz2":   "rar",
    "c":     "c",
    "cab":   "cab",
    "cat":   "cat",
    "cdr":   "cdr",
    "cer":   "cer",
    "chm":   "chm",
    "class": "class",
    "cmd":   "cmd",
    "com":   "cmd",
    "cpp":   "cpp",
    "cs":    "cs",
    "css":   "css",
    "csv":   "csv",
    "dll":   "dll",
    "dmg":   "dmg",
    "doc":   "doc",
    "docm":  "docm",
    "docx":  "docx",
    "dot":   "dot",
    "dotm":  "dotm",
    "dotx":  "dotx",
    "dtd":   "dtd",
    "dwg":   "dwg",
    "dxf":   "dxf",
    "ear":   "rar",
    "emf":   "wmf",
    "eps":   "eps",
    "epub":  "epub",
    "exe":   "exe",
    "f":     "f",
    "file":  "file",
    "fla":   "fla",
    "flv":   "flv",
    "fon":   "fon",
    "font":  "font",
    "gif":   "gif",
    "gz":    "rar",
    "h":     "h",
    "hlp":   "hlp",
    "htm":   "htm",
    "html":  "htm",
    "ico":   "ico",
    "img":   "png",
    "indd":  "indd",
    "ini":   "ini",
    "ipa":   "ipa",
    "iso":   "iso",
    "jar":   "jar",
    "java":  "java",
    "jpeg":  "jpg",
    "jpg":   "jpg",
    "js":    "js",
    "json":  "json",
    "key":   "key",
    "ldf":   "ldf",
    "log":   "log",
    "md":    "md",
    "mdb":   "mdb",
    "mde":   "mde",
    "mdf":   "mdf",
    "mht":   "mht",
    "mid":   "mp4",
    "midi":  "midi",
    "mkv":   "mp4",
    "mov":   "mpeg",
    "mp3":   "mp3",
    "mp4":   "mp4",
    "mpeg":  "mpeg",
    "mpg":   "mpeg",
    "mpp":   "mpp",
    "mpt":   "mpt",
    "msg":   "msg",
    "msi":   "msi",
    "music": "music",
    "o":     "o",
    "odp":   "odp",
    "ods":   "ods",
    "odt":   "odt",
    "oexe":  "oexe",
    "ogg":   "ogg",
    "pages": "pages",
    "pdb":   "pdb",
    "pdf":   "pdf",
    "php":   "php",
    "pkg":   "pkg",
    "pl":    "pl",
    "png":   "png",
    "pot":   "pot",
    "pps":   "pps",
    "ppsx":  "ppsx",
    "ppt":   "ppt",
    "pptx":  "pptx",
    "ps1":   "ps1",
    "psd":   "psd",
    "pst":   "pst",
    "pub":   "pub",
    "py":    "py",
    "rar":   "rar",
    "rb":    "rb",
    "reg":   "reg",
    "resx":  "resx",
    "rmvb":  "mp4",
    "rtf":   "rtf",
    "s":     "s",
    "sitx":  "sitx",
    "sln":   "sln",
    "sql":   "sql",
    "suo":   "suo",
    "svg":   "svg",
    "swf":   "swf",
    "tar":   "rar",
    "tif":   "tif",
    "tiff":  "tif",
    "ts":    "mpeg",
    "txt":   "txt",
    "url":   "url",
    "vb":    "vb",
    "vbs":   "vbs",
    "vcf":   "vcf",
    "vdw":   "vdw",
    "vdx":   "vdx",
    "vsd":   "vsd",
    "vsdx":  "vsdx",
    "vss":   "vss",
    "vst":   "vst",
    "vsx":   "vsx",
    "vtx":   "vtx",
    "war":   "rar",
    "wav":   "wav",
    "wave":  "wav",
    "wm":    "mpeg",
    "wma":   "wma",
    "wmd":   "mpeg",
    "wmf":   "wmf",
    "wmv":   "wmv",
    "xaml":  "xaml",
    "xap":   "xap",
    "xls":   "xls",
    "xlsb":  "xlsb",
    "xlsm":  "xlsm",
    "xlsx":  "xlsx",
    "xlt":   "xlt",
    "xltx":  "xltx",
    "xml":   "xml",
    "xps":   "xps",
    "xsd":   "xsd",
    "xsl":   "xsl",
    "y":     "y",
    "zip":   "rar"
};

FileType.registe = function(types, handler) {
    this.executors[this.executors.length] = {"types": types, "handler": handler};
};

FileType.execute = function(file, options) {
    var executors = this.executors;
    var extension = this.getType(file.name);

    for(var i = 0; i < executors.length; i++) {
        var item = executors[i];

        if(this.contains(item.types, extension)) {
            item.handler(file, options);
            return true;
        }
    }
    Finder.display(file, options);
};

FileType.contains = function(source, searchment) {
    var a = source.split(",");

    for(var i = 0; i < a.length; i++) {
        var e = StringUtil.trim(a[i]);

        if(e == searchment) {
            return true;
        }
    }
    return false;
};

/**
 * @param path
 * @return
 */
FileType.getName = function(path) {
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

/**
 * @param path
 * @return String
 */
FileType.getExtension = function(path) {
    if(path != null && path.length > 0) {
        var c = null;
        var i = path.length - 1;

        for(; i > -1; i--) {
            c = path.charAt(i);

            if(c == ".") {
                return path.substring(i + 1);
            }
            else if(c == "/" || c == "\\" || c == ":") {
                return "";
            }
        }
    }
    return "";
};

/**
 * @param path
 * @return String
 */
FileType.getType = function(path) {
    return FileType.getExtension(path).toLowerCase();
};

/**
 * @param path
 * @return String
 */
FileType.getIcon = function(path) {
    var type = FileType.getExtension(path).toLowerCase();
    var icon = FileType.icons[type];

    if(icon == null || icon == undefined) {
        return "unknown";
    }
    return icon;
};

/**
 * @param fileList
 * @return FileList
 */
FileType.setIcon = function(fileList) {
    if(fileList == null || fileList == undefined) {
        return [];
    }

    for(var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        file.icon = FileType.getIcon(file.name);
    }
    return fileList;
};

var FileSort = {};

FileSort.sort = function(files, name, direction) {
    if(files == null || files.length < 1) {
        return;
    }

    var fileList = [];
    var folderList = [];

    for(var i = 0; i < files.length; i++) {
        if(files[i].file == 1) {
            fileList[fileList.length] = files[i];
        }
        else {
            folderList[folderList.length] = files[i];
        }
    }

    if(name == "file-name") {
        folderList.sort(FileSort.byName);
        fileList.sort(FileSort.byName);
    }
    else if(name == "file-type") {
        folderList.sort(FileSort.byName);
        fileList.sort(FileSort.byType);
    }
    else if(name == "file-size") {
        folderList.sort(FileSort.byName);
        fileList.sort(FileSort.bySize);
    }
    else if(name == "modified") {
        folderList.sort(FileSort.byLastModified);
        fileList.sort(FileSort.byLastModified);
    }

    if(direction == "desc") {
        folderList.reverse();
        fileList.reverse();
    }
    FileSort.merge(folderList, fileList, files);
    return files;
};

FileSort.merge = function(folderList, fileList, files) {
    var index = 0;

    for(var i = 0; i < folderList.length; i++) {
        files[index] = folderList[i];
        index++;
    }

    for(var i = 0; i < fileList.length; i++) {
        files[index] = fileList[i];
        index++;
    }
};

FileSort.byName = function(f1, f2) {
    var s1 = f1.name.toLowerCase();
    var s2 = f2.name.toLowerCase();

    if(s1 == s2) {
        return 0;
    }

    if(s1 > s2) {
        return 1;
    }
    else {
        return -1;
    }
};

FileSort.byType = function(f1, f2) {
    var s1 = FileType.getType(f1.name).toLowerCase();
    var s2 = FileType.getType(f2.name).toLowerCase();

    if(s1 == s2) {
        return 0;
    }

    if(s1 > s2) {
        return 1;
    }
    else {
        return -1;
    }
};

FileSort.bySize = function(f1, f2) {
    return f1.size - f2.size;
};

FileSort.byLastModified = function(f1, f2) {
    return f1.modified - f2.modified;
};

var Finder = {listeners: []};

Finder.on = function(name, listener) {
    this.listeners.push({"name": name, "listener": listener});
};

Finder.removeListener = function(listener) {
    for(var i = 0; i < this.listeners.length; i++) {
        var item = this.listeners[i].listener;

        if(item == listener) {
            this.listeners.splice(i, 1);
            return item;
        }
    }
    return null;
};

Finder.trigger = function(name) {
    var args = [];

    for(var i = 1; i < arguments.length; i++) {
        args[args.length] = arguments[i];
    }

    for(var i = 0; i < this.listeners.length; i++) {
        var item = this.listeners[i];

        if(item.name == name) {
            var handler = this.listeners[i].listener;
            var flag = handler.apply(this, args);

            if(flag == false) {
                break;
            }
        }
    }
};

Finder.getWindow = function() {
    return window;
};

Finder.getComponent = function(name) {
    return (window)[name];
};

Finder.getMobile = function() {
    if (this.mobile == null || this.mobile == undefined) {
        this.mobile = false;
        var userAgent = navigator.userAgent.toLowerCase();
        var deviceUserAgent = ["iphone os", "iphone", "android", "mobile", "ipod", "rv:1.2.3.4", "series", "mqqbrowser", "midp", "ucweb", "windows ce", "windows mobile"];

        for(var i = 0; i < deviceUserAgent.length; i++) {
            var regExp = new RegExp(deviceUserAgent[i], "i");

            if(userAgent.match(regExp) == deviceUserAgent[i]) {
                this.mobile = true;
                break;
            }
        }
    }
    return this.mobile;
};

Finder.setCookie = function(cookie) {
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

Finder.getCookie = function(name) {
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

Finder.getLocalVariable = function(name) {
    if(typeof(window.localStorage) != "undefined") {
        return window.localStorage[name];
    }
    else {
        return Finder.getCookie(name);
    }
};

Finder.setLocalVariable = function(name, value) {
    if(typeof(window.localStorage) != "undefined") {
        window.localStorage[name] = value;
    }
    else {
        Finder.setCookie({"name": name, "value": value, "expires": 7 * 24 * 60 * 60});
    }
};

Finder.setAttribute = function(name, value) {
    var e = document.getElementById("pageContext");

    if(e != null) {
        if(value == null || value == undefined) {
            e.removeAttribute(name);
        }
        else {
            e.setAttribute(name, value);
        }
    }
};

Finder.getAttribute = function(name, defaultValue) {
    var value = null;
    var e = document.getElementById("pageContext");

    if(e != null) {
        value = e.getAttribute(name);
    }

    if(value == null || value == undefined) {
        value = defaultValue;
    }

    if(value != null && value != undefined) {
        return value;
    }
    return null;
};

Finder.getInteger = function(name, defaultValue) {
    var value = this.getAttribute(name);

    if(value == null || isNaN(value)) {
        return defaultValue;
    }

    var i = parseInt(value);

    if(isNaN(i)) {
        return defaultValue;
    }
    return i;
};

Finder.getContextPath = function() {
    if(this.contextPath == null || this.contextPath == undefined) {
        var contextPath = this.getAttribute("data-context-path");

        if(contextPath == null || contextPath == "/") {
            contextPath = "";
        }
        this.contextPath = contextPath;
    }
    return this.contextPath;
};

Finder.getRequestURI = function(full) {
    if(full == true) {
        var url = window.location.href;
        var i = url.indexOf("?");

        if(i > -1) {
            return url.substring(0, i);
        }
        return url;
    }
    return window.location.pathname;
};

Finder.getURL = function(params) {
    var b = [];
    var c = {};
    c.action = params.action;
    c.host = Finder.getHost();
    c.workspace = Finder.getWorkspace();
    c.path = Finder.getPath();

    for(var name in params) {
        c[name] = params[name];
    }

    b[b.length] = "action=" + encodeURIComponent(c.action);
    b[b.length] = "host=" + encodeURIComponent(c.host);
    b[b.length] = "workspace=" + encodeURIComponent(c.workspace);
    b[b.length] = "path=" + encodeURIComponent(c.path);

    c.action = null;
    c.host = null;
    c.workspace = null;
    c.path = null;

    for(var name in c) {
        var value = c[name];

        if(value != null) {
            b[b.length] = (name + "=" + encodeURIComponent(value));
        }
    }
    return Finder.getRequestURI() + "?" + b.join("&");
};

Finder.getHost = function() {
    return this.host;
};

Finder.getWorkspace = function() {
    return this.workspace;
};

Finder.getPath = function() {
    if(this.path == null || this.path.length <= 1) {
        return "";
    }
    else {
        return this.path.replace(/\\/g, "/");
    }
};

Finder.getParentPath = function() {
    var path = this.getPath();
    var k = path.lastIndexOf("/");

    if(k > -1) {
        return path.substring(0, k);
    }
    else {
        return "/";
    }
};

Finder.join = function(name) {
    if(this.path == null || this.path.length <= 1) {
        return "/" + name;
    }
    return this.path + "/" + name;
};

Finder.hash = function() {
    if(this.HASH == null) {
        this.HASH = Finder.getAttribute("data-hash", "");
    }
    return this.HASH;
};

Finder.getMode = function() {
    if(this.mode == null) {
        this.mode = 0;
    }
    return this.mode;
};

Finder.getLang = function() {
    return Finder.getAttribute("data-lang", "en");
};

Finder.setOrderBy = function(name, direction) {
    Finder.setLocalVariable("order_by", name + "_" + direction);
};

Finder.getOrderBy = function() {
    var value = Finder.getLocalVariable("order_by");
    var orderBy = {"name": "file-name", "direction": "asc"};

    if(value != null) {
        var array = value.split("_");

        if(array != null && array.length >= 2) {
            orderBy.name = array[0];
            orderBy.direction = array[1];
        }
    }
    return orderBy;
};

Finder.setViewMode = function(viewMode) {
    Finder.setLocalVariable("view_mode", viewMode);
};

Finder.getViewMode = function() {
    return Finder.getLocalVariable("view_mode");
};

Finder.format = function(date) {
    if(date == null) {
        date = new Date();
    }

    if(typeof(date) == "number") {
        var temp = new Date();
        temp.setTime(date);
        date = temp;
    }

    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var a = [];

    a[a.length] = y;
    a[a.length] = "-";

    if(M < 10) {
        a[a.length] = "0";
    }

    a[a.length] = M.toString();
    a[a.length] = "-";

    if(d < 10) {
        a[a.length] = "0";
    }

    a[a.length] = d.toString();

    a[a.length] = " ";

    if(h < 10) {
        a[a.length] = "0";
    }

    a[a.length] = h.toString();
    a[a.length] = ":";

    if(m < 10) {
        a[a.length] = "0";
    }

    a[a.length] = m.toString();
    return a.join("");
};

/**
 * 返回li元素
 */
Finder.getItem = function(name) {
    var element = null;

    Finder.each(function(e) {
        var file = Finder.getFile(e);

        if(file != null && file.name == name) {
            element = e;
            return false;
        }
        return true;
    });
    return element;
};

/**
 * @element li.item
 * @return {file: 1, name: 'xxx', icon: 'xxx', size: 1000, modified: 1508291550491}
 */
Finder.getFile = function(element) {
    var parent = this.getParent(element);

    if(parent == null) {
        return;
    }

    var isFile = parent.getAttribute("data-file");
    var fileIcon = parent.getAttribute("data-icon");
    var fileName = parent.getAttribute("data-name");
    var modified = parent.getAttribute("data-modified");
    var file = {"name": fileName};

    if(isFile == "1") {
        file.file = 1;
        file.icon = fileIcon;
        file.size = parseInt(parent.getAttribute("data-size"));
        file.modified = parseInt(modified);
    }
    else {
        file.file = 0;
        file.modified = parseInt(modified);
    }
    return file;
};

Finder.setFileList = function(fileList) {
    this.mode = fileList.mode;
    this.fileList = fileList.fileList;
    FileType.setIcon(fileList.fileList);
};

Finder.getFileList = function() {
    if(this.fileList == null) {
        var fileList = [];

        Finder.each(function(e) {
            var file = Finder.getFile(e);

            if(file != null) {
                fileList[fileList.length] = file;
            }
        });
        Finder.fileList = fileList;
    }
    return Finder.fileList;
};

/**
 * @path 相对于当前路径后退
 */
Finder.back = function() {
    var parent = this.getParentPath();

    if(parent == null || parent.length < 1) {
        tabPanel.display(this.host, this.workspace, "/");
    }
    else {
        tabPanel.display(this.host, this.workspace, parent);
    }
};

/**
 * @path 绝对路径
 */
Finder.forward = function(path) {
    SuggestDialog.close();
    Finder.getContextMenu().close();

    var url = this.getURL({"action": "finder.getFile", "path": path});

    jQuery.ajax({
        "type": "post",
        "url": url,
        "dataType": "json",
        "error": function() {
            if(status != Finder.status) {
                return;
            }
            Finder.error("System error. Please try again later !");
        },
        "success": function(response) {
            if(response.status != 200) {
                Finder.error(response.message);
                return;
            }

            var file = response.value;
            file.path = path;
            Finder.open(response.value);
        }
    });
};

Finder.refresh = function() {
    /**
     * 延时加载, 否则由于速度太快会感觉没效果
     */
    jQuery("#loading").show();

    setTimeout(function() {
        Finder.reload();
    }, 200);
};

Finder.getFirst = /* private */ function() {
    var parent = document.getElementById("file-list");

    if(parent != null) {
        var list = parent.childNodes;

        for(var i = 0; i < list.length; i++) {
            var e = list[i];

            if(e.nodeType == 1 && e.className != null) {
                var className = e.className;

                if(className.indexOf("item") > -1) {
                     return e;
                }
            }
        }
    }
    return null;
};

Finder.getLast = /* private */ function() {
    var parent = document.getElementById("file-list");

    if(parent != null) {
        var list = parent.childNodes;

        for(var i = list.length - 1; i > -1; i--) {
            var e = list[i];

            if(e.nodeType == 1 && e.className != null) {
                var className = e.className;

                if(className.indexOf("item") > -1) {
                     return e;
                }
            }
        }
    }
    return null;
};

Finder.getSelected = /* private */ function() {
    var list = [];

    Finder.each(function(e) {
        var className = e.className;

        if(className.indexOf("selected") > -1) {
            list[list.length] = e;
        }
    });
    return list;
};

Finder.getNext = /* private */ function(e) {
    var next = e;

    while((next = next.nextSibling) != null) {
        if(next.nodeType == 1) {
            return next;
        }
    }
    return null;
};

Finder.getPrevious = /* private */ function(e) {
    var previous = e;

    while((previous = previous.previousSibling) != null) {
        if(previous.nodeType == 1) {
            return previous;
        }
    }
    return null;
};

Finder.each = /* private */ function(handler) {
    var parent = document.getElementById("file-list");

    if(parent == null || parent == undefined) {
        return;
    }

    var list = parent.childNodes;

    for(var i = 0; i < list.length; i++) {
        var e = list[i];

        if(e.nodeType == 1 && e.className != null) {
            if(e.className.indexOf("item") > -1) {
                var flag = handler(e);

                if(flag == false) {
                    break;
                }
            }
        }
    }
};

Finder.setVisible = /* private */ function(element, target, center) {
    var height = target.clientHeight;
    var scrollTop = target.scrollTop;
    var offsetTop = element.offsetTop;
    var clientHeight = element.clientHeight;

    if(target == document.body) {
        height = document.documentElement.clientHeight;
    }

    if(scrollTop > offsetTop) {
        var top = offsetTop;

        if(center == true) {
            top = top - Math.floor(top - (height / 2));
        }

        if(target == document.body) {
            document.body.scrollTop = top;
            document.documentElement.scrollTop = top;
        }
        else {
            target.scrollTop = top;
        }
    }

    if(offsetTop > (height + scrollTop - clientHeight)) {
        var top = offsetTop - height + clientHeight;

        if(center == true) {
            top = top - Math.floor(top - (height / 2));
        }

        if(target == document.body) {
            document.body.scrollTop = top;
            document.documentElement.scrollTop = top;
        }
        else {
            target.scrollTop = top;
        }
    }
};

Finder.scroll = /* private */ function(offset, multiple) {
    var prev = null;
    var next = null;
    var active = this.active;

    if(active == null) {
        active = this.active = this.getFirst();

        if(active != null) {
            active.className = "item active selected";
        }
        return false;
    }

    if(multiple == true) {
        if(offset > 0) {
            next = this.getNext(active);

            if(next != null) {
                if(next.className.indexOf("selected") > -1) {
                    active.className = "item";
                }

                next.className = "item active selected";
                this.active = next;
            }
        }
        else {
            prev = this.getPrevious(active);

            if(prev != null) {
                if(prev.className.indexOf("selected") > -1) {
                    active.className = "item";
                }

                prev.className = "item active selected";
                this.active = prev;
            }
        }

        if(active != this.active) {
            if(active.className.indexOf("selected") > -1) {
                active.className = "item selected";
            }
            else {
                active.className = "item";
            }
            return true;
        }
        return false;
    }

    var list = Finder.getSelected();

    if(list.length > 0) {
        for(var i = 0; i < list.length; i++) {
            list[i].className = "item";
        }
    }

    if(offset > 0) {
        next = this.getNext(active);

        if(next == null) {
            next = this.getFirst();
        }
    }
    else {
        next = this.getPrevious(active);

        if(next == null) {
            next = this.getLast();
        }
    }

    if(next != null) {
        next.className = "item active selected";
        this.active = next;
        this.setVisible(next, document.body);
    }
    else {
        this.active = null;
    }
    return false;
};

Finder.load = /* public */ function(host, workspace, path) {
    this.host = host;
    this.workspace = workspace;

    if(StringUtil.isBlank(path)) {
        this.path = "/";
    }
    else {
        this.path = StringUtil.trim(path);
    }

    if(this.path.length > 1) {
        jQuery("#back").removeClass("disabled");
        jQuery("#back i").attr("class", "back");
    }
    else {
        jQuery("#back").addClass("disabled");
        jQuery("#back i").attr("class", "back-disabled");
    }

    Finder.status = 0;
    Finder.cache = {};
    Finder.reload();
};

Finder.reload = /* public */ function(callback) {
    if(isNaN(Finder.status)) {
        return;
    }
    else {
        Finder.status = Finder.status + 1;
    }

    var status = Finder.status;
    var url = Finder.getURL({"action": "finder.getFileList"});

    jQuery("#loading").show();
    jQuery("#address").val(this.path);
    Finder.getContextMenu().close();

    jQuery.ajax({
        "type": "get",
        "url": url,
        "dataType": "json",
        "error": function() {
            if(status != Finder.status) {
                return;
            }

            jQuery("#loading").hide();
            jQuery("#address").val(Finder.path);
            Finder.error("System error. Please try again later !");
        },
        "success": function(response) {
            if(status != Finder.status) {
                return;
            }

            jQuery("#loading").hide();
            jQuery("#address").val(Finder.path);

            if(response == null || response.status != 200 || response.value == null) {
                Finder.error("System error. Please try again later !");

                if(callback != null) {
                    callback();
                }
                return;
            }

            Finder.list(response.value);
            TreePanel.expand();

            if(callback != null) {
                callback();
            }
        }
    });
};

Finder.denied = function(message) {
    var e = document.createElement("div");
    e.style.cssText = "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: #ffffff; z-index: 10000;";
    e.innerHTML = [
        "<div style=\"margin-top: 100px; text-align: center; font-size: 14px; color: #aaaaaa; cursor: default;\">",
        "<p>" + message + "</p>",
        "<p style=\"margin-top: 30px;\" onclick=\"(function(src){src.parentNode.removeChild(src, true);})(this.parentNode.parentNode);\">单击继续</p>",
        "</div>"].join("");
    document.body.appendChild(e);
};

Finder.error = /* private */ function(message) {
    this.mode = 0;
    Finder.setMessage(500, message);
};

Finder.message = /* private */ function(message) {
    this.setMessage(200, message);
};

Finder.setMessage = /* private */ function(status, message) {
    var e = document.createElement("div");
    e.style.cssText = "padding-top: 100px; text-align: center; text-align: center; font-size: 14px; color: #c0c0c0;";
    e.appendChild(document.createTextNode(message));

    jQuery("#file-list").html("").hide();
    jQuery("#info-view").html("").show();
    jQuery("#info-view").append(e);

    if(status == 200) {
        jQuery("#info-view").attr("contextmenu", "true");
    }
    else {
        jQuery("#info-view").attr("contextmenu", "false");
    }
};

Finder.getTooltip = /* private */ function(path, file) {
    if(file.file == 1) {
        return HtmlUtil.encode(file.name) + "&#10;类型: " + FileType.getType(file.name) + "文件&#10;修改日期: " + Finder.format(file.modified) + "&#10;大小: " + file.size + " 字节";
    }
    else {
        return HtmlUtil.encode(file.name) + "&#10;类型: 文件夹&#10;修改日期: " + Finder.format(file.modified);
    }
};

Finder.setViewType = /* private */ function(viewMode) {
    if(viewMode == "outline") {
        jQuery("#head-view").hide();
        jQuery("#file-view").show();
        jQuery("#info-view").hide();
        jQuery("#file-list").attr("class", "outline-view").show();
        jQuery(window).resize();
        Finder.lazyload();
    }
    else {
        jQuery("#head-view").show();
        jQuery("#file-view").show();
        jQuery("#info-view").hide();
        jQuery("#file-list").attr("class", "detail-view").show();
        jQuery(window).resize();
        Finder.lazyload();
    }
};

Finder.sort = /* private */ function(name, direction) {
    var fileList = Finder.getFileList();

    if(fileList == null || fileList == undefined || fileList.length < 1) {
        Finder.message("Folder is empty.");
        jQuery(window).resize();
        return;
    }

    Finder.active = null;
    FileSort.sort(fileList, name, direction);
    Finder.detail();
};

Finder.list = /* private */ function(fileList) {
    var orderBy = Finder.getOrderBy();
    var viewMode = Finder.getViewMode();

    Finder.setFileList(fileList);
    Finder.sort(orderBy.name, orderBy.direction);
    Finder.setViewType(viewMode);
};

Finder.lazyload = /* private */ function() {
    var ele = jQuery("#file-list li.item div.box div.icon img.thumbnail");

    if(ele.size() < 1) {
        return true;
    }

    var startY = jQuery(document).scrollTop();
    var endY = startY + jQuery(window).height();
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath();
    var url = [];
    url[0] = "?action=finder.get";
    url[1] = "host=" + encodeURIComponent(host);
    url[2] = "workspace=" + encodeURIComponent(workspace);

    ele.each(function() {
        var offsetTop = jQuery(this).closest("li.item").offset().top;

        if(offsetTop < startY || offsetTop > endY) {
            return;
        }

        url[3] = "path=" + encodeURIComponent(path + "/" + this.getAttribute("data-name"));
        this.src = "?action=res&path=/finder/images/loading1.gif";
        this.className = "";
        this.style.opacity = 0.18;

        var src = this;
        var img = new Image();
        img.src = url.join("&");

        img.onload = function() {
            src.src = img.src;
            src.style.opacity = 0.0;
            src.style.transition = "opacity 200ms ease-in-out";
            src.style.opacity = 1.0;
        };
    });
    return true;
};

/**
 * 操作按钮
 */
var Operate = /* private */ function(name) {
    this.name = name;
    this.show = true;
    this.enabled = true;
};

Operate.prototype.toString = function() {
    if(this.show != true) {
        return "";
    }

    if(this.enabled != true) {
        return "";
    }
    else {
        return "<a action=\"finder-" + this.name + "\" href=\"javascript:void(0)\" draggable=\"false\">" + I18N.getLang("finder.list.button." + this.name) +"</a>";
    }
};

Finder.detail = /* private */ function() {
    var index = 1;
    var path = this.getPath();
    var mode = Finder.getMode();
    var mobile = Finder.getMobile();
    var allows = Finder.getAttribute("data-display-operate-button", "");
    var textType = Finder.getAttribute("data-text-type", "");
    var fileList = Finder.getFileList();

    if(mobile) {
        jQuery("#head-view span.file-type").hide();
        jQuery("#head-view span.modified").hide();
    }

    var map = {
        "ico":  "ico",
        "jpg":  "jpg",
        "jpeg": "jpeg",
        "gif":  "gif",
        "bmp":  "bmp",
        "png":  "png"
    };

    var buttons = {
        "tail":     new Operate("tail"),
        "less":     new Operate("less"),
        "grep":     new Operate("grep"),
        "open":     new Operate("open"),
        "download": new Operate("download"),
        "delete":   new Operate("delete")
    };

    for(var name in buttons) {
        if(!StringUtil.contains(allows, name)) {
            buttons[name].show = false;
        }
    }

    if(StringUtil.contains(allows, "tail")
        || StringUtil.contains(allows, "less")
        || StringUtil.contains(allows, "grep")) {
        buttons["tail"].show = true;
        buttons["less"].show = true;
        buttons["grep"].show = true;
    }

    /**
     * 读权限
     */
    if(mode < 1) {
        buttons["download"].show = false;
    }

    if((mode & 4) < 1) {
        buttons["delete"].show = false;
    }

    var b = [];

    for(var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        var fileName = HtmlUtil.encode(file.name);

        if(file.file != 1) {
            b[b.length] = "<li class=\"item\" data-name=\"" + fileName + "\" data-modified=\"" + file.modified + "\" title=\"" + Finder.getTooltip(path, file) + "\">";
            b[b.length] = "<div class=\"box\">";
            b[b.length] = "   <div class=\"icon\"><img src=\"?action=res&path=/finder/icon/folder.png\"/></div>";
            b[b.length] = "   <div class=\"file-name\">" + fileName + "</div>";
            b[b.length] = "   <div class=\"file-size\">&nbsp;</div>";

            if(!mobile) {
                b[b.length] = "   <div class=\"file-type\">文件夹</div>";
                b[b.length] = "   <div class=\"modified\">" + this.format(file.modified) + "</div>";
            }
            b[b.length] = "   <div class=\"operate\">";
            b[b.length] = buttons["open"].toString();
            b[b.length] = buttons["delete"].toString();
            b[b.length] = "   </div>";
            b[b.length] = "</div>";
            b[b.length] = "</li>";
        }
        else {
            var fileType = FileType.getType(file.name);

            if(StringUtil.contains(textType, fileType)) {
                buttons["tail"].enabled = true;
                buttons["less"].enabled = true;
                buttons["grep"].enabled = true;
            }
            else {
                buttons["tail"].enabled = false;
                buttons["less"].enabled = false;
                buttons["grep"].enabled = false;
            }

            b[b.length] = "<li class=\"item\" data-file=\"1\" data-icon=\"" + file.icon + "\" data-name=\"" + fileName + "\" data-size=\"" + file.size + "\" data-modified=\"" + file.modified + "\" title=\"" + Finder.getTooltip(path, file) + "\">";
            b[b.length] = "<div class=\"box\"><div class=\"icon\">";

            if(map[fileType] == null) {
                b[b.length] = "<img src=\"?action=res&path=/finder/icon/" + file.icon + ".png\" ondragstart=\"return false;\"/>";
            }
            else {
                b[b.length] = "<img class=\"thumbnail\" src=\"?action=res&path=/finder/icon/" + file.icon + ".png\" data-name=\"" + fileName + "\" data-icon=\"" + file.icon + "\" ondragstart=\"return false;\"/>";
            }

            b[b.length] = "</div><div class=\"file-name\">" + fileName + "</div>";
            b[b.length] = "<div class=\"file-size\">" + ByteUtil.getByteSize(file.size) + "</div>";

            if(!mobile) {
                b[b.length] = "<div class=\"file-type\">" + fileType + "文件</div>";
                b[b.length] = "<div class=\"modified\">" + Finder.format(file.modified) + "</div>";
            }
            b[b.length] = "   <div class=\"operate\">";
            b[b.length] = buttons["tail"].toString();
            b[b.length] = buttons["less"].toString();
            b[b.length] = buttons["grep"].toString();
            b[b.length] = buttons["open"].toString();
            b[b.length] = buttons["download"].toString();
            b[b.length] = buttons["delete"].toString();
            b[b.length] = "   </div>";
            b[b.length] = "</div>";
            b[b.length] = "</li>";
        }
    }
    jQuery("#file-list").html(b.join(""));
};

/**
 * h5下已经不需要使用该函数重置图片尺寸
 * @deprecated
 */
Finder.resize = function(img) {
    ImageUtil.resize(img, 64, 64);
};

Finder.getParent = function(src) {
    var parent = src;

    while(parent != null && (parent.className == null || parent.className.indexOf("item") < 0)) {
        if(parent == parent.parentNode) {
            return null;
        }
        parent = parent.parentNode;
    };
    return parent;
};

Finder.click = function(event, name) {
    var e = (event || window.event);
    var src = (e.srcElement || e.target);
    var nodeName = src.nodeName;

    if(nodeName == "INPUT" || nodeName == "TEXTAREA") {
        return;
    }

    var parent = Finder.getParent(src);

    if(parent == null) {
        Finder.active = null;
        Finder.each(function(e) {
            e.className = "item";
        });
        return;
    }

    Finder.select(src, (e.ctrlKey == true), (e.shiftKey == true));

    var bindEvent = "dblclick";
    var className = src.className;

    if(className != null && className.indexOf("disabled") > -1) {
        return;
    }

    if(src.nodeName.toLowerCase() == "a") {
        bindEvent = src.getAttribute("bind-event");
    }

    if(bindEvent != null && bindEvent != name) {
        return;
    }

    var file = Finder.getFile(src);
    var action = src.getAttribute("action");
    var target = src.getAttribute("target");
    var options = {};

    if(event.ctrlKey == true) {
        options.target = "_blank";
    }

    if(target != null) {
        options.target = target;
    }

    if(action == "finder-download") {
        Finder.download(file, options);
    }
    else if(action == "finder-delete") {
        Finder.remove([file], options);
    }
    else if(action == "finder-tail") {
        Finder.tail(file, options);
    }
    else if(action == "finder-less") {
        Finder.less(file, options);
    }
    else if(action == "finder-grep") {
        Finder.grep(file, options);
    }
    else {
        Finder.open(file, options);
    }
    return true;
};

Finder.open = /* public */ function(file, options) {
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();

    if(file.path == null) {
        file.path = Finder.join(file.name);
    }

    if(file.file == 1) {
        if(options.edit == 1) {
            var TextEditor = Finder.getComponent("TextEditor");
            TextEditor.open(host, workspace, file.path);
        }
        else {
            FileType.execute(file, (options || {}));
        }
    }
    else {
        Finder.display(file, (options || {}));
    }
    return true;
};

/**
 * 私有
 */
Finder.display = /* private */ function(file, options) {
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = file.path;

    if(file.file == 1) {
        var url = Finder.getURL({"action": "finder.display", "path": path});
        var tooltips = host + "@" + workspace + "/" + path + "/" + file.name;

        if(options.target != null) {
            window.open(url, options.target);
            return;
        }
        tabPanel.addTabPanel(file.name, tooltips, url);
        return;
    }
    else {
        tabPanel.display(host, workspace, path);
        return;
    }
};

Finder.download = function(file, options) {
    if(file == null || file.file != 1) {
        DialogUtil.message("文件不存在或者不是一个文件！");
        return;
    }

    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath() + "/" + file.name;
    var url = Finder.getURL({"action": "api.key", "host": host, "workspace": workspace, "path": path});
    var handler = function(key) {
        var a = document.getElementById("_finder_download_");
        var downloadURL = Finder.getURL({"action": "api.download", "host": host, "workspace": workspace, "path": path, "key": key});

        if(a == null) {
            a = document.createElement("a");
            a.style.display = "none";
            document.body.appendChild(a);
        }

        a.setAttribute("href", downloadURL);
        a.setAttribute("download", file.name);
        a.click();
    };

    jQuery("#loading").show();
    jQuery.ajax({
        "type": "post",
        "url": url,
        "dataType": "json",
        "error": function() {
            jQuery("#loading").hide();
        },
        "success": function(response) {
            jQuery("#loading").hide();

            if(response.status != 200) {
                DialogUtil.alert(response.message);
                return;
            }

            var key = response.value;

            if(StringUtil.isBlank(key)) {
                DialogUtil.alert("finder.system.error.");
                return;
            }
            handler(key);
        }
    });
    return true;
};

Finder.tail = function(file, options) {
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath() + "/" + file.name;
    var url = Finder.getURL({"action": "finder.tail", "path": path});
    var tooltips = host + "@" + workspace + "/" + path + "/" + file.name;

    if(options.target != null) {
        window.open(url, options.target);
        return;
    }
    tabPanel.addTabPanel(file.name, tooltips, url);
};

Finder.less = function(file, options) {
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath() + "/" + file.name;
    var url = Finder.getURL({"action": "finder.less", "path": path});
    var tooltips = host + "@" + workspace + "/" + path + "/" + file.name;

    if(options.target != null) {
        window.open(url, options.target);
        return;
    }
    tabPanel.addTabPanel(file.name, tooltips, url);
};

Finder.grep = function(file, options) {
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath() + "/" + file.name;
    var url = Finder.getURL({"action": "finder.grep", "path": path});
    var tooltips = host + "@" + workspace + "/" + path + "/" + file.name;

    if(options.target != null) {
        window.open(url, options.target);
        return;
    }
    tabPanel.addTabPanel(file.name, tooltips, url);
};

Finder.mkdir = function(options) {
    var params = [];
    params[params.length] = "host=" + encodeURIComponent(Finder.getHost());
    params[params.length] = "workspace=" + encodeURIComponent(Finder.getWorkspace());
    params[params.length] = "path=" + encodeURIComponent(Finder.getPath());
    params[params.length] = "name=" + encodeURIComponent("新建文件夹");

    jQuery.ajax({
        "type": "post",
        "url": this.getRequestURI() + "?action=finder.mkdir&" + params.join("&"),
        "dataType": "json",
        "error": function() {
            DialogUtil.alert(I18N.getLang("finder.message.system.error"));
        },
        "success": function(response) {
            var callback = options.callback;

            if(callback != null) {
                callback((response || {}));
            }
            TreePanel.reload();
        }
    });
};

Finder.remove = function(files, options) {
    if(files.length < 1) {
        return;
    }

    var host = this.getHost();
    var workspace = this.getWorkspace();
    var path = this.getPath();

    if(options.force != true) {
        var message = null;

        if(files.length == 1) {
            message = I18N.getLang("finder.message.file.delete.confirm1", path + "/" + files[0].name);
        }
        else {
            message = I18N.getLang("finder.message.file.delete.confirm2", files.length);
        }

        DialogUtil.confirm(message, function(ok) {
            if(ok) {
                options.force = true;
                Finder.remove(files, options);
            }
        });
        return;
    }

    var params = {};
    params.path = [];

    for(var i = 0; i < files.length; i++) {
        params.path[ params.path.length] = (path + "/" + files[i].name);
    }

    jQuery.ajax({
        "type": "post",
        "url": this.getRequestURI() + "?action=finder.delete&host=" + encodeURIComponent(host) + "&workspace=" + encodeURIComponent(workspace),
        "dataType": "json",
        "data": jQuery.param(params, true),
        "error": function() {
            DialogUtil.alert(I18N.getLang("finder.message.system.error"));
        },
        "success": function(response) {
            if(response == null || response.status != 200) {
                DialogUtil.alert(I18N.getLang(response.message));
                return;
            }

            if(response.value < files.length) {
                DialogUtil.alert(I18N.getLang("finder.message.file.delete.failed"));
                return;
            }
            Finder.reload();
            TreePanel.reload();
        }
    });
};

Finder.rename = function(file, options) {
    var params = [];
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath() + "/" + file.name;

    params[params.length] = "host=" + encodeURIComponent(host);
    params[params.length] = "workspace=" + encodeURIComponent(workspace);
    params[params.length] = "path=" + encodeURIComponent(path);
    params[params.length] = "newName=" + encodeURIComponent(file.newName);

    jQuery.ajax({
        "type": "post",
        "url": this.getRequestURI() + "?action=finder.rename&" + params.join("&"),
        "dataType": "json",
        "error": function() {
            var callback = options.callback;

            if(callback != null) {
                callback({"status": 502, "message": "finder.system.error"});
            }
        },
        "success": function(response) {
            var callback = options.callback;

            if(callback != null) {
                callback((response || {}));
            }
            TreePanel.reload();
        }
    });
};

Finder.edit = function(src) {
    if(src == null || src.className != "file-name") {
        return;
    }

    var parent = Finder.getParent(src);

    if(parent.className == null || parent.className.indexOf("selected") < 0) {
        return;
    }

    var file = Finder.getFile(src);
    var fileName = file.name;
    var input = null;

    if(jQuery(src).closest("ul").hasClass("outline-view")) {
        input = document.createElement("textarea");
        input.className = "text";
        input.value = fileName;

        input.setAttribute("draggable", "false");
        input.setAttribute("oldValue", fileName);
        src.innerHTML = "";

        parent.style.position ="relative";
        parent.appendChild(input);
    }
    else {
        input = document.createElement("input");
        input.type = "text";
        input.className = "text";
        input.value = fileName;
        input.setAttribute("draggable", "false");
        input.setAttribute("oldValue", fileName);

        src.innerHTML = "";
        src.appendChild(input);
    }

    var handler = function() {
        /**
         * 取消blur事件
         */
        jQuery(input).unbind();

        var oldValue = input.getAttribute("oldValue");
        var newValue = StringUtil.trim(input.value);

        if(newValue.length > 0 && newValue != oldValue) {
            file.newName = newValue;

            Finder.rename(file, {"callback": function(result) {
                if(result != null && result.status == 200 && result.value == true) {
                    jQuery(input).remove();
                    src.appendChild(document.createTextNode(newValue));
                    parent.setAttribute("data-name", newValue);
                    Finder.fileList = null;
                }
                else {
                    jQuery(input).remove();
                    src.appendChild(document.createTextNode(fileName));
                    DialogUtil.alert(I18N.getLang("finder.message.file.rename.failed"));
                    return;
                }
            }});
        }
        else {
            jQuery(input).remove();
            src.appendChild(document.createTextNode(fileName));
        }
    };

    jQuery(input).blur(handler);
    jQuery(input).keydown(function(event) {
        var e = (event || window.event);

        if(e.keyCode == 13) {
            console.log("keydown");
            handler();
        }
    });

    try {
        input.select();
        input.focus();
    }
    catch(e) {
        console.log(e.name + ": " + e.message);
    }
};

Finder.cut = function() {
    var list = Finder.getSelected();

    Finder.each(function(e) {
        e.style.opacity = "1.0";
        e.style.filter = "alpha(opacity=100)";
    });

    if(list.length > 0) {
        var object = {};
        var fileList = [];
        object.host = Finder.getHost();
        object.workspace = Finder.getWorkspace();
        object.path = Finder.getPath();
        object.fileList = fileList;
        object.operate = "cut";

        for(var i = 0; i < list.length; i++) {
            list[i].style.opacity = "0.5";
            list[i].style.filter = "alpha(opacity=50)";

            var file = Finder.getFile(list[i]);
            fileList[fileList.length] = file.name;
        }
        FinderClipboard.set(JSON.stringify(object));
    }
};

Finder.copy = function() {
    var list = Finder.getSelected();

    Finder.each(function(e) {
        e.style.opacity = "1.0";
        e.style.filter = "alpha(opacity=100)";
    });

    if(list.length > 0) {
        var object = {};
        var fileList = [];
        object.host = Finder.getHost();
        object.workspace = Finder.getWorkspace();
        object.path = Finder.getPath();
        object.fileList = fileList;
        object.operate = "copy";

        for(var i = 0; i < list.length; i++) {
            var file = Finder.getFile(list[i]);
            fileList[fileList.length] = file.name;
        }
        FinderClipboard.set(JSON.stringify(object));
    }
};

Finder.getClipboardFiles = function(event) {
    var files = [];
    var clipboard = event.clipboardData;

    if(clipboard != null) {
        var items = clipboard.items;

        for(var i = 0, length = items.length; i < length; i++) {
            var item = items[i];

            if(item.kind == "file" || item.type.indexOf("image") > -1) {
                var file = item.getAsFile();
                file.fileName = "screenshot_" + new Date().getTime() + "." + item.type.replace("image/", "");
                files[files.length] = file;
            }
        }
    }
    return files;
};

Finder.paste = function() {
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath();
    var object = FinderClipboard.getObject();

    if(object == null) {
        return;
    }

    if(host != object.host) {
        DialogUtil.alert(I18N.getLang("finder.message.file.cut.failed100"));
        return;
    }

    var url = null;
    var params = {};
    params.sourceHost = object.host;
    params.sourceWorkspace = object.workspace;
    params.sourcePath = object.path;
    params.file = object.fileList;

    if(object.operate == "cut") {
        url = Finder.getRequestURI() + "?action=finder.cut";
    }
    else if(object.operate == "copy") {
        url = Finder.getRequestURI() + "?action=finder.copy";
    }
    else {
        return;
    }

    url = url + "&host=" + encodeURIComponent(host) + "&workspace=" + encodeURIComponent(workspace) + "&path=" + encodeURIComponent(path);

    jQuery.ajax({
        "type": "post",
        "url": url,
        "data": jQuery.param(params, true),
        "dataType": "json",
        "error": function() {
            FinderClipboard.clear();
            DialogUtil.alert(I18N.getLang("finder.message.system.error"));
        },
        "success": function(response) {
            if(response.status != 200) {
                DialogUtil.alert(I18N.getLang(response.message));
                return;
            }

            Finder.reload();
            TreePanel.reload();
            FinderClipboard.clear();
        }
    });
};

Finder.upload = function(files) {
    if(files.length < 1) {
        return;
    }

    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath();
    var url = Finder.getRequestURI() + "?action=finder.upload&host=" + encodeURIComponent(host) + "&workspace=" + encodeURIComponent(workspace) + "&path=" + encodeURIComponent(path);
    var partSize = Finder.getAttribute("data-upload-part-size", "5m");
    var FileUpload = Finder.getComponent("FileUpload");
    var callback = function() {
        if(host == Finder.getHost() && workspace == Finder.getWorkspace() && path == Finder.getPath()) {
            Finder.reload();
        }
    };

    if(typeof(FileUpload) != "undefined") {
        FileUpload.upload({
            "url": url,
            "files": files,
            "partSize": partSize,
            "error": callback,
            "success": callback,
            "cancel": callback
        });
    }
};

Finder.zip = function() {
    var fileList = [];
    var list = Finder.getSelected();
    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath();

    for(var i = 0; i < list.length; i++) {
        var file = Finder.getFile(list[i]);
        fileList[fileList.length] = file.name;
    }

    var url = Finder.getRequestURI() + "?action=finder.zip&host=" + encodeURIComponent(host) + "&workspace=" + encodeURIComponent(workspace) + "&path=" + encodeURIComponent(path);

    jQuery.ajax({
        "type": "post",
        "url": url,
        "data": jQuery.param({"file": fileList}, true),
        "dataType": "json",
        "error": function() {
            DialogUtil.alert(I18N.getLang("finder.message.system.error"));
        },
        "success": function(response) {
            if(response.status != 200) {
                DialogUtil.alert(I18N.getLang(response.message));
                return;
            }
            Finder.reload();
        }
    });
};

Finder.unzip = function() {
    var list = Finder.getSelected();

    if(list.length != 1) {
        alert("请选择一个ZIP文件！");
        return;
    }

    var file = Finder.getFile(list[0]);
    var type = FileType.getType(file.name);

    if(type != "zip" && type != "jar") {
        alert("请选择一个ZIP或者JAR文件！");
        return;
    }

    var host = Finder.getHost();
    var workspace = Finder.getWorkspace();
    var path = Finder.getPath();
    var url = Finder.getRequestURI() + "?action=finder.unzip&host=" + encodeURIComponent(host) + "&workspace=" + encodeURIComponent(workspace);

    jQuery.ajax({
        "type": "post",
        "url": url,
        "data": "file=" + encodeURIComponent(path + "/" + file.name),
        "dataType": "json",
        "error": function() {
            DialogUtil.alert(I18N.getLang("finder.message.system.error"));
        },
        "success": function(response) {
            if(response.status != 200) {
                DialogUtil.alert(I18N.getLang(response.message));
                return;
            }
            Finder.reload();
        }
    });
};

Finder.select = function(src, multiple, shift) {
    if(multiple != true && shift != true) {
        this.each(function(e) {
            e.className = "item";
        });
    }

    var parent = Finder.getParent(src);

    if(parent != null) {
        if(this.active == null) {
            this.active = this.getFirst();
        }

        if(shift == true) {
            var j = -1;
            var k = -1;
            var list = [];
            var active = this.active;

            this.each(function(e) {
                list[list.length] = e;

                if(e == parent) {
                    j = list.length - 1;
                }

                if(e == active) {
                    k = list.length - 1;
                }
            });

            if(j > -1 && k > -1) {
                var min = Math.min(j, k);
                var max = Math.max(j, k);

                for(var i = 0; i < list.length; i++) {
                    if(i < min || i > max) {
                        list[i].className = "item";
                    }
                    else {
                        list[i].className = "item selected";
                    }
                }
            }
        }
        else {
            this.active = parent;
        }

        if(multiple == true) {
            if(parent.className.indexOf("selected") > -1) {
                parent.className = "item";
            }
            else {
                parent.className = "item selected";
            }
        }
        else {
            parent.className = "item selected";
        }

        if(this.active != null) {
            if(this.active.className.indexOf("selected") > -1) {
                this.active.className = "item active selected";
            }
            else {
                this.active.className = "item";
            }
        }
    }
};

Finder.keydown = function(event) {
    var e = (event || window.event);
    var src = (e.srcElement || e.target);
    var keyCode = (event.keyCode || event.which);
    var path = StringUtil.trim(src.value);

    switch(keyCode) {
        case KeyCode.BACKSPACE: {
            if(e.ctrlKey == true) {
                var i = path.lastIndexOf("/", path.length - 2);

                if(i > -1) {
                    src.value = path.substring(0, i + 1);
                }
                else {
                    src.value = "/";
                }
                return false;
            }
            else {
                return true;
            }
        }
        case KeyCode.UP: {
            SuggestDialog.scroll(-1);
            return false;
        }
        case KeyCode.DOWN: {
            SuggestDialog.scroll(+1);
            return false;
        }
    }
    return true;
};

Finder.keyup = function(event) {
    var e = (event || window.event);
    var src = (e.srcElement || e.target);
    var keyCode = (event.keyCode || event.which);
    var path = src.value;

    switch(keyCode) {
        case KeyCode.ESC: {
            Finder.back();
            return false;
        }
        case KeyCode.ENTER: {
            Finder.forward(path);
            return false;
        }
        case KeyCode.UP: {
            EventUtil.stop(e);
            return false;
        }
        case KeyCode.DOWN: {
            EventUtil.stop(e);
            return false;
        }
    }
    Finder.suggest(Finder.getHost(), Finder.getWorkspace(), path);
    EventUtil.stop(e);
    return false;
};

Finder.showContextMenu = function(event) {
    var e = (event || window.event);
    var src = (e.srcElement || e.target);
    var parent = this.getParent(src);

    if(parent != null && parent.className.indexOf("selected") < 0) {
        if(src.nodeName.toLowerCase() == "a") {
            Finder.select(src.parentNode);
        }
        else {
            Finder.select(src);
        }
    }

    var mode = Finder.getMode();
    var contextMenu = Finder.getContextMenu();

    if(parent != null) {
        var download = true;
        var list = Finder.getSelected();

        if(list.length != 1) {
            download = false;
        }
        else {
            var file = Finder.getFile(list[0]);
            download = (file.file == 1);
        }

        contextMenu.setEnabled("open", true);
        contextMenu.setEnabled("edit", true);
        contextMenu.setEnabled("download", download);
        contextMenu.setEnabled("zip", true);
        contextMenu.setEnabled("unzip", true);
        contextMenu.setEnabled("cut", true);
        contextMenu.setEnabled("copy", true);
        contextMenu.setEnabled("remove", true);
        contextMenu.setEnabled("rename", true);
        contextMenu.setEnabled("info", true);
    }
    else {
        contextMenu.setEnabled("open", false);
        contextMenu.setEnabled("edit", false);
        contextMenu.setEnabled("download", false);
        contextMenu.setEnabled("zip", false);
        contextMenu.setEnabled("unzip", false);
        contextMenu.setEnabled("cut", false);
        contextMenu.setEnabled("copy", false);
        contextMenu.setEnabled("remove", false);
        contextMenu.setEnabled("rename", false);
        contextMenu.setEnabled("info", false);
    }

    var object = FinderClipboard.getObject();

    if(object != null) {
        contextMenu.setEnabled("paste", true);
    }
    else {
        contextMenu.setEnabled("paste", false);
    }

    /**
     * read
     */
    if(mode < 1) {
        contextMenu.setEnabled("download", false);
    }

    /**
     * write
     */
    if((mode & 2) < 1) {
        contextMenu.setEnabled("edit", false);
        contextMenu.setEnabled("upload", false);
        contextMenu.setEnabled("zip", false);
        contextMenu.setEnabled("unzip", false);
        contextMenu.setEnabled("cut", false);
        contextMenu.setEnabled("remove", false);
        contextMenu.setEnabled("rename", false);
        contextMenu.setEnabled("paste", false);
        contextMenu.setEnabled("mkdir", false);
    }
    contextMenu.open(e);
    return false;
};

Finder.getSuggest = function(workspace, path) {
    if(Finder.cache == null) {
        Finder.cache = {};
    }

    var i = path.lastIndexOf("/");
    var key = path.substring(0, i + 1);
    var prefix = path.substring(i + 1).toLowerCase();
    var fileList = Finder.cache[key];

    if(fileList != null) {
        var result = [];

        for(var i = 0; i < fileList.length; i++) {
            var file = fileList[i];

            if(StringUtil.startsWith(file.name.toLowerCase(), prefix)) {
                result[result.length] = file;
            }
        }
        return result;
    }
    return null;
};

Finder.suggest = function(host, workspace, path) {
    path = StringUtil.trim(path);
    path = StringUtil.replace(path, "\\", "/");
    path = StringUtil.replace(path, "//", "/");

    if(path.length < 1) {
        path = "/";
    }

    if(path.charAt(0) != "/") {
        path = "/" + path;
    }

    var json = Finder.getSuggest(workspace, path);

    if(json != null) {
        SuggestDialog.open(json);
        return;
    }

    jQuery.ajax({
        "type": "get",
        "url": Finder.getURL({"action": "finder.suggest", "host": host, "workspace": workspace, "path": path}),
        "dataType": "json",
        "success": function(response) {
            if(response != null && response.status == 200) {
                var fileList = FileSort.sort(response.value, "file-name", "asc");
                Finder.cache[path] = FileType.setIcon(fileList);
                SuggestDialog.open(fileList);
            }
        }
    });
};

Finder.info = function(file) {
    var opts = {file: {}};
    opts.file.host = Finder.getHost();
    opts.file.workspace = Finder.getWorkspace();
    opts.file.path = Finder.getPath() + "/" + file.name;
    opts.file.file = file.file;
    opts.file.icon = file.icon;
    opts.file.name = file.name;
    opts.file.size = file.size;
    opts.file.modified = file.modified;

    opts.success = function() {
        Finder.reload();
    };

    var PropertyDialog = Finder.getComponent("PropertyDialog");
    new PropertyDialog().display(opts);
};

Finder.getContextMenu = function() {
    if(this.contextMenu == null) {
        this.contextMenu = new ContextMenu({"container": "finder-contextmenu"});
        this.contextMenu.context = {
            open: function(event) {
                var list = Finder.getSelected();

                if(list.length > 0) {
                    Finder.open(Finder.getFile(list[0]));
                }
                else {
                    DialogUtil.alert(I18N.getLang("finder.message.file.download.unselect"));
                }
            },
            edit: function(event) {
                var list = Finder.getSelected();

                if(list.length > 0) {
                    Finder.open(Finder.getFile(list[0]), {"edit": 1});
                }
                else {
                    DialogUtil.alert(I18N.getLang("finder.message.file.download.unselect"));
                }
            },
            upload: function(event) {
                var input = document.getElementById("_finder_file_input");

                if(input == null) {
                    input = document.createElement("input");
                    input.id = "_finder_file_input";
                    input.type = "file";
                    input.name = "uploadFile";
                    input.accept = "*";
                    input.multiple = "multiple";

                    var div = document.createElement("div");
                    div.style.display = "none";
                    div.appendChild(input);
                    document.body.appendChild(div);
                }

                input.value = "";
                jQuery(input).unbind();
                jQuery(input).change(function() {
                    var files = this.files;
                    var message = I18N.getLang("finder.message.file.upload.confirm1");

                    DialogUtil.confirm(message, function(ok) {
                        if(ok) {
                            Finder.upload(files);
                        }
                    });
                });
                input.click();
            },
            download: function(event) {
                var list = Finder.getSelected();

                if(list.length > 0) {
                    Finder.download(Finder.getFile(list[0]));
                }
                else {
                    DialogUtil.alert(I18N.getLang("finder.message.file.download.unselect"));
                }
            },
            zip: function(event) {
                Finder.zip();
            },
            unzip: function(event) {
                Finder.unzip();
            },
            cut: function(event) {
                Finder.cut();
            },
            copy: function(event) {
                Finder.copy();
            },
            paste: function(event) {
                Finder.paste(event);
            },
            remove: function(event) {
                var files = [];
                var list = Finder.getSelected();

                for(var i = 0; i < list.length; i++) {
                    files[files.length] = Finder.getFile(list[i]);
                }

                Finder.remove(files, {});
                return false;
            },
            rename: function(event) {
                var list = Finder.getSelected();

                if(list.length > 0) {
                    var parent = Finder.getParent(list[0]);
                    Finder.edit(jQuery(parent).find(".file-name").get(0));
                }
            },
            mkdir: function(event) {
                Finder.mkdir({"callback": function(result) {
                    if(result == null || result.status != 200 || result.value != true) {
                        DialogUtil.alert(I18N.getLang("finder.message.file.mkdir.failed"));
                        return;
                    }
                    Finder.reload();
                }});
            },
            refresh: function(event) {
                Finder.refresh();
            },
            info: function(event) {
                var list = Finder.getSelected();

                if(list.length > 0) {
                    Finder.info(Finder.getFile(list[0]));
                }
            }
        };

        var items = [
            {"key": "O",  "command": "open"},
            {"key": "F",  "command": "upload"},
            {"key": "G",  "command": "download"},
            {"key": "Z",  "command": "zip"},
            {"key": "U",  "command": "unzip"},
            {"key": "X",  "command": "cut"},
            {"key": "C",  "command": "download"},
            {"key": "V",  "command": "paste"},
            {"key": "D",  "command": "remove"},
            {"key": "F2", "command": "rename"},
            {"key": "N",  "command": "mdkir"},
            {"key": "E",  "command": "refresh"},
            {"key": "H",  "command": "help"},
            {"key": "R",  "command": "info"}
        ];

        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            this.contextMenu.addShortcut(item.key, item.command);
        }
    }
    return this.contextMenu;
};

Finder.getPlugin = function() {
    if(this.plugin == null) {
        var plugin = {};

        plugin.getHome = function() {
            if(this.home == null) {
                var home = null;
                var scripts = document.getElementsByTagName("script");

                for(var i = 0, length = scripts.length; i < length; i++) {
                    var src = scripts[i].src;

                    if(src != null && src != undefined && src.length > 0) {
                        var k = src.indexOf("/finder/plugins/");
                        if(k > -1) {
                            home = src.substring(0, k + "/finder/plugins/".length);
                            break;
                        }
                    }
                }

                if(home == null) {
                    this.home = "";
                }
                else {
                    home = StringUtil.trim(home);

                    if(home.length >= 1) {
                        if(home.substring(home.length - 1) == "/") {
                            home = home.substring(0, home.length - 1);
                        }
                    }
                    this.home = home;
                }
            }
            return this.home;
        };

        plugin.loadCss = function(url) {
            var e = document.createElement("link");
            e.rel = "stylesheet";
            e.type = "text/css";
            e.href = url;
            document.body.appendChild(e);
        };

        plugin.loadScript = function(url) {
            var e = document.createElement("script");
            e.type = "text/javascript";
            e.src = url;
            document.body.appendChild(e);
        };
        this.plugin = plugin;
    }
    return this.plugin;
};

var SuggestDialog = {"id": "finder-suggest", "handler": null};

/**
 * @Override
 */
SuggestDialog.handler = function(value, action) {
    var e = document.getElementById("address");

    if(e == null) {
        return;
    }

    var path = StringUtil.trim(e.value);
    path = StringUtil.replace(path, "\\", "/");
    path = StringUtil.replace(path, "//", "/");

    var k = path.lastIndexOf("/");

    if(k > -1) {
        path = path.substring(0, k);
    }

    if(path.length < 1 || path == "/") {
        e.value = "/" + value;
    }
    else {
        if(StringUtil.endsWith(path, "/")) {
            e.value = path + value;
        }
        else {
            e.value = path + "/" + value;
        }
    }

    if(action) {
        Finder.forward(e.value);
    }
};

SuggestDialog.click = function(src) {
    var name = src.getAttribute("data-value");
    this.handler(name, true);
};

SuggestDialog.open = function(fileList) {
    var e = document.getElementById(this.id);

    if(e == null) {
        return;
    }

    var b = [];
    b[b.length] = "<ul>";
    b[b.length] = "<li class=\"item\" index=\"0\" data-value=\"\">";
    b[b.length] = "   <span class=\"icon\"><img src=\"?action=res&path=/finder/images/folder.png\"/></span>";
    b[b.length] = "   <span class=\"file-name\">...</span>";
    b[b.length] = "   <span class=\"file-size\">&nbsp;</span>";
    b[b.length] = "</li>";

    if(fileList != null && fileList.length != null && fileList.length > 0) {
        for(var i = 0; i < fileList.length; i++) {
            var file = fileList[i];
            var fileName = HtmlUtil.encode(file.name);

            if(file.file != 1) {
                b[b.length] = "<li class=\"item\" index=\"0\" data-value=\"" + fileName + "\">";
                b[b.length] = "   <span class=\"icon\"><img src=\"?action=res&path=/finder/images/folder.png\"/></span>";
                b[b.length] = "   <span class=\"file-name\">" + fileName + "</span>";
                b[b.length] = "   <span class=\"file-size\">&nbsp;</span>";
                b[b.length] = "</li>";
            }
        }

        for(var i = 0; i < fileList.length; i++) {
            var file = fileList[i];
            var fileName = HtmlUtil.encode(file.name);

            if(file.file == 1) {
                b[b.length] = "<li class=\"item\" index=\"0\" data-value=\"" + fileName + "\">";
                b[b.length] = "   <span class=\"icon\"><img style=\"\" src=\"?action=res&path=/finder/icon/" + file.icon + ".png\"/></span>";
                b[b.length] = "   <span class=\"file-name\">" + fileName + "</span>";
                b[b.length] = "   <span class=\"file-size\">" + ByteUtil.getByteSize(file.size) + "</span>";
                b[b.length] = "</li>";
            }
        }
    }

    b[b.length] = "</ul>";
    e.innerHTML = b.join("");

    if(fileList == null || fileList.length <= 20) {
        e.style.height = ((fileList.length + 1) * 26) + "px";
        e.style.overflow = "hidden";
    }
    else {
        e.style.height = "480px";
        e.style.overflow = "auto";
    }
    e.setAttribute("status", "0");
    e.style.display = "block";
};

SuggestDialog.close = function() {
    var e = document.getElementById(this.id);

    if(e != null && e.getAttribute("status") != "1") {
        e.style.display = "none";
    }
};

SuggestDialog.list = function() {
    var list = [];
    var e = document.getElementById(this.id);

    if(e != null) {
        var elements = e.getElementsByTagName("ul");

        if(elements != null && elements.length > 0) {
            var temp = elements[0].childNodes;

            for(var i = 0, length = temp.length; i < length; i++) {
                if(temp[i].nodeType == 1 && temp[i].nodeName.toLowerCase() == "li") {
                    if(temp[i].className != "empty") {
                        list[list.length] = temp[i];
                    }
                }
            }
        }
    }
    return list;
};

SuggestDialog.scroll = function(offset) {
    var selected = -1;
    var list = this.list();
    var length = list.length;

    if(length < 1) {
        return;
    }

    for(var i = 0; i < length; i++) {
        if(list[i].className == "item selected") {
            selected = i;
            list[i].className = "";
        }
    }

    selected = selected + offset;

    if(selected < 0) {
        selected = list.length - 1;
    }

    if(selected >= list.length) {
        selected = 0;
    }

    if(selected < length) {
        var e = list[selected];
        var p = document.getElementById(this.id);
        var value = e.getAttribute("data-value");
        e.className = "item selected";
        p.scrollTop = e.offsetTop;

        if(value != null && value.length > 0) {
            if(this.handler != null) {
                this.handler(value);
            }
        }
    }
};

var FinderClipboard = {};

FinderClipboard.set = function(value) {
    if(encodeURIComponent(value).length > 20 * 1024 * 1024) {
        throw {"name": "LargeDataException", "message": "The data is too large."};
    }
    Finder.setLocalVariable("finder_clipboard", value);
};

FinderClipboard.get = function() {
    return Finder.getLocalVariable("finder_clipboard");
};

FinderClipboard.getObject = function() {
    var value = Finder.getLocalVariable("finder_clipboard");

    if(value != null && value.length > 0) {
        try {
            return window.eval("(" + value + ")");
        }
        catch(e) {
        }
    }
    return null;
};

FinderClipboard.clear = function() {
    FinderClipboard.set("");
};

/*
 * $RCSfile: ImageUtil.js,v $$
 * $Revision: 1.1 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
var ImageUtil = {};

ImageUtil.resize = function(img, maxWidth, maxHeight) {
    if(img.readyState != "complete") {
    }

    if(img.offsetWidth > maxWidth || img.offsetHeight > maxHeight) {
        var scaleWidth = 0;
        var scaleHeight = 0;
        var ratio = img.offsetWidth / img.offsetHeight;

        if(img.offsetWidth > maxWidth) {
            scaleWidth = maxWidth;
            scaleHeight = Math.floor(maxWidth / ratio);

            if(scaleHeight > maxHeight) {
                scaleHeight = maxHeight;
                scaleWidth = Math.floor(maxHeight * ratio);
            }
        }
        else {
            scaleHeight = maxHeight;
            scaleWidth = Math.floor(maxHeight * ratio);

            if(scaleWidth > maxWidth) {
                scaleWidth = maxWidth;
                scaleHeight = Math.floor(maxWidth / ratio);
            }
        }
        img.style.width = scaleWidth + "px";
        img.style.height = scaleHeight + "px";
    }
    img.style.opacity = 100;
};

var TreePanel = {};

TreePanel.expand = function() {
    if(typeof(FileTree) != "undefined") {
        FileTree.expand("/" + Finder.getHost() + "/" + Finder.getWorkspace() + Finder.getPath());
    }
};

TreePanel.reload = function() {
    if(typeof(FileTree) != "undefined") {
        FileTree.reload("/" + Finder.getHost() + "/" + Finder.getWorkspace() + Finder.getPath());
    }
};

/* =========================================================
 * init
 * =========================================================
 */
jQuery(function() {
    var b = [
        "Welcome to finder. http://www.finderweb.net",
        "Copyright (C) 2008 Skin, Inc. All rights reserved.",
        "This software is the proprietary information of Skin, Inc.",
        "Use is subject to license terms.",
        "================================================================================"
    ];
    console.log(b.join("\r\n"));
});

jQuery(function() {
    var version = Finder.getAttribute("data-version");
    var title = "FinderWeb - Powered by FinderWeb v" + version;
    window.document.title = title;
});

/**
 * finder
 */
jQuery(function() {
    jQuery("#back").click(function(event) {
        if(jQuery(this).hasClass("disabled")) {
            return;
        }
        Finder.back();
    });

    jQuery("#refresh").click(function(event) {
        if(event.ctrlKey == true) {
            var url = Finder.getURL({"action": "finder.display"});
            window.open(url);
            return;
        }
        Finder.refresh();
    });

    jQuery("#view-button").click(function(event) {
        jQuery("#view-options").show();
        return false;
    });

    jQuery("#address").keydown(function(event) {
        return Finder.keydown(event);
    });

    jQuery("#address").keyup(function(event) {
        return Finder.keyup(event);
    });

    jQuery("#address").click(function(event) {
        Finder.keyup(event);
        return true;
    });

    jQuery(document).click(function(event) {
        SuggestDialog.close();
        jQuery("#view-options").hide();
        return true;
    });

    jQuery("#view-options li").click(function() {
        var viewMode = jQuery(this).attr("option-value");
        jQuery("#view-options li").attr("class", "");
        jQuery(this).attr("class", "selected");
        jQuery("#view-options").show();

        Finder.setViewMode(viewMode);
        Finder.setViewType(viewMode);
    });
});

jQuery(function() {
    var viewMode = Finder.getViewMode();
    var orderBy = Finder.getOrderBy();

    if(viewMode != "detail" && viewMode != "outline") {
        viewMode = "detail";
    }

    jQuery("#view-options li").removeClass("selected");
    jQuery("#view-options li[option-value=" + viewMode + "]").addClass("selected");
    jQuery("#head-view span.orderable em.order").attr("class", "order");
    jQuery("#head-view span.orderable[orderBy=" + orderBy.name + "] em.order").addClass(orderBy.direction);
});

jQuery(function() {
    var is360se = (window.showModalDialog && window.chrome);
    var message = decodeURIComponent("%E4%B8%BA%E8%8E%B7%E5%BE%97%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%EF%BC%8C%E8%AF%B7%E4%BD%BF%E7%94%A8%E5%8E%9F%E7%89%88Chrome%E6%B5%8F%E8%A7%88%E5%99%A8%E3%80%82");

    if(is360se != undefined) {
        Finder.is360se = true;
        console.log("%c" + message, "color: #ff0000;");
    }
});

/**
 * sort
 */
jQuery(function() {
    jQuery("#head-view span.orderable").click(function() {
        var src = jQuery(this).find("em.order");

        if(src.size() < 1) {
            return;
        }

        var name = jQuery(this).attr("orderBy");
        var direction = "asc";
        var className = src.attr("class");

        jQuery("#head-view span.orderable em.order").attr("class", "order");

        if(className.indexOf("asc") > -1) {
            direction = "desc";
            src.attr("class", "order desc");
        }
        else {
            src.attr("class", "order asc");
        }

        Finder.setOrderBy(name, direction);
        Finder.sort(name, direction);
    });
});

/**
 * short cut & contextmenu
 */
jQuery(function() {
    if(jQuery("#file-view").attr("data-frame") == "false") {
        return;
    }

    /*
     * $RCSfile: FileListFrame.js,v $$
     * $Revision: 1.1 $
     *
     * Copyright (C) 2008 Skin, Inc. All rights reserved.
     * This software is the proprietary information of Skin, Inc.
     * Use is subject to license terms.
     */
    var FileListFrame = com.skin.framework.Class.create(Dialog, null);

    FileListFrame.prototype.create = function() {
    };

    FileListFrame.prototype.setActiveStyle = function() {
    };

    FileListFrame.prototype.close = function() {
    };

    FileListFrame.prototype.destroy = function() {
    };

    /**
     * root
     */
    var root = new FileListFrame({"container": "file-view"});
    var listener = root.getListener();

    /*
    listener.click = function(event) {
        Finder.click(event);
    };
    */

    listener.dblclick = function(event) {
        Finder.click(event, "dblclick");
        return true;
    };

    /**
     * paste system clipboard
     */
    listener.paste = function(event) {
        if(event.shiftKey == true) {
            Finder.paste(event);
        }
        else {
            var files = Finder.getClipboardFiles(event);

            if(files != null && files.length > 0) {
                Finder.upload(files);
            }
        }
        return true;
    };

    listener.contextmenu = function(event) {
        var src = (event.srcElement || event.target);
        var nodeName = src.nodeName.toLowerCase();

        if(nodeName == "input" || nodeName == "select" || nodeName == "textarea" || nodeName == "button") {
            Finder.getContextMenu().close();
            return true;
        }

        if(event.ctrlKey == true) {
            Finder.getContextMenu().close();
            return true;
        }

        if(jQuery(src).closest("div.contextmenu").size() > 0) {
            return false;
        }

        /**
         * 内嵌元素允许使用false禁止菜单
         */
        if(jQuery(src).closest("div[contextmenu=false]").size() > 0) {
            return false;
        }

        if(jQuery(src).closest("div[contextmenu=true]").size() > 0) {
            return Finder.showContextMenu(event);
        }
        Finder.getContextMenu().close();
        return true;
    };

    /*
    root.addShortcut("F5", function(event) {
        Finder.reload();
        return false;
    });
    */

    root.addShortcut("BACKSPACE", function(event) {
        Finder.back();
        return false;
    });

    root.addShortcut("HOME", function(event) {
        if(event.shiftKey != true) {
            Finder.select(Finder.getFirst(), false);
        }
        return false;
    });

    root.addShortcut("END", function(event) {
        if(event.shiftKey != true) {
            Finder.select(Finder.getLast(), false);
        }
        return false;
    });

    root.addShortcut("LEFT | UP", function(event) {
        Finder.scroll(-1, (event.shiftKey == true));
        return false;
    });

    root.addShortcut("RIGHT | DOWN", function(event) {
        Finder.scroll(+1, (event.shiftKey == true));
        return false;
    });

    root.addShortcut("ENTER", function(event) {
        Finder.getContextMenu().execute("open", event);
        return false;
    });

    root.addShortcut("DELETE", function(event) {
        Finder.getContextMenu().execute("remove", event);
        return false;
    });

    root.addShortcut("SHIFT + F", function(event) {
        Finder.getContextMenu().execute("upload");
        return false;
    });

    root.addShortcut("SHIFT + G", function(event) {
        Finder.getContextMenu().execute("download");
        return false;
    });

    root.addShortcut("SHIFT + N", function(event) {
        Finder.getContextMenu().execute("mkdir");
        return false;
    });

    root.addShortcut("F2", function(event) {
        Finder.getContextMenu().execute("rename");
        return false;
    });

    /**
     * The default shortcut key for the operating system is still returned to true
     */
    root.addShortcut("CTRL + A", function(event) {
        Finder.each(function(e) {
            e.className = "item selected";
        });
        return false;
    });

    /**
     * The default shortcut key for the operating system is still returned to true
     */
    root.addShortcut("CTRL + X", function(event) {
        Finder.getContextMenu().execute("cut");
        return true;
    });

    /**
     * The default shortcut key for the operating system is still returned to true
     */
    root.addShortcut("CTRL + C", function(event) {
        Finder.getContextMenu().execute("copy");
        return true;
    });

    root.addShortcut("SHIFT + R", function(event) {
        Finder.getContextMenu().execute("info");
        return false;
    });
    root.setActive(true);
});

/**
 * Register context menu click event
 */
jQuery(function() {
    jQuery("#finder-contextmenu").bind("selectstart", function() {
        return false;
    });
});

/**
 * File upload support
 */
jQuery(function() {
    /**
     * dragleave dragenter dragover
     */
    EventUtil.addEventListener(document, "dragover", function(event) {
        event.preventDefault();
    });

    /**
     * JQuery's drop event has bug and cannot get dataTransfer
     * See: https://bugs.jquery.com/ticket/10756
     */
    EventUtil.addEventListener(document, "drop", function(event) {
        /**
         * has write permission
         */
        var mode = Finder.getMode();

        if((mode & 2) < 1) {
            EventUtil.stop(event);
            return;
        }

        var dataTransfer = event.dataTransfer;

        if(dataTransfer == null || dataTransfer == undefined || dataTransfer.files == null || dataTransfer.files.length < 1) {
            return;
        }

        var files = dataTransfer.files;

        DialogUtil.confirm(I18N.getLang("finder.message.file.upload.confirm1"), function(ok) {
            if(ok) {
                Finder.upload(files);
            }
        });
        EventUtil.stop(event);
    });

    jQuery(window).bind("beforeunload", function(event) {
        if(Finder.uploadCount > 0) {
            return I18N.getLang("finder.message.file.upload.confirm2");
        }
        /**
         * Do not return any value other than undefined: null, true, false
         * return undefined;
         */
    });
});

/**
 * 拦截当前页面的全部事件, 并将控制权转交到widget
 * widget负责管理所有的窗口并负责将页面的事件转发给当前活动窗口
 * widget完成的功能有：
 * 1. 窗口管理, zIndex分配, 活动窗口管理
 * 2. 事件转发, 将事件转发给当前活动的窗口
 */
jQuery(function() {
    jQuery(document).click(function(event) {
        return DialogManager.dispatch("click", event);
    });

    jQuery(document).dblclick(function(event) {
        return DialogManager.dispatch("dblclick", event);
    });

    /**
     * The paste event of the jQuery-1.7.2 gets less than clipboardData
     * jQuery-1.7.2版本的paste事件获取不到clipboardData
     * The event is as much as possible before the jQuery event
     * bug: IE11 does not trigger the paste event
     */
    EventUtil.addEventListener(document, "paste", function(event) {
        return DialogManager.dispatch("paste", event);
    });

    /**
     * keydown事件先于paste触发
     * 因此要保证paste被触发必须使Ctrl + V操作返回true
     * 如果Ctrl + V事件存在弹框, 那么root将无法捕获到paste事件
     * 因为当弹框出现的时候, 弹框是活动窗口, 因此paste事件不会被传递到root
     */
    jQuery(document).keydown(function(event) {
        return DialogManager.dispatch("keydown", event);
    });

    jQuery(document).bind("contextmenu", function(event) {
        var e = (event || window.event);
        var src = (e.srcElement || e.target);
        var nodeName = src.nodeName.toLowerCase();

        if(nodeName == "input" || nodeName == "textarea") {
            return true;
        }
        else {
            return DialogManager.dispatch("contextmenu", e);
        }
    });
});

jQuery(function() {
    jQuery("#finder-suggest").click(function(event) {
        var src = (event.srcElement || event.target);
        var li = Finder.getParent(src);
        SuggestDialog.click(li);
    });
});

jQuery(function() {
    jQuery("#file-view").scroll(Finder.lazyload);
});

jQuery(function() {
    var container = document.getElementById("file-view");

    if(container.getAttribute("draggable") == "false") {
        return;
    }

    var draggable = new Draggable2(container);
    draggable.onstart = function(event) {
        var src = (event.srcElement || event.target);

        if(src.getAttribute("draggable") == "false") {
            Finder.click(event);
            return false;
        }

        var file = Finder.getFile(src);

        if(file == null) {
            Finder.click(event);
            return false;
        }

        var parent = Finder.getParent(src);

        if(parent.className.indexOf("selected") < 0) {
            this.clicked = true;
            Finder.click(event);
        }

        var selected = Finder.getSelected();
        var icon = (file.file == "1" ? file.icon : "folder");

        if(selected.length > 1) {
            this.frame.innerHTML = "<div class=\"widget-bubble\">" + selected.length + "</div>"
                + "<img src=\"?action=res&amp;path=/finder/icon/" + icon + ".png\"/>";
        }
        else {
            this.frame.innerHTML = "<img src=\"?action=res&amp;path=/finder/icon/" + icon + ".png\"/>";
        }
        return true;
    };

    draggable.onmove = function(event) {
        var x = event.clientX;
        var y = event.clientY;
        this.frame.style.top = (y - 124) + "px";
        this.frame.style.left = (x - 50) + "px";
        this.frame.style.display = "block";
    };

    draggable.onstop = function(event) {
        if(this.dragging == false) {
            if(this.clicked != true) {
                Finder.click(event);
            }
            return;
        }

        var selected = Finder.getSelected();

        if(selected.length < 0) {
            return;
        }
        Finder.trigger("drop", event, selected);
    };
});

jQuery(function() {
    var container = document.getElementById("file-view");

    if(container.getAttribute("selectable") == "false") {
        return;
    }

    var selectable = new Selectable(container);
    selectable.onstart = function(event) {
        var src = (event.srcElement || event.target);
        var file = Finder.getFile(src);

        if(file != null) {
            return false;
        }
    };

    selectable.onmove = function(event) {
        var minX1 = this.x;
        var minY1 = this.y;
        var maxX1 = this.x + this.width;
        var maxY1 = this.y + this.height;
        var scrollLeft = this.container.scrollLeft;
        var scrollTop = this.container.scrollTop;

        Finder.each(function(e) {
            var src = jQuery(e);
            var offset = src.position();
            var minX2 = offset.left + scrollLeft;
            var minY2 = offset.top + scrollTop;
            var maxX2 = minX2 + src.width();
            var maxY2 = minY2 + src.height();

            var minX = Math.max(minX1, minX2);
            var minY = Math.max(minY1, minY2);
            var maxX = Math.min(maxX1, maxX2);
            var maxY = Math.min(maxY1, maxY2);

            if(minX > maxX || minY > maxY) {
                src.removeClass("selected");
            }
            else {
                src.addClass("selected");
            }
        });
        return true;
    };
});

jQuery(function() {
    var container = document.getElementById("file-view");

    if(container.getAttribute("draggable") == "false") {
        return;
    }

    /**
     * 拖拽到播放器
     */
    EventUtil.addEventListener(document.getElementById("file-list"), "dragstart", function(event) {
        var e = (event || window.event);
        var src = (e.srcElement || e.target);
        var file = Finder.getFile(src);

        if(file != null) {
            var path = Finder.getPath();
            var url = Finder.getURL({"action": "finder.get", "path": path + "/" + file.name});
            var cover = Finder.getRequestURI() + "?action=res&path=/finder/images/hua.jpg";
            var item = {"name": file.name, "file": file.file, "url": url, "cover": cover};
            e.dataTransfer.setData("Text", JSON.stringify(item));
        }
    });

    /**
     * Finder的拖拽事件
     */
    Finder.on("drop", function(event, selected) {
        var src = (event.srcElement || event.target);
        var file = Finder.getFile(src);

        /**
         * 继续
         */
        if(file == null || file.file != 0) {
            return true;
        }

        var files = [];

        for(var i = 0; i < selected.length; i++) {
            var item = Finder.getFile(selected[i]);
            files[files.length] = item.name;

            /**
             * 停止传播
             */
            if(item.name == file.name) {
                return false;
            }
        }

        /**
         * 剪切
         */
        var host = Finder.getHost();
        var workspace = Finder.getWorkspace();
        var path = Finder.getPath();
        var url = Finder.getURL({"action": "finder.cut", "path": path + "/" + file.name});
        var params = {};
        params.sourceHost = host;
        params.sourceWorkspace = workspace;
        params.sourcePath = path;
        params.file = files;

        jQuery.ajax({
            "type": "post",
            "url": url,
            "data": jQuery.param(params, true),
            "dataType": "json",
            "error": function() {
                DialogUtil.alert(I18N.getLang("finder.message.system.error"));
            },
            "success": function(response) {
                if(response.status != 200) {
                    DialogUtil.alert(I18N.getLang(response.message));
                    return;
                }
                Finder.reload();
            }
        });
        return false;
    });
});

/**
 * media support
 */
jQuery(function() {
    var win = Finder.getWindow();
    var doc = win.document;
    var hash = Finder.hash();

    if(win._finder_media_support_ == null || win._finder_media_support_ == undefined) {
        var requestURI = Finder.getRequestURI();
        ResourceLoader.script(window.document, requestURI + "?action=res&path=/finder/media/media.js&v=" + hash);
    }
});

/**
 * 加载插件
 */
jQuery(function() {
    /**
     * Finder.plugins = [{"name": "xxx", "src": "xxx.js"}];
     */
    var hash = Finder.hash();
    var plugins = Finder.plugins;

    if(plugins != null && plugins.length > 0) {
        for(var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            var url = plugin.src;

            if(url == null || url == undefined) {
                continue;
            }

            var k = url.indexOf("?");

            if(k < 0) {
                url = url + "?v=" + hash;
            }
            else {
                url = url + "&v=" + hash;
            }
            ResourceLoader.script(window.document, url);
        }
    }
});

/**
 * 
 */
jQuery(function() {
    DialogUtil.messageTitle = I18N.getLang("finder.dialog.message.title");
    DialogUtil.confirmTitle = I18N.getLang("finder.dialog.confirm.title");
    DialogUtil.ensureButtonText = I18N.getLang("finder.dialog.confirm.ensure");
    DialogUtil.cancelButtonText = I18N.getLang("finder.dialog.confirm.cancel");
});

/**
 * 独立页面支持
 */
jQuery(function() {
    var host = document.body.getAttribute("data-host");
    var workspace = document.body.getAttribute("data-workspace");
    var path = document.body.getAttribute("data-path");

    if(host != null && workspace != null && path != null) {
        var tabPanel = window.tabPanel = {};

        tabPanel.display = function(host, workspace, path) {
            Finder.load(host, workspace, path);
        };

        tabPanel.addTabPanel = function(title, tooltips, url) {
            window.open(url, "_blank");
        };
        Finder.load(host, workspace, path);
    }
});

jQuery(function() {
    jQuery(window).resize(function() {
        var fileView = jQuery("#file-view");
        var offset = fileView.position();
        var parentHeight = fileView.parent().height();
        var height = (parentHeight - offset.top);
        fileView.css("height",  height + "px");
    });
    jQuery(window).resize();
});

window.FileType = FileType;
window.Finder = Finder;
window.SuggestDialog = SuggestDialog;
})();

/**
 * 表头拖动
 */
(function() {
    var Resize = function(opts) {
        var self = this;
        this.container = opts.container;
        this.padding = (opts.padding || 0);
        this.minWidth = (opts.minWidth || 100);
        this.boxPadding = (opts.boxPadding || 0);
        this.cssSelector = (opts.cssSelector || null);
        this.boxCssSelector = (opts.boxCssSelector || null);

        if(this.container == null || this.container == undefined) {
            return;
        }

        if(this.cssSelector != null) {
            this.cssRule = StyleUtil.getRule(this.cssSelector);
        }

        if(this.boxCssSelector != null) {
            this.boxCssRule = StyleUtil.getRule(this.boxCssSelector);
        }

        this.moveHandler = function(event) {
            self.move(event);
        };

        this.stopHandler = function(event) {
            self.stop(event);
        };
        this.bind();
    };

    Resize.prototype.bind = function() {
        var src = this.container;
        this.mask = document.getElementById("widget-draggable-mask");

        if(this.mask == null) {
            this.mask = document.createElement("div");
            this.mask.id = "widget-draggable-mask";
            this.mask.className = "widget-draggable-mask";
            document.body.appendChild(this.mask);
        }

        this.right = document.createElement("div");
        this.right.className = "resize";
        this.after(this.right, this.container);
        EventUtil.addEventListener(this.right, "mousedown", BindUtil.bindAsEventListener(this, this.start));
    };

    Resize.prototype.after = function(e, target) {
        var parent = target.parentNode;

        if(parent.lastChild == target) {
            parent.appendChild(e);
        }
        else {
            parent.insertBefore(e, target.nextSibling);
        }
    };

    Resize.prototype.start = function(event) {
        var keyCode = (event.keyCode || event.which);

        if(keyCode != 1) {
            return true;
        }

        this.mask.style.zIndex = 100;
        this.mask.style.cursor = "col-resize";
        this.mask.style.display = "block";

        jQuery(this.container).addClass("selected");
        EventUtil.addEventListener(document, "mouseup", this.stopHandler);
        EventUtil.addEventListener(document, "mousemove", this.moveHandler);
        return false;
    }

    Resize.prototype.move = function(event) {
        var offset = jQuery(this.container).offset();
        var x = event.clientX - offset.left;
        var width = x - this.padding;

        if(width < this.minWidth) {
            width = this.minWidth;
        }

        this.container.style.width = width + "px";

        var parent = this.container.parentNode;
        var viewWidth = jQuery(parent.parentNode).width();
        var contentWidth = this.getContentWidth() + 30;

        if(contentWidth > viewWidth) {
            parent.style.width = contentWidth + "px";
        }
        else {
            parent.style.width = viewWidth + "px";
        }

        if(this.cssRule != null) {
            this.cssRule.style["width"] = (width - this.boxPadding) + "px";
        }

        if(this.boxCssRule != null) {
            if(contentWidth > viewWidth) {
                this.boxCssRule.style["width"] = (contentWidth + 20) + "px";
            }
            else {
                this.boxCssRule.style["width"] = "auto";
            }
        }
        return false;
    };

    Resize.prototype.stop = function(event) {
        EventUtil.removeEventListener(document, "mouseup", this.stopHandler);
        EventUtil.removeEventListener(document, "mousemove", this.moveHandler);
        this.mask.style.cursor = "default";
        this.mask.style.display = "none";

        jQuery(this.container).removeClass("selected");
        return false;
    };

    Resize.prototype.getContentWidth = function() {
        var width = 0;

        jQuery(this.container.parentNode).children("span").each(function() {
            width += jQuery(this).width();
        });
        return width;
    };

    jQuery(function() {
        var mobile = Finder.getMobile();
        var envName = Finder.getAttribute("data-env-name", "prod");

        if(envName == "demo") {
            var fix = function(selector) {
                var rule = StyleUtil.getRule(selector);

                if(rule != null) {
                    rule.style["marginLeft"] = "0px";
                }
            };

            fix("div.head-view span.file-size");
            fix("div.head-view span.file-type");
            fix("div.head-view span.modified");
            fix("div.head-view span.operate");
            return;
        }

        jQuery("#file-view").scroll(function() {
            var scrollLeft = this.scrollLeft;
            jQuery("#head-view").css("marginLeft", (0 - scrollLeft) + "px");
        });

        /**
         * file-name
         */
        new Resize({
            "container": jQuery("#head-view span.file-name").get(0),
            "padding": 20,
            "minWidth": 100,
            "boxPadding": 50,
            "cssSelector": "ul.detail-view li div.box div.file-name",
            "boxCssSelector": "ul.detail-view"
        });

        /**
         * file-size
         */
        new Resize({
            "container": jQuery("#head-view span.file-size").get(0),
            "padding": 0,
            "minWidth": 60,
            "boxPadding": 7,
            "cssSelector": "ul.detail-view li div.box div.file-size",
            "boxCssSelector": "ul.detail-view"
        });

        if(mobile) {
            return;
        }

        /**
         * file-type
         */
        new Resize({
            "container": jQuery("#head-view span.file-type").get(0),
            "padding": 0,
            "minWidth": 60,
            "boxPadding": 7,
            "cssSelector": "ul.detail-view li div.box div.file-type",
            "boxCssSelector": "ul.detail-view"
        });

        /**
         * last-modified
         */
        new Resize({
            "container": jQuery("#head-view span.modified").get(0),
            "padding": 0,
            "minWidth": 100,
            "boxPadding": 7,
            "cssSelector": "ul.detail-view li div.box div.modified",
            "boxCssSelector": "ul.detail-view"
        });
    });
})();
