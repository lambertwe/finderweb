/*
 * $RCSfile: tail.js,v $
 * $Revision: 1.1 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
if(typeof(window.localStorage) == "undefined") {
    window.localStorage = {};
}

var Tail = {};
Tail.rows = 0;
Tail.length = 0;
Tail.maxRows = 1000;
Tail.position = -1;
Tail.running = false;
Tail.scroll = true;
Tail.timeout = 1000;
Tail.editorId = "tail-editor";
Tail.containerId = "tail-container";
Tail.tailURL = window.location.pathname + "?action=less.getTail&";

Tail.getContextPath = function() {
    if(this.contextPath == null || this.contextPath == undefined) {
        var contextPath = document.body.getAttribute("contextPath");

        if(contextPath == null || contextPath == "/") {
            contextPath = "";
        }
        this.contextPath = contextPath;
    }
    return this.contextPath;
};

Tail.getTailURL = function(position, rows) {
    var params = [];
    params[params.length] = "host=" + encodeURIComponent(this.host);
    params[params.length] = "workspace=" + encodeURIComponent(this.workspace);
    params[params.length] = "path=" + encodeURIComponent(this.path);
    params[params.length] = "position=" + position;
    params[params.length] = "rows=" + rows;
    params[params.length] = "charset=" + this.charset;
    return this.tailURL + params.join("&");
};

Tail.parse = function(text, xhr) {
    var status = xhr.getResponseHeader("Finder-Status");

    if(status == null) {
        return {"status": 999, "message": "BadResponse."};
    }

    if(status == "302") {
        window.location.href = xhr.getResponseHeader("Finder-Location");
        return;
    }

    var message = xhr.getResponseHeader("Finder-Message");
    var lastModified = xhr.getResponseHeader("Finder-Modified");
    var contentRange = (xhr.getResponseHeader("Finder-Range") || "");
    var rows = xhr.getResponseHeader("Finder-Rows");
    var start = 0;
    var end = 0;
    var length = 0;
    var i = contentRange.lastIndexOf("/");

    if(i > -1) {
        length = parseInt(contentRange.substring(i + 1));
        contentRange = contentRange.substring(0, i);
        i = contentRange.indexOf("-");

        if(i > -1) {
            start = contentRange.substring(0, i);
            end = contentRange.substring(i + 1);
        }
    }

    var result = {"status": parseInt(status), "message": message, "value": {}};
    var range = result.value;
    range.start = parseInt(start);
    range.end = parseInt(end);
    range.rows = parseInt(rows);
    range.length = parseInt(length);

    if(lastModified != null) {
        range.lastModified = parseInt(lastModified, 16);
    }

    range.content = text;
    return result;
};

Tail.setScroll = function(b) {
    this.scroll = b;
};

Tail.getTimeout = function() {
    var e = document.getElementById("tail-reload-interval");

    if(e != null) {
        var timeout = parseInt(e.value);

        if(isNaN(timeout) == false && timeout >= 1) {
            return timeout * 1000;
        }
    }
    return 2000;
};

Tail.start = function() {
    this.stop();
    this.running = true;
    this.poll();
};

Tail.stop = function() {
    this.running = false;

    if(this.timer != null) {
        clearTimeout(this.timer);
    }
};

Tail.poll = function() {
    if(this.running != true) {
        return;
    }

    var position = this.getEnd();
    var rows = this.getRows();
    var length = this.length;
    var url = this.getTailURL(position, rows);
    var keyword = this.getKeyword();
    var regexp = this.getRegexp(keyword);

    jQuery.ajax({
        type: "get",
        url: url,
        dataType: "text",
        error: function(req, status, error) {
            var message = "\r\n## ** ERROR: ** ##\r\n" + status + ": " + error + "\r\n\r\n";
            Tail.append({"start": position, "end": position, "rows": 1, "length": length, "content": message});
        },
        success: function(text, status, xhr) {
            var result = Tail.parse(text, xhr);
            var range = result.value;

            if(range == null) {
                var message = "\r\n## ** ERROR: ** ##\r\n500: " + result.message + "\r\n\r\n";
                Tail.append({"start": position, "end": position, "rows": 1, "length": length, "content": message});
                return;
            }

            if(range.length < Tail.length) {
                window.location.reload();
                return;
            }

            if(result.status == 200) {
                Tail.append(Tail.filter(range, keyword, regexp), keyword, regexp);
            }
            else {
                var message = "\r\n## ** ERROR: ** ##\r\n500: " + result.message + "\r\n\r\n";
                Tail.append({"start": position, "end": position, "rows": 1, "length": length, "content": message});
                return;
            }
        }
    });
};

Tail.filter = function(range, keyword, regexp) {
    if(keyword != null && keyword.length > 0 && range.rows > 0) {
        var buffer = [];
        var content = range.content;
        var array = content.split("\n");
        var reg = new RegExp(keyword);
        reg.compile(keyword);

        for(var i = 0; i < array.length; i++) {
            if(regexp == true && reg.test(array[i])) {
                buffer[buffer.length] = array[i];
            }
            else if(array[i].indexOf(keyword) > -1) {
                buffer[buffer.length] = array[i];
            }
        }
        range.rows = buffer.length;
        buffer[buffer.length] = "";
        range.content = buffer.join("\r\n");
    }
    return range;
};

Tail.append = function(range, keyword, regexp) {
    var modified = this.modified(range);

    if(range != null) {
        this.length = range.length;
        this.rows = this.rows + range.rows;
        this.lastModified = range.lastModified;

        if(range.rows > 0) {
            var e = this.getEditor();
            var p = this.create(range, keyword, regexp);

            while(e.childNodes.length > 100) {
                var node = e.childNodes[0];
                var count = parseInt(node.getAttribute("rows"));
                e.removeChild(node);
                this.rows -= count;
            }

            while(this.rows > this.maxRows) {
                if(e.childNodes.length > 1) {
                    var node = e.childNodes[0];
                    var count = parseInt(node.getAttribute("rows"));
                    e.removeChild(node);
                    this.rows -= count;
                }
                else {
                    break;
                }
            }

            e.appendChild(p);

            if(this.scroll == true) {
                var scrollHeight = e.scrollHeight;

                if(range.rows <= 5) {
                    e.scrollTop = scrollHeight;
                }
                else {
                    /**
                     * 此处的动画效果会出现卡顿的现象
                     * 这是因为浏览器的单线程模型导致的，这个问题无法避免
                     * 无论怎么做只要发起ajax请求都会导致在当前的UI线程队列里增加一个函数调用
                     * 这将阻塞动画效果连续执行，从而出现卡顿
                     */
                    jQuery(e).stop();
                    jQuery(e).animate({"scrollTop": scrollHeight}, range.rows * 5);
                }
            }
        }
        else {
            Tail.setEnd(range.end);
        }

        if(range.length - 1 > range.end) {
            Tail.poll();
            return;
        }
        else {
        }
    }

    if(this.timer != null) {
        clearTimeout(this.timer);
        this.timer = null;
    }

    if(modified) {
        this.timeout = 1000;
    }
    else {
        this.timeout = this.timeout + 1000;
    }

    if(this.timeout > 5000) {
        this.timeout = 5000;
    }
    this.timer = setTimeout(function() {Tail.poll();}, this.timeout);
};

