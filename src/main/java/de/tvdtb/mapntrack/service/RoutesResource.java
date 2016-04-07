package de.tvdtb.mapntrack.service;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.NotFoundException;
import de.tvdtb.mapntrack.route.boundary.RouteBoundary;
import de.tvdtb.mapntrack.route.entity.Route;
import java.io.FileNotFoundException;
import java.util.List;
import javax.inject.Inject;
import javax.inject.Named;

/**
 * An endpoint class we are exposing
 */
@Api(name = "myApi",
        version = "v1",
        namespace = @ApiNamespace(ownerDomain = "helloworld.example.com",
                ownerName = "helloworld.example.com",
                packagePath = ""))
public class RoutesResource {

    @Inject
    RouteBoundary boundary;

    @ApiMethod(name = "listRoutes", httpMethod = "GET", path = "routes")
    public List<Route> listAll() {
        return boundary.findAll();
    }

    @ApiMethod(name = "routeByName", httpMethod = "GET", path = "routes/{name}")
    public Route findByName(@Named("name") String name) throws NotFoundException {
        final Route route = boundary.findByName(name);
        if (route == null) {
            throw new NotFoundException("no object with name " + name);
        }
        return route;
    }

    @ApiMethod(name = "addRoute", httpMethod = "POST", path = "routes")
    public void addRoute(Route r) {
        boundary.addRoute(r);
    }

    @ApiMethod(name = "updateRoute", httpMethod = "PUT", path = "routes")
    public void updateRoute(Route r) {
        boundary.updateRoute(r);
    }

}
