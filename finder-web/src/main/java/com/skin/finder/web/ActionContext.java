/*
 * $RCSfile: ActionContext.java,v $
 * $Revision: 1.1 $
 *
 * Copyright (C) 2008 Skin, Inc. All rights reserved.
 *
 * This software is the proprietary information of Skin, Inc.
 * Use is subject to license terms.
 */
package com.skin.finder.web;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>Title: ActionContext</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2006</p>
 * @author xuesong.net
 * @version 1.0
 */
public class ActionContext {
    private ServletContext servletContext;
    private Map<String, Method> actionMap;
    private ConcurrentHashMap<String, HttpServlet> servletMap;
    private static final Logger logger = LoggerFactory.getLogger(ActionContext.class);

    /**
     * @param servletContext
     */
    public ActionContext(ServletContext servletContext) {
        this.servletContext = servletContext;
        this.actionMap = new HashMap<String, Method>();
        this.servletMap = new ConcurrentHashMap<String, HttpServlet>();
    }

    /**
     * 
     */
    public void init() {
        for(Map.Entry<String, Method> entry : this.actionMap.entrySet()) {
            Method method = entry.getValue();
            Class<?> type = method.getDeclaringClass();
            String className = type.getName();
            Startup startup = type.getAnnotation(Startup.class);

            if(startup != null && startup.value() >= 0) {
                if(this.hasServlet(className)) {
                    continue;
                }

                logger.info("servlet.init: {}", className);
                this.getServlet(type.getName());
            }
        }
    }

    /**
     * @param url
     * @param method
     */
    public void setAction(String url, Method method) {
        this.actionMap.put(url, method);
    }

    /**
     * @param url
     * @return Method
     */
    public Method getMethod(String url) {
        return this.actionMap.get(url);
    }

    /**
     * @param className
     * @return boolean
     */
    public boolean hasServlet(String className) {
        return (this.servletMap.get(className) != null);
    }

    /**
     * @param method
     * @return HttpServlet
     */
    public HttpServlet getServlet(Method method) {
        return this.getServlet(method.getDeclaringClass().getName());
    }

    /**
     * @param className
     * @return HttpServlet
     */
    public HttpServlet getServlet(String className) {
        HttpServlet servlet = this.servletMap.get(className);

        if(servlet != null) {
            return servlet;
        }

        try {
            servlet = create(className);
            HttpServlet old = this.servletMap.putIfAbsent(className, servlet);

            if(old != null) {
                return old;
            }
            else {
                return servlet;
            }
        }
        catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @param className
     * @return HttpServlet
     * @throws Exception
     */
    private HttpServlet create(String className) throws Exception {
        Class<?> type = getClass(className);
        HttpServlet servlet = (HttpServlet)(type.newInstance());

        try {
            Method method = type.getMethod("setServletContext", ServletContext.class);
            method.invoke(servlet, new Object[]{this.servletContext});
        }
        catch(Exception e) {
        }

        try {
            Method method = type.getMethod("init");
            method.invoke(servlet, new Object[0]);
        }
        catch(Exception e) {
        }
        return servlet;
    }

    /**
     * @param className
     * @return Class<?>
     * @throws ClassNotFoundException
     */
    private Class<?> getClass(String className) throws ClassNotFoundException {
        try {
            return Thread.currentThread().getContextClassLoader().loadClass(className);
        }
        catch(Exception e) {
        }

        try {
            return ActionDispatcher.class.getClassLoader().loadClass(className);
        }
        catch(ClassNotFoundException e) {
        }
        return Class.forName(className);
    }

    /**
     * 
     */
    public void destroy() {
        Map<String, HttpServlet> map = this.servletMap;

        if(map != null && map.size() > 0) {
            for(Map.Entry<String, HttpServlet> entry : map.entrySet()) {
                HttpServlet httpServlet = entry.getValue();

                if(httpServlet != null) {
                    httpServlet.destroy();
                }
            }
        }
        this.actionMap.clear();
        this.servletMap.clear();
        this.actionMap = null;
        this.servletMap = null;
    }
}
