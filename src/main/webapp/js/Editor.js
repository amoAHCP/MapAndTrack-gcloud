Modify = function(myMap) {
    this.select = new ol.interaction.Select();
    myMap.addInteraction(this.select);

    this.modify = new ol.interaction.Modify({
        features: this.select.getFeatures()
    });
    myMap.addInteraction(this.modify);

    var selectedFeatures = this.select.getFeatures();

    this.select.on('change:active', function () {
        selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
    });
    
    this.setActive = function (active) {
        if (this.modify) {
            this.select.setActive(active);
            this.modify.setActive(active);
        }
    }
};

Draw = function (myMap, vectorLayer) {
        this.myMap = myMap;

        this.LineString = new ol.interaction.Draw({
            source: vectorLayer.getSource(),
            type: 'LineString'
        });
        myMap.addInteraction(this.LineString);

        this.LineString.setActive(false);
        this.LineString.on('drawstart', function (event) {
            stateChange("draw", event.feature);
        }, this);
        this.LineString.on('drawend', function (event) {
            stateChange("modify", event.feature);
            
            this.modify = new Modify(this.myMap);
            this.setActive(false);
            this.modify.setActive(true);
        }, this);
        this.LineString.on('change', function (event) {
            console.log("CHANGE=" + event);
        }, this.LineString);

    this.getActive = function () {
        return this.activeType ? this[this.activeType].getActive() : false;
    };
    
    this.setActive = function (active) {
        if (this.LineString)
            this.LineString.setActive(active);
    }
};

