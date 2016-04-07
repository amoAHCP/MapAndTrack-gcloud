Geo = {
	
}

Geo.Util = {
	
}

/**
 * APIFunction: getFormattedLonLat
 * This function will return latitude or longitude value formatted as 
 *
 * Parameters:
 * coordinate - {Float} the coordinate value to be formatted
 * axis - {String} value of either 'lat' or 'lon' to indicate which axis is to
 *          to be formatted (default = lat)
 * dmsOption - {String} specify the precision of the output can be one of:
 *           'dms' show degrees minutes and seconds
 *           'dmdm' show degrees minutes and decimal minutes fraction
 *           'dm' show only degrees and minutes
 *           'd' show only degrees
 * 
 * Returns:
 * {String} the coordinate value formatted as a string
 */
Geo.Util.getFormattedLonLat = function(coordinate, axis, dmsOption) {
	var str =""; 
		
    if (axis == "lon") {
        str += coordinate < 0 ? "W" : "E";
    } else {
        str += coordinate < 0 ? "S" : "N";
    }

    if (!dmsOption) {
        dmsOption = 'dms';    //default to show degree, minutes, seconds
    }
    var abscoordinate = Math.abs(coordinate);
    var coordinatedegrees = Math.floor(abscoordinate);

    var coordinateminutes = (abscoordinate - coordinatedegrees)/(1/60);
    var tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    
    var decimalminutes = (tempcoordinateminutes - coordinateminutes);
    var coordinateseconds = (tempcoordinateminutes - coordinateminutes)/(1/60);
    coordinateseconds =  Math.round(coordinateseconds*10);
    coordinateseconds /= 10;

    if( coordinatedegrees < 10 ) {
        coordinatedegrees = "0" + coordinatedegrees;
    }
    str += coordinatedegrees + "\u00B0";

    if (dmsOption.indexOf('dmdm') >= 0) {
    	var x = ""+(Math.floor(tempcoordinateminutes*1000)/1000);
    	if (tempcoordinateminutes<10)
    		x="0"+x;
    	if (x.indexOf(".")<0)
    		x+=".";
    	while (x.length<6)
    		x+="0";
    	str+=x;
    } else
    if (dmsOption.indexOf('dm') >= 0) {
        if( coordinateminutes < 10 ) {
            coordinateminutes = "0" + coordinateminutes;
        }
        str += coordinateminutes + "'";
  
        if (dmsOption.indexOf('dms') >= 0) {
            if( coordinateseconds < 10 ) {
                coordinateseconds = "0" + coordinateseconds;
            }
            str += coordinateseconds + '"';
        }
    }
    
    return str;
};