Tail.modified = function(range) {
    if(range == null) {
        return true;
    }
    return (this.length != range.length || this.lastModified != range.lastModified);
};

Tail.select = function() {
    var e = this.getEditor();

    if(document.all) {
        /* for IE */
        var range = document.body.createTextRange();
        range.moveToElementText(e);
        range.select();
    }
    else {
        var selection = window.getSelection();

        if(selection.setBaseAndExtent) {
            /* for Safari */
            selection.setBaseAndExtent(e, 0, e, 1);
        }
        else {
            /* for FF, Opera */
            var range = document.createRange();
            range.selectNodeContents(e);
            selection.removeAllRanges();
            selection.addRange(range);
            window.focus();
        }
    }
};

/**
 * 清除显示区域全部内容
 */
Tail.clear = function() {
    this.rows = 0;
    this.getEditor().innerHTML = "";
};

Tail.getKeyword = function() {
    return this.keyword;
};

Tail.getRegexp = function() {
    /**
     * 尽可能的不使用正则, 这样可以避免再去取消勾选正则
     * 如果存在查找的文本, 那么客户端做一个校验
     * 如果查找的文本一定不是正则, 那么直接返回false
     */
    if(this.keyword != null) {
        var regExp = new RegExp("^[0-9a-zA-Z]+$");

        /**
         * 如果全部是字母或者数字, 说明一定不是正则
         */
        if(regExp.test(this.keyword)) {
            return false;
        }
    }
    return (this.regexp == true);
};

