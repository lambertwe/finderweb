/*
 * $RCSfile: LoginTemplate.java,v $
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

import com.skin.finder.config.App;
import com.skin.finder.config.ConfigFactory;
import com.skin.finder.util.Manifest;
import com.skin.finder.util.Version;

/**
 * <p>Title: LoginTemplate</p>
 * <p>Description: </p>
 * @author JspKit
 * @version 1.0
 */
public class LoginTemplate extends com.skin.finder.web.servlet.JspServlet {
	private static final long			serialVersionUID	= 1L;
	private static final LoginTemplate	instance			= new LoginTemplate();

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

		out.write(_jsp_13866, 0, _jsp_13866.length);
		out.write(_jsp_13867, 0, _jsp_13867.length);
		out.write(_jsp_13868, 0, _jsp_13868.length);
		out.write(_jsp_13869, 0, _jsp_13869.length);
		out.write(_jsp_13870, 0, _jsp_13870.length);
		this.write(out, (App.hash()));
		out.write(_jsp_13872, 0, _jsp_13872.length);
		out.write(_jsp_13873, 0, _jsp_13873.length);
		out.write(_jsp_13874, 0, _jsp_13874.length);
		this.write(out, (App.hash()));
		out.write(_jsp_13876, 0, _jsp_13876.length);
		out.write(_jsp_13877, 0, _jsp_13877.length);
		out.write(_jsp_13878, 0, _jsp_13878.length);
		out.write(_jsp_13879, 0, _jsp_13879.length);
		this.write(out, (ConfigFactory.getDemoUserName()));
		out.write(_jsp_13881, 0, _jsp_13881.length);
		this.write(out, (ConfigFactory.getDemoPassword()));
		out.write(_jsp_13883, 0, _jsp_13883.length);
		out.write(_jsp_13884, 0, _jsp_13884.length);
		this.write(out, (App.getVersion()));
		out.write(_jsp_13886, 0, _jsp_13886.length);
		out.write(_jsp_13887, 0, _jsp_13887.length);
		this.write(out, (System.currentTimeMillis()));
		out.write(_jsp_13889, 0, _jsp_13889.length);
		this.write(out, (ConfigFactory.getPublicKey()));
		out.write(_jsp_13891, 0, _jsp_13891.length);
		this.write(out, ConfigFactory.getAccessCode(), false);
		out.write(_jsp_13893, 0, _jsp_13893.length);
		this.write(out, (Manifest.getBuildTime()));
		out.write(_jsp_13895, 0, _jsp_13895.length);
		this.write(out, (Version.getInstance().getVersionName()));
		out.write(_jsp_13897, 0, _jsp_13897.length);

		out.flush();
	}

	protected static final byte[]	_jsp_13866	= b(
			"<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\r\n");
	protected static final byte[]	_jsp_13867	= b("<meta http-equiv=\"Pragma\" content=\"no-cache\"/>\r\n<meta http-equiv=\"Cache-Control\" content=\"no-cache\"/>\r\n");
	protected static final byte[]	_jsp_13868	= b("<meta http-equiv=\"Expires\" content=\"0\"/>\r\n<title>Login - Powered by FinderWeb</title>\r\n");
	protected static final byte[]	_jsp_13869	= b("<link rel=\"shortcut icon\" href=\"?action=res&path=/finder/images/favicon.png\"/>\r\n");
	protected static final byte[]	_jsp_13870	= b("<link rel=\"stylesheet\" type=\"text/css\" href=\"?action=res&path=/finder/css/user.css&v=");
	protected static final byte[]	_jsp_13872	= b("\"/>\r\n<script type=\"text/javascript\" src=\"?action=res&path=/finder/jquery-1.12.4.min.js\"></script>\r\n");
	protected static final byte[]	_jsp_13873	= b("<script type=\"text/javascript\" src=\"?action=res&path=/finder/jsencrypt.min.js\"></script>\r\n");
	protected static final byte[]	_jsp_13874	= b("<script type=\"text/javascript\" src=\"?action=res&path=/finder/signin.js&v=");
	protected static final byte[]	_jsp_13876	= b(
			"\"></script>\r\n</head>\r\n<body class=\"background\">\r\n<div class=\"apptop\">\r\n    <a href=\"http://www.finderweb.net\" target=\"_blank\"><div class=\"logo\" title=\"免费开源的文件管理系统\"></div></a>\r\n");
	protected static final byte[]	_jsp_13877	= b("    <div style=\"margin-left: 300px; height: 60px;\">\r\n        <div style=\"height: 28px;\"></div>\r\n");
	protected static final byte[]	_jsp_13878	= b(
			"        <div class=\"menu-bar\"></div>\r\n    </div>\r\n</div>\r\n<div class=\"wrap\">\r\n    <div class=\"login-container\">\r\n");
	protected static final byte[]	_jsp_13879	= b(
			"        <div class=\"login-panel\">\r\n            <h2>用户登录</h2>\r\n            <div class=\"row\"><input id=\"s1\" type=\"text\" class=\"text\" spellcheck=\"false\" placeholder=\"UserName\" value=\"");
	protected static final byte[]	_jsp_13881	= b(
			"\"/></div>\r\n            <div class=\"row\"><input id=\"s2\" type=\"password\" class=\"text\" placeholder=\"Password\" value=\"");
	protected static final byte[]	_jsp_13883	= b("\"/></div>\r\n            <div class=\"row\"><input id=\"submit\" type=\"button\" class=\"button\" value=\"登 录\"/></div>\r\n");
	protected static final byte[]	_jsp_13884	= b("        </div>\r\n    </div>\r\n</div>\r\n<div class=\"footer\">\r\n    <div class=\"copyright\">Powered by FinderWeb v");
	protected static final byte[]	_jsp_13886	= b(" | Copyright © <a href=\"#\" draggable=\"false\" target=\"_blank\">www.inaction.top</a> All rights reserved.</div>\r\n");
	protected static final byte[]	_jsp_13887	= b("</div>\r\n<div style=\"display: none;\">\r\n    <input id=\"timestamp\" type=\"text\" value=\"");
	protected static final byte[]	_jsp_13889	= b("\"/>\r\n    <textarea id=\"publicKey\">");
	protected static final byte[]	_jsp_13891	= b("</textarea>\r\n</div>\r\n<div style=\"display: none;\">");
	protected static final byte[]	_jsp_13893	= b("</div>\r\n<!-- Developer: http://www.finderweb.net -->\r\n<!-- BuildTime: ");
	protected static final byte[]	_jsp_13895	= b(" -->\r\n<!-- Version:   ");
	protected static final byte[]	_jsp_13897	= b(" -->\r\n</body>\r\n</html>\r\n");

}