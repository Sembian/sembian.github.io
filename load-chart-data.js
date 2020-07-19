function loaddata( dataloaded ) {

    d3.dsv(",", "data.csv", function(d) {

        const dataobj = {
            year: parseInt(+d.Year),
            cause: d["Cause of death"],
            category: d["Category"],
            rate: parseFloat(+d.Rate),
        };

        if (!referencesByYear[dataobj.year])
            referencesByYear[dataobj.year] = { year: parseInt(dataobj.year)
            };
        
       

        return dataobj;
    }).then(function(data) {
        dataSet = data;
        var entries = d3.nest()
        .key(function(d) { return d.cause; })
        .map(dataSet)
        
        console.log("Entries" + entries)
        dataloaded();
    });
}


