import {
    event as d3_event,
    select as d3_select
} from 'd3-selection';
import { scaleLinear as d3_scaleLinear } from 'd3-scale';

import { prefs } from '../../core/preferences';
import { t, localizer } from '../../core/localizer';
import { svgIcon } from '../../svg/icon';
import { uiSection } from '../section';


export function uiSectionFeatureConfidenceOptions(context) {

    var section = uiSection('feature-confidence-options', context)
        .title(t('background.feature_confidence'))
        .disclosureContent(renderDisclosureContent);

    // Load stored values
    let _minVal = prefs('feature_confidence_minVal');
    let _maxVal = prefs('feature_confidence_maxVal');
    let _resolution = prefs('feature_confidence_resolution');
    let _blueOnLeft = prefs('feature_confidence_blueOnLeft');
    let _lowOnLeft = prefs('feature_confidence_lowOnLeft');
    let _featureConfidenceThreshold = prefs('feature_confidence_threshold');

    // Set up defaults for unset values
    _minVal = _minVal !== null ? _minVal : 0;
    _maxVal = _maxVal !== null ? _maxVal : 1;
    _resolution = _resolution !== null ? _resolution : 0.1;
    _featureConfidenceThreshold = _featureConfidenceThreshold !== null ? _featureConfidenceThreshold : 0;
    _blueOnLeft = _blueOnLeft !== null ? JSON.parse(_blueOnLeft) : true;
    _lowOnLeft = _lowOnLeft !== null ? JSON.parse(_lowOnLeft) : true;

    // Store it all back
    prefs('feature_confidence_minVal', _minVal);
    prefs('feature_confidence_maxVal', _maxVal);
    prefs('feature_confidence_resolution', _resolution);
    prefs('feature_confidence_blueOnLeft', _blueOnLeft);
    prefs('feature_confidence_lowOnLeft', _lowOnLeft);
    prefs('feature_confidence_threshold', _featureConfidenceThreshold);

    const _sliderToValue = d3_scaleLinear().domain([0,1]).range([-1,1]).clamp(true);

    var _sliders = ['feature_confidence'];

    function updateSliderUI(selection) {
        const slider = d3_select('.display-option-input');

        // Update the value from existing slider scale

        // Update the scale
        if (_lowOnLeft !== _blueOnLeft) {
            _sliderToValue.range([_maxVal, _minVal]);
        } else {
            _sliderToValue.range([_minVal, _maxVal]);
        }
        
        // Update slider 
        slider
            .style('direction', function() {
                return _blueOnLeft ? null : 'rtl';
            });

        const fullRange = _maxVal - _minVal;
        const stepCount = fullRange / _resolution;
        const step = 1 / (stepCount);
        slider.attr('step', step);
        slider.property('value', _sliderToValue.invert(_featureConfidenceThreshold));

        // Update the display
        selection.selectAll('.display-option-value')
            .text(function() {
                return _featureConfidenceThreshold;
            });
        // Re-render the map
        context.map().pan([0,0]);
    }

    function renderDisclosureContent(selection) {
        var container = selection.selectAll('.feature-confidence-container');
        container = container.data([0]);

        var containerEnter = container.enter()
            .append('div')
            .attr('class', 'feature-confidence-container controls-list');


        containerEnter
            .append('div')
            .attr('class', 'nudge-instructions')
            .text(t('background.confidence_description'));

        // add slider controls
        var slidersEnter = containerEnter.selectAll('.display-control')
            .data(_sliders)
            .enter()
            .append('div')
            .attr('class', function(d) { return 'display-control display-control-' + d; });

        slidersEnter
            .append('h5')
            .text(function(d) { return t('background.' + d); })
            .append('span')
            .attr('class', function(d) { return 'display-option-value display-option-value-' + d; });

        slidersEnter
            .append('span')
            .text('Blue on left')
            .append('input')
            .attr('type', 'checkbox')
            .attr('checked', _blueOnLeft ? _blueOnLeft : null)
            .on('input', function() {
                _blueOnLeft = d3_select(this).property('checked');
                prefs('feature_confidence_blueOnLeft', _blueOnLeft);
                updateSliderUI(selection);
            });

        slidersEnter
            .append('br');

        slidersEnter
            .append('span')
            .text('Low on left')
            .append('input')
            .attr('type', 'checkbox')
            .attr('checked', _lowOnLeft ? _lowOnLeft : null)
            .on('input', function() {
                _lowOnLeft = d3_select(this).property('checked');
                prefs('feature_confidence_lowOnLeft', _lowOnLeft);
                updateSliderUI(selection);
            });

        slidersEnter
            .append('br');

        const controls = slidersEnter
            .append('div')
            .style('display', 'flex')
            .style('flex-direction', 'column');

        let row = controls
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');
        
        row
            .append('div')
            .text('Min Value:');

        row
            .append('input')
            .attr('type', 'text')
            .attr('value', _minVal)
            .style('margin', '5px')
            .on('change', function() {
                _minVal = d3_select(this).property('value');
                prefs('feature_confidence_minVal', _minVal);
                updateSliderUI(selection);
            });

        row = controls
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');

        row
            .append('div')
            .text('Max Value:');

        row
            .append('input')
            .attr('type', 'text')
            .attr('value', _maxVal)
            .style('margin', '5px')
            .on('change', function() {
                _maxVal = d3_select(this).property('value');
                prefs('feature_confidence_maxVal', _maxVal);
                updateSliderUI(selection);
            });

        row = controls
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');

        row
            .append('div')
            .text('Resolution:');
        row
            .append('input')
            .attr('type', 'text')
            .attr('value', _resolution)
            .style('margin', '5px')
            .on('change', function() {
                _resolution = d3_select(this).property('value');
                prefs('feature_confidence_resolution', _resolution);
                updateSliderUI(selection);
            });

        row = controls
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');

        row
            .append('div')
            .text('Range slider:');
        
        row
            .append('input')
            .attr('type', 'range')
            .attr('min', 0)
            .attr('max', 1)
            .attr('height', '8px')
            .style('margin', '5px')
            .attr('class', function(d) { return 'display-option-input display-option-input-' + d; })
            .on('input', function() {
                _featureConfidenceThreshold = _sliderToValue(d3_select(this).property('value'));
                prefs('feature_confidence_threshold', _featureConfidenceThreshold);
                updateSliderUI(selection);
            });
        
        updateSliderUI(selection);
    }

    return section;
}
