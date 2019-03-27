/*
 * $RCSfile: SettingTemplate.java,v $
 * $Revision: 1.1 $
 *
 * JSP generated by JspCompiler-1.0.0
 * http://www.finderweb.net
 */
package com.skin.finder.servlet.template;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



/**
 * <p>Title: SettingTemplate</p>
 * <p>Description: </p>
 * @author JspKit
 * @version 1.0
 */
public class SettingTemplate extends com.skin.finder.web.servlet.JspServlet {
    private static final long serialVersionUID = 1L;
    private static final SettingTemplate instance = new SettingTemplate();


    /**
     * @param request
     * @param response
     * @throws IOException
     * @throws ServletException
     */
    public static void execute(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        instance.service(request, response);
    }

    /**
     * @param request
     * @param response
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("text/html; charset=utf-8");
        OutputStream out = response.getOutputStream();

        out.write(_jsp_80712, 0, _jsp_80712.length);
        out.write(_jsp_80713, 0, _jsp_80713.length);
        out.write(_jsp_80714, 0, _jsp_80714.length);
        out.write(_jsp_80715, 0, _jsp_80715.length);
        out.write(_jsp_80716, 0, _jsp_80716.length);
        out.write(_jsp_80717, 0, _jsp_80717.length);
        out.write(_jsp_80718, 0, _jsp_80718.length);
        out.write(_jsp_80719, 0, _jsp_80719.length);
        out.write(_jsp_80720, 0, _jsp_80720.length);
        out.write(_jsp_80721, 0, _jsp_80721.length);
        out.write(_jsp_80722, 0, _jsp_80722.length);
        out.write(_jsp_80723, 0, _jsp_80723.length);
        out.write(_jsp_80724, 0, _jsp_80724.length);

        out.flush();
    }

    protected static final byte[] _jsp_80712 = b("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\r\n");
    protected static final byte[] _jsp_80713 = b("<meta http-equiv=\"Pragma\" content=\"no-cache\"/>\r\n<meta http-equiv=\"Cache-Control\" content=\"no-cache\"/>\r\n");
    protected static final byte[] _jsp_80714 = b("<meta http-equiv=\"Expires\" content=\"0\"/>\r\n<title>FinderWeb - Powered by FinderWeb</title>\r\n");
    protected static final byte[] _jsp_80715 = b("<link rel=\"shortcut icon\" href=\"?action=res&path=/finder/images/favicon.png\"/>\r\n");
    protected static final byte[] _jsp_80716 = b("<link rel=\"stylesheet\" type=\"text/css\" href=\"?action=res&path=/finder/css/finder.css\"/>\r\n");
    protected static final byte[] _jsp_80717 = b("<script type=\"text/javascript\" src=\"?action=res&path=/finder/jquery-1.12.4.min.js\"></script>\r\n");
    protected static final byte[] _jsp_80718 = b("<script type=\"text/javascript\" src=\"?action=res&path=/finder/widget.js\"></script>\r\n");
    protected static final byte[] _jsp_80719 = b("<script type=\"text/javascript\" src=\"?action=res&path=/admin/admin.js\"></script>\r\n");
    protected static final byte[] _jsp_80720 = b("</head>\r\n<body style=\"overflow: hidden;\">\r\n<div id=\"view-panel\" split=\"x\">\r\n    <div id=\"left-panel\" class=\"left-panel\"><iframe id=\"left-frame\" name=\"leftFrame\" class=\"left-frame\"\r\n");
    protected static final byte[] _jsp_80721 = b("        src=\"?action=setting.menu\" frameborder=\"0\" scrolling=\"no\" marginwidth=\"0\" marginheight=\"0\"></iframe></div>\r\n");
    protected static final byte[] _jsp_80722 = b("    <div id=\"main-panel\" class=\"main-panel\"><iframe id=\"main-frame\" name=\"mainFrame\" class=\"main-frame\"\r\n");
    protected static final byte[] _jsp_80723 = b("        src=\"?action=setting.text\" frameborder=\"0\" scrolling=\"auto\" marginwidth=\"0\" marginheight=\"0\"></iframe></div>\r\n");
    protected static final byte[] _jsp_80724 = b("</div>\r\n</body>\r\n</html>\r\n");

}