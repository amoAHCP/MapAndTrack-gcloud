package de.tvdtb.mapntrack.route.boundary;

import com.google.inject.Singleton;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.LoadResult;
import com.googlecode.objectify.ObjectifyService;
import de.tvdtb.mapntrack.route.entity.Route;
import java.util.List;

@Singleton
public class RouteBoundary {

    public List<Route> findAll() {
        
        final List<Route> result = ObjectifyService.ofy() //
                .load() //
                .type(Route.class) //
                .project("activity", "name", "description" ) // id is included anyway
                .list();
        return result;
    }

    public long addRoute(Route route) {
        if (route.getName() == null
                || route.getName().trim().length() == 0) {
            throw new IllegalArgumentException("missing name");
        }

        Route existing = findByName(route.getName());
        if (existing != null) {
            throw new IllegalArgumentException(":" + route.getName() + ": already exists!");
        }
        final Key<Route> key = ObjectifyService.ofy() //
                .save().entity(route)//
                .now();
        
        return key.getId();
    }
    
    public void updateRoute(Route route) {
        final Route existing = ObjectifyService.ofy()//
                .load().type(Route.class) //
                .filterKey(Key.create(Route.class, route.getId())) 
                .first()
                .now();
        if (existing==null)
            throw new IllegalArgumentException("unknown route");
    
        ObjectifyService.ofy().save().entity(route).now();
    }

    public Route findByName(String name) {
        System.out.println("Filter = :" + name + ":");
        final LoadResult<Route> result = ObjectifyService.ofy()//
                .load().type(Route.class) //
                .filter("name", name) // required @Index on name property
                .first();

        return result.now();
    }

}
