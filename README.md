progressBatch
=============

##Basic usage


```javascript
$(function() {
    $('.easypiechart').progressBatch({
        'updateCallback': function(percent, progressBatch){
            progressBatch.$el.data('easyPieChart').update(percent);
        },
        'errorCallback': function(){
            alert(1);
        },
        'method': 'GET',
        'uri': 'http://localhost/import/7/tick',
        'delay': '5000'
    });
});
```
