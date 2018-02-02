var blocksize_chart = null;
var register_chart = null;
var shm_chart = null;
$(document).ready(function() {
    $('select').material_select();
    blocksize_chart = c3.generate({
        bindto: '#impact_blocksize_plot',
        data: {
            xs: {
                'Threads Per Block': 'x1'
            },
            columns: [],
        },
        color: {
            pattern: ['#77b723', '#e51239']
        }
    });
    register_chart = c3.generate({
        bindto: '#impact_register_plot',
        data: {
            xs: {
                'Registers Per Thread': 'x1'
            },
            columns: [],
        },
        color: {
            pattern: ['#77b723', '#e51239']
        }
    });
    shm_chart = c3.generate({
        bindto: '#impact_shm_plot',
        data: {
            xs: {
                'Shared Memory Per Block': 'x1'
            },
            columns: [],
        },
        color: {
            pattern: ['#77b723', '#e51239']
        }
    });
});

$('form').on('submit', function(e){
    e.preventDefault();

    var d = {};
    jQuery.map($('form').serializeArray(), function(n, i){
        d[n['name']] = n['value'];
    });

    d['sharedMemoryPerBlock'] = +d['sharedMemoryPerBlock'] * (+d['shm_unit'])


    var data = calculate(d);
    var graph = calculateGraphs(d);


    var $o = $('#output').show();

    _.forEach(data, function(v,k){
        $o.find('[data-value=' + k + ']').text(v);
    });


    var gds = _.map(graph, function(v){

        var vs = _.values(v.current)
        var vss = {
                x: [+vs[0]],
                y: [+vs[1]]
            }


        x_data = _.map(v.data, function(v){
            var vs = _.values(v);
            return vs[0]
        });
        y_data = _.map(v.data, function(v){
            var vs = _.values(v);
            return vs[1]
        });

        return {
            data: {x: x_data, y: y_data},
            current: {x: vss.x, y: vss.y}
        }


    });


    blocksize_chart.load({
            columns: [
                ['x1'].concat(gds[0].data.x),
                ['Threads Per Block'].concat(gds[0].data.y)
            ],
    });
    blocksize_chart.xgrids([{value: gds[0].current.x, text: 'current', position: 'middle'}])


    register_chart.load({
        columns: [
            ['x1'].concat(gds[1].data.x),
            ['Registers Per Thread'].concat(gds[1].data.y)
        ]
    });
    register_chart.xgrids([{value: gds[1].current.x, text: 'current', position: 'middle'}])

    shm_chart.load({
        columns: [
            ['x1'].concat(gds[2].data.x),
            ['Shared Memory Per Block'].concat(gds[2].data.y)
        ]
    });
    shm_chart.xgrids([{value: gds[2].current.x, text: 'current', position: 'middle'}])


})