/**
 * 获取当前显示区域显示的起始位置
 */
Tail.getStart = function() {
    var e = this.getEditor();
    var list = e.childNodes;

    if(list.length > 0) {
        var node = list[0];
        return parseInt(node.getAttribute("start"));
    }
    else {
        return 0;
    }
};

/**
 * 设置结束位置
 */
Tail.setEnd = function(end) {
    var e = this.getEditor();
    var list = e.childNodes;

    if(list.length > 0) {
        var node = list[list.length - 1];
        node.setAttribute("end", end);
    }
};

/**
 * 获取当前显示区域显示的终止位置
 */
Tail.getEnd = function() {
    var e = this.getEditor();
    var list = e.childNodes;

    if(list.length > 0) {
        var node = list[list.length - 1];
        return parseInt(node.getAttribute("end"));
    }
    else {
        return this.length - 1;
    }
};

/**
 * 获取发送请求时请求的行数
 * 每次请求时请求的行数为当前显示区域可显示行数的3倍
 * 表达式中的16为行高, 如果显示区域的行高调整, 需要调整此参数
 * 暂时先写死吧
 */
Tail.getRows = function() {
    var c = this.getContainer();
    return Math.max(3 * Math.floor(jQuery(c).height() / 16), 300);
};

/**
 * 获取根容器
 */
Tail.getContainer = function() {
    if(this.container == null) {
        this.container = document.getElementById(this.containerId);
    }
    return this.container;
};

/**
 * 获取显示区域的容器
 */
Tail.getEditor = function() {
    if(this.container == null) {
        this.container = document.getElementById(this.containerId);
    }
    return this.container;
};

Tail.highlight1 = function(element, content, keyword) {
    if(content == null) {
        return;
    }

    if(keyword == null || keyword.length < 1) {
        element.appendChild(document.createTextNode(content));
        return;
    }

    var s = 0;
    var e = 0;
    var d = keyword.length;

    while(true) {
        e = content.indexOf(keyword, s);

        if(e < 0) {
            element.appendChild(document.createTextNode(content.substring(s)));
            break;
        }

        var span = document.createElement("span");
        span.className = "keyword";
        span.appendChild(document.createTextNode(keyword));

        element.appendChild(document.createTextNode(content.substring(s, e)));
        element.appendChild(span);
        s = e + d;
    }
};

Tail.highlight2 = function(element, content, keyword) {
    if(content == null) {
        return;
    }

    if(keyword == null || keyword.length < 1) {
        element.appendChild(document.createTextNode(content));
        return;
    }

    var start = 0;
    var end = 0;
    var regexp = new RegExp().compile(keyword, "g");
    var array = content.match(regexp);

    if(array == null) {
        return;
    }

    for(var i = 0; i < array.length; i++) {
        var item = array[i];
        end = content.indexOf(item, start);

        if(start > -1) {
            var span = document.createElement("span");
            span.className = "keyword";
            span.appendChild(document.createTextNode(item));
            element.appendChild(document.createTextNode(content.substring(start, end)));
            element.appendChild(span);
            start = end + item.length;
        }
        else {
            break;
        }
    }
    if((start + 1) < content.length) {
        element.appendChild(document.createTextNode(content.substring(start)));
    }
};

/**
 * 创建块内容
 * range: {"start": 269027, "end": 269361, "length": 269389, "rows": 2, "content": "1 0123456789\r\n2 0123456789\r\n"}}
 * start  - content中的第一个字符的位置
 * end    - content中最后一个字符的位置
 * rows   - content中包含的行数
 * length - 文件总大小, 对于实时变化的系统日志文件, 每次请求返回的文件总大小也总在变化.
 *          一般情况下日志文件会不断增大, 但也有可能从很大变为很小, 例如按天滚动的日志文件, 在凌晨时会重新产生新文件.
 * @param range - 服务器返回的文本块
 */
