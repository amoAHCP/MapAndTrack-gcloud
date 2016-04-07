package de.tvdtb.mapntrack.guice;

import com.google.api.server.spi.guice.GuiceSystemServiceServletModule;
import com.google.inject.Scopes;
import com.googlecode.objectify.ObjectifyFilter;
import com.googlecode.objectify.ObjectifyService;
import de.tvdtb.mapntrack.service.RoutesResource;
import de.tvdtb.mapntrack.route.entity.Route;
import java.util.HashSet;
import java.util.Set;

public class GuiceSSSModule extends GuiceSystemServiceServletModule {

    @Override
    protected void configureServlets() {
        super.configureServlets();

        ObjectifyService.register(Route.class);

        Set<Class<?>> serviceClasses = new HashSet<Class<?>>();
        serviceClasses.add(RoutesResource.class);
        this.serveGuiceSystemServiceServlet("/_ah/spi/*", serviceClasses);

        this.bind(ObjectifyFilter.class).in(Scopes.SINGLETON);
        this.filter("/*").through(com.googlecode.objectify.ObjectifyFilter.class);

    }
}
