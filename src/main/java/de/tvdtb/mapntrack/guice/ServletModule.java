package de.tvdtb.mapntrack.guice;

import com.google.inject.Scopes;
import de.tvdtb.mapntrack.service.RoutesResource;
import de.tvdtb.mapntrack.route.boundary.RouteBoundary;

/**
 * https://github.com/google/guice/wiki/GoogleAppEngine
 * 
 */
class ServletModule extends com.google.inject.servlet.ServletModule {
  @Override protected void configureServlets() {
    serve("/_ah/*")//
            .with(com.google.api.server.spi.SystemServiceServlet.class);
    bind(com.google.api.server.spi.SystemServiceServlet.class).in(Scopes.SINGLETON);
    bind(RoutesResource.class);
    bind(RouteBoundary.class);
  }
}