Tail.create = function(range, keyword, regexp) {
    var p = document.createElement("pre");
    p.setAttribute("start", range.start);
    p.setAttribute("end",   range.end);
    p.setAttribute("rows",  range.rows);
    p.setAttribute("length", range.length);

    if(keyword == null || keyword.length < 1) {
        p.appendChild(document.createTextNode(range.content));
    }
    else {
        if(regexp != true) {
            Tail.highlight1(p, range.content, keyword);
        }
        else {
            Tail.highlight2(p, range.content, keyword);
        }
    }
    return p;
};

Tail.init = function() {
    this.host = document.body.getAttribute("host");
    this.workspace = document.body.getAttribute("workspace");
    this.path = document.body.getAttribute("path");
    this.charset = document.body.getAttribute("charset");
    this.fontFamily = Finder.getConfig("less.fontFamily", "Lucida Console");
    this.fontColor = Finder.getConfig("less.fontColor", "#999999");
    this.backgroundColor = Finder.getConfig("less.backgroundColor", "#000000");

    if(this.charset == null || this.charset.length < 1) {
        this.charset = Finder.getConfig("global.charset", "utf-8");
    }

    var container = this.getContainer();
    container.style.color = this.fontColor;
    container.style.fontFamily = this.fontFamily;
    container.style.backgroundColor = this.backgroundColor;
    Charset.setup(jQuery("select[name=charset]").get(0), this.charset);

    jQuery("select[name=charset]").change(function() {
        Tail.charset = this.value;
    });

    jQuery("#tail-clear-btn").click(function() {
        Tail.clear();
    });

    jQuery("#tail-stop-btn").click(function() {
        var status = this.getAttribute("data-status");

        if(status != "0") {
            this.value = "开 始";
            this.setAttribute("data-status", "0");
            Tail.stop();
        }
        else {
            this.value = "停 止";
            this.setAttribute("data-status", "1");
            Tail.start();
        }
    });

    jQuery("#tail-select-btn").click(function() {
        Tail.select();
    });

    jQuery("#tail-reload-btn").click(function() {
        window.location.reload();
    });

    jQuery("#tail-find-btn").click(function() {
        jQuery("#find-panel").show();
    });

    jQuery("#tail-auto-scroll").click(function() {
        Tail.setScroll(this.checked);
    });

    /**
     * grep
     */
    jQuery("#grep-ensure").click(function() {
        jQuery("#find-panel").hide();

        Tail.keyword = jQuery("#grep-keyword").val();
        Tail.regexp = jQuery("#grep-regexp").prop("checked");
        Tail.stop();
        Tail.clear();
        Tail.start();
    });

    jQuery("#grep-close").click(function() {
        jQuery("#find-panel").hide();
    });

    /**
     * 修改回车键的默认操作
     */
    jQuery(container).keydown(function(event) {
        var keyCode = event.keyCode;

        if(keyCode == 13) {
            document.execCommand("InsertHtml", false, "\r\n");
            return false;
        }
        return true;
    });

    jQuery(document.body).keydown(function(event) {
        var keyCode = event.keyCode;

        if(event.ctrlKey == true && keyCode == 66) {
            if(jQuery("#find-panel").is(":hidden")) {
                jQuery("#find-panel").show();

                try {
                    document.getElementById("grep-keyword").select();
                }
                catch(e) {
                }
            }
            else {
                jQuery("#find-panel").hide();
            }
            return false;
        }
    });
    Tail.start();
};

jQuery(function() {
    var b = [
        "Welcome to finder. http://www.finderweb.net",
        "Copyright (C) 2008 Skin, Inc. All rights reserved.",
        "This software is the proprietary information of Skin, Inc.",
        "Use is subject to license terms.",
        "================================================================================"
    ];
    console.clear();
    console.log(b.join("\r\n"));
});

jQuery(function() {
    var container = Tail.getContainer();

    jQuery(window).bind("resize", function() {
        jQuery(container).height(jQuery(window).height() - 48);
    });
    jQuery(window).trigger("resize");
});

jQuery(function() {
    Tail.init();
